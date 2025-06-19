import { PrismaClient } from "./generated/mysql-client/index.js";
export const prisma = new PrismaClient();

export class SensorPrismaService {
  static async createLight(val) {
    return prisma.light.create({
      data: { val },
    });
  }

  static async getAllLightValues() {
    return prisma.light.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
  }

  static async getLightValuesBetween(startTimestamp, endTimestamp) {
    try {
      console.log(
        `getLightValuesBetween - Timestamps reçus: start=${startTimestamp}, end=${endTimestamp}`
      );

      // Vérifier si les timestamps sont des nombres
      if (
        typeof startTimestamp !== "number" ||
        typeof endTimestamp !== "number"
      ) {
        console.error("Les timestamps ne sont pas des nombres");
        startTimestamp = Number(startTimestamp);
        endTimestamp = Number(endTimestamp);
      }

      // S'assurer que les timestamps sont valides
      if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
        console.error("Les timestamps convertis ne sont pas valides");
        return [];
      }

      // Convertir les timestamps de secondes en millisecondes si nécessaire
      // Un timestamp en secondes a généralement 10 chiffres ou moins
      if (startTimestamp < 10000000000) startTimestamp *= 1000;
      if (endTimestamp < 10000000000) endTimestamp *= 1000;

      console.log(
        `Timestamps après conversion en ms: start=${startTimestamp}, end=${endTimestamp}`
      );

      // Créer les dates à partir des timestamps
      const start = new Date(startTimestamp);
      const end = new Date(endTimestamp);

      console.log(
        `Dates converties: start=${start.toISOString()}, end=${end.toISOString()}`
      );

      // Vérifier si les dates sont valides
      if (
        !(start instanceof Date && !isNaN(start)) ||
        !(end instanceof Date && !isNaN(end))
      ) {
        console.error("Dates invalides après conversion");
        return [];
      }

      // Créer des chaînes formatées pour MySQL
      const startStr = start.toISOString().slice(0, 19).replace("T", " ");
      const endStr = end.toISOString().slice(0, 19).replace("T", " ");
      console.log(
        `Chaînes de dates formatées pour MySQL: start="${startStr}", end="${endStr}"`
      );

      // Essayons une approche différente avec une requête brute
      try {
        // Requête SQL brute pour déboguer
        const rawResult = await prisma.$queryRaw`
					SELECT * FROM light 
					WHERE created_at >= ${startStr} 
					AND created_at <= ${endStr} 
					ORDER BY created_at ASC
				`;

        console.log(
          `Résultats SQL bruts: ${rawResult.length} enregistrements trouvés`
        );

        if (rawResult.length > 0) {
          return rawResult;
        }
      } catch (sqlError) {
        console.error("Erreur SQL:", sqlError);
      }

      // Si la requête brute échoue ou ne retourne pas de résultats, essayer avec Prisma
      try {
        const result = await prisma.light.findMany({
          where: {
            created_at: {
              gte: start,
              lte: end,
            },
          },
          orderBy: {
            created_at: "asc",
          },
        });

        console.log(
          `Résultats Prisma: ${result.length} enregistrements trouvés`
        );
        return result;
      } catch (prismaError) {
        console.error("Erreur Prisma:", prismaError);
        return [];
      }
    } catch (error) {
      console.error("Erreur dans getLightValuesBetween:", error);
      throw error;
    }
  }

  static async getAllTemperatureValues() {
    return prisma.temperature.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
  }

  static async getTemperatureValuesBetween(startTimestamp, endTimestamp) {
    try {
      console.log(
        `getTemperatureValuesBetween - Timestamps reçus: start=${startTimestamp}, end=${endTimestamp}`
      );

      // Vérifier si les timestamps sont des nombres
      if (
        typeof startTimestamp !== "number" ||
        typeof endTimestamp !== "number"
      ) {
        console.error("Les timestamps ne sont pas des nombres");
        startTimestamp = Number(startTimestamp);
        endTimestamp = Number(endTimestamp);
      }

      // S'assurer que les timestamps sont valides
      if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
        console.error("Les timestamps convertis ne sont pas valides");
        return [];
      }

      // Convertir les timestamps de secondes en millisecondes si nécessaire
      // Un timestamp en secondes a généralement 10 chiffres ou moins
      if (startTimestamp < 10000000000) startTimestamp *= 1000;
      if (endTimestamp < 10000000000) endTimestamp *= 1000;

      console.log(
        `Timestamps après conversion en ms: start=${startTimestamp}, end=${endTimestamp}`
      );

      // Créer les dates à partir des timestamps
      const start = new Date(startTimestamp);
      const end = new Date(endTimestamp);

      console.log(
        `Dates converties: start=${start.toISOString()}, end=${end.toISOString()}`
      );

      // Créer des chaînes formatées pour MySQL
      const startStr = start.toISOString().slice(0, 19).replace("T", " ");
      const endStr = end.toISOString().slice(0, 19).replace("T", " ");
      console.log(
        `Chaînes de dates formatées pour MySQL: start="${startStr}", end="${endStr}"`
      );

      // Essayons une approche différente avec une requête brute
      try {
        // Requête SQL brute pour déboguer
        const rawResult = await prisma.$queryRaw`
					SELECT * FROM temperature 
					WHERE created_at >= ${startStr} 
					AND created_at <= ${endStr} 
					ORDER BY created_at ASC
				`;

        console.log(
          `Résultats SQL bruts: ${rawResult.length} enregistrements trouvés`
        );

        if (rawResult.length > 0) {
          return rawResult;
        }
      } catch (sqlError) {
        console.error("Erreur SQL:", sqlError);
      }

      // Si la requête brute échoue ou ne retourne pas de résultats, essayer avec Prisma
      try {
        const result = await prisma.temperature.findMany({
          where: {
            created_at: {
              gte: start,
              lte: end,
            },
          },
          orderBy: {
            created_at: "asc",
          },
        });

        console.log(
          `Résultats Prisma: ${result.length} enregistrements trouvés`
        );
        return result;
      } catch (prismaError) {
        console.error("Erreur Prisma:", prismaError);
        return [];
      }
    } catch (error) {
      console.error("Erreur dans getTemperatureValuesBetween:", error);
      throw error;
    }
  }

  static async getAllHumidityValues() {
    console.log("🟪 [PRISMA] getAllHumidityValues appelé");
    try {
      const result = await prisma.humidity.findMany({
        orderBy: {
          created_at: "desc",
        },
      });
      console.log(
        "🟪 [PRISMA] getAllHumidityValues résultat:",
        result.length,
        "éléments"
      );
      if (result.length > 0) {
        console.log("🟪 [PRISMA] Premier élément:", result[0]);
      }
      return result;
    } catch (error) {
      console.error("🔴 [PRISMA] Erreur getAllHumidityValues:", error);
      throw error;
    }
  }

  static async getHumidityValuesBetween(startTimestamp, endTimestamp) {
    try {
      console.log(
        `getHumidityValuesBetween - Timestamps reçus: start=${startTimestamp}, end=${endTimestamp}`
      );

      // Vérifier si les timestamps sont des nombres
      if (
        typeof startTimestamp !== "number" ||
        typeof endTimestamp !== "number"
      ) {
        console.error("Les timestamps ne sont pas des nombres");
        startTimestamp = Number(startTimestamp);
        endTimestamp = Number(endTimestamp);
      }

      // S'assurer que les timestamps sont valides
      if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
        console.error("Les timestamps convertis ne sont pas valides");
        return [];
      }

      // Convertir les timestamps de secondes en millisecondes si nécessaire
      // Un timestamp en secondes a généralement 10 chiffres ou moins
      if (startTimestamp < 10000000000) startTimestamp *= 1000;
      if (endTimestamp < 10000000000) endTimestamp *= 1000;

      console.log(
        `Timestamps après conversion en ms: start=${startTimestamp}, end=${endTimestamp}`
      );

      // Créer les dates à partir des timestamps
      const start = new Date(startTimestamp);
      const end = new Date(endTimestamp);

      console.log(
        `Dates converties: start=${start.toISOString()}, end=${end.toISOString()}`
      );

      // Créer des chaînes formatées pour MySQL
      const startStr = start.toISOString().slice(0, 19).replace("T", " ");
      const endStr = end.toISOString().slice(0, 19).replace("T", " ");
      console.log(
        `Chaînes de dates formatées pour MySQL: start="${startStr}", end="${endStr}"`
      );

      // Essayons une approche différente avec une requête brute
      try {
        // Requête SQL brute pour déboguer
        const rawResult = await prisma.$queryRaw`
					SELECT * FROM humidity 
					WHERE created_at >= ${startStr} 
					AND created_at <= ${endStr} 
					ORDER BY created_at ASC
				`;

        console.log(
          `Résultats SQL bruts: ${rawResult.length} enregistrements trouvés`
        );

        if (rawResult.length > 0) {
          return rawResult;
        }
      } catch (sqlError) {
        console.error("Erreur SQL:", sqlError);
      }

      // Si la requête brute échoue ou ne retourne pas de résultats, essayer avec Prisma
      try {
        const result = await prisma.humidity.findMany({
          where: {
            created_at: {
              gte: start,
              lte: end,
            },
          },
          orderBy: {
            created_at: "asc",
          },
        });

        console.log(
          `Résultats Prisma: ${result.length} enregistrements trouvés`
        );
        return result;
      } catch (prismaError) {
        console.error("Erreur Prisma:", prismaError);
        return [];
      }
    } catch (error) {
      console.error("Erreur dans getHumidityValuesBetween:", error);
      throw error;
    }
  }
}

async function main() {}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
