const editBtn = document.getElementById('editBtn');
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');

let editing = false;

editBtn.addEventListener('click', () => {
  editing = !editing;

  nameField.disabled = !editing;
  emailField.disabled = !editing;

  editBtn.textContent = editing ? 'Save' : 'Edit';

  if (!editing) {
    alert('Info has been successfully modified!');
  }
});

//Image change
const uploadInput = document.getElementById("uploadInput");
const profileImage = document.getElementById("profileImage");

uploadInput.addEventListener("change", function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          profileImage.src = e.target.result;
          alert('Profile photo has been successfully changed!');
      };
      reader.readAsDataURL(file);
    }
});


