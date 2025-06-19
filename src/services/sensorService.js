import { SensorPrismaService } from "../../prisma/sensor.js";

class SensorService {
  async getAllLightValues() {
    return SensorPrismaService.getAllLightValues();
  }

  async getLightValuesBetween(startTimestamp, endTimestamp) {
    return SensorPrismaService.getLightValuesBetween(
      startTimestamp,
      endTimestamp
    );
  }

  async createLight(value) {
    return SensorPrismaService.createLight(value);
  }

  async getAllTemperatureValues() {
    return SensorPrismaService.getAllTemperatureValues();
  }

  async getTemperatureValuesBetween(startTimestamp, endTimestamp) {
    return SensorPrismaService.getTemperatureValuesBetween(
      startTimestamp,
      endTimestamp
    );
  }

  async getAllHumidityValues() {
    console.log("🟨 [SERVICE] getAllHumidityValues appelé");
    const result = await SensorPrismaService.getAllHumidityValues();

    return result;
  }

  async getHumidityValuesBetween(startTimestamp, endTimestamp) {
    const result = await SensorPrismaService.getHumidityValuesBetween(
      startTimestamp,
      endTimestamp
    );
    return result;
  }

  async getLatestSensorData() {
    const [lightValues, temperatureValues, humidityValues] = await Promise.all([
      SensorPrismaService.getAllLightValues(),
      SensorPrismaService.getAllTemperatureValues(),
      SensorPrismaService.getAllHumidityValues(),
    ]);

    return {
      light: lightValues[0] || null,
      temperature: temperatureValues[0] || null,
      humidity: humidityValues[0] || null,
    };
  }
}

export default new SensorService();
