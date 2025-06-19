// @ts-nocheck
import Api from "./api.js";
import socketManager from "./socket.js";
import AuthUtils from "./authUtils.js";

// Variables pour stocker les données
let temperatureData = []; // Données de température pour la période sélectionnée
let humidityData = []; // Données d'humidité pour la période sélectionnée
let lightData = []; // Données de luminosité pour la période sélectionnée
let charts = {};
let recentDataTable = [];
let currentSerreId = null; // Sera récupéré depuis l'API

// Variables pour stocker les périodes sélectionnées par l'utilisateur
let currentTemperatureTimeRange = "24h";
let currentHumidityTimeRange = "24h";
let currentLightTimeRange = "24h";

// Variables pour la mise à jour en temps réel
let realtimeUpdateInterval = null;
let currentRefreshInterval = 30; // en secondes
let nextUpdateCountdown = null;
let countdownInterval = null;

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

  // Récupérer l'ID de la serre actuelle depuis l'API de manière sécurisée
  currentSerreId = await getSecureSerreId();
  if (!currentSerreId) {
    console.error("Impossible de récupérer l'ID de la serre");
    return;
  }
  // Afficher l'ID de la serre
  displaySerreId();

  // Afficher le sélecteur de serre si l'utilisateur en a plusieurs
  await displaySerreSelector();

  // Ajouter un bouton pour supprimer la serre
  addDeleteSerreButton();

  // Initialiser les graphiques
  initializeCharts();

  // Configurer les filtres de temps pour les graphiques
  setupTimeFilters(); // Charger les données initiales
  await loadInitialData();

  // Mettre à jour les valeurs du dashboard avec les dernières données
  await updateDashboardValues();
  // Configurer la mise à jour en temps réel
  setupRealtimeUpdates();

  // Configurer les paramètres de mise à jour
  setupRefreshSettings();
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
          } else if (response.status === 403) {
            alert("Vous n'avez pas l'autorisation de supprimer cette serre.");
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
      // Mettre à jour le DPV et les tendances après changement
      updateDPV();
      updateTrends();
      // Mettre à jour les valeurs du dashboard après changement
      await updateDashboardValues();
    });

  document
    .getElementById("humidityFilter")
    .addEventListener("change", async function () {
      currentHumidityTimeRange = this.value; // Sauvegarder la sélection
      await loadHumidityData(this.value);
      updateHumidityChart(this.value);
      // Mettre à jour le DPV et les tendances après changement
      updateDPV();
      updateTrends();
      // Mettre à jour les valeurs du dashboard après changement
      await updateDashboardValues();
    });
  document
    .getElementById("luminosityFilter")
    .addEventListener("change", async function () {
      currentLightTimeRange = this.value; // Sauvegarder la sélection
      await loadLightData(this.value);
      updateLightChart(this.value);
      // S'assurer que la luminosité actuelle est toujours affichée
      await updateCurrentLuminosityDisplay();
    });
}

// Fonction pour charger les données initiales
async function loadInitialData() {
  try {
    // Charger les données de température pour les dernières 24h
    await loadTemperatureData("24h");
    updateTemperatureChart("24h");

    // Charger les données d'humidité pour les dernières 24h
    await loadHumidityData("24h");
    updateHumidityChart("24h"); // Charger les données de luminosité pour les dernières 24h
    await loadLightData("24h");
    updateLightChart("24h");

    // Mettre à jour l'affichage de la luminosité actuelle (indépendamment des données 24h)
    await updateCurrentLuminosityDisplay();

    // Mettre à jour le DPV et les tendances avec les données chargées
    updateDPV();
    updateTrends();

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
    console.log("🌡️ [TEMPERATURE] Données reçues de l'API:", data.slice(0, 2)); // Afficher les 2 premiers éléments
    temperatureData = data.map((item) => ({
      value: item.val, // Utiliser 'val' au lieu de 'value'
      timestamp: new Date(item.created_at), // Utiliser 'created_at' au lieu de 'timestamp'
    }));

    // Trier les données par timestamp croissant (du plus ancien au plus récent)
    temperatureData.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );

    console.log(
      "🌡️ [TEMPERATURE] Données transformées et triées:",
      temperatureData.slice(0, 2)
    );
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
    console.log("💧 [HUMIDITY] Données reçues de l'API:", data.slice(0, 2)); // Afficher les 2 premiers éléments
    humidityData = data.map((item) => ({
      value: item.val, // Utiliser 'val' au lieu de 'value'
      timestamp: new Date(item.created_at), // Utiliser 'created_at' au lieu de 'timestamp'
    }));

    // Trier les données par timestamp croissant (du plus ancien au plus récent)
    humidityData.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    console.log(
      "💧 [HUMIDITY] Données transformées et triées:",
      humidityData.slice(0, 2)
    );
  } catch (error) {
    console.error("Erreur lors du chargement des données d'humidité:", error);
    humidityData = generateDummyData(60, 70, timeRange);
  }
}

// Fonction pour charger les données de luminosité
async function loadLightData(timeRange) {
  try {
    const data = await Api.getLightData(timeRange);
    console.log("💡 [LIGHT] Données reçues de l'API:", data.slice(0, 2)); // Afficher les 2 premiers éléments
    lightData = data.map((item) => ({
      value: item.val, // Utiliser 'val' au lieu de 'value'
      timestamp: new Date(item.created_at), // Utiliser 'created_at' au lieu de 'timestamp'
    }));

    // Trier les données par timestamp croissant (du plus ancien au plus récent)
    lightData.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    console.log(
      "💡 [LIGHT] Données transformées et triées:",
      lightData.slice(0, 2)
    );
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
  const labels = temperatureData.map((item) =>
    formatTime(item.timestamp, false, timeRange)
  );
  const values = temperatureData.map((item) => item.value);

  // Filtrer les labels pour éviter l'encombrement selon la période
  const { filteredLabels, filteredValues } = filterDataForDisplay(
    labels,
    values,
    timeRange
  );
  charts.temperature.data.labels = filteredLabels;
  charts.temperature.data.datasets[0].data = filteredValues;
  charts.temperature.update();
}

// Fonction pour mettre à jour le graphique d'humidité
function updateHumidityChart(timeRange = "24h") {
  const labels = humidityData.map((item) =>
    formatTime(item.timestamp, false, timeRange)
  );
  const values = humidityData.map((item) => item.value);

  // Filtrer les labels pour éviter l'encombrement selon la période
  const { filteredLabels, filteredValues } = filterDataForDisplay(
    labels,
    values,
    timeRange
  );
  charts.humidity.data.labels = filteredLabels;
  charts.humidity.data.datasets[0].data = filteredValues;
  charts.humidity.update();
}

// Fonction pour mettre à jour le graphique de luminosité
function updateLightChart(timeRange = "24h") {
  const labels = lightData.map((item) =>
    formatTime(item.timestamp, false, timeRange)
  );
  const values = lightData.map((item) => item.value);

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
  // Utiliser la dernière valeur disponible, peu importe la période
  updateCurrentLuminosityDisplay();
}

// Fonction pour initialiser la table de données récentes
function initRecentDataTable() {
  const tableBody = document.querySelector(".data-table tbody");
  if (tableBody) {
    tableBody.innerHTML = "";
  }

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

  // Remplir la table avec les dernières données disponibles
  updateRecentDataTable();
}

// Fonction pour mettre à jour la table de données récentes
function updateRecentDataTable() {
  // Utiliser les dernières données disponibles pour remplir la table
  const latestTemperature =
    temperatureData.length > 0
      ? temperatureData[temperatureData.length - 1]
      : null;
  const latestHumidity =
    humidityData.length > 0 ? humidityData[humidityData.length - 1] : null;
  const latestLight =
    lightData.length > 0 ? lightData[lightData.length - 1] : null;

  // Trouver le timestamp le plus récent parmi toutes les données disponibles
  let mostRecentTimestamp = null;
  const timestamps = [];

  if (latestTemperature && latestTemperature.timestamp) {
    timestamps.push(latestTemperature.timestamp);
  }
  if (latestHumidity && latestHumidity.timestamp) {
    timestamps.push(latestHumidity.timestamp);
  }
  if (latestLight && latestLight.timestamp) {
    timestamps.push(latestLight.timestamp);
  }

  // Prendre le timestamp le plus récent
  if (timestamps.length > 0) {
    mostRecentTimestamp = new Date(
      Math.max(...timestamps.map((t) => t.getTime()))
    );
  } else {
    mostRecentTimestamp = new Date(); // Fallback vers l'heure actuelle si aucune donnée
  }

  // Créer une entrée pour la table
  const newEntry = {
    timestamp: mostRecentTimestamp,
    temperature: latestTemperature ? latestTemperature.value : null,
    humidity: latestHumidity ? latestHumidity.value : null,
    light: latestLight ? latestLight.value : null,
  };

  // Ajouter la nouvelle entrée au début du tableau
  recentDataTable.unshift(newEntry);

  // Limiter le tableau à 5 entrées
  recentDataTable = recentDataTable.slice(0, 5);

  // Mettre à jour l'affichage de la table
  const tableBody = document.querySelector(".data-table tbody");
  if (tableBody) {
    tableBody.innerHTML = "";

    recentDataTable.forEach((entry) => {
      if (entry.timestamp) {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${formatTime(entry.timestamp, true)}</td>
          <td>${
            entry.temperature !== null &&
            entry.temperature !== undefined &&
            typeof entry.temperature === "number"
              ? `${entry.temperature.toFixed(1)}°C`
              : "-"
          }</td>
          <td>${
            entry.humidity !== null &&
            entry.humidity !== undefined &&
            typeof entry.humidity === "number"
              ? `${entry.humidity.toFixed(1)}%`
              : "-"
          }</td>
          <td>${
            entry.light !== null &&
            entry.light !== undefined &&
            typeof entry.light === "number"
              ? `${entry.light.toFixed(1)}%`
              : "-"
          }</td>
        `;
        tableBody.appendChild(row);
      }
    });
  }
}

// Fonction pour mettre à jour les recommandations et alertes
function updateRecommendations() {
  // Récupérer les valeurs actuelles depuis les dernières données disponibles
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

// Fonction pour récupérer l'ID de serre de manière sécurisée
async function getSecureSerreId() {
  try {
    const response = await fetch("http://localhost:3000/api/v1/greenhouse", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      const data = await response.json();

      if (data && data.serres && data.serres.length > 0) {
        // Si l'utilisateur a des serres, prendre la première (ou celle stockée en local si elle existe et est valide)
        const storedSerreId = localStorage.getItem("currentSerreId");
        // Vérifier si l'ID stocké localement correspond à une serre de l'utilisateur
        const validSerre = data.serres.find(
          (serre) => serre.identifiant_serre === storedSerreId
        );

        if (validSerre) {
          return storedSerreId;
        } else {
          // Si l'ID local n'est pas valide, prendre la première serre et la stocker
          const newSerreId = data.serres[0].identifiant_serre;
          localStorage.setItem("currentSerreId", newSerreId);
          return newSerreId;
        }
      }
    }

    return null;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération sécurisée de l'ID de serre:",
      error
    );
    return null;
  }
}

// Fonction pour permettre à l'utilisateur de changer de serre (si il en a plusieurs)
async function displaySerreSelector() {
  try {
    const response = await fetch("http://localhost:3000/api/v1/greenhouse", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      const serres = await response.json();

      if (serres && serres.length > 1) {
        // Si l'utilisateur a plusieurs serres, afficher un sélecteur
        const headerInfo = document.querySelector(".header-info");
        if (headerInfo) {
          const selectorDiv = document.createElement("div");
          selectorDiv.className = "serre-selector";
          selectorDiv.innerHTML = `
            <label for="serreSelect">Serre active:</label>
            <select id="serreSelect">
              ${serres
                .map(
                  (serre) =>
                    `<option value="${serre.identifiant_serre}" ${
                      serre.identifiant_serre === currentSerreId
                        ? "selected"
                        : ""
                    }>
                  ${serre.nom} (${serre.identifiant_serre})
                </option>`
                )
                .join("")}
            </select>
          `;
          headerInfo.appendChild(selectorDiv);

          // Ajouter un gestionnaire pour le changement de serre
          document
            .getElementById("serreSelect")
            .addEventListener("change", function () {
              const newSerreId = this.value;
              localStorage.setItem("currentSerreId", newSerreId);
              currentSerreId = newSerreId;
              // Actualiser l'affichage
              displaySerreId();
            });
        }
      }
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des serres:", error);
  }
}

// Fonction pour mettre à jour les valeurs du dashboard avec les dernières données
async function updateDashboardValues() {
  console.log("🔄 Mise à jour des valeurs du dashboard");

  try {
    // Récupérer les dernières valeurs directement depuis l'API
    // L'API retourne déjà les données triées par ID (donc la dernière est la plus récente)

    // Température
    const temperatureResponse = await Api.getTemperatureData("7j");
    if (temperatureResponse && temperatureResponse.length > 0) {
      const latestTemperature =
        temperatureResponse[temperatureResponse.length - 1];
      const temperatureValue = latestTemperature.val;
      console.log("🌡️ Dernière température:", temperatureValue, "°C");

      const temperatureValueElement =
        document.getElementById("temperatureValue");
      const isDay = new Date().getHours() >= 6 && new Date().getHours() < 20;

      if (isDay) {
        if (19 <= temperatureValue && temperatureValue <= 26) {
          temperatureValueElement.textContent = temperatureValue + "°C";
          temperatureValueElement.style.color = "green";
        } else if (temperatureValue < 19) {
          temperatureValueElement.textContent =
            temperatureValue + "°C (Trop froid)";
          temperatureValueElement.style.color = "blue";
        } else {
          temperatureValueElement.textContent =
            temperatureValue + "°C (Trop chaud)";
          temperatureValueElement.style.color = "red";
        }
      } else {
        if (15 <= temperatureValue && temperatureValue <= 20) {
          temperatureValueElement.textContent = temperatureValue + "°C";
          temperatureValueElement.style.color = "green";
        } else if (temperatureValue < 15) {
          temperatureValueElement.textContent =
            temperatureValue + "°C (Trop froid)";
          temperatureValueElement.style.color = "blue";
        } else {
          temperatureValueElement.textContent =
            temperatureValue + "°C (Trop chaud)";
          temperatureValueElement.style.color = "red";
        }
      }
    }

    // Humidité
    const humidityResponse = await Api.getHumidityData("7j");
    if (humidityResponse && humidityResponse.length > 0) {
      const latestHumidity = humidityResponse[humidityResponse.length - 1];
      const humidityValue = latestHumidity.val;
      console.log("💧 Dernière humidité:", humidityValue, "%");

      const humidityValueElement = document.getElementById("humidityValue");

      if (50 <= humidityValue && humidityValue <= 85) {
        humidityValueElement.textContent = humidityValue + "%";
        humidityValueElement.style.color = "green";
      } else if (humidityValue < 50) {
        humidityValueElement.textContent = humidityValue + "% (Trop sec)";
        humidityValueElement.style.color = "orange";
      } else {
        humidityValueElement.textContent = humidityValue + "% (Trop humide)";
        humidityValueElement.style.color = "lightblue";
      }
    }
  } catch (error) {
    console.error(
      "❌ Erreur lors de la mise à jour des valeurs du dashboard:",
      error
    );
  }
}

// Fonction pour mettre à jour l'affichage de la luminosité actuelle
async function updateCurrentLuminosityDisplay() {
  try {
    // Récupérer la dernière valeur de luminosité depuis l'API (sur 7j pour avoir une valeur récente)
    const lightResponse = await Api.getLightData("7j");
    if (lightResponse && lightResponse.length > 0) {
      // Trier par timestamp pour s'assurer d'avoir la plus récente
      const sortedLightData = lightResponse
        .map((item) => ({
          value: item.val,
          timestamp: new Date(item.created_at),
        }))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Du plus récent au plus ancien

      const currentLuminosity = sortedLightData[0].value; // La plus récente
      const luminosityValueElement = document.getElementById("luminosityValue");

      if (luminosityValueElement) {
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
    } else {
      // Si aucune donnée disponible, afficher un message par défaut
      const luminosityValueElement = document.getElementById("luminosityValue");
      if (luminosityValueElement) {
        luminosityValueElement.textContent = "- %";
        luminosityValueElement.style.color = "gray";
      }
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la luminosité actuelle:",
      error
    );
    // En cas d'erreur, utiliser les données locales si disponibles
    if (lightData.length > 0) {
      const currentLuminosity = lightData[lightData.length - 1].value;
      const luminosityValueElement = document.getElementById("luminosityValue");
      if (luminosityValueElement) {
        luminosityValueElement.textContent = `${currentLuminosity}%`;
        luminosityValueElement.style.color = "gray";
      }
    }
  }
}

// Fonction pour configurer les mises à jour en temps réel
function setupRealtimeUpdates() {
  // Arrêter l'intervalle existant s'il y en a un
  if (realtimeUpdateInterval) {
    clearInterval(realtimeUpdateInterval);
  }

  // Charger l'intervalle depuis le localStorage ou utiliser la valeur par défaut
  const savedInterval = localStorage.getItem("refreshInterval");
  if (savedInterval) {
    currentRefreshInterval = parseInt(savedInterval);
  }

  // Mettre à jour le sélecteur avec la valeur actuelle
  const intervalSelect = document.getElementById("refresh-interval");
  if (intervalSelect) {
    intervalSelect.value = currentRefreshInterval;
  }

  // Démarrer les mises à jour
  startRealtimeUpdates();
}

// Fonction pour démarrer les mises à jour en temps réel
function startRealtimeUpdates() {
  // Arrêter le compte à rebours s'il est en cours
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }

  // Démarrer le nouvel intervalle de mise à jour
  realtimeUpdateInterval = setInterval(async () => {
    try {
      console.log("🔄 Mise à jour en temps réel des données...");

      // Recharger les données pour la période actuellement sélectionnée et mettre à jour les graphiques
      if (currentTemperatureTimeRange === "24h") {
        await loadTemperatureData("24h");
        updateTemperatureChart("24h");
      }

      if (currentHumidityTimeRange === "24h") {
        await loadHumidityData("24h");
        updateHumidityChart("24h");
      }

      if (currentLightTimeRange === "24h") {
        await loadLightData("24h");
        updateLightChart("24h");
      }

      // Toujours mettre à jour l'affichage de la luminosité actuelle
      await updateCurrentLuminosityDisplay();

      // Mettre à jour les valeurs du dashboard
      await updateDashboardValues();

      // Mettre à jour le DPV et les tendances
      updateDPV();
      updateTrends(); // Mettre à jour la table de données récentes
      updateRecentDataTable();

      // Redémarrer le compte à rebours
      startCountdown();

      console.log("✅ Mise à jour en temps réel terminée");
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour en temps réel:", error);
    }
  }, currentRefreshInterval * 1000); // Utiliser l'intervalle configurable

  console.log(
    `🚀 Mise à jour en temps réel activée (toutes les ${currentRefreshInterval} secondes)`
  );

  // Démarrer le compte à rebours
  startCountdown();
}

// Fonction pour arrêter les mises à jour en temps réel
function stopRealtimeUpdates() {
  if (realtimeUpdateInterval) {
    clearInterval(realtimeUpdateInterval);
    realtimeUpdateInterval = null;
    console.log("⏹️ Mise à jour en temps réel désactivée");
  }

  // Arrêter aussi le compte à rebours
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

// Nettoyer les intervalles quand la page se ferme
window.addEventListener("beforeunload", () => {
  stopRealtimeUpdates();
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});

// Initialiser la page lorsqu'elle est chargée
document.addEventListener("DOMContentLoaded", initialize);

// Fonction pour configurer les paramètres de mise à jour
function setupRefreshSettings() {
  const intervalSelect = document.getElementById("refresh-interval");
  const applyButton = document.getElementById("apply-interval");
  const autoRefreshToggle = document.getElementById("auto-refresh");

  // Charger les paramètres sauvegardés
  const savedInterval = localStorage.getItem("refreshInterval");
  const savedAutoRefresh = localStorage.getItem("autoRefresh");

  if (savedInterval) {
    currentRefreshInterval = parseInt(savedInterval);
    if (intervalSelect) {
      intervalSelect.value = currentRefreshInterval;
    }
  }

  if (savedAutoRefresh !== null) {
    const autoRefreshEnabled = savedAutoRefresh === "true";
    if (autoRefreshToggle) {
      autoRefreshToggle.checked = autoRefreshEnabled;
    }
    if (!autoRefreshEnabled) {
      stopRealtimeUpdates();
    }
  }

  // Gestionnaire pour le bouton Appliquer
  if (applyButton) {
    applyButton.addEventListener("click", () => {
      const newInterval = parseInt(intervalSelect.value);
      if (newInterval !== currentRefreshInterval) {
        currentRefreshInterval = newInterval;
        localStorage.setItem(
          "refreshInterval",
          currentRefreshInterval.toString()
        );

        // Redémarrer les mises à jour avec le nouvel intervalle
        if (autoRefreshToggle && autoRefreshToggle.checked) {
          startRealtimeUpdates();
        }

        console.log(
          `🔄 Intervalle de mise à jour changé: ${currentRefreshInterval} secondes`
        );

        // Notification visuelle
        applyButton.innerHTML = '<i class="fas fa-check"></i> Appliqué!';
        applyButton.style.backgroundColor = "#4CAF50";
        setTimeout(() => {
          applyButton.innerHTML = '<i class="fas fa-check"></i> Appliquer';
          applyButton.style.backgroundColor = "";
        }, 2000);
      }
    });
  }

  // Gestionnaire pour le toggle auto-refresh
  if (autoRefreshToggle) {
    autoRefreshToggle.addEventListener("change", (e) => {
      const isEnabled = e.target.checked;
      localStorage.setItem("autoRefresh", isEnabled.toString());

      if (isEnabled) {
        startRealtimeUpdates();
        console.log("🔄 Mise à jour automatique activée");
      } else {
        stopRealtimeUpdates();
        // Effacer le compte à rebours
        const countdownElement = document.getElementById(
          "next-update-countdown"
        );
        if (countdownElement) {
          countdownElement.textContent = "Désactivé";
        }
        console.log("⏹️ Mise à jour automatique désactivée");
      }
    });
  }
}

// Fonction pour démarrer le compte à rebours
function startCountdown() {
  // Arrêter le compte à rebours existant
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  let timeLeft = currentRefreshInterval;
  const countdownElement = document.getElementById("next-update-countdown");

  if (!countdownElement) return;

  const updateCountdown = () => {
    if (timeLeft <= 0) {
      countdownElement.textContent = "Mise à jour...";
      timeLeft = currentRefreshInterval; // Redémarrer le compte
    } else {
      countdownElement.textContent = `${timeLeft}s`;
      timeLeft--;
    }
  };

  // Première mise à jour immédiate
  updateCountdown();

  // Mettre à jour chaque seconde
  countdownInterval = setInterval(updateCountdown, 1000);
}
