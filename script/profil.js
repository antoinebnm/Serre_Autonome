// ...existing code...
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
    // Show message after saving
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

//Extra API
fetch('https://api.openweathermap.org/data/2.5/weather?q=Paris&appid=289787803f4565f40363247e34089279&units=metric')
    .then(response => response.json())
    .then(data => {
      document.getElementById('weatherBox').textContent =
        `Weather: ${data.weather[0].description}, ${data.main.temp}°C`;
      document.getElementById('humidityBox').textContent =
        `Humidity: ${data.main.humidity}%`;
      document.getElementById('windBox').textContent =
        `Wind: ${data.wind.speed} m/s`;
    })
    .catch(() => {
      document.getElementById('weatherBox').textContent = '';
      document.getElementById('humidityBox').textContent = '';
      document.getElementById('windBox').textContent = '';
    });