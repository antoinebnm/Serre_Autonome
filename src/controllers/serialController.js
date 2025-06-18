import { SerialService } from "../serial/serialService.js"
import { asyncWrapper } from "../utils/asyncWrapper.js"
import { execSync } from "child_process"

// Instance unique du service série
const serialService = new SerialService()

// Liste tous les ports série disponibles
export const listPorts = asyncWrapper(async (req, res) => {
	const ports = await SerialService.listPorts()
	res.json({ success: true, data: ports })
})

// Connecte au port série spécifié
export const connectToPort = asyncWrapper(async (req, res) => {
	const { portName, baudRate, dataBits, stopBits } = req.body

	if (!portName) {
		return res
			.status(400)
			.json({ success: false, message: "Le nom du port est requis" })
	}

	// Tenter de fermer tous les processus qui utilisent le port
	if (process.platform !== "win32") {
		try {
			execSync(`fuser -k ${portName} 2>/dev/null || true`)
			console.log(`Port ${portName} libéré des autres processus`)
		} catch (err) {
			console.log("Impossible de libérer le port:", err.message)
		}
	}

	try {
		await serialService.connect(
			portName,
			baudRate || 9600,
			dataBits || 8,
			stopBits || 1
		)

		res.json({ success: true, message: `Connecté au port ${portName}` })
	} catch (error) {
		console.error("Erreur de connexion:", error)
		res.status(500).json({ success: false, message: error.message })
	}
})

// Déconnecte du port série
export const disconnectPort = asyncWrapper(async (req, res) => {
	serialService.disconnect()
	res.json({ success: true, message: "Déconnecté du port série" })
})

// Envoie des données au port série
export const sendData = asyncWrapper(async (req, res) => {
	const { data } = req.body

	if (!data) {
		return res
			.status(400)
			.json({ success: false, message: "Les données à envoyer sont requises" })
	}

	const bytesSent = await serialService.write(data)
	res.json({ success: true, bytesSent, message: `${bytesSent} octets envoyés` })
})

// Lit des données du port série pendant une durée spécifiée
export const readData = asyncWrapper(async (req, res) => {
	const { durationMs } = req.query
	const duration = parseInt(durationMs) || 10000 // Par défaut 10 secondes

	const data = await serialService.readForDuration(duration)
	res.json({ success: true, data })
})

// Stream de données en temps réel
export const streamData = asyncWrapper(async (req, res) => {
	// Configuration SSE pour l'envoi en temps réel des données
	res.setHeader("Content-Type", "text/event-stream")
	res.setHeader("Cache-Control", "no-cache")
	res.setHeader("Connection", "keep-alive")
	// Pour éviter un timeout du serveur
	res.setTimeout(0)

	const sendEvent = data => {
		res.write(`data: ${JSON.stringify(data)}\n\n`)
	}

	try {
		// On va ignorer la vérification du middleware d'authentification qui a déjà été faite
		// et utiliser directement les paramètres de requête
		const { portName, baudRate } = req.query

		if (!portName) {
			sendEvent({ type: "error", message: "Le nom du port est requis" })
			return res.end()
		}

		// Libérer d'abord le port
		if (process.platform !== "win32") {
			try {
				execSync(`fuser -k ${portName} 2>/dev/null || true`)
				console.log(`Port ${portName} libéré des autres processus`)
				// Attendre un peu pour s'assurer que le port est bien fermé
				await new Promise(resolve => setTimeout(resolve, 1000))
			} catch (error) {
				console.log("Erreur lors de la libération du port:", error)
			}
		}

		sendEvent({
			type: "info",
			message: `Connexion au port ${portName}...`,
		})

		// Connexion au port série
		try {
			await serialService.connect(portName, parseInt(baudRate) || 9600, 8, 1)
			sendEvent({
				type: "success",
				message: `Connecté au port ${portName} à ${
					parseInt(baudRate) || 9600
				} bauds`,
			})
		} catch (error) {
			sendEvent({
				type: "error",
				message: `Impossible de se connecter au port ${portName}: ${error.message}`,
			})
			return res.end()
		}

		// Configuration de l'écouteur d'événements pour les données reçues
		let lastSentTime = 0
		const minInterval = 1000 // Intervalle minimum de 1 seconde entre les envois
		let pendingData = null
		let dataCount = 0 // Compteur pour n'envoyer qu'une donnée sur X
		const samplingRate = 1 // Valeur non utilisée maintenant - on utilise l'intervalle de temps

		const dataHandler = data => {
			console.log("Données reçues (stream):", data)

			const now = Date.now()
			// N'envoyer qu'une donnée par seconde
			if (now - lastSentTime >= minInterval) {
				sendEvent({ type: "data", message: data })
				lastSentTime = now
				pendingData = null
			} else {
				// Stocker la donnée la plus récente pour le prochain envoi
				pendingData = data
			}
		}

		// Timer pour envoyer les données en attente (uniquement si aucune nouvelle donnée n'est reçue pendant l'intervalle)
		const dataTimer = setInterval(() => {
			if (pendingData) {
				const now = Date.now()
				if (now - lastSentTime >= minInterval) {
					sendEvent({ type: "data", message: pendingData })
					pendingData = null
					lastSentTime = now
				}
			}
		}, minInterval)

		serialService.on("data", dataHandler)

		// Gestion de la déconnexion du client
		req.on("close", () => {
			console.log("Client déconnecté, fermeture du port série")
			serialService.off("data", dataHandler)
			serialService.disconnect()
			clearInterval(dataTimer)
		})
	} catch (error) {
		sendEvent({ type: "error", message: `Erreur: ${error.message}` })
		res.end()
	}
})

// Démo similaire au script PHP original
export const demoSerialCommunication = asyncWrapper(async (req, res) => {
	// Configuration SSE pour l'envoi en temps réel des données
	res.setHeader("Content-Type", "text/event-stream")
	res.setHeader("Cache-Control", "no-cache")
	res.setHeader("Connection", "keep-alive")

	const sendEvent = data => {
		res.write(`data: ${JSON.stringify(data)}\n\n`)
	}

	try {
		const { portName } = req.query

		if (!portName) {
			sendEvent({ type: "error", message: "Le nom du port est requis" })
			return res.end()
		}

		// Libérer d'abord le port
		if (process.platform !== "win32") {
			try {
				execSync(`fuser -k ${portName} 2>/dev/null || true`)
				console.log(`Port ${portName} libéré des autres processus`)
				// Attendre un peu pour s'assurer que le port est bien fermé
				await new Promise(resolve => setTimeout(resolve, 1000))
			} catch (err) {
				console.log("Impossible de libérer le port:", err.message)
			}
		}

		sendEvent({
			type: "info",
			message: "Démarrage de la démonstration de communication série...",
		})

		// Connexion au port série
		try {
			await serialService.connect(portName, 9600, 8, 1)
			sendEvent({ type: "success", message: `Connecté au port ${portName}` })
		} catch (error) {
			sendEvent({
				type: "error",
				message: `Impossible d'ouvrir le port série ${portName}: ${error.message}`,
			})
			return res.end()
		}

		// Envoi de données
		try {
			const message = "\n\nHello from Node.js !!!\n\n\n"
			const bytesSent = await serialService.write(message)
			sendEvent({ type: "info", message: `Envoyé: ${bytesSent} octets...` })
		} catch (error) {
			sendEvent({
				type: "error",
				message: `Erreur lors de l'envoi de données: ${error.message}`,
			})
		}

		// Configuration de l'écouteur d'événements pour les données reçues
		const dataHandler = data => {
			console.log("Données reçues (demo):", data)
			sendEvent({ type: "data", message: data })
		}

		serialService.on("data", dataHandler)

		// Lecture pendant 10 secondes
		sendEvent({
			type: "info",
			message: "Attente de 10 secondes pour recevoir des données...",
		})

		// Fermeture de la connexion après 10 secondes
		setTimeout(() => {
			serialService.off("data", dataHandler)
			serialService.disconnect()
			sendEvent({
				type: "info",
				message: "Démonstration terminée, port série fermé",
			})
			res.end()
		}, 10000)

		// Gestion de la déconnexion du client
		req.on("close", () => {
			serialService.off("data", dataHandler)
			serialService.disconnect()
		})
	} catch (error) {
		sendEvent({ type: "error", message: `Erreur: ${error.message}` })
		res.end()
	}
})
