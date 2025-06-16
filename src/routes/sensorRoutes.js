import { Router } from "express"
import {
	getAllLightValues,
	getLightValuesBetween,
	createLight,
	getAllTemperatureValues,
	getTemperatureValuesBetween,
	getAllHumidityValues,
	getHumidityValuesBetween,
	getLatestSensorData,
} from "../controllers/sensorController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const router = Router()

/**
 * @route GET /api/v1/latest
 * @desc Récupère les dernières valeurs de tous les capteurs
 * @access Public
 */
router.get("/latest", authMiddleware, getLatestSensorData)

/**
 * @route GET /api/v1/light
 * @desc Récupère toutes les valeurs de luminosité
 * @access Public
 */
router.get("/light", authMiddleware, getAllLightValues)

/**
 * @route GET /api/v1/light/between
 * @desc Récupère les valeurs de luminosité entre deux dates
 * @access Public
 */
router.get("/light/between", authMiddleware, getLightValuesBetween)

/**
 * @route POST /api/v1/light
 * @desc Crée une nouvelle entrée de luminosité
 * @access Protected
 */
router.post("/light", authMiddleware, createLight)

/**
 * @route GET /api/v1/temperature
 * @desc Récupère toutes les valeurs de température
 * @access Public
 */
router.get("/temperature", authMiddleware, getAllTemperatureValues)

/**
 * @route GET /api/v1/temperature/between
 * @desc Récupère les valeurs de température entre deux dates
 * @access Public
 */
router.get("/temperature/between", authMiddleware, getTemperatureValuesBetween)

/**
 * @route GET /api/v1/humidity
 * @desc Récupère toutes les valeurs d'humidité
 * @access Public
 */
router.get("/humidity", authMiddleware, getAllHumidityValues)

/**
 * @route GET /api/v1/humidity/between
 * @desc Récupère les valeurs d'humidité entre deux dates
 * @access Public
 */
router.get("/humidity/between", authMiddleware, getHumidityValuesBetween)

export default router
