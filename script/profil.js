// @ts-nocheck
import Api from "./api.js";
import AuthUtils from "./authUtils.js";

AuthUtils.requireAuth();

const currentName = AuthUtils.getCurrentUser().nom;
const currentEmail = AuthUtils.getCurrentUser().email;

const editBtn = document.getElementById("editBtn");
const nameField = document.getElementById("name");
const emailField = document.getElementById("email");

nameField.value = currentName;
emailField.value = currentEmail;

let editing = false;

editBtn.addEventListener("click", () => {
  editing = !editing;

  nameField.disabled = !editing;
  emailField.disabled = !editing;

  editBtn.textContent = editing ? "Save" : "Edit";

  if (!editing) {
    alert("Les informations ont été modifiées avec succès !");
  }
});

//Image change
const uploadInput = document.getElementById("uploadInput");
const profileImage = document.getElementById("profileImage");

uploadInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profileImage.src = e.target.result;
      alert("Le photo a été modifié avec succès !");
    };
    reader.readAsDataURL(file);
  }
});
