// @ts-nocheck
import Api from "./api.js";
import socketManager from "./socket.js";
import AuthUtils from "./authUtils.js";

// Variables pour stocker les données
let temperatureData = []; // Données historiques (depuis l'API)
let humidityData = []; // Données historiques (depuis l'API)
let lightData = []; // Données historiques (depuis l'API)
let realtimeTemperatureData = []; // Données en temps réel (WebSocket/API latest)
let realtimeHumidityData = []; // Données en temps réel (WebSocket/API latest)
let realtimeLightData = []; // Données en temps réel (WebSocket/API latest)
let lastUpdateTime = new Date();
let charts = {};
let dataUpdateInterval = null;
let recentDataTable = [];
let currentSerreId = localStorage.getItem("currentSerreId");
let lastLightData = null; // Pour stocker la dernière valeur de luminosité reçue

// Variables pour stocker les périodes sélectionnées par l'utilisateur
let currentTemperatureTimeRange = "24h";
let currentHumidityTimeRange = "24h";
let currentLightTimeRange = "24h";

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
      currentTemperatureTimeRange = this.value; // Sauvegarder la sélection
      await loadTemperatureData(this.value);
      updateTemperatureChart(this.value);
    });

  document
    .getElementById("humidityFilter")
    .addEventListener("change", async function () {
      currentHumidityTimeRange = this.value; // Sauvegarder la sélection
      await loadHumidityData(this.value);
      updateHumidityChart(this.value);
    });

  document
    .getElementById("luminosityFilter")
    .addEventListener("change", async function () {
      currentLightTimeRange = this.value; // Sauvegarder la sélection
      await loadLightData(this.value);
      updateLightChart(this.value);
    });
}

// Fonction pour charger les données initiales
async function loadInitialData() {
  try {
    // Charger les données de température pour les dernières 24h
    await loadTemperatureData("24h");
    // Copier les données vers le dataset temps réel pour l'affichage initial
    realtimeTemperatureData = [...temperatureData];
    updateTemperatureChart("24h");

    // Charger les données d'humidité pour les dernières 24h
    await loadHumidityData("24h");
    // Copier les données vers le dataset temps réel pour l'affichage initial
    realtimeHumidityData = [...humidityData];
    updateHumidityChart("24h");

    // Charger les données de luminosité pour les dernières 24h
    await loadLightData("24h");
    // Copier les données vers le dataset temps réel pour l'affichage initial
    realtimeLightData = [...lightData];
    updateLightChart("24h");

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
    temperatureData = generateDummyData(20, 25, timeRange);
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
    humidityData = generateDummyData(60, 70, timeRange);
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
    lightData = generateDummyData(40, 60, timeRange);
  }
}

// Fonction pour générer des données factices pour les tests
function generateDummyData(min, max, timeRange = "24h") {
  const data = [];
  const now = new Date();

  // Déterminer le nombre de points et l'intervalle selon la période
  let pointCount;
  let intervalMs; // Intervalle en millisecondes

  switch (timeRange) {
    case "24h":
      pointCount = 24; // Un point par heure
      intervalMs = 60 * 60 * 1000; // 1 heure
      break;
    case "7j":
      pointCount = 7 * 4; // 4 points par jour sur 7 jours
      intervalMs = 6 * 60 * 60 * 1000; // 6 heures
      break;
    case "30j":
      pointCount = 30; // Un point par jour
      intervalMs = 24 * 60 * 60 * 1000; // 24 heures
      break;
    default:
      pointCount = 20;
      intervalMs = 60 * 60 * 1000; // 1 heure par défaut
  }

  for (let i = 0; i < pointCount; i++) {
    const timestamp = new Date(now.getTime() - (pointCount - i) * intervalMs);
    const value = min + Math.random() * (max - min);
    data.push({
      value: parseFloat(value.toFixed(1)),
      timestamp: timestamp,
    });
  }

  return data;
}

// Fonction pour mettre à jour le graphique de température
function updateTemperatureChart(timeRange = "24h") {
  // Utiliser les données en temps réel pour 24h, sinon les données historiques
  const dataToUse =
    timeRange === "24h" ? realtimeTemperatureData : temperatureData;
  const labels = dataToUse.map((item) =>
    formatTime(item.timestamp, false, timeRange)
  );
  const values = dataToUse.map((item) => item.value);

  // Filtrer les labels pour éviter l'encombrement selon la période
  const { filteredLabels, filteredValues } = filterDataForDisplay(
    labels,
    values,
    timeRange
  );

  charts.temperature.data.labels = filteredLabels;
  charts.temperature.data.datasets[0].data = filteredValues;
  charts.temperature.update();

  // Mettre à jour l'affichage de la température actuelle
  if (values.length > 0) {
    const currentTemperature = values[values.length - 1];
    const temperatureValueElement = document.getElementById("temperatureValue");
    temperatureValueElement.textContent = `${currentTemperature}°C`;
    const isDay = new Date().getHours() >= 6 && new Date().getHours() < 20;
    if (isDay) {
      if (19 <= currentTemperature && currentTemperature <= 26) {
        temperatureValueElement.textContent = currentTemperature + "°C";
        temperatureValueElement.style.color = "green";
      } else if (currentTemperature < 19) {
        temperatureValueElement.textContent =
          currentTemperature + "°C (Trop froid)";
        temperatureValueElement.style.color = "blue";
      } else {
        temperatureValueElement.textContent =
          currentTemperature + "°C (Trop chaud)";
        temperatureValueElement.style.color = "red";
      }
    } else {
      if (15 <= temperature && temperature <= 20) {
        temperatureValueElement.textContent = temperature + "°C";
        temperatureValueElement.style.color = "green";
      } else if (temperature < 15) {
        temperatureValueElement.textContent = temperature + "°C (Trop froid)";
        temperatureValueElement.style.color = "blue";
      } else {
        temperatureValueElement.textContent = temperature + "°C (Trop chaud)";
        temperatureValueElement.style.color = "red";
      }
    }
  }
}

// Fonction pour mettre à jour le graphique d'humidité
function updateHumidityChart(timeRange = "24h") {
  // Utiliser les données en temps réel pour 24h, sinon les données historiques
  const dataToUse = timeRange === "24h" ? realtimeHumidityData : humidityData;
  const labels = dataToUse.map((item) =>
    formatTime(item.timestamp, false, timeRange)
  );
  const values = dataToUse.map((item) => item.value);

  // Filtrer les labels pour éviter l'encombrement selon la période
  const { filteredLabels, filteredValues } = filterDataForDisplay(
    labels,
    values,
    timeRange
  );

  charts.humidity.data.labels = filteredLabels;
  charts.humidity.data.datasets[0].data = filteredValues;
  charts.humidity.update();

  // Mettre à jour l'affichage de l'humidité actuelle
  if (values.length > 0) {
    const currentHumidity = values[values.length - 1];
    document.getElementById(
      "humidityValue"
    ).textContent = `${currentHumidity}%`;
    if (50 <= currentHumidity && currentHumidity <= 85) {
      humidityValueElement.textContent = currentHumidity + "%";
      humidityValueElement.style.color = "green";
    } else if (currentHumidity < 50) {
      humidityValueElement.textContent = currentHumidity + "% (Trop sec)";
      humidityValueElement.style.color = "orange";
    } else {
      humidityValueElement.textContent = currentHumidity + "% (Trop humide)";
      humidityValueElement.style.color = "lightblue";
    }
  }
}

// Fonction pour mettre à jour le graphique de luminosité
function updateLightChart(timeRange = "24h") {
  // Utiliser les données en temps réel pour 24h, sinon les données historiques
  const dataToUse = timeRange === "24h" ? realtimeLightData : lightData;
  const labels = dataToUse.map((item) =>
    formatTime(item.timestamp, false, timeRange)
  );
  const values = dataToUse.map((item) => item.value);

  // Filtrer les labels pour éviter l'encombrement selon la période
  const { filteredLabels, filteredValues } = filterDataForDisplay(
    labels,
    values,
    timeRange
  );

  charts.light.data.labels = filteredLabels;
  charts.light.data.datasets[0].data = filteredValues;
  charts.light.update();

  // Mettre à jour l'affichage de la luminosité actuelle
  if (values.length > 0) {
    const currentLuminosity = values[values.length - 1];
    const luminosityValueElement = document.getElementById("luminosityValue");
    luminosityValueElement.textContent = `${currentLuminosity}%`;
    const isDay = new Date().getHours() >= 6 && new Date().getHours() < 20;
    if (isDay) {
      if (50 <= currentLuminosity && currentLuminosity <= 100) {
        luminosityValueElement.textContent = currentLuminosity + " %";
        luminosityValueElement.style.color = "green";
      } else if (currentLuminosity < 50) {
        luminosityValueElement.textContent = currentLuminosity + " %";
        luminosityValueElement.style.color = "orange";
      }
    } else {
      luminosityValueElement.textContent = currentLuminosity + " % (Nuit)";
      luminosityValueElement.style.color = "gray";
    }
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
  // Récupérer les valeurs actuelles depuis les données en temps réel
  const currentTemperature =
    realtimeTemperatureData.length > 0
      ? realtimeTemperatureData[realtimeTemperatureData.length - 1].value
      : null;
  const currentHumidity =
    realtimeHumidityData.length > 0
      ? realtimeHumidityData[realtimeHumidityData.length - 1].value
      : null;
  const currentLight =
    realtimeLightData.length > 0
      ? realtimeLightData[realtimeLightData.length - 1].value
      : null;

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
  // S'assurer que nous avons des données de température et d'humidité en temps réel
  if (realtimeTemperatureData.length > 0 && realtimeHumidityData.length > 0) {
    const currentTemperature =
      realtimeTemperatureData[realtimeTemperatureData.length - 1].value;
    const currentHumidity =
      realtimeHumidityData[realtimeHumidityData.length - 1].value;

    const dpv = calculateDPV(currentTemperature, currentHumidity);
    const dpvValueElement = document.getElementById("dpv-value");
    dpvValueElement.textContent = `${dpv.toFixed(2)} kPa`;

    if (dpv >= 0.8 && dpv <= 1.2) {
      dpvValueElement.style.color = "green";
    } else if (dpv < 0.8) {
      dpvValueElement.style.color = "blue";
    } else {
      dpvValueElement.style.color = "red";
    }

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

  // Mettre à jour les tendances si nous avons suffisamment de données en temps réel
  if (realtimeTemperatureData.length >= 2) {
    const trend =
      realtimeTemperatureData[realtimeTemperatureData.length - 1].value -
      realtimeTemperatureData[realtimeTemperatureData.length - 2].value;
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

  if (realtimeHumidityData.length >= 2) {
    const trend =
      realtimeHumidityData[realtimeHumidityData.length - 1].value -
      realtimeHumidityData[realtimeHumidityData.length - 2].value;
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

  if (realtimeLightData.length >= 2) {
    const trend =
      realtimeLightData[realtimeLightData.length - 1].value -
      realtimeLightData[realtimeLightData.length - 2].value;
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

          // Ajouter au dataset température EN TEMPS RÉEL
          realtimeTemperatureData.push({
            value: temperature,
            timestamp: timestamp,
          });

          // Limiter le nombre de points sur les graphiques en temps réel
          if (realtimeTemperatureData.length > 50)
            realtimeTemperatureData.shift();
        }

        // Traitement des données d'humidité
        if (data.humidity && data.humidity.val !== undefined) {
          humidity = parseFloat(data.humidity.val);
          const timestamp = new Date(data.humidity.created_at);

          // Ajouter au dataset humidité EN TEMPS RÉEL
          realtimeHumidityData.push({
            value: humidity,
            timestamp: timestamp,
          });

          // Limiter le nombre de points sur les graphiques en temps réel
          if (realtimeHumidityData.length > 50) realtimeHumidityData.shift();
        }
      }

      // Utiliser la dernière valeur de luminosité reçue via WebSocket (si disponible)
      if (lastLightData) {
        realtimeLightData.push(lastLightData);

        // Limiter le nombre de points sur le graphique en temps réel
        if (realtimeLightData.length > 50) realtimeLightData.shift();

        // Réinitialiser la dernière valeur pour éviter de l'utiliser plusieurs fois
        lastLightData = null;
      }

      // Mettre à jour les graphiques avec les périodes sélectionnées par l'utilisateur
      updateTemperatureChart(currentTemperatureTimeRange);
      updateHumidityChart(currentHumidityTimeRange);
      updateLightChart(currentLightTimeRange);

      // Mettre à jour le DPV avec les dernières données réelles
      updateDPV();

      // Mettre à jour les tendances
      updateTrends();

      // Mettre à jour la table de données récentes
      updateRecentDataTable({
        temperature:
          realtimeTemperatureData.length > 0
            ? realtimeTemperatureData[realtimeTemperatureData.length - 1].value
            : null,
        humidity:
          realtimeHumidityData.length > 0
            ? realtimeHumidityData[realtimeHumidityData.length - 1].value
            : null,
        light:
          realtimeLightData.length > 0
            ? realtimeLightData[realtimeLightData.length - 1].value
            : null,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  }, 5000);
}

// Fonction utilitaire pour formater un timestamp
function formatTime(timestamp, includeSeconds = false, timeRange = "24h") {
  if (!timestamp) return "-";

  const date = new Date(timestamp);

  // Pour les périodes courtes (24h), afficher seulement l'heure
  if (timeRange === "24h") {
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

  // Pour les périodes moyennes (7j), afficher jour/mois et heure
  if (timeRange === "7j") {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month} ${hours}:${minutes}`;
  }

  // Pour les périodes longues (30j), afficher seulement la date
  if (timeRange === "30j") {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);

    return `${day}/${month}/${year}`;
  }

  // Fallback pour autres cas
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

// Fonction pour filtrer les données selon la période pour éviter l'encombrement
function filterDataForDisplay(labels, values, timeRange) {
  if (!labels || !values || labels.length === 0) {
    return { filteredLabels: [], filteredValues: [] };
  }

  // Pour les périodes courtes (24h), afficher tous les points
  if (timeRange === "24h") {
    return { filteredLabels: labels, filteredValues: values };
  }

  // Pour les périodes moyennes (7j), afficher des points bien espacés
  if (timeRange === "7j") {
    const targetPoints = Math.min(14, labels.length); // Maximum 14 points pour 7 jours
    const step = Math.max(1, Math.floor(labels.length / targetPoints));
    const filteredLabels = [];
    const filteredValues = [];

    for (let i = 0; i < labels.length; i += step) {
      filteredLabels.push(labels[i]);
      filteredValues.push(values[i]);
    }

    // Toujours inclure le dernier point
    if (labels.length > 1 && (labels.length - 1) % step !== 0) {
      filteredLabels.push(labels[labels.length - 1]);
      filteredValues.push(values[values.length - 1]);
    }

    return { filteredLabels, filteredValues };
  }

  // Pour les périodes longues (30j), afficher un point tous les 2-3 jours
  if (timeRange === "30j") {
    const targetPoints = Math.min(12, labels.length); // Maximum 12 points pour 30 jours
    const step = Math.max(1, Math.floor(labels.length / targetPoints));
    const filteredLabels = [];
    const filteredValues = [];

    for (let i = 0; i < labels.length; i += step) {
      filteredLabels.push(labels[i]);
      filteredValues.push(values[i]);
    }

    // Toujours inclure le dernier point
    if (labels.length > 1 && (labels.length - 1) % step !== 0) {
      filteredLabels.push(labels[labels.length - 1]);
      filteredValues.push(values[values.length - 1]);
    }

    return { filteredLabels, filteredValues };
  }

  // Fallback : retourner toutes les données
  return { filteredLabels: labels, filteredValues: values };
}

// Initialiser la page lorsqu'elle est chargée
document.addEventListener("DOMContentLoaded", initialize);
