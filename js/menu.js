(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const toggle = document.querySelector('.mobile-nav-toggle');
        const nav = document.getElementById('primary-navigation');
        const overlay = document.querySelector('[data-menu-overlay]');

        if (!toggle || !nav) {
            return;
        }

        const links = Array.from(nav.querySelectorAll('a'));
        let lastFocus = null;

        function setMenuState(isOpen) {
            nav.setAttribute('data-visible', String(isOpen));
            toggle.setAttribute('aria-expanded', String(isOpen));
            document.body.classList.toggle('nav-open', isOpen);
            if (overlay) {
                overlay.classList.toggle('is-visible', isOpen);
            }

            if (isOpen && links.length) {
                lastFocus = document.activeElement;
                links[0].focus();
            } else if (!isOpen && lastFocus) {
                toggle.focus();
                lastFocus = null;
            }
        }

        toggle.addEventListener('click', function () {
            const isOpen = nav.getAttribute('data-visible') === 'true';
            setMenuState(!isOpen);
        });

        links.forEach(function (link) {
            link.addEventListener('click', function () {
                setMenuState(false);
            });
        });

        if (overlay) {
            overlay.addEventListener('click', function () {
                setMenuState(false);
            });
        }

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                setMenuState(false);
            }
        });
    });
})();
