import { SerialService } from "../serial/serialService.js"
import jwt from "jsonwebtoken"

// Stockage des connexions actives
const activeConnections = new Map()

/**
 * Configure les événements Socket.IO
 * @param {Server} io - Instance Socket.IO
 */
export function setupSocketIO(io) {
	const serialService = new SerialService()
	const DEFAULT_PORT = "/dev/ttyACM0"
	const DEFAULT_BAUD_RATE = 9600

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
				serialService.disconnect()
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

		// Gérer la déconnexion du client
		socket.on("disconnect", () => {
			console.log(`WebSocket déconnecté: ${socket.id}`)

			if (activeConnections.has(socket.id)) {
				const { dataHandler } = activeConnections.get(socket.id)
				serialService.off("data", dataHandler)
				serialService.disconnect()
				activeConnections.delete(socket.id)
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

		// Établir la connexion
		await serialService.connect(portName, baudRate, 8, 1)

		// Configurer le gestionnaire de données
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
