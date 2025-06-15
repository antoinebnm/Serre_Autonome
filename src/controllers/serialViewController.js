import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

// Obtenir le chemin du répertoire actuel
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const getSerialDemoPage = (req, res) => {
	try {
		const filePath = path.join(__dirname, "..", "serial", "serialDemo.html")
		const content = fs.readFileSync(filePath, "utf8")
		res.setHeader("Content-Type", "text/html")
		res.send(content)
	} catch (error) {
		console.error("Erreur lors de la lecture du fichier HTML:", error)
		res
			.status(500)
			.send("Erreur lors du chargement de la page de démonstration")
	}
}

export const getSerialMonitorPage = (req, res) => {
	try {
		const filePath = path.join(__dirname, "..", "serial", "serialMonitor.html")
		const content = fs.readFileSync(filePath, "utf8")
		res.setHeader("Content-Type", "text/html")
		res.send(content)
	} catch (error) {
		console.error("Erreur lors de la lecture du fichier HTML:", error)
		res
			.status(500)
			.send("Erreur lors du chargement de la page du moniteur série")
	}
}

export const getWebSocketPage = (req, res) => {
	try {
		const filePath = path.join(
			__dirname,
			"..",
			"serial",
			"serialWebsocket.html"
		)
		const content = fs.readFileSync(filePath, "utf8")
		res.setHeader("Content-Type", "text/html")
		res.send(content)
	} catch (error) {
		console.error("Erreur lors de la lecture du fichier HTML:", error)
		res.status(500).send("Erreur lors du chargement de la page WebSocket")
	}
}
