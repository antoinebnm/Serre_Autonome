// @ts-nocheck
import Api from "./api.js";
import AuthUtils from "./authUtils.js";

AuthUtils.requireAuth();
const currentName = AuthUtils.getCurrentUser().nom;
const currentFirstName = AuthUtils.getCurrentUser().prenom;
const currentEmail = AuthUtils.getCurrentUser().email;

const editBtn = document.getElementById("editBtn");
const firstNameField = document.getElementById("firstName");
const lastNameField = document.getElementById("lastName");
const emailField = document.getElementById("email");

firstNameField.value = currentFirstName;
lastNameField.value = currentName;
emailField.value = currentEmail;

let editing = false;

editBtn.addEventListener("click", async () => {
  if (editing) {
    // Mode sauvegarde
    const newFirstName = firstNameField.value.trim();
    const newLastName = lastNameField.value.trim();
    const newEmail = emailField.value.trim();

    // Validation basique
    if (!newFirstName || !newLastName || !newEmail) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (!isValidEmail(newEmail)) {
      alert("Veuillez entrer une adresse email valide.");
      return;
    }

    try {
      // Désactiver le bouton pendant la sauvegarde
      editBtn.disabled = true;
      editBtn.textContent = "Sauvegarde...";

      const currentUser = AuthUtils.getCurrentUser();
      const userData = {
        prenom: newFirstName,
        nom: newLastName,
        email: newEmail,
      };

      // Appeler l'API pour mettre à jour les données
      await Api.updateUser(currentUser.id, userData);

      // Succès - passer en mode lecture
      editing = false;
      firstNameField.disabled = true;
      lastNameField.disabled = true;
      emailField.disabled = true;
      editBtn.textContent = "Edit";

      alert("Les informations ont été modifiées avec succès !");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde : " + error.message);
    } finally {
      editBtn.disabled = false;
    }
  } else {
    // Mode édition
    editing = true;
    firstNameField.disabled = false;
    lastNameField.disabled = false;
    emailField.disabled = false;
    editBtn.textContent = "Save";
  }
});

// Fonction de validation email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

//Image change
const uploadInput = document.getElementById("uploadInput");
const profileImage = document.getElementById("profileImage");

uploadInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profileImage.src = e.target.result;
      alert("Le photo a été modifié avec succès !");
    };
    reader.readAsDataURL(file);
  }
});
