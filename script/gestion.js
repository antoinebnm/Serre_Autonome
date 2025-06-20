function openModal() {
  document.getElementById("addHoseModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("addHoseModal").style.display = "none";
}

function addHose() {
  const hoseId = document.getElementById("hoseId").value.trim();
  const hoseName = document.getElementById("hoseName").value.trim();
  const sensorId = document.getElementById("sensorId").value.trim();

  if (!hoseId || !hoseName || !sensorId) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  const hoseContainer = document.getElementById("hoseContainer");
  const noCapteursMessage = document.getElementById("noCapteursMessage");

  if (noCapteursMessage) {
    noCapteursMessage.style.display = "none";
  }

  const hoseDiv = document.createElement("div");
  hoseDiv.className = "hose";
  hoseDiv.innerHTML = `
      <div class="hose-info">
        <strong>${hoseName} (${hoseId})</strong>
        <small>Sensor ID: ${sensorId}</small>
      </div>
      <div class="threshold">
        <label>Threshold:</label>
        <input type="number" value="50" min="0" max="100">
      </div>
    `;

  hoseContainer.appendChild(hoseDiv);

  closeModal();
  document.getElementById("hoseId").value = "";
  document.getElementById("hoseName").value = "";
  document.getElementById("sensorId").value = "";
}
