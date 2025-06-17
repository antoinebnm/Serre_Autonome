import { SerialService } from "../serial/serialService.js"
import jwt from "jsonwebtoken"
import sensorService from "../services/sensorService.js"

// Stockage des connexions actives
const activeConnections = new Map()

// Variables pour la gestion des données de lumière
let lastLightSaveTime = 0
let latestLightValue = null

// Création d'une instance du service série globale
const serialService = new SerialService()
const DEFAULT_PORT = "/dev/ttyACM0"
const DEFAULT_BAUD_RATE = 9600

// Fonction pour initialiser la connexion au port série au démarrage du serveur
export async function initializeSerialPort() {
	try {
		console.log(
			`Initialisation de la connexion au port série ${DEFAULT_PORT} à ${DEFAULT_BAUD_RATE} bauds...`
		)
		await serialService.connect(DEFAULT_PORT, DEFAULT_BAUD_RATE, 8, 1)

		// Configurer le gestionnaire de données pour l'enregistrement dans la BD
		serialService.on("data", processLightData)

		console.log(
			`Port série ${DEFAULT_PORT} connecté avec succès au démarrage du serveur`
		)
	} catch (error) {
		console.error(
			"Erreur lors de l'initialisation du port série au démarrage:",
			error
		)
	}
}

/**
 * Configure les événements Socket.IO
 * @param {Server} io - Instance Socket.IO
 */
export function setupSocketIO(io) {
	// Middleware d'authentification pour Socket.IO
	io.use((socket, next) => {
		const token = socket.handshake.auth.token || socket.handshake.query.token

		if (!token) {
			return next(new Error("Authentication token required"))
		}

		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET)
			socket.userId = decoded.userId
			next()
		} catch (error) {
			return next(new Error("Authentication failed"))
		}
	})

	io.on("connection", socket => {
		console.log(`Nouvelle connexion WebSocket: ${socket.id}`)

		// Connexion automatique au port série par défaut
		connectToSerialPort(socket, serialService, DEFAULT_PORT, DEFAULT_BAUD_RATE)

		// Gestionnaire pour la connexion à un port série
		socket.on("serial:connect", async data => {
			try {
				const { portName, baudRate = DEFAULT_BAUD_RATE } = data

				if (!portName) {
					socket.emit("error", { message: "Port name is required" })
					return
				}

				connectToSerialPort(socket, serialService, portName, baudRate)
			} catch (error) {
				console.error("Erreur WebSocket:", error)
				socket.emit("error", { message: error.message })
			}
		})

		// Gestionnaire pour envoyer des données au port série
		socket.on("serial:send", async data => {
			try {
				if (!activeConnections.has(socket.id)) {
					socket.emit("error", { message: "Not connected to any serial port" })
					return
				}

				const bytes = await serialService.write(data.message)
				socket.emit("serial:sent", { bytes })
			} catch (error) {
				socket.emit("error", { message: error.message })
			}
		})

		// Gestionnaire pour déconnecter du port série
		socket.on("serial:disconnect", () => {
			if (activeConnections.has(socket.id)) {
				const { dataHandler } = activeConnections.get(socket.id)
				serialService.off("data", dataHandler)
				// Ne pas déconnecter complètement le port série car il pourrait être utilisé ailleurs
				activeConnections.delete(socket.id)
				socket.emit("serial:disconnected", {
					message: "Déconnecté du port série",
				})
			}
		})

		// Gestionnaire pour lister les ports disponibles
		socket.on("serial:list-ports", async () => {
			try {
				const ports = await SerialService.listPorts()
				socket.emit("serial:ports", { ports })
			} catch (error) {
				socket.emit("error", { message: error.message })
			}
		})
	})
}

/**
 * Fonction utilitaire pour connecter au port série
 */
async function connectToSerialPort(socket, serialService, portName, baudRate) {
	try {
		console.log(
			`Tentative de connexion au port ${portName} à ${baudRate} bauds`
		)

		// Si la socket est déjà connectée à un port, déconnecter
		if (activeConnections.has(socket.id)) {
			const { dataHandler } = activeConnections.get(socket.id)
			serialService.off("data", dataHandler)
		}

		// Si le port n'est pas connecté, le connecter
		if (!serialService.isConnected) {
			await serialService.connect(portName, baudRate, 8, 1)
		}

		// Configurer le gestionnaire de données spécifique à cette socket
		const dataHandler = data => {
			socket.emit("serial:data", { data })
		}

		serialService.on("data", dataHandler)

		// Stocker la connexion active
		activeConnections.set(socket.id, {
			serialService,
			dataHandler,
			portName,
			baudRate,
		})

		socket.emit("serial:connected", {
			message: `Connecté au port ${portName} à ${baudRate} bauds`,
		})
	} catch (error) {
		console.error("Erreur de connexion au port série:", error)
		socket.emit("error", { message: error.message })
	}
}

/**
 * Traite et enregistre les données de lumière dans la base de données
 * @param {string} data - Données reçues du port série
 */
function processLightData(data) {
	try {
		// Convertir les données en chaîne de caractères et nettoyer
		const dataStr = data.toString().trim()

		// Vérifier si la donnée est un nombre valide
		const numericValue = parseFloat(dataStr)

		if (!isNaN(numericValue)) {
			// Convertir de 0-4095 à 0-100 (pourcentage)
			// La formule est: (valeur / valeurMax) * 100
			const MAX_SENSOR_VALUE = 4095
			const percentValue = (numericValue / MAX_SENSOR_VALUE) * 100

			// Arrondir à 2 décimales
			const roundedPercentValue = Math.round(percentValue * 100) / 100

			// Mettre à jour la dernière valeur connue
			latestLightValue = roundedPercentValue

			const now = Date.now()
			// Enregistrer les données toutes les 5 secondes
			if (now - lastLightSaveTime >= 5000) {
				lastLightSaveTime = now
				console.log(
					`Enregistrement de la valeur de luminosité dans la BD: ${roundedPercentValue}% (valeur brute: ${numericValue})`
				)

				// Enregistrer la valeur en pourcentage dans la base de données
				sensorService
					.createLight(roundedPercentValue)
					.then(result => console.log("Donnée de lumière enregistrée:", result))
					.catch(err =>
						console.error("Erreur lors de l'enregistrement de la lumière:", err)
					)
			}
		}
	} catch (error) {
		console.error("Erreur lors du traitement des données de lumière:", error)
	}
}
