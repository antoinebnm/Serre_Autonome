// Module de gestion des connexions WebSocket
class SocketManager {
	constructor() {
		this.socket = null
		this.connected = false
		this.listeners = new Map()
		this.reconnectAttempts = 0
		this.maxReconnectAttempts = 5
		this.reconnectTimeout = null
		this.baseUrl = "http://localhost:3000"
	}

	// Initialisation de la connexion WebSocket
	connect() {
		// S'assurer que la bibliothèque socket.io est chargée
		if (!window.io) {
			console.error("La bibliothèque socket.io n'est pas chargée")
			return false
		}

		// Récupérer le token d'authentification
		const token = localStorage.getItem("token")
		if (!token) {
			console.error(
				"Aucun token d'authentification trouvé, impossible de se connecter au WebSocket"
			)
			return false
		}

		try {
			// Créer la connexion avec authentification
			this.socket = io(this.baseUrl, {
				auth: { token },
				query: { token },
				reconnection: true,
				reconnectionDelay: 1000,
				reconnectionDelayMax: 5000,
				reconnectionAttempts: this.maxReconnectAttempts,
			})

			// Configurer les événements de base
			this.setupBasicEvents()
			return true
		} catch (error) {
			console.error("Erreur lors de la connexion au WebSocket:", error)
			return false
		}
	}

	// Configuration des événements de base pour la gestion de la connexion
	setupBasicEvents() {
		this.socket.on("connect", () => {
			console.log("WebSocket connecté")
			this.connected = true
			this.reconnectAttempts = 0
			// Informer les écouteurs que la connexion est établie
			this.triggerEvent("connect")
		})

		this.socket.on("disconnect", reason => {
			console.log(`WebSocket déconnecté: ${reason}`)
			this.connected = false
			this.triggerEvent("disconnect", reason)
		})

		this.socket.on("connect_error", error => {
			console.error("Erreur de connexion WebSocket:", error)
			this.triggerEvent("error", error)

			// Gérer les reconnexions manuellement si nécessaire
			if (this.reconnectAttempts < this.maxReconnectAttempts) {
				this.reconnectAttempts++
				this.reconnectTimeout = setTimeout(() => {
					console.log(
						`Tentative de reconnexion WebSocket ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
					)
					this.socket.connect()
				}, 2000)
			}
		})

		this.socket.on("error", error => {
			console.error("Erreur WebSocket:", error)
			this.triggerEvent("error", error)
		})

		// Événement pour les données série
		this.socket.on("serial:data", data => {
			this.triggerEvent("serial:data", data)
		})

		// Événement pour la confirmation de connexion au port série
		this.socket.on("serial:connected", data => {
			console.log("Port série connecté:", data.message)
			this.triggerEvent("serial:connected", data)
		})

		// Événement pour les erreurs liées au port série
		this.socket.on("serial:error", error => {
			console.error("Erreur port série:", error.message)
			this.triggerEvent("serial:error", error)
		})
	}

	// Méthode pour s'abonner aux données en temps réel
	subscribeToData(dataHandler, errorHandler) {
		if (!this.socket || !this.connected) {
			if (!this.connect()) {
				if (errorHandler) {
					errorHandler(new Error("Impossible de se connecter au WebSocket"))
				}
				return false
			}
		}

		// Ajouter l'écouteur pour les données
		this.addListener("serial:data", dataHandler)

		// Ajouter l'écouteur pour les erreurs si fourni
		if (errorHandler) {
			this.addListener("error", errorHandler)
			this.addListener("serial:error", errorHandler)
		}

		return true
	}

	// Méthode pour se désabonner
	unsubscribe(dataHandler, errorHandler) {
		this.removeListener("serial:data", dataHandler)

		if (errorHandler) {
			this.removeListener("error", errorHandler)
			this.removeListener("serial:error", errorHandler)
		}
	}

	// Ajouter un écouteur d'événement
	addListener(event, callback) {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, [])
		}
		this.listeners.get(event).push(callback)
	}

	// Retirer un écouteur d'événement
	removeListener(event, callback) {
		if (this.listeners.has(event)) {
			const callbacks = this.listeners.get(event)
			const index = callbacks.indexOf(callback)

			if (index !== -1) {
				callbacks.splice(index, 1)
			}

			if (callbacks.length === 0) {
				this.listeners.delete(event)
			}
		}
	}

	// Déclencher un événement pour tous les écouteurs
	triggerEvent(event, data) {
		if (this.listeners.has(event)) {
			const callbacks = this.listeners.get(event)
			callbacks.forEach(callback => {
				try {
					callback(data)
				} catch (error) {
					console.error(`Erreur dans l'écouteur d'événement ${event}:`, error)
				}
			})
		}
	}

	// Déconnexion du WebSocket
	disconnect() {
		if (this.socket) {
			this.socket.disconnect()
			this.socket = null
			this.connected = false

			// Nettoyer le timeout de reconnexion si présent
			if (this.reconnectTimeout) {
				clearTimeout(this.reconnectTimeout)
				this.reconnectTimeout = null
			}

			return true
		}
		return false
	}
}

// Créer une instance unique pour l'application
const socketManager = new SocketManager()

export default socketManager
