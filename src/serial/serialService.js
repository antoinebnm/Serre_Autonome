import { SerialPort } from "serialport"
import { ReadlineParser } from "@serialport/parser-readline"
import EventEmitter from "events"

export class SerialService extends EventEmitter {
	constructor() {
		super()
		this.port = null
		this.parser = null
		this.isConnected = false
		this.reconnectAttempts = 0
		this.maxReconnectAttempts = 3
	}

	/**
	 * Ouvre une connexion au port série
	 * @param {string} portName - Nom du port (ex: 'COM22' sur Windows ou '/dev/cu.usbserial-XXXX' sur Unix)
	 * @param {number} baudRate - Vitesse de transmission (par défaut 9600)
	 * @param {number} dataBits - Nombre de bits de données (par défaut 8)
	 * @param {number} stopBits - Nombre de bits d'arrêt (par défaut 1)
	 * @returns {Promise<boolean>} - Promise résolue avec true si la connexion est établie
	 */
	async connect(portName, baudRate = 9600, dataBits = 8, stopBits = 1) {
		return new Promise((resolve, reject) => {
			try {
				// Vérifier si le port est déjà ouvert
				if (this.isConnected) {
					this.disconnect()
				}

				// Fermer tous les processus qui pourraient utiliser le port
				if (process.platform !== "win32") {
					try {
						// Sur Unix, tenter de libérer le port en fermant les processus qui l'utilisent
						const { execSync } = require("child_process")
						execSync(`fuser -k ${portName} 2>/dev/null || true`)
					} catch (err) {
						console.log(
							"Impossible de libérer le port automatiquement:",
							err.message
						)
					}
				}

				// Créer une nouvelle instance de SerialPort
				this.port = new SerialPort({
					path: portName,
					baudRate: baudRate,
					dataBits: dataBits,
					stopBits: stopBits,
					parity: "none",
					autoOpen: false,
				})

				// Configurer le parser pour lire ligne par ligne
				this.parser = this.port.pipe(new ReadlineParser({ delimiter: "\n" }))

				// Écouter les événements du port
				this.port.on("open", () => {
					console.log(`Port série ${portName} ouvert avec succès`)
					this.isConnected = true
					this.reconnectAttempts = 0

					// Configurer les écouteurs d'événements pour les données reçues
					this.parser.on("data", data => {
						//console.log("Données reçues:", data)
						this.emit("data", data)
					})

					resolve(true)
				})

				this.port.on("error", err => {
					console.error("Erreur du port série:", err.message)
					this.emit("error", err)

					// Tentative de reconnexion en cas d'erreur
					if (this.reconnectAttempts < this.maxReconnectAttempts) {
						console.log(
							`Tentative de reconnexion (${this.reconnectAttempts + 1}/${
								this.maxReconnectAttempts
							})...`
						)
						this.reconnectAttempts++
						setTimeout(() => {
							this.connect(portName, baudRate, dataBits, stopBits)
								.then(resolve)
								.catch(reject)
						}, 1000)
					} else {
						reject(err)
					}
				})

				this.port.on("close", () => {
					console.log("Port série fermé")
					this.isConnected = false
				})

				// Ouvrir le port
				this.port.open(err => {
					if (err) {
						console.error(
							`Erreur lors de l'ouverture du port ${portName}:`,
							err.message
						)
						reject(err)
					}
				})
			} catch (error) {
				console.error("Erreur lors de la connexion au port série:", error)
				reject(error)
			}
		})
	}

	/**
	 * Envoie des données au port série
	 * @param {string} data - Données à envoyer
	 * @returns {Promise<number>} - Promise résolue avec le nombre d'octets envoyés
	 */
	async write(data) {
		return new Promise((resolve, reject) => {
			if (!this.isConnected || !this.port) {
				reject(new Error("Port série non connecté"))
				return
			}

			this.port.write(data, err => {
				if (err) {
					console.error("Erreur lors de l'envoi de données:", err.message)
					reject(err)
					return
				}

				this.port.drain(err => {
					if (err) {
						console.error("Erreur lors du vidage du buffer:", err.message)
						reject(err)
						return
					}
					resolve(data.length)
				})
			})
		})
	}

	/**
	 * Lit des données du port série pendant une durée spécifiée
	 * @param {number} durationMs - Durée de lecture en millisecondes
	 * @returns {Promise<string[]>} - Promise résolue avec un tableau de lignes lues
	 */
	async readForDuration(durationMs) {
		return new Promise((resolve, reject) => {
			if (!this.isConnected || !this.port) {
				reject(new Error("Port série non connecté"))
				return
			}

			const receivedData = []
			const dataHandler = data => {
				//console.log("Données lues:", data)
				receivedData.push(data)
			}

			// Ajouter un écouteur temporaire
			this.on("data", dataHandler)

			// Définir un timeout pour arrêter la lecture après la durée spécifiée
			setTimeout(() => {
				this.off("data", dataHandler)
				resolve(receivedData)
			}, durationMs)
		})
	}

	/**
	 * Ferme la connexion au port série
	 */
	disconnect() {
		if (this.port && this.isConnected) {
			this.port.close(err => {
				if (err) {
					console.error(
						"Erreur lors de la fermeture du port série:",
						err.message
					)
				} else {
					console.log("Port série fermé avec succès")
				}
			})
			this.isConnected = false
			this.port = null
			this.parser = null
		}
	}

	/**
	 * Liste tous les ports série disponibles
	 * @returns {Promise<Array>} - Promise résolue avec la liste des ports
	 */
	static async listPorts() {
		try {
			return await SerialPort.list()
		} catch (error) {
			console.error("Erreur lors de la liste des ports:", error)
			throw error
		}
	}
}
