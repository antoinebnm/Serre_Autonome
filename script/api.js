// URL de base de l'API
const API_BASE_URL = "http://localhost:3000";

// Classe utilitaire pour les appels API
class Api {
  // Méthode pour s'inscrire
  static async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de l'inscription");
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      throw error;
    }
  }

  // Méthode pour se connecter
  static async login(credentials) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/users/authentication`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la connexion");
      }

      const data = await response.json();
      // Stocker le token dans le localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    }
  }

  // Méthode pour se déconnecter
  static async logout() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/v1/users/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Supprimer les données utilisateur du localStorage même si la requête échoue
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (!response.ok) {
        const error = await response.json();
        console.warn(error.message || "Erreur lors de la déconnexion");
      }

      return true;
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      // Supprimer quand même les données localStorage en cas d'erreur
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return true;
    }
  }

  // Méthode pour obtenir l'utilisateur actuel
  static getCurrentUser() {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.error(
        "Erreur lors de la récupération des données utilisateur",
        e
      );
      return null;
    }
  }

  // Méthode pour vérifier si l'utilisateur est connecté
  static isAuthenticated() {
    return !!localStorage.getItem("token");
  }

  // Méthode pour ajouter le token d'authentification aux headers
  static getAuthHeaders() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } // Méthode pour récupérer les données de température
  static async getTemperatureData(timeRange = "24h") {
    try {
      // Calculer le timestamp en fonction de la plage de temps demandée
      const now = Date.now();
      let startTime;

      switch (timeRange) {
        case "7j":
          startTime = now - 7 * 24 * 60 * 60 * 1000; // 7 jours en ms
          break;
        case "30j":
          startTime = now - 30 * 24 * 60 * 60 * 1000; // 30 jours en ms
          break;
        default: // 24h
          startTime = now - 24 * 60 * 60 * 1000; // 24 heures en ms
      }

      const response = await fetch(
        `${API_BASE_URL}/api/v1/sensors/temperature?startTime=${startTime}&endTime=${now}`,
        {
          headers: { ...this.getAuthHeaders() },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des données de température"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur API température:", error);
      throw error;
    }
  } // Méthode pour récupérer les données d'humidité
  static async getHumidityData(timeRange = "24h") {
    try {
      // Calculer le timestamp en fonction de la plage de temps demandée
      const now = Date.now();
      let startTime;

      switch (timeRange) {
        case "7j":
          startTime = now - 7 * 24 * 60 * 60 * 1000;
          break;
        case "30j":
          startTime = now - 30 * 24 * 60 * 60 * 1000;
          break;
        default: // 24h
          startTime = now - 24 * 60 * 60 * 1000;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/v1/sensors/humidity?startTime=${startTime}&endTime=${now}`,
        {
          headers: { ...this.getAuthHeaders() },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des données d'humidité"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur API humidité:", error);
      throw error;
    }
  } // Méthode pour récupérer les données de luminosité
  static async getLightData(timeRange = "24h") {
    try {
      // Calculer le timestamp en fonction de la plage de temps demandée
      const now = Date.now();
      let startTime;

      switch (timeRange) {
        case "7j":
          startTime = now - 7 * 24 * 60 * 60 * 1000;
          break;
        case "30j":
          startTime = now - 30 * 24 * 60 * 60 * 1000;
          break;
        default: // 24h
          startTime = now - 24 * 60 * 60 * 1000;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/v1/sensors/light?startTime=${startTime}&endTime=${now}`,
        {
          headers: { ...this.getAuthHeaders() },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des données de luminosité"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur API luminosité:", error);
      throw error;
    }
  }

  // Méthode pour générer un ID de serre unique
  static async generateGreenHouseId() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/greenhouse/generate-id`,
        {
          headers: { ...this.getAuthHeaders() },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la génération de l'ID de serre");
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur génération ID:", error);
      throw error;
    }
  }

  // Méthode pour mettre à jour les informations utilisateur
  static async updateUser(userId, userData) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Erreur lors de la mise à jour du profil"
        );
      }

      const updatedUser = await response.json();
      // Mettre à jour les données utilisateur en local
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      console.error("Erreur de mise à jour du profil:", error);
      throw error;
    }
  }
  // Méthode pour récupérer les serres de l'utilisateur
  static async getUserGreenhouses() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/v1/greenhouse`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Erreur lors de la récupération des serres"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur de récupération des serres:", error);
      throw error;
    }
  }
}

export default Api;
