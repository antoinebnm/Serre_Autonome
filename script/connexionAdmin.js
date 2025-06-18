import Api from "./api.js";

// Vue.js Application
const app = Vue.createApp({
  data() {
    return {
      isRegister: true, // Par défaut sur le formulaire d'inscription
      registerForm: {
        prenom: "", // Champ pour le prénom
        nom: "", // Champ pour le nom
        email: "",
        password: "",
        terms: false,
      },
      loginForm: {
        email: "",
        password: "",
      },
      message: "",
      error: "",
      redirectUrl: null,
      pendingSerreId: null,
    };
  },
  mounted() {
    // Vérifier si l'utilisateur est déjà connecté
    if (Api.isAuthenticated()) {
      // Rediriger vers la page d'accueil ou le tableau de bord
      window.location.href = "/affichage";
      return;
    }

    // Récupérer l'identifiant de serre en attente s'il existe
    this.pendingSerreId = localStorage.getItem("pendingSerreId");

    // Vérifier s'il y a une URL de redirection dans les paramètres
    const params = new URLSearchParams(window.location.search);
    this.redirectUrl = params.get("redirect");

    // Nettoyer l'URL de redirection pour supprimer les extensions .html
    if (this.redirectUrl) {
      this.redirectUrl = this.redirectUrl.replace(/\.html$/, "");
      // S'assurer que ça commence par un /
      if (!this.redirectUrl.startsWith("/")) {
        this.redirectUrl = "/" + this.redirectUrl;
      }
    }
  },
  methods: {
    async submitRegister() {
      try {
        this.error = "";
        this.message = "";

        if (!this.registerForm.terms) {
          this.error = "Vous devez accepter les termes et conditions";
          return;
        }

        // Préparer les données pour l'API
        const userData = {
          prenom: this.registerForm.prenom,
          nom: this.registerForm.nom,
          email: this.registerForm.email,
          password: this.registerForm.password,
        };
        // Vérifier que tous les champs sont remplis
        if (
          !userData.prenom ||
          !userData.nom ||
          !userData.email ||
          !userData.password
        ) {
          this.error = "Tous les champs doivent être remplis";
          return;
        }
        // Vérifier que l'email est valide
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(userData.email)) {
          this.error = "Veuillez entrer une adresse e-mail valide";
          return;
        }
        // Vérifier que le mot de passe a au moins 8 caractères
        if (userData.password.length < 8) {
          this.error = "Le mot de passe doit contenir au moins 8 caractères";
          return;
        }
        // Vérifier que le mot de passe contient au moins une majuscule et un caractère spécial
        if (!/[A-Z]/.test(userData.password)) {
          this.error =
            "Le mot de passe doit contenir au moins une lettre majuscule";
          return;
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(userData.password)) {
          this.error =
            "Le mot de passe doit contenir au moins un caractère spécial";
          return;
        }
        // Vérifier que le prénom et le nom ne contiennent pas de caractères spéciaux
        const namePattern = /^[a-zA-ZÀ-ÿ '-]+$/;
        if (
          !namePattern.test(userData.prenom) ||
          !namePattern.test(userData.nom)
        ) {
          this.error =
            "Le prénom et le nom ne doivent pas contenir de caractères spéciaux";
          return;
        }
        // Vérifier que l'email n'est pas déjà utilisé

        // Appeler l'API d'inscription
        const response = await Api.register(userData);

        // Afficher le message de succès
        this.message = "Inscription réussie ! Connexion en cours...";

        // Si nous avons un ID de serre en attente, créer la serre pour l'utilisateur
        if (this.pendingSerreId) {
          try {
            const serreData = {
              identifiant_serre: this.pendingSerreId,
              nom: "Kit Capteurs Smart",
              description: "Serre automatisée avec kit de capteurs",
            };

            await fetch("http://localhost:3000/api/v1/greenhouse", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify(serreData),
            });

            // Stocker l'ID de la serre courante
            localStorage.setItem("currentSerreId", this.pendingSerreId);
            // Supprimer l'ID en attente
            localStorage.removeItem("pendingSerreId");
          } catch (error) {
            console.error("Erreur lors de la création de la serre:", error);
          }
        }

        // Attendre 1 seconde avant de rediriger
        setTimeout(() => {
          if (this.redirectUrl) {
            window.location.href = this.redirectUrl;
          } else {
            window.location.href = "/affichage";
          }
        }, 1000);
      } catch (error) {
        this.error =
          error.message || "Une erreur est survenue lors de l'inscription";
      }
    },

    async submitLogin() {
      try {
        this.error = "";
        this.message = "";

        // Préparer les données pour l'API
        const credentials = {
          email: this.loginForm.email,
          password: this.loginForm.password,
        };

        // Appeler l'API de connexion
        const response = await Api.login(credentials);

        // Afficher le message de succès
        this.message = "Connexion réussie !";

        // Si nous avons un ID de serre en attente, créer la serre pour l'utilisateur
        if (this.pendingSerreId) {
          try {
            const serreData = {
              identifiant_serre: this.pendingSerreId,
              nom: "Kit Capteurs Smart",
              description: "Serre automatisée avec kit de capteurs",
            };

            await fetch("http://localhost:3000/api/v1/greenhouse", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify(serreData),
            });

            // Stocker l'ID de la serre courante
            localStorage.setItem("currentSerreId", this.pendingSerreId);
            // Supprimer l'ID en attente
            localStorage.removeItem("pendingSerreId");
          } catch (error) {
            console.error("Erreur lors de la création de la serre:", error);
          }
        }

        // Rediriger vers la page d'origine ou le tableau de bord
        setTimeout(() => {
          if (this.redirectUrl) {
            window.location.href = this.redirectUrl;
          } else {
            window.location.href = "/affichage";
          }
        }, 1000);
      } catch (error) {
        this.error =
          error.message || "Une erreur est survenue lors de la connexion";
      }
    },
  },
});

// Monter l'application Vue
app.mount("#app");
