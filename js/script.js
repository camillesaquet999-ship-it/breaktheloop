// Configuration des particules
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#ffffff'
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                },
                polygon: {
                    nb_sides: 5
                }
            },
            opacity: {
                value: 0.3,
                random: false,
                anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#82DBFF',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.6
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    });
}

// Gestion du défilement pour le header sticky et la disparition des vagues
function handleScroll() {
    const header = document.querySelector('header');
    const waveWrapper = document.getElementById('wave-wrapper');
    const scrollPosition = window.scrollY;
    
    // Changer le style du header lors du défilement
    if (header) { // Ajout d'une vérification au cas où header n'existe pas
        if (scrollPosition > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Faire disparaître les vagues en fondu lors du défilement
    if (waveWrapper) { // Ajout d'une vérification
        if (scrollPosition > 50) { // Ajustement du seuil de disparition
            if (!waveWrapper.classList.contains('hidden')) {
                waveWrapper.classList.add('hidden');
            }
        } else {
            if (waveWrapper.classList.contains('hidden')) {
                waveWrapper.classList.remove('hidden');
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Code du menu mobile déplacé vers mobile-menu.js
    // Pour éviter les conflits et assurer un fonctionnement fiable

    // Initialiser les particules
    if (typeof particlesJS === 'function') { // Vérifie si particlesJS est chargé
        initParticles();
    } else {
        console.error('particlesJS not found, skipping initialization.');
    }

    // Gestion du défilement
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Appel initial pour définir l'état correct au chargement

    // Ajouter un écouteur d'événement pour la flèche de défilement
    const scrollIndicator = document.querySelector('.scroll-indicator'); // Nom original rétabli
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const solutionsSection = document.getElementById('solutions');
            if (solutionsSection) {
                solutionsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Code existant pour le modèle 3D
    const canvas = document.getElementById('ringCanvas');
    let scene, camera, renderer, model; // Déclarations pour Three.js
    let ambientLight, directionalLight;
    let lastMouseX = 0, lastMouseY = 0; // Renamed to avoid confusion, stores last position
    let targetRotationX = 0, targetRotationY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    let isDragging = false;

    function init() {
        // Scene
        scene = new THREE.Scene();

        // Camera
        const aspectRatio = canvas.offsetWidth / canvas.offsetHeight;
        camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
        camera.position.set(0, 0, 9); // Moved camera back to accommodate larger model
        camera.lookAt(scene.position);

        // Renderer
        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputEncoding = THREE.sRGBEncoding; // For GLTF models
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        
        // Ajout des écouteurs d'événements pour l'interaction avec la souris/doigt
        canvas.addEventListener('mousedown', onDocumentMouseDown, false);
        canvas.addEventListener('touchstart', onDocumentTouchStart, false);
        canvas.addEventListener('mousemove', onDocumentMouseMove, false);
        canvas.addEventListener('touchmove', onDocumentTouchMove, false);
        canvas.addEventListener('mouseup', onDocumentMouseUp, false);
        canvas.addEventListener('touchend', onDocumentTouchEnd, false);

        // Lighting
        ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
        scene.add(ambientLight);

        directionalLight = new THREE.DirectionalLight(0x82DBFF, 2.5); // Light blueish light
        directionalLight.position.set(5, 5, 5).normalize();
        scene.add(directionalLight);
        
        const backLight = new THREE.DirectionalLight(0x6A0DAD, 1.5); // Purpleish backlight
        backLight.position.set(-5, -3, -5).normalize();
        scene.add(backLight);


        // GLTF Loader
        const loader = new THREE.GLTFLoader();
        loader.load(
            'assets/ring.glb', // Ensure this path is correct
            function (gltf) {
                model = gltf.scene;
                model.scale.set(3.5, 3.5, 3.5); // Increased scale significantly
                model.position.set(0, 0, 0); // Center the model

                // Optional: Apply a more metallic/shiny look if not defined in GLB
                model.traverse((child) => {
                    if (child.isMesh) {
                        // Ensure a material exists
                        if (!child.material) {
                            child.material = new THREE.MeshStandardMaterial({ color: 0x5555ff });
                        } else if (child.material.isMeshStandardMaterial) {
                            child.material.metalness = 0.8; // Increase metalness
                            child.material.roughness = 0.3; // Decrease roughness for shinier surface
                        }
                         // If you want to force a specific color similar to the image:
                        // child.material.color.setHex(0x3c65d8); // Blueish
                        // child.material.emissive = new THREE.Color(0x6A0DAD).multiplyScalar(0.2); // Purple glow
                    }
                });

                scene.add(model);
                animate(); // Start animation loop only after model is loaded
            },
            function (error) {
                console.error('An error happened loading the GLTF model:', error);
                // Display a fallback or error message on the canvas
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = 'red';
                    ctx.font = '16px Poppins';
                    ctx.textAlign = 'center';
                    ctx.fillText('Erreur: Modèle 3D (ring.glb) introuvable ou non chargé.', canvas.offsetWidth / 2, canvas.offsetHeight / 2);
                    ctx.fillText('Vérifiez le chemin et le fichier dans assets/.', canvas.offsetWidth / 2, canvas.offsetHeight / 2 + 20);
                }
            }
        );

        // Handle window resize
        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
        if (camera && renderer && canvas) {
            const heroImageContainer = document.querySelector('.hero-image-container');
            if (heroImageContainer) {
                 // Set canvas size based on its container - make it larger
                canvas.width = heroImageContainer.offsetWidth * 1.2;
                canvas.height = heroImageContainer.offsetHeight * 1.2;
                
                camera.aspect = canvas.width / canvas.height;
                camera.updateProjectionMatrix();
                renderer.setSize(canvas.width, canvas.height);
                
                // Mettre à jour les variables utilisées pour le calcul de la rotation
                windowHalfX = window.innerWidth / 2;
                windowHalfY = window.innerHeight / 2;
            }
        }
    }
    
    // Call onWindowResize initially to set correct size
    setTimeout(onWindowResize, 50); // Small delay to ensure layout is stable


    function animate() {
        requestAnimationFrame(animate);

        if (model) {
            if (!isDragging) {
                // Animation automatique lente quand pas d'interaction
                // Continue d'utiliser targetRotationX/Y ou une rotation incrémentielle simple
                model.rotation.y += 0.003; // Ou ajustez pour utiliser targetRotationY si vous préférez une dérive vers une cible
                model.rotation.x += 0.001; // Ou ajustez pour utiliser targetRotationX
            }
            // La rotation pendant le glissement est gérée directement dans les événements mousemove/touchmove
        }

        renderer.render(scene, camera);
    }
    
    // Fonctions pour gérer les interactions souris/tactile
    function onDocumentMouseDown(event) {
        event.preventDefault();
        isDragging = true;
        
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        // Pas besoin de définir targetRotationX/Y ici, l'animation idle s'en chargera
    }
    
    function onDocumentMouseMove(event) {
        if (isDragging && model) {
            const deltaX = event.clientX - lastMouseX;
            const deltaY = event.clientY - lastMouseY;
            
            model.rotation.y += deltaX * 0.005; // Sensibilité ajustée, à tester
            model.rotation.x += deltaY * 0.005; // Sensibilité ajustée, à tester
            
            lastMouseX = event.clientX;
            lastMouseY = event.clientY;
        }
    }
    
    function onDocumentMouseUp() {
        isDragging = false;
    }
    
    function onDocumentTouchStart(event) {
        if (event.touches.length === 1) {
            event.preventDefault();
            isDragging = true;
            
            lastMouseX = event.touches[0].pageX;
            lastMouseY = event.touches[0].pageY;
        }
    }
    
    function onDocumentTouchMove(event) {
        if (event.touches.length === 1 && isDragging && model) {
            event.preventDefault();
            
            const currentX = event.touches[0].pageX;
            const currentY = event.touches[0].pageY;
            
            const deltaX = currentX - lastMouseX;
            const deltaY = currentY - lastMouseY;
            
            model.rotation.y += deltaX * 0.005; // Sensibilité ajustée, à tester
            model.rotation.x += deltaY * 0.005; // Sensibilité ajustée, à tester
            
            lastMouseX = currentX;
            lastMouseY = currentY;
        }
    }
    
    function onDocumentTouchEnd() {
        isDragging = false;
    }

    // Initialisation du modèle 3D et logique de finalisation de la mise en page
    if (canvas && typeof THREE !== 'undefined') {
        try {
            init(); // init() contient son propre setTimeout pour onWindowResize
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du modèle 3D:', error);
        }
    } else if (canvas && typeof THREE === 'undefined') {
        console.error('THREE.js library not found! 3D model cannot be initialized.');
    }

    // Tenter de finaliser la mise en page APRÈS l'initialisation potentielle de Three.js
    // et après que son propre onWindowResize (dans un setTimeout de 50ms) ait eu une chance de s'exécuter.
    setTimeout(() => {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            void heroSection.offsetHeight;
        }
        // Appeler onWindowResize ici pour s'assurer que le canvas a les bonnes dimensions
        // après que le reste de la page (y compris hero-section) ait eu une chance de se mettre en page.
        if (typeof onWindowResize === 'function') {
            onWindowResize();
        }

        handleScroll(); // S'assure que le header/vagues sont corrects
        window.dispatchEvent(new Event('scroll')); // Déclenche les événements de scroll globaux
    }, 800); // Délai augmenté pour couvrir l'initialisation de Three.js + son onWindowResize
});
