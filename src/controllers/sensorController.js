import sensorService from "../services/sensorService.js"
import { asyncWrapper } from "../utils/asyncWrapper.js"

export const getAllLightValues = asyncWrapper(async (req, res) => {
	const data = await sensorService.getAllLightValues()
	res.json(data)
})

export const getLightValuesBetween = asyncWrapper(async (req, res) => {
	const { start, end } = req.query
	if (!start || !end) {
		return res
			.status(400)
			.json({ error: "Les paramètres start et end sont requis" })
	}

	console.log(
		`Requête getLightValuesBetween reçue avec start=${start}, end=${end}`
	)

	// S'assurer que les timestamps sont des nombres
	let startTimestamp, endTimestamp
	try {
		startTimestamp = Number(start)
		endTimestamp = Number(end)

		if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
			return res
				.status(400)
				.json({ error: "Les timestamps doivent être des nombres" })
		}

		console.log(
			`Timestamps convertis: start=${startTimestamp}, end=${endTimestamp}`
		)

		const data = await sensorService.getLightValuesBetween(
			startTimestamp,
			endTimestamp
		)
		console.log(`Données retournées: ${data.length} enregistrements`)
		return res.json(data)
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des valeurs de luminosité:",
			error
		)
		return res.status(500).json({ error: `Erreur serveur: ${error.message}` })
	}
})

export const createLight = asyncWrapper(async (req, res) => {
	const { value } = req.body
	if (value === undefined) {
		return res.status(400).json({ error: "La valeur est requise" })
	}

	const data = await sensorService.createLight(Number(value))
	res.status(201).json(data)
})

export const getAllTemperatureValues = asyncWrapper(async (req, res) => {
	const data = await sensorService.getAllTemperatureValues()
	res.json(data)
})

export const getTemperatureValuesBetween = asyncWrapper(async (req, res) => {
	const { start, end } = req.query
	if (!start || !end) {
		return res
			.status(400)
			.json({ error: "Les paramètres start et end sont requis" })
	}

	console.log(
		`Requête getTemperatureValuesBetween reçue avec start=${start}, end=${end}`
	)

	// S'assurer que les timestamps sont des nombres
	let startTimestamp, endTimestamp
	try {
		startTimestamp = Number(start)
		endTimestamp = Number(end)

		if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
			return res
				.status(400)
				.json({ error: "Les timestamps doivent être des nombres" })
		}

		console.log(
			`Timestamps convertis: start=${startTimestamp}, end=${endTimestamp}`
		)

		const data = await sensorService.getTemperatureValuesBetween(
			startTimestamp,
			endTimestamp
		)
		console.log(`Données retournées: ${data.length} enregistrements`)
		return res.json(data)
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des valeurs de température:",
			error
		)
		return res.status(500).json({ error: `Erreur serveur: ${error.message}` })
	}
})

export const getAllHumidityValues = asyncWrapper(async (req, res) => {
	const data = await sensorService.getAllHumidityValues()
	res.json(data)
})

export const getHumidityValuesBetween = asyncWrapper(async (req, res) => {
	const { start, end } = req.query
	if (!start || !end) {
		return res
			.status(400)
			.json({ error: "Les paramètres start et end sont requis" })
	}

	console.log(
		`Requête getHumidityValuesBetween reçue avec start=${start}, end=${end}`
	)

	// S'assurer que les timestamps sont des nombres
	let startTimestamp, endTimestamp
	try {
		startTimestamp = Number(start)
		endTimestamp = Number(end)

		if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
			return res
				.status(400)
				.json({ error: "Les timestamps doivent être des nombres" })
		}

		console.log(
			`Timestamps convertis: start=${startTimestamp}, end=${endTimestamp}`
		)

		const data = await sensorService.getHumidityValuesBetween(
			startTimestamp,
			endTimestamp
		)
		console.log(`Données retournées: ${data.length} enregistrements`)
		return res.json(data)
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des valeurs d'humidité:",
			error
		)
		return res.status(500).json({ error: `Erreur serveur: ${error.message}` })
	}
})

export const getLatestSensorData = asyncWrapper(async (req, res) => {
	const data = await sensorService.getLatestSensorData()
	res.json(data)
})
