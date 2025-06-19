import Api from "./api.js";
import AuthUtils from "./authUtils.js";

document.addEventListener("DOMContentLoaded", function () {
  // Initialisation de l'authentification
  AuthUtils.init();

  // Récupération des éléments du DOM
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  const orderNowBtn = document.getElementById("order-now-btn");
  const modal = document.getElementById("order-modal");
  const closeModal = document.querySelector(".close-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const modalMessage = document.getElementById("modal-message"); // Fonction pour gérer la commande
  async function handleOrder() {
    // Afficher le modal
    modal.style.display = "flex";

    // Vérifier d'abord si l'utilisateur est connecté
    if (!AuthUtils.isLoggedIn()) {
      modalMessage.innerHTML = `
                <i class="fas fa-user error-icon"></i>
                <p>Vous devez être connecté pour finaliser votre commande.</p>
                <p>Vous allez être redirigé vers la page de connexion...</p>
            `;

      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        window.location.href =
          "/inscription?redirect=" + encodeURIComponent("/produit");
      }, 3000);
      return;
    }

    modalMessage.innerHTML = `
            <p>Génération de votre identifiant unique de serre...</p>
            <div class="loader"></div>
        `;

    try {
      // Générer un identifiant unique pour la serre
      const response = await Api.generateGreenHouseId();
      const identifiantSerre = response.identifiant_serre;

      // Créer la serre dans la base de données pour l'utilisateur connecté
      try {
        const serreData = {
          identifiant_serre: identifiantSerre,
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

        // Mettre à jour le message du modal pour succès
        modalMessage.innerHTML = `
                      <i class="fas fa-check-circle success-icon"></i>
                      <p>Votre commande a été traitée avec succès !</p>
                      <p>Identifiant unique de votre serre : <strong>${identifiantSerre}</strong></p>
                      <p>Vous allez être redirigé vers votre tableau de bord...</p>
                  `;

        // Rediriger vers le tableau de bord après 3 secondes
        setTimeout(() => {
          // Stocker l'ID de la serre dans le localStorage pour l'afficher sur la page du tableau de bord
          localStorage.setItem("currentSerreId", identifiantSerre);
          window.location.href = "/affichage";
        }, 3000);
      } catch (error) {
        console.error("Erreur lors de la création de la serre:", error);
        modalMessage.innerHTML = `
                      <i class="fas fa-exclamation-triangle error-icon"></i>
                      <p>Une erreur est survenue lors de la création de votre serre.</p>
                      <p>Veuillez réessayer ultérieurement.</p>
                  `;
      }
    } catch (error) {
      console.error("Erreur lors de la génération de l'ID:", error);
      modalMessage.innerHTML = `
              <i class="fas fa-exclamation-triangle error-icon"></i>
              <p>Une erreur est survenue lors de la génération de l'identifiant.</p>
              <p>Veuillez réessayer ultérieurement.</p>
          `;
    }
  }

  // Gestionnaires d'événements
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", handleOrder);
  }

  if (orderNowBtn) {
    orderNowBtn.addEventListener("click", handleOrder);
  }

  // Fermer le modal
  if (closeModal) {
    closeModal.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }

  // Fermer le modal si on clique en dehors
  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
});

// Ajouter les styles CSS nécessaires pour le modal
const style = document.createElement("style");
style.textContent = `
    .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        align-items: center;
        justify-content: center;
    }
    
    .modal-content {
        background-color: #fefefe;
        margin: auto;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        max-width: 500px;
        width: 90%;
    }
    
    .close-modal {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
    }
    
    .close-modal:hover,
    .close-modal:focus {
        color: #000;
        text-decoration: none;
        cursor: pointer;
    }
    
    .modal-header {
        text-align: center;
        margin-bottom: 20px;
    }
    
    .modal-body {
        text-align: center;
        margin-bottom: 20px;
    }
    
    .modal-footer {
        text-align: center;
        margin-top: 20px;
    }
    
    .success-icon {
        color: #4CAF50;
        font-size: 48px;
        margin-bottom: 10px;
    }
    
    .error-icon {
        color: #f44336;
        font-size: 48px;
        margin-bottom: 10px;
    }
    
    .loader {
        border: 5px solid #f3f3f3;
        border-top: 5px solid #3498db;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 2s linear infinite;
        margin: 20px auto;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .btn-secondary {
        background-color: #808080;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
    }
    
    .btn-secondary:hover {
        background-color: #666666;
    }
`;

document.head.appendChild(style);
