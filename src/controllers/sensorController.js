import sensorService from "../services/sensorService.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

export const getAllLightValues = asyncWrapper(async (req, res) => {
  const { startTime, endTime } = req.query;

  // Si des paramètres de temps sont fournis, les utiliser pour filtrer
  if (startTime && endTime) {
    console.log(
      `Requête getAllLightValues avec filtres: startTime=${startTime}, endTime=${endTime}`
    );

    // S'assurer que les timestamps sont des nombres
    let startTimestamp, endTimestamp;
    try {
      startTimestamp = Number(startTime);
      endTimestamp = Number(endTime);

      if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
        return res
          .status(400)
          .json({ error: "Les timestamps doivent être des nombres" });
      }

      console.log(
        `Timestamps convertis: start=${startTimestamp}, end=${endTimestamp}`
      );

      const data = await sensorService.getLightValuesBetween(
        startTimestamp,
        endTimestamp
      );
      console.log(`Données retournées: ${data.length} enregistrements`);
      return res.json(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des valeurs de luminosité:",
        error
      );
      return res
        .status(500)
        .json({ error: `Erreur serveur: ${error.message}` });
    }
  }

  // Sinon, retourner toutes les valeurs
  const data = await sensorService.getAllLightValues();
  res.json(data);
});

export const getLightValuesBetween = asyncWrapper(async (req, res) => {
  const { start, end } = req.query;
  if (!start || !end) {
    return res
      .status(400)
      .json({ error: "Les paramètres start et end sont requis" });
  }

  console.log(
    `Requête getLightValuesBetween reçue avec start=${start}, end=${end}`
  );

  // S'assurer que les timestamps sont des nombres
  let startTimestamp, endTimestamp;
  try {
    startTimestamp = Number(start);
    endTimestamp = Number(end);

    if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
      return res
        .status(400)
        .json({ error: "Les timestamps doivent être des nombres" });
    }

    console.log(
      `Timestamps convertis: start=${startTimestamp}, end=${endTimestamp}`
    );

    const data = await sensorService.getLightValuesBetween(
      startTimestamp,
      endTimestamp
    );
    console.log(`Données retournées: ${data.length} enregistrements`);
    return res.json(data);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des valeurs de luminosité:",
      error
    );
    return res.status(500).json({ error: `Erreur serveur: ${error.message}` });
  }
});

export const createLight = asyncWrapper(async (req, res) => {
  const { value } = req.body;
  if (value === undefined) {
    return res.status(400).json({ error: "La valeur est requise" });
  }

  const data = await sensorService.createLight(Number(value));
  res.status(201).json(data);
});

export const getAllTemperatureValues = asyncWrapper(async (req, res) => {
  const { startTime, endTime } = req.query;

  // Si des paramètres de temps sont fournis, les utiliser pour filtrer
  if (startTime && endTime) {
    console.log(
      `Requête getAllTemperatureValues avec filtres: startTime=${startTime}, endTime=${endTime}`
    );

    // S'assurer que les timestamps sont des nombres
    let startTimestamp, endTimestamp;
    try {
      startTimestamp = Number(startTime);
      endTimestamp = Number(endTime);

      if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
        return res
          .status(400)
          .json({ error: "Les timestamps doivent être des nombres" });
      }
      console.log(
        `Timestamps convertis: start=${startTimestamp}, end=${endTimestamp}`
      );

      let data = await sensorService.getTemperatureValuesBetween(
        startTimestamp,
        endTimestamp
      );

      // Si aucune donnée trouvée, essayer de récupérer les dernières données disponibles
      if (!data || (Array.isArray(data) && data.length === 0)) {
        console.log(
          "🟨 [TEMPERATURE] Aucune donnée dans la période, récupération des dernières données"
        );
        data = await sensorService.getAllTemperatureValues();
        // Limiter aux 50 derniers points pour éviter de surcharger l'interface
        if (data && Array.isArray(data) && data.length > 50) {
          data = data.slice(0, 50);
        }
      }

      console.log(
        `🟢 [TEMPERATURE] Données retournées: ${
          Array.isArray(data) ? data.length : 0
        } enregistrements`
      );
      return res.json(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des valeurs de température:",
        error
      );
      return res
        .status(500)
        .json({ error: `Erreur serveur: ${error.message}` });
    }
  }

  // Sinon, retourner toutes les valeurs
  const data = await sensorService.getAllTemperatureValues();
  res.json(data);
});

export const getTemperatureValuesBetween = asyncWrapper(async (req, res) => {
  const { start, end } = req.query;
  if (!start || !end) {
    return res
      .status(400)
      .json({ error: "Les paramètres start et end sont requis" });
  }

  console.log(
    `Requête getTemperatureValuesBetween reçue avec start=${start}, end=${end}`
  );

  // S'assurer que les timestamps sont des nombres
  let startTimestamp, endTimestamp;
  try {
    startTimestamp = Number(start);
    endTimestamp = Number(end);

    if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
      return res
        .status(400)
        .json({ error: "Les timestamps doivent être des nombres" });
    }

    console.log(
      `Timestamps convertis: start=${startTimestamp}, end=${endTimestamp}`
    );

    const data = await sensorService.getTemperatureValuesBetween(
      startTimestamp,
      endTimestamp
    );
    console.log(`Données retournées: ${data.length} enregistrements`);
    return res.json(data);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des valeurs de température:",
      error
    );
    return res.status(500).json({ error: `Erreur serveur: ${error.message}` });
  }
});

export const getAllHumidityValues = asyncWrapper(async (req, res) => {
  console.log("🟦 [HUMIDITY] Requête reçue");
  console.log("🟦 [HUMIDITY] Query params:", req.query);

  const { startTime, endTime } = req.query;

  // Si des paramètres de temps sont fournis, les utiliser pour filtrer
  if (startTime && endTime) {
    console.log(
      `🟦 [HUMIDITY] Requête avec filtres: startTime=${startTime}, endTime=${endTime}`
    );

    // S'assurer que les timestamps sont des nombres
    let startTimestamp, endTimestamp;
    try {
      startTimestamp = Number(startTime);
      endTimestamp = Number(endTime);

      if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
        console.log("🔴 [HUMIDITY] Timestamps invalides");
        return res
          .status(400)
          .json({ error: "Les timestamps doivent être des nombres" });
      }
      console.log(
        `🟦 [HUMIDITY] Timestamps convertis: start=${startTimestamp}, end=${endTimestamp}`
      );
      let data = await sensorService.getHumidityValuesBetween(
        startTimestamp,
        endTimestamp
      );

      console.log("🟨 [HUMIDITY] Data après getHumidityValuesBetween:", data);
      console.log("🟨 [HUMIDITY] Type de data:", typeof data);
      console.log("🟨 [HUMIDITY] Array.isArray(data):", Array.isArray(data));
      console.log("🟨 [HUMIDITY] data.length:", data?.length);

      // Si aucune donnée trouvée, essayer de récupérer les dernières données disponibles
      if (!data || (Array.isArray(data) && data.length === 0)) {
        console.log(
          "🟨 [HUMIDITY] Aucune donnée dans la période, récupération des dernières données"
        );
        data = await sensorService.getAllHumidityValues();
        console.log(
          "🟨 [HUMIDITY] Data après getAllHumidityValues:",
          data?.length || 0,
          "éléments"
        );
        // Limiter aux 50 derniers points pour éviter de surcharger l'interface
        if (data && Array.isArray(data) && data.length > 50) {
          data = data.slice(0, 50);
        }
      }

      console.log(
        `🟢 [HUMIDITY] Données retournées:`,
        data?.length || 0,
        "enregistrements"
      );
      console.log(`🟢 [HUMIDITY] Premier élément:`, data?.[0]);
      return res.json(data);
    } catch (error) {
      console.error(
        "🔴 [HUMIDITY] Erreur lors de la récupération des valeurs d'humidité:",
        error
      );
      return res
        .status(500)
        .json({ error: `Erreur serveur: ${error.message}` });
    }
  }

  // Sinon, retourner toutes les valeurs
  console.log("🟦 [HUMIDITY] Récupération de toutes les valeurs");
  try {
    const data = await sensorService.getAllHumidityValues();
    console.log(
      `🟢 [HUMIDITY] Toutes les données retournées:`,
      data.length,
      "enregistrements"
    );
    console.log(`🟢 [HUMIDITY] Premier élément:`, data[0]);
    res.json(data);
  } catch (error) {
    console.error(
      "🔴 [HUMIDITY] Erreur lors de la récupération de toutes les valeurs:",
      error
    );
    res.status(500).json({ error: `Erreur serveur: ${error.message}` });
  }
});

export const getHumidityValuesBetween = asyncWrapper(async (req, res) => {
  const { start, end } = req.query;
  if (!start || !end) {
    return res
      .status(400)
      .json({ error: "Les paramètres start et end sont requis" });
  }

  console.log(
    `Requête getHumidityValuesBetween reçue avec start=${start}, end=${end}`
  );

  // S'assurer que les timestamps sont des nombres
  let startTimestamp, endTimestamp;
  try {
    startTimestamp = Number(start);
    endTimestamp = Number(end);

    if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
      return res
        .status(400)
        .json({ error: "Les timestamps doivent être des nombres" });
    }

    console.log(
      `Timestamps convertis: start=${startTimestamp}, end=${endTimestamp}`
    );

    const data = await sensorService.getHumidityValuesBetween(
      startTimestamp,
      endTimestamp
    );
    console.log(`Données retournées: ${data.length} enregistrements`);
    return res.json(data);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des valeurs d'humidité:",
      error
    );
    return res.status(500).json({ error: `Erreur serveur: ${error.message}` });
  }
});

export const getLatestSensorData = asyncWrapper(async (req, res) => {
  const data = await sensorService.getLatestSensorData();
  res.json(data);
});
