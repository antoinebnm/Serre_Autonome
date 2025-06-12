import { AuthService } from "../services/authService.js"
import { prisma } from "../../prisma/user.js"

export const authMiddleware = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization
		if (!authHeader) {
			return res.status(401).json({ message: "No token provided" })
		}

		const token = authHeader.split(" ")[1]
		try {
			const decoded = await AuthService.verifyToken(token)

			// Vérifier que l'utilisateur existe toujours dans la base de données
			const user = await prisma.users.findUnique({
				where: { id: parseInt(decoded.userId) },
			})

			if (!user) {
				return res.status(401).json({ message: "User not found" })
			}

			req.user = { userId: user.id }
			next()
		} catch (error) {
			return res.status(401).json({ message: error.message })
		}
	} catch (error) {
		res.status(401).json({ message: "Invalid token" })
	}
}
