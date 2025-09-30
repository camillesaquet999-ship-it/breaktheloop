const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function initHeroScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') {
    return;
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050818, 0.045);

  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 220);
  camera.position.set(0, 6, 16);

  const ambient = new THREE.AmbientLight(0x7c5cff, 0.45);
  scene.add(ambient);

  const directional = new THREE.DirectionalLight(0x4cf3ff, 1.1);
  directional.position.set(5, 12, 8);
  scene.add(directional);

  const city = new THREE.Group();
  const blockGeometry = new THREE.BoxGeometry(1, 1, 1);

  for (let i = 0; i < 240; i += 1) {
    const height = Math.random() * 10 + 2;
    const width = Math.random() * 1.8 + 0.4;
    const depth = Math.random() * 1.8 + 0.4;
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.62 + Math.random() * 0.05, 0.55, 0.45),
      emissive: 0x091133,
      metalness: 0.75,
      roughness: 0.35,
    });

    const block = new THREE.Mesh(blockGeometry, material);
    block.scale.set(width, height, depth);
    block.position.set((Math.random() - 0.5) * 40, height / 2 - 2, -Math.random() * 90 - 10);
    block.castShadow = false;
    block.receiveShadow = false;
    city.add(block);
  }

  scene.add(city);

  const roadGeometry = new THREE.PlaneGeometry(9, 220);
  const roadMaterial = new THREE.MeshStandardMaterial({
    color: 0x050a1a,
    emissive: 0x0a1330,
    metalness: 0.9,
    roughness: 0.15,
    transparent: true,
    opacity: 0.85,
  });
  const road = new THREE.Mesh(roadGeometry, roadMaterial);
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, -2, -80);
  scene.add(road);

  const laneGeometry = new THREE.PlaneGeometry(0.18, 220);
  const laneMaterial = new THREE.MeshBasicMaterial({ color: 0x7c5cff, transparent: true, opacity: 0.65 });
  const laneLeft = new THREE.Mesh(laneGeometry, laneMaterial);
  laneLeft.rotation.x = -Math.PI / 2;
  laneLeft.position.set(-1.2, -1.99, -80);
  scene.add(laneLeft);
  const laneRight = laneLeft.clone();
  laneRight.position.x = 1.2;
  scene.add(laneRight);

  const stars = new THREE.BufferGeometry();
  const starCount = 400;
  const positions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 1] = Math.random() * 40 + 5;
    positions[i * 3 + 2] = -Math.random() * 180;
  }
  stars.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starMaterial = new THREE.PointsMaterial({ color: 0x4cf3ff, size: 0.12, transparent: true, opacity: 0.65 });
  const starField = new THREE.Points(stars, starMaterial);
  scene.add(starField);

  const targetPosition = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
  const lookTarget = new THREE.Vector3(0, 0, -40);
  const clock = new THREE.Clock();
  const speed = 12;

  function handlePointerMove(event) {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = (event.clientY / window.innerHeight) * 2 - 1;
    targetPosition.x = clamp(x * 3.2, -4, 4);
    targetPosition.y = clamp(6 - y * 2.2, 3, 8.5);
  }

  window.addEventListener('pointermove', handlePointerMove);

  function resizeRenderer() {
    const { clientWidth, clientHeight } = canvas;
    if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    }
  }

  function animate() {
    requestAnimationFrame(animate);

    resizeRenderer();
    const delta = clamp(clock.getDelta(), 0.016, 0.08);

    city.children.forEach((block) => {
      block.position.z += delta * speed;
      if (block.position.z > 10) {
        block.position.z = -100 - Math.random() * 60;
        block.position.x = (Math.random() - 0.5) * 40;
      }
    });

    [road, laneLeft, laneRight, starField].forEach((mesh) => {
      mesh.position.z += delta * speed;
      if (mesh.position.z > 20) {
        mesh.position.z = -180;
      }
    });

    camera.position.lerp(targetPosition, 0.08);
    camera.lookAt(lookTarget);

    renderer.render(scene, camera);
  }

  animate();
}

function initRevealAnimations() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!revealElements.length) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px',
  });

  revealElements.forEach((el) => observer.observe(el));
}

function initParallax() {
  const parallaxItems = document.querySelectorAll('[data-parallax-target]');
  if (!parallaxItems.length) {
    return;
  }

  let ticking = false;

  const update = () => {
    parallaxItems.forEach((item) => {
      const parent = item.closest('[data-parallax]');
      if (!parent) {
        return;
      }
      const rect = parent.getBoundingClientRect();
      const depth = parseFloat(parent.dataset.parallax || '0.18');
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * depth;
      item.style.transform = `translate3d(0, ${-offset}px, 0)`;
    });
    ticking = false;
  };

  const requestUpdate = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  requestUpdate();
}

function initCursorGlow() {
  const glow = document.querySelector('.cursor-glow');
  if (!glow) {
    return;
  }

  let activePointer = false;

  const updatePosition = (x, y) => {
    glow.style.opacity = '1';
    glow.style.left = `${x}px`;
    glow.style.top = `${y}px`;
  };

  window.addEventListener('pointermove', (event) => {
    activePointer = true;
    updatePosition(event.clientX, event.clientY);
  });

  window.addEventListener('pointerdown', (event) => {
    updatePosition(event.clientX, event.clientY);
  });

  window.addEventListener('pointerleave', () => {
    if (activePointer) {
      glow.style.opacity = '0';
    }
  });
}

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) {
    return;
  }

  const handleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 80);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function initCurrentYear() {
  const yearElements = document.querySelectorAll('#current-year');
  if (!yearElements.length) {
    return;
  }
  const currentYear = new Date().getFullYear();
  yearElements.forEach((element) => {
    element.textContent = String(currentYear);
  });
}

function initVanillaTilt() {
  if (typeof VanillaTilt === 'undefined') {
    return;
  }
  const tiltNodes = document.querySelectorAll('[data-tilt]');
  if (!tiltNodes.length) {
    return;
  }
  VanillaTilt.init(tiltNodes, {
    glare: true,
    'max-glare': 0.35,
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroScene();
  initRevealAnimations();
  initParallax();
  initCursorGlow();
  initHeaderScroll();
  initCurrentYear();
  initVanillaTilt();
});
