// @ts-nocheck
import Api from "./api.js";
import socketManager from "./socket.js";
import AuthUtils from "./authUtils.js";

// Variables pour stocker les données
let temperatureData = [];
let humidityData = [];
let lightData = [];
let lastUpdateTime = new Date();
let charts = {};
let dataUpdateInterval = null;
let recentDataTable = [];
let currentSerreId = localStorage.getItem("currentSerreId");
let lastLightData = null; // Pour stocker la dernière valeur de luminosité reçue

// Fonctions pour calculer le DPV (Déficit de Pression de Vapeur)
function saturationPressure(temperature) {
  // Formule de Tetens pour la pression de vapeur saturante (en kPa)
  return 0.6108 * Math.exp((17.27 * temperature) / (temperature + 237.3));
}

function calculateDPV(temperature, humidity) {
  // Calcul du DPV (Déficit de Pression de Vapeur) en kPa
  const es = saturationPressure(temperature);
  const ea = (humidity / 100) * es;
  return Math.max(0, es - ea); // Assurez-vous que le DPV n'est jamais négatif
}

// Fonction d'initialisation
async function initialize() {
  // Vérifier que l'utilisateur est connecté et possède une serre
  if (!(await AuthUtils.requireSerreOwnership())) {
    return;
  }

  // Récupérer l'ID de la serre actuelle
  currentSerreId = localStorage.getItem("currentSerreId");

  // Afficher l'ID de la serre
  displaySerreId();

  // Ajouter un bouton pour supprimer la serre
  addDeleteSerreButton();

  // Initialiser les graphiques
  initializeCharts();

  // Configurer les filtres de temps pour les graphiques
  setupTimeFilters();

  // Charger les données initiales
  await loadInitialData();

  // Configurer la connexion WebSocket
  setupWebSocket();

  // Configurer l'intervalle de mise à jour
  setupUpdateInterval();
}

// La fonction showNoSerreMessage a été déplacée dans authUtils.js

// Fonction pour ajouter un bouton de suppression de serre
function addDeleteSerreButton() {
  const headerInfo = document.querySelector(".header-info");
  if (headerInfo) {
    const deleteButton = document.createElement("div");
    deleteButton.className = "delete-serre-btn";
    deleteButton.innerHTML = `<button class="btn-danger"><i class="fas fa-trash"></i> Supprimer ma serre</button>`;
    headerInfo.appendChild(deleteButton);

    // Ajouter un gestionnaire d'événements pour le bouton
    deleteButton.querySelector("button").addEventListener("click", async () => {
      if (
        confirm(
          "Êtes-vous sûr de vouloir supprimer votre serre ? Cette action est irréversible."
        )
      ) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/v1/greenhouse/${currentSerreId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.ok) {
            localStorage.removeItem("currentSerreId");
            alert("Votre serre a été supprimée avec succès.");
            window.location.href = "/";
          } else {
            alert(
              "Une erreur est survenue lors de la suppression de votre serre."
            );
          }
        } catch (error) {
          console.error("Erreur lors de la suppression de la serre:", error);
          alert(
            "Une erreur est survenue lors de la suppression de votre serre."
          );
        }
      }
    });
  }
}

// Fonction pour afficher l'ID de la serre
function displaySerreId() {
  if (currentSerreId) {
    // Créer un élément pour afficher l'ID de la serre dans le header
    const headerInfo = document.querySelector(".header-info");
    if (headerInfo) {
      const serreIdDiv = document.createElement("div");
      serreIdDiv.className = "serre-id";
      serreIdDiv.innerHTML = `<i class="fas fa-qrcode"></i> ID Serre: <span>${currentSerreId}</span>`;
      headerInfo.appendChild(serreIdDiv);
    }
  }
}

// Fonction pour initialiser les graphiques
function initializeCharts() {
  // Graphique de température
  const temperatureCtx = document
    .getElementById("temperatureChart")
    .getContext("2d");
  charts.temperature = new Chart(temperatureCtx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Température (°C)",
          data: [],
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderWidth: 1,
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    },
  });

  // Graphique d'humidité
  const humidityCtx = document.getElementById("humidityChart").getContext("2d");
  charts.humidity = new Chart(humidityCtx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Humidité (%)",
          data: [],
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderWidth: 1,
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
          max: 100,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    },
  });

  // Graphique de luminosité
  const lightCtx = document.getElementById("luminosityChart").getContext("2d");
  charts.light = new Chart(lightCtx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Luminosité (%)",
          data: [],
          borderColor: "rgb(255, 205, 86)",
          backgroundColor: "rgba(255, 205, 86, 0.2)",
          borderWidth: 1,
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    },
  });
}

// Fonction pour configurer les filtres de temps
function setupTimeFilters() {
  document
    .getElementById("temperatureFilter")
    .addEventListener("change", async function () {
      await loadTemperatureData(this.value);
      updateTemperatureChart();
    });

  document
    .getElementById("humidityFilter")
    .addEventListener("change", async function () {
      await loadHumidityData(this.value);
      updateHumidityChart();
    });

  document
    .getElementById("luminosityFilter")
    .addEventListener("change", async function () {
      await loadLightData(this.value);
      updateLightChart();
    });
}

// Fonction pour charger les données initiales
async function loadInitialData() {
  try {
    // Charger les données de température pour les dernières 24h
    await loadTemperatureData("24h");
    updateTemperatureChart();

    // Charger les données d'humidité pour les dernières 24h
    await loadHumidityData("24h");
    updateHumidityChart();

    // Charger les données de luminosité pour les dernières 24h
    await loadLightData("24h");
    updateLightChart();

    // Initialiser la table de données récentes
    initRecentDataTable();
  } catch (error) {
    console.error("Erreur lors du chargement des données initiales:", error);
    showError("Erreur de connexion au serveur. Veuillez réessayer plus tard.");
  }
}

// Fonction pour charger les données de température
async function loadTemperatureData(timeRange) {
  try {
    const data = await Api.getTemperatureData(timeRange);
    temperatureData = data.map((item) => ({
      value: item.value,
      timestamp: new Date(item.timestamp),
    }));
  } catch (error) {
    console.error(
      "Erreur lors du chargement des données de température:",
      error
    );
    temperatureData = generateDummyData(20, 25, 20);
  }
}

// Fonction pour charger les données d'humidité
async function loadHumidityData(timeRange) {
  try {
    const data = await Api.getHumidityData(timeRange);
    humidityData = data.map((item) => ({
      value: item.value,
      timestamp: new Date(item.timestamp),
    }));
  } catch (error) {
    console.error("Erreur lors du chargement des données d'humidité:", error);
    humidityData = generateDummyData(60, 70, 20);
  }
}

// Fonction pour charger les données de luminosité
async function loadLightData(timeRange) {
  try {
    const data = await Api.getLightData(timeRange);
    lightData = data.map((item) => ({
      value: item.value,
      timestamp: new Date(item.timestamp),
    }));
  } catch (error) {
    console.error(
      "Erreur lors du chargement des données de luminosité:",
      error
    );
    lightData = generateDummyData(40, 60, 20);
  }
}

// Fonction pour générer des données factices pour les tests
function generateDummyData(min, max, count) {
  const data = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (count - i) * 3600000);
    const value = min + Math.random() * (max - min);
    data.push({
      value: parseFloat(value.toFixed(1)),
      timestamp: timestamp,
    });
  }

  return data;
}

// Fonction pour mettre à jour le graphique de température
function updateTemperatureChart() {
  const labels = temperatureData.map((item) => formatTime(item.timestamp));
  const values = temperatureData.map((item) => item.value);

  charts.temperature.data.labels = labels;
  charts.temperature.data.datasets[0].data = values;
  charts.temperature.update();

  // Mettre à jour l'affichage de la température actuelle
  if (values.length > 0) {
    const currentTemperature = values[values.length - 1];
    document.getElementById(
      "temperatureValue"
    ).textContent = `${currentTemperature}°C`;
  }
}

// Fonction pour mettre à jour le graphique d'humidité
function updateHumidityChart() {
  const labels = humidityData.map((item) => formatTime(item.timestamp));
  const values = humidityData.map((item) => item.value);

  charts.humidity.data.labels = labels;
  charts.humidity.data.datasets[0].data = values;
  charts.humidity.update();

  // Mettre à jour l'affichage de l'humidité actuelle
  if (values.length > 0) {
    const currentHumidity = values[values.length - 1];
    document.getElementById(
      "humidityValue"
    ).textContent = `${currentHumidity}%`;
  }
}

// Fonction pour mettre à jour le graphique de luminosité
function updateLightChart() {
  const labels = lightData.map((item) => formatTime(item.timestamp));
  const values = lightData.map((item) => item.value);

  charts.light.data.labels = labels;
  charts.light.data.datasets[0].data = values;
  charts.light.update();

  // Mettre à jour l'affichage de la luminosité actuelle
  if (values.length > 0) {
    const currentLuminosity = values[values.length - 1];
    document.getElementById(
      "luminosityValue"
    ).textContent = `${currentLuminosity}%`;
  }
}

// Fonction pour initialiser la table de données récentes
function initRecentDataTable() {
  const tableBody = document.querySelector(".data-table tbody");
  tableBody.innerHTML = "";

  // Créer un tableau de 5 entrées vides
  recentDataTable = [];
  for (let i = 0; i < 5; i++) {
    recentDataTable.push({
      timestamp: null,
      temperature: null,
      humidity: null,
      light: null,
    });
  }
}

// Fonction pour mettre à jour la table de données récentes
function updateRecentDataTable(newData) {
  // Ajouter la nouvelle entrée au début du tableau
  recentDataTable.unshift({
    timestamp: new Date(),
    temperature:
      newData.temperature ||
      (temperatureData.length > 0
        ? temperatureData[temperatureData.length - 1].value
        : null),
    humidity:
      newData.humidity ||
      (humidityData.length > 0
        ? humidityData[humidityData.length - 1].value
        : null),
    light:
      newData.light ||
      (lightData.length > 0 ? lightData[lightData.length - 1].value : null),
  });

  // Limiter le tableau à 5 entrées
  recentDataTable = recentDataTable.slice(0, 5);

  // Mettre à jour l'affichage de la table
  const tableBody = document.querySelector(".data-table tbody");
  tableBody.innerHTML = "";

  recentDataTable.forEach((entry) => {
    if (entry.timestamp) {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${formatTime(entry.timestamp, true)}</td>
                <td>${
                  entry.temperature !== null
                    ? `${entry.temperature.toFixed(1)}°C`
                    : "-"
                }</td>
                <td>${
                  entry.humidity !== null
                    ? `${entry.humidity.toFixed(1)}%`
                    : "-"
                }</td>
                <td>${
                  entry.light !== null ? `${entry.light.toFixed(1)}%` : "-"
                }</td>
            `;
      tableBody.appendChild(row);
    }
  });
}

// Fonction pour mettre à jour les recommandations et alertes
function updateRecommendations() {
  // Récupérer les valeurs actuelles
  const currentTemperature =
    temperatureData.length > 0
      ? temperatureData[temperatureData.length - 1].value
      : null;
  const currentHumidity =
    humidityData.length > 0
      ? humidityData[humidityData.length - 1].value
      : null;
  const currentLight =
    lightData.length > 0 ? lightData[lightData.length - 1].value : null;

  // Calculer le DPV actuel si possible
  let currentDPV = null;
  if (currentTemperature !== null && currentHumidity !== null) {
    currentDPV = calculateDPV(currentTemperature, currentHumidity);
  }

  // Définir les seuils pour les alertes (ces valeurs peuvent être ajustées selon les besoins spécifiques)
  const thresholds = {
    temperature: {
      danger_low: 5, // Risque de gel
      warning_low: 15, // Température basse
      warning_high: 30, // Température élevée
      danger_high: 35, // Température critique
    },
    humidity: {
      danger_low: 20, // Très sec
      warning_low: 30, // Sec
      warning_high: 80, // Humide
      danger_high: 90, // Très humide
    },
    light: {
      danger_low: 10, // Très sombre
      warning_low: 20, // Faible luminosité
      good: 60, // Luminosité optimale
    },
    dpv: {
      optimal_low: 0.4, // Optimal bas
      optimal_high: 1.0, // Optimal haut
      warning_high: 2.0, // Élevé
      danger_high: 2.5, // Stress hydrique
    },
  };

  // Mettre à jour les alertes
  const alertsList = document.querySelector(".alerts-list");
  if (alertsList) {
    alertsList.innerHTML = "";
    let alertCount = 0;

    // Vérifier les conditions de température et ajouter des alertes
    if (currentTemperature !== null) {
      if (currentTemperature <= thresholds.temperature.danger_low) {
        alertsList.innerHTML += createAlert(
          "danger",
          "fa-thermometer-empty",
          "Risque de gel",
          `Température: ${currentTemperature.toFixed(1)}°C`
        );
        alertCount++;
      } else if (currentTemperature < thresholds.temperature.warning_low) {
        alertsList.innerHTML += createAlert(
          "warning",
          "fa-thermometer-quarter",
          "Température basse",
          `Température: ${currentTemperature.toFixed(1)}°C`
        );
        alertCount++;
      } else if (currentTemperature >= thresholds.temperature.danger_high) {
        alertsList.innerHTML += createAlert(
          "danger",
          "fa-thermometer-full",
          "Température critique",
          `Température: ${currentTemperature.toFixed(1)}°C`
        );
        alertCount++;
      } else if (currentTemperature >= thresholds.temperature.warning_high) {
        alertsList.innerHTML += createAlert(
          "warning",
          "fa-thermometer-three-quarters",
          "Température élevée",
          `Température: ${currentTemperature.toFixed(1)}°C`
        );
        alertCount++;
      }
    }

    // Vérifier les conditions d'humidité et ajouter des alertes
    if (currentHumidity !== null) {
      if (currentHumidity <= thresholds.humidity.danger_low) {
        alertsList.innerHTML += createAlert(
          "danger",
          "fa-tint-slash",
          "Humidité critique",
          `Humidité: ${currentHumidity.toFixed(1)}%`
        );
        alertCount++;
      } else if (currentHumidity < thresholds.humidity.warning_low) {
        alertsList.innerHTML += createAlert(
          "warning",
          "fa-tint-slash",
          "Humidité basse",
          `Humidité: ${currentHumidity.toFixed(1)}%`
        );
        alertCount++;
      } else if (currentHumidity >= thresholds.humidity.danger_high) {
        alertsList.innerHTML += createAlert(
          "danger",
          "fa-tint",
          "Humidité excessive",
          `Humidité: ${currentHumidity.toFixed(1)}%`
        );
        alertCount++;
      } else if (currentHumidity >= thresholds.humidity.warning_high) {
        alertsList.innerHTML += createAlert(
          "warning",
          "fa-tint",
          "Humidité élevée",
          `Humidité: ${currentHumidity.toFixed(1)}%`
        );
        alertCount++;
      }
    }

    // Vérifier les conditions de luminosité et ajouter des alertes
    if (currentLight !== null) {
      if (currentLight <= thresholds.light.danger_low) {
        alertsList.innerHTML += createAlert(
          "warning",
          "fa-lightbulb",
          "Luminosité très faible",
          `Luminosité: ${currentLight.toFixed(1)}%`
        );
        alertCount++;
      } else if (currentLight < thresholds.light.warning_low) {
        alertsList.innerHTML += createAlert(
          "info",
          "fa-lightbulb",
          "Luminosité faible",
          `Luminosité: ${currentLight.toFixed(1)}%`
        );
        alertCount++;
      }
    }

    // Vérifier les conditions de DPV et ajouter des alertes
    if (currentDPV !== null) {
      if (currentDPV >= thresholds.dpv.danger_high) {
        alertsList.innerHTML += createAlert(
          "danger",
          "fa-seedling",
          "Stress hydrique",
          `DPV: ${currentDPV.toFixed(2)} kPa`
        );
        alertCount++;
      } else if (currentDPV >= thresholds.dpv.warning_high) {
        alertsList.innerHTML += createAlert(
          "warning",
          "fa-seedling",
          "DPV élevé",
          `DPV: ${currentDPV.toFixed(2)} kPa`
        );
        alertCount++;
      } else if (currentDPV < thresholds.dpv.optimal_low) {
        alertsList.innerHTML += createAlert(
          "info",
          "fa-seedling",
          "DPV bas",
          `DPV: ${currentDPV.toFixed(2)} kPa`
        );
        alertCount++;
      }
    }

    // Ajouter une information d'arrosage programmé (statique pour l'exemple)
    alertsList.innerHTML += createAlert(
      "info",
      "fa-faucet",
      "Arrosage programmé",
      "Dans 1h"
    );
    alertCount++;

    // Mise à jour du compteur d'alertes
    const alertCountElement = document.querySelector(".alert-count");
    if (alertCountElement) {
      alertCountElement.textContent = alertCount.toString();
    }
  }
}

// Fonction utilitaire pour créer une alerte HTML
function createAlert(type, icon, title, time) {
  return `
		<div class="alert-item ${type}">
			<i class="fas ${icon}"></i>
			<div class="alert-content">
				<div class="alert-title">${title}</div>
				<div class="alert-time">${time}</div>
			</div>
		</div>
	`;
}

// Fonction pour mettre à jour le DPV
function updateDPV() {
  // S'assurer que nous avons des données de température et d'humidité
  if (temperatureData.length > 0 && humidityData.length > 0) {
    const currentTemperature =
      temperatureData[temperatureData.length - 1].value;
    const currentHumidity = humidityData[humidityData.length - 1].value;

    const dpv = calculateDPV(currentTemperature, currentHumidity);
    document.getElementById("dpv-value").textContent = `${dpv.toFixed(2)} kPa`;

    // Mettre à jour l'indicateur de tendance
    const dpvElement = document.querySelector(".stat-card .dpv");
    const dpvTrend = document.querySelector(
      ".stat-card .dpv + .stat-info .stat-trend"
    );

    if (dpvTrend) {
      // Interpréter la valeur DPV pour les plantes
      if (dpv < 0.4) {
        dpvTrend.className = "stat-trend info";
        dpvTrend.textContent = "Bas";
        dpvElement.classList.remove("warning", "danger");
      } else if (dpv < 1.0) {
        dpvTrend.className = "stat-trend neutral";
        dpvTrend.textContent = "Optimal";
        dpvElement.classList.remove("warning", "danger");
      } else if (dpv < 2.0) {
        dpvTrend.className = "stat-trend positive";
        dpvTrend.textContent = "Bon";
        dpvElement.classList.remove("warning", "danger");
      } else if (dpv < 2.5) {
        dpvTrend.className = "stat-trend warning";
        dpvTrend.textContent = "Élevé";
        dpvElement.classList.add("warning");
        dpvElement.classList.remove("danger");
      } else {
        dpvTrend.className = "stat-trend negative";
        dpvTrend.textContent = "Stress hydrique";
        dpvElement.classList.add("danger");
        dpvElement.classList.remove("warning");
      }
    }
  }
}

// Fonction pour mettre à jour les tendances et autres éléments visuels
function updateTrends() {
  // Mettre à jour la dernière heure de mise à jour
  document.getElementById("last-update").textContent = formatTime(
    new Date(),
    true
  );

  // Mettre à jour les tendances si nous avons suffisamment de données
  if (temperatureData.length >= 2) {
    const trend =
      temperatureData[temperatureData.length - 1].value -
      temperatureData[temperatureData.length - 2].value;
    const trendElement = document.querySelector(
      ".stat-card .temperature + .stat-info .stat-trend"
    );

    if (trendElement) {
      trendElement.textContent = `${trend >= 0 ? "+" : ""}${trend.toFixed(
        1
      )}°C`;
      trendElement.className = `stat-trend ${
        trend > 0 ? "positive" : trend < 0 ? "negative" : "neutral"
      }`;
    }
  }

  if (humidityData.length >= 2) {
    const trend =
      humidityData[humidityData.length - 1].value -
      humidityData[humidityData.length - 2].value;
    const trendElement = document.querySelector(
      ".stat-card .humidity + .stat-info .stat-trend"
    );

    if (trendElement) {
      trendElement.textContent = `${trend >= 0 ? "+" : ""}${trend.toFixed(1)}%`;
      trendElement.className = `stat-trend ${
        trend > 0 ? "positive" : trend < 0 ? "negative" : "neutral"
      }`;
    }
  }

  if (lightData.length >= 2) {
    const trend =
      lightData[lightData.length - 1].value -
      lightData[lightData.length - 2].value;
    const trendElement = document.querySelector(
      ".stat-card .light + .stat-info .stat-trend"
    );

    if (trendElement) {
      trendElement.textContent = `${trend >= 0 ? "+" : ""}${trend.toFixed(1)}%`;
      trendElement.className = `stat-trend ${
        trend > 0 ? "positive" : trend < 0 ? "negative" : "neutral"
      }`;
    }
  }

  // Mettre à jour les recommandations et alertes
  updateRecommendations();
}

// Fonction pour configurer la connexion WebSocket
function setupWebSocket() {
  // Handler pour les données reçues du WebSocket
  const handleSerialData = (data) => {
    try {
      // Extraire et traiter la valeur de luminosité
      const raw = data.data.toString();
      const value = parseFloat(raw);

      if (!isNaN(value)) {
        // Normaliser la valeur de 0-4095 à 0-100%
        const normalizedValue = (value / 4095) * 100;
        const roundedValue = Math.round(normalizedValue * 10) / 10;

        // Stocker la dernière valeur reçue mais ne pas mettre à jour l'affichage
        // immédiatement pour éviter le problème de trop de mises à jour
        lastLightData = {
          value: roundedValue,
          timestamp: new Date(),
        };
      }
    } catch (error) {
      console.error("Erreur lors du traitement des données série:", error);
    }
  };

  const handleSocketError = (error) => {
    console.error("Erreur WebSocket:", error);
  };

  // S'abonner aux données série du WebSocket
  socketManager.subscribeToData(handleSerialData, handleSocketError);
}

// Fonction pour configurer l'intervalle de mise à jour
function setupUpdateInterval() {
  // Mettre à jour les graphiques et les données toutes les 5 secondes
  dataUpdateInterval = setInterval(async () => {
    // Récupérer les dernières données de tous les capteurs depuis l'API
    try {
      const response = await fetch("http://localhost:3000/api/v1/latest", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      let temperature = null;
      let humidity = null;

      if (response.ok) {
        const data = await response.json();

        // Traitement des données de température
        if (data.temperature && data.temperature.val !== undefined) {
          temperature = parseFloat(data.temperature.val);
          const timestamp = new Date(data.temperature.created_at);

          // Ajouter au dataset température
          temperatureData.push({
            value: temperature,
            timestamp: timestamp,
          });

          // Limiter le nombre de points sur les graphiques
          if (temperatureData.length > 50) temperatureData.shift();
        }

        // Traitement des données d'humidité
        if (data.humidity && data.humidity.val !== undefined) {
          humidity = parseFloat(data.humidity.val);
          const timestamp = new Date(data.humidity.created_at);

          // Ajouter au dataset humidité
          humidityData.push({
            value: humidity,
            timestamp: timestamp,
          });

          // Limiter le nombre de points sur les graphiques
          if (humidityData.length > 50) humidityData.shift();
        }
      }

      // Utiliser la dernière valeur de luminosité reçue via WebSocket (si disponible)
      if (lastLightData) {
        lightData.push(lastLightData);

        // Limiter le nombre de points sur le graphique
        if (lightData.length > 50) lightData.shift();

        // Réinitialiser la dernière valeur pour éviter de l'utiliser plusieurs fois
        lastLightData = null;
      }

      // Mettre à jour les graphiques
      updateTemperatureChart();
      updateHumidityChart();
      updateLightChart();

      // Mettre à jour le DPV avec les dernières données réelles
      updateDPV();

      // Mettre à jour les tendances
      updateTrends();

      // Mettre à jour la table de données récentes
      updateRecentDataTable({
        temperature:
          temperatureData.length > 0
            ? temperatureData[temperatureData.length - 1].value
            : null,
        humidity:
          humidityData.length > 0
            ? humidityData[humidityData.length - 1].value
            : null,
        light:
          lightData.length > 0 ? lightData[lightData.length - 1].value : null,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  }, 5000);
}

// Fonction utilitaire pour formater un timestamp
function formatTime(timestamp, includeSeconds = false) {
  if (!timestamp) return "-";

  const date = new Date(timestamp);
  return includeSeconds
    ? `${date.getHours().toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`
    : `${date.getHours().toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
}

// Fonction pour afficher un message d'erreur
function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  document.querySelector(".container").prepend(errorDiv);

  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

// Initialiser la page lorsqu'elle est chargée
document.addEventListener("DOMContentLoaded", initialize);
