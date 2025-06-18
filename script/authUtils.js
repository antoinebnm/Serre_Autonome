// Utilitaires pour la gestion de l'authentification côté frontend
import Api from "./api.js"

class AuthUtils {
	/**
	 * Vérifie si l'utilisateur est connecté
	 * @returns {boolean} True si l'utilisateur est connecté, sinon False
	 */
	static isLoggedIn() {
		return !!localStorage.getItem("token")
	}

	/**
	 * Récupère les informations de l'utilisateur connecté
	 * @returns {Object|null} Les données de l'utilisateur ou null si non connecté
	 */
	static getCurrentUser() {
		return Api.getCurrentUser()
	}

	/**
	 * Déconnecte l'utilisateur et redirige vers la page d'accueil
	 * @param {string} redirectUrl - URL vers laquelle rediriger après déconnexion (par défaut: home.html)
	 * @returns {Promise<boolean>} Promise qui se résout quand l'utilisateur est déconnecté
	 */
	static async logout(redirectUrl = "../vue/home.html") {
		await Api.logout()
		window.location.href = redirectUrl
		return true
	}

	/**
	 * Récupérer les informations de l'utilisateur
	 * @returns {Object|null} Les données de l'utilisateur ou null si non connecté
	 */
	static getUser() {
		try {
			const userStr = localStorage.getItem("user")
			return userStr ? JSON.parse(userStr) : null
		} catch (e) {
			console.error("Erreur lors de la récupération des données utilisateur", e)
			return null
		}
	}

	/**
	 * Vérifier si l'utilisateur est administrateur
	 * @returns {boolean} True si l'utilisateur est administrateur, sinon False
	 */
	static isAdmin() {
		const user = this.getUser()
		return user && user.role === "admin"
	}

	/**
	 * Rediriger si l'utilisateur n'est pas connecté
	 * @param {string} redirectUrl - URL vers laquelle rediriger après connexion
	 * @returns {boolean} True si l'utilisateur est connecté, sinon redirige et retourne false
	 */
	static requireAuth(redirectUrl = null) {
		if (!this.isLoggedIn()) {
			// Sauvegarder l'URL actuelle pour y revenir après connexion
			localStorage.setItem("redirectUrl", window.location.href)

			// Déterminer l'URL de la page de connexion
			let loginPath = "inscription.html"

			// Si une URL de redirection est spécifiée, la passer en paramètre
			if (redirectUrl) {
				loginPath += `?redirect=${encodeURIComponent(redirectUrl)}`
			}

			// Assurer un chemin de redirection correct
			if (window.location.href.includes("/Front/vue/")) {
				// Déjà dans le dossier vue, chemin relatif
				window.location.href = loginPath
			} else {
				// Assurer un chemin absolu
				window.location.href = `../vue/${loginPath}`
			}

			return false
		}
		return true
	}

	/**
	 * Rediriger si l'utilisateur n'est pas administrateur
	 * @returns {boolean} True si l'utilisateur est administrateur, sinon redirige et retourne false
	 */
	static requireAdmin() {
		if (!this.requireAuth()) return false

		if (!this.isAdmin()) {
			alert("Vous n'avez pas les droits d'accès à cette page.")
			window.location.href = "home.html"
			return false
		}
		return true
	}

	/**
	 * Adapte l'interface utilisateur en fonction de l'état de connexion
	 * @param {Object} options - Options de personnalisation
	 */
	static updateUI(options = {}) {
		const isLoggedIn = this.isLoggedIn()
		const authLink = document.getElementById("auth-link")

		// Mettre à jour le lien d'authentification
		if (authLink) {
			if (isLoggedIn) {
				authLink.textContent = "Déconnexion"
				authLink.href = "javascript:void(0);"
				authLink.onclick = async () => {
					await this.logout()
				}
			} else {
				authLink.textContent = "Inscription/Connexion"
				authLink.href = "inscription.html"
				authLink.onclick = null
			}
		}

		// Afficher/Masquer les éléments en fonction des options
		const elementsToShow = options.showForLoggedIn || []
		const elementsToHide = options.hideForLoggedIn || []

		elementsToShow.forEach(selector => {
			const elements = document.querySelectorAll(selector)
			elements.forEach(el => {
				el.style.display = isLoggedIn ? "block" : "none"
			})
		})

		elementsToHide.forEach(selector => {
			const elements = document.querySelectorAll(selector)
			elements.forEach(el => {
				el.style.display = isLoggedIn ? "none" : "block"
			})
		})

		// Callback personnalisé si fourni
		if (options.callback && typeof options.callback === "function") {
			options.callback(isLoggedIn)
		}
	}

	/**
	 * Initialise les comportements d'authentification sur la page
	 * @param {Object} options - Options de configuration
	 */
	static init(options = {}) {
		// Mettre à jour l'interface en fonction de l'état de connexion
		this.updateUI(options)

		// Configurer l'écouteur d'événements pour la déconnexion
		document.addEventListener("DOMContentLoaded", () => {
			const logoutButtons = document.querySelectorAll(".logout-button")
			logoutButtons.forEach(button => {
				button.addEventListener("click", async () => {
					const redirectPath = options.logoutRedirect || "home.html"
					await this.logout(redirectPath)
				})
			})
		})

		// Si la page requiert une authentification, vérifier l'état de connexion
		if (options.requireAuth) {
			this.requireAuth(options.authRedirect)
		}
	}

	/**
	 * Vérifier si l'utilisateur possède une serre
	 * @returns {Promise<boolean>} Promise qui se résout avec True si l'utilisateur possède une serre, sinon False
	 */
	static async requireSerreOwnership() {
		// D'abord vérifier que l'utilisateur est connecté
		if (!this.requireAuth()) {
			return false
		}

		try {
			// Essayer de récupérer les serres de l'utilisateur
			const response = await fetch("http://localhost:3000/api/v1/greenhouse", {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			})

			if (response.ok) {
				const data = await response.json()

				// Si l'utilisateur n'a pas de serre
				if (!data || data.length === 0) {
					// Afficher un message et rediriger vers la page de commande
					this.showNoSerreMessage()
					return false
				} else {
					// Mettre à jour l'ID de la serre courante si nécessaire
					if (!localStorage.getItem("currentSerreId")) {
						localStorage.setItem("currentSerreId", data[0].identifiant_serre)
					}
					return true
				}
			} else {
				// Erreur lors de la récupération des serres
				console.error("Erreur lors de la récupération des serres")
				this.showNoSerreMessage()
				return false
			}
		} catch (error) {
			console.error("Erreur lors de la vérification de la serre:", error)
			this.showNoSerreMessage()
			return false
		}
	}

	/**
	 * Afficher un message indiquant que l'utilisateur n'a pas de serre
	 */
	static showNoSerreMessage() {
		// Si nous sommes sur la page d'affichage ou une autre page qui doit modifier tout le contenu
		const container = document.querySelector(".container") || document.body

		// Sauvegarder le contenu original de la page
		const originalContent = container.innerHTML

		// Créer et afficher le message
		container.innerHTML = `
			<div class="no-serre-message" style="text-align: center; padding: 2rem; max-width: 600px; margin: 0 auto;">
				<h2>Vous n'avez pas encore de serre</h2>
				<p>Pour accéder à cette page, vous devez d'abord commander un kit de capteurs.</p>
				<button id="order-kit-btn" style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 1rem;">Commander un kit</button>
				<button id="cancel-btn" style="background-color: #f44336; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 1rem; margin-left: 10px;">Retour</button>
			</div>
		`

		// Ajouter des gestionnaires d'événements pour les boutons
		document.getElementById("order-kit-btn").addEventListener("click", () => {
			window.location.href = "produit.html"
		})

		document.getElementById("cancel-btn").addEventListener("click", () => {
			container.innerHTML = originalContent
			window.history.back()
		})
	}
}

export default AuthUtils
