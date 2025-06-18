import AuthUtils from "./authUtils.js";

// Initialiser les fonctionnalités d'authentification pour la page d'accueil
document.addEventListener("DOMContentLoaded", function () {
  // Configurer l'authentification
  AuthUtils.init({
    // Les éléments à afficher seulement pour les utilisateurs connectés
    showForLoggedIn: [
      '.nav-links li a[href="affichage"]',
      '.nav-links li a[href="gestion"]',
      '.nav-links li a[href="profil"]',
    ],
    // Redirection après déconnexion
    logoutRedirect: "homel",
  });
});
