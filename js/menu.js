const NAV_OPEN_CLASS = 'nav-open';

document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.querySelector('[data-nav-toggle]');
  const navList = document.getElementById('primary-nav');
  const backdrop = document.querySelector('[data-nav-dismiss]');
  const focusableSelectors = 'a[href], button:not([disabled])';
  let lastFocusedElement = null;

  if (!toggleButton || !navList) {
    return;
  }

  const toggleMenu = (forceOpen) => {
    const shouldOpen = typeof forceOpen === 'boolean'
      ? forceOpen
      : !document.body.classList.contains(NAV_OPEN_CLASS);

    document.body.classList.toggle(NAV_OPEN_CLASS, shouldOpen);
    toggleButton.setAttribute('aria-expanded', String(shouldOpen));

    if (shouldOpen) {
      lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      navList.querySelector(focusableSelectors)?.focus();
    } else if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };

  toggleButton.addEventListener('click', () => {
    toggleMenu();
  });

  backdrop?.addEventListener('click', () => {
    toggleMenu(false);
  });

  navList.addEventListener('click', (event) => {
    if (event.target instanceof HTMLElement && event.target.matches('a')) {
      toggleMenu(false);
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains(NAV_OPEN_CLASS)) {
      toggleMenu(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && document.body.classList.contains(NAV_OPEN_CLASS)) {
      toggleMenu(false);
    }
  });
});
