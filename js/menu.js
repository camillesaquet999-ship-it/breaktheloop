// Fichier JavaScript minimal pour le menu mobile

document.addEventListener('DOMContentLoaded', function() {
    // Créer le menu mobile en JavaScript pour éviter les conflits HTML
    function createMobileMenu() {
        // Créer l'élément div du menu
        const mobileMenu = document.createElement('div');
        mobileMenu.id = 'mobile-menu';
        
        // Créer le bouton de fermeture
        const closeButton = document.createElement('button');
        closeButton.className = 'close-menu';
        closeButton.innerHTML = '&times;';
        closeButton.setAttribute('aria-label', 'Fermer le menu');
        
        // Créer la liste de liens (copie des liens du menu principal)
        const menuList = document.createElement('ul');
        const navLinks = document.querySelector('.nav-links');
        
        if (navLinks) {
            // Copier les liens de navigation existants
            const links = navLinks.querySelectorAll('li');
            links.forEach(function(link) {
                const newItem = link.cloneNode(true);
                menuList.appendChild(newItem);
            });
        } else {
            // Si pas de liens trouvés, créer des liens par défaut
            const defaultLinks = [
                { href: "index.html", text: "Accueil" },
                { href: "#solutions", text: "Solutions" },
                { href: "actualites.html", text: "Actualités" },
                { href: "#", text: "Méthode" },
                { href: "#", text: "Ressources" },
                { href: "#", text: "Contact" }
            ];
            
            defaultLinks.forEach(function(link) {
                const item = document.createElement('li');
                const anchor = document.createElement('a');
                anchor.href = link.href;
                anchor.textContent = link.text;
                item.appendChild(anchor);
                menuList.appendChild(item);
            });
        }
        
        // Assembler le menu
        mobileMenu.appendChild(closeButton);
        mobileMenu.appendChild(menuList);
        
        // Ajouter le menu au body
        document.body.appendChild(mobileMenu);
        
        return mobileMenu;
    }
    
    // Créer le menu
    const mobileMenu = createMobileMenu();
    
    // Référence au bouton hamburger
    const hamburgerButton = document.querySelector('.mobile-nav-toggle');
    const closeButton = document.querySelector('.close-menu');
    
    // Fonction pour ouvrir le menu
    function openMenu() {
        mobileMenu.classList.add('show');
        document.body.style.overflow = 'hidden'; // Empêcher le défilement
    }
    
    // Fonction pour fermer le menu
    function closeMenu() {
        mobileMenu.classList.remove('show');
        document.body.style.overflow = ''; // Réactiver le défilement
    }
    
    // Événements pour ouvrir/fermer le menu
    if (hamburgerButton) {
        hamburgerButton.addEventListener('click', function(e) {
            e.preventDefault();
            openMenu();
        });
    }
    
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            closeMenu();
        });
    }
    
    // Fermer le menu si on clique sur un lien
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });
    
    // Fermer le menu avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('show')) {
            closeMenu();
        }
    });
    
    console.log('Menu mobile simple initialisé avec succès');
});
