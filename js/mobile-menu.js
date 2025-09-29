/**
 * Script ultra-simplifié pour le menu mobile
 */
document.addEventListener('DOMContentLoaded', function() {
    // Éléments du menu
    const menuButton = document.querySelector('.mobile-nav-toggle');
    const menuLinks = document.querySelector('.nav-links');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    // Fonction pour ouvrir/fermer le menu
    function toggleMenu() {
        // Si le menu est déjà ouvert, on le ferme
        if (menuLinks.classList.contains('active')) {
            menuLinks.classList.remove('active');
            menuButton.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = ''; // Réactiver le scroll
            if (menuOverlay) menuOverlay.classList.remove('active');
        } 
        // Sinon, on l'ouvre
        else {
            menuLinks.classList.add('active');
            menuButton.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden'; // Bloquer le scroll
            if (menuOverlay) menuOverlay.classList.add('active');
        }
    }
    
    // Écouter le clic sur le bouton du menu
    if (menuButton) {
        menuButton.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMenu();
        });
    }
    
    // Fermer le menu si on clique sur un lien
    if (menuLinks) {
        const links = menuLinks.querySelectorAll('a');
        links.forEach(function(link) {
            link.addEventListener('click', toggleMenu);
        });
    }
    
    // Fermer le menu si on clique sur l'overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', toggleMenu);
    }
});
