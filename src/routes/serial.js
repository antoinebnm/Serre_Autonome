import express from "express"
import {
	connectToPort,
	disconnectPort,
	demoSerialCommunication,
	listPorts,
	readData,
	sendData,
	streamData,
} from "../controllers/serialController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import {
	getSerialDemoPage,
	getSerialMonitorPage,
	getWebSocketPage,
} from "../controllers/serialViewController.js"

const router = express.Router()

// Routes pour les pages HTML
router.get("/serial/demo-page", getSerialDemoPage)
router.get("/serial/monitor", getSerialMonitorPage)
router.get("/serial/websocket", getWebSocketPage)

// Routes API
router.get("/api/v1/serial/ports", authMiddleware, listPorts)
router.post("/api/v1/serial/connect", authMiddleware, connectToPort)
router.post("/api/v1/serial/disconnect", authMiddleware, disconnectPort)
router.post("/api/v1/serial/send", authMiddleware, sendData)
router.get("/api/v1/serial/read", authMiddleware, readData)

// Route de streaming - pas d'authentification pour éviter les problèmes avec SSE
router.get("/api/v1/serial/stream", streamData)

// Route de démonstration similaire au script PHP original
router.get("/api/v1/serial/demo", authMiddleware, demoSerialCommunication)

export default router
