import { SensorPrismaService } from "../../prisma/sensor.js"


class SensorService {

	async getAllLightValues() {
		return SensorPrismaService.getAllLightValues()
	}

	async getLightValuesBetween(startTimestamp, endTimestamp) {
		return SensorPrismaService.getLightValuesBetween(
			startTimestamp,
			endTimestamp
		)
	}

	async createLight(value) {
		return SensorPrismaService.createLight(value)
	}

	async getAllTemperatureValues() {
		return SensorPrismaService.getAllTemperatureValues()
	}

	async getTemperatureValuesBetween(startTimestamp, endTimestamp) {
		return SensorPrismaService.getTemperatureValuesBetween(
			startTimestamp,
			endTimestamp
		)
	}

	async getAllHumidityValues() {
		return SensorPrismaService.getAllHumidityValues()
	}

	async getHumidityValuesBetween(startTimestamp, endTimestamp) {
		return SensorPrismaService.getHumidityValuesBetween(
			startTimestamp,
			endTimestamp
		)
	}

	async getLatestSensorData() {
		const [lightValues, temperatureValues, humidityValues] = await Promise.all([
			SensorPrismaService.getAllLightValues(),
			SensorPrismaService.getAllTemperatureValues(),
			SensorPrismaService.getAllHumidityValues(),
		])

		return {
			light: lightValues[0] || null,
			temperature: temperatureValues[0] || null,
			humidity: humidityValues[0] || null,
		}
	}
}

export default new SensorService()
