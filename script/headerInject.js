import AuthUtils from "./authUtils.js"

fetch("../vue/header.html")
	.then(response => response.text())
	.then(data => {
		const nav = document.getElementById("nav-container")
		nav.innerHTML = data

		// Apply saved theme
		const savedTheme = localStorage.getItem("theme")
		if (savedTheme === "dark") {
			document.body.classList.add("dark-mode")
		} else if (savedTheme === "light") {
			document.body.classList.remove("dark-mode")
		}

		// Toggle listener
		const toggle = document.getElementById("theme-toggle")
		if (toggle) {
			toggle.addEventListener("click", () => {
				document.body.classList.toggle("dark-mode")
				const isDark = document.body.classList.contains("dark-mode")
				localStorage.setItem("theme", isDark ? "dark" : "light")
			})
		}

		// Configuration du bouton de déconnexion
		const authLink = document.getElementById("auth-link")
		if (authLink) {
			if (AuthUtils.isLoggedIn()) {
				authLink.textContent = "Déconnexion"
				authLink.href = "javascript:void(0);"
				authLink.addEventListener("click", async () => {
					try {
						await AuthUtils.logout()
						// Redirection vers la page d'accueil après déconnexion
						window.location.href = "../vue/home.html"
					} catch (error) {
						console.error("Erreur lors de la déconnexion:", error)
					}
				})
			} else {
				authLink.textContent = "Inscription/Connexion"
				authLink.href = "inscription.html"
			}
		}

		// Gestion de l'affichage du menu en fonction de l'authentification
		AuthUtils.updateUI({
			showForLoggedIn: [
				'.nav-links li a[href="affichage.html"]',
				'.nav-links li a[href="gestion.html"]',
				'.nav-links li a[href="profil.html"]',
			],
			callback: isLoggedIn => {
				// Si on est sur la page d'accueil et qu'on n'est pas connecté, masquer certains liens
				const isHomePage =
					window.location.pathname.includes("home.html") ||
					window.location.pathname.endsWith("/") ||
					window.location.pathname.endsWith("/vue/")

				if (isHomePage && !isLoggedIn) {
					// Cacher les liens du menu qui nécessitent une connexion
					document
						.querySelectorAll(
							'.nav-links li a[href="affichage.html"], .nav-links li a[href="gestion.html"], .nav-links li a[href="profil.html"]'
						)
						.forEach(el => {
							el.parentElement.style.display = "none"
						})
				}
			},
		})
	})
	.catch(err => {
		console.error("Erreur de chargement du nav:", err)
	})

//---- Easy access below without having to read the code ----
//<nav id="nav-container"></nav>
//<script type="module" src="../script/headerInject.js"></script>
