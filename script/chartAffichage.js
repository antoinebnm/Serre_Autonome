// @ts-nocheck
const tempctx = document.getElementById("temperatureChart").getContext("2d");
const lightctx = document.getElementById("luminosityChart").getContext("2d");
const humidityctx = document.getElementById("humidityChart").getContext("2d");

let tempfilter = document.getElementById("temperatureFilter").value; // 24h, 7 jours, 30 jours
let lightfilter = document.getElementById("luminosityFilter").value; // 24h, 7 jours, 30 jours
let humidityfilter = document.getElementById("humidityFilter").value; // 24h, 7 jours, 30 jours

const temperatureData = {
  "24h": [20, 21, 19, 18, 22, 23, 21, 20, 19, 18, 17, 16, 15, 14, 13],
  "7 jours": [20, 21, 19, 18, 22, 23, 21],
  "30 jours": [20, 21, 19, 18, 22, 23, 21, 20, 19, 18, 17, 16, 15, 14, 13],
};
const luminosityData = {
  "24h": [300, 320, 310, 290, 330, 340, 320, 310, 300, 290, 280, 270, 260],
  "7 jours": [300, 320, 310, 290, 330, 340],
  "30 jours": [300, 320, 310, 290, 330, 340, 320, 310, 300, 290, 280, 270],
};
const humidityData = {
  "24h": [40, 42, 38, 36, 44, 46, 42, 40, 38, 36, 34, 32, 30],
  "7 jours": [40, 42, 38, 36, 44, 46],
  "30 jours": [40, 42, 38, 36, 44, 46, 42, 40, 38, 36, 34, 32],
};
// Initialize the chart on page load
updateHumidityChart();
updateLuminosityChart();
updateTemperatureChart();

// Add event listener to rebuild the chart when the filter changes
document
  .getElementById("temperatureFilter")
  .addEventListener("change", function () {
    tempfilter = this.value;
    updateTemperatureChart(); // Call function to update chart
  });
document
  .getElementById("luminosityFilter")
  .addEventListener("change", function () {
    lightfilter = this.value;
    updateLuminosityChart(); // Call function to update chart
  });

// Add event listener to rebuild the chart when the filter changes
document
  .getElementById("humidityFilter")
  .addEventListener("change", function () {
    humidityfilter = this.value;
    updateHumidityChart(); // Call function to update chart
  });

// Function to update the chart
function updateTemperatureChart() {
  // Destroy existing chart if it exists
  if (window.temperatureChartInstance) {
    window.temperatureChartInstance.destroy();
  }

  // Create new chart with updated data
  window.temperatureChartInstance = new Chart(tempctx, {
    type: "line",
    data: {
      labels: temperatureData[tempfilter].map(
        (_, index) => `Point ${index + 1}`
      ),
      datasets: [
        {
          label: "Température",
          data: temperatureData[tempfilter],
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Initialize luminosity chart
function updateLuminosityChart() {
  if (window.luminosityChartInstance) {
    window.luminosityChartInstance.destroy();
  }

  window.luminosityChartInstance = new Chart(lightctx, {
    type: "line",
    data: {
      labels: luminosityData[lightfilter].map(
        (_, index) => `Point ${index + 1}`
      ),
      datasets: [
        {
          label: "Luminosité",
          data: luminosityData[lightfilter],
          borderColor: "rgba(255, 206, 86, 1)",
          backgroundColor: "rgba(255, 206, 86, 0.2)",
          fill: true,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Initialize humidity chart
function updateHumidityChart() {
  if (window.humidityChartInstance) {
    window.humidityChartInstance.destroy();
  }

  window.humidityChartInstance = new Chart(humidityctx, {
    type: "line",
    data: {
      labels: humidityData[humidityfilter].map(
        (_, index) => `Point ${index + 1}`
      ),
      datasets: [
        {
          label: "Humidité",
          data: humidityData[humidityfilter],
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          fill: true,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
