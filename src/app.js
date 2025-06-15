import express from "express"
import { createServer } from "http"
import cookieParser from "cookie-parser"
import logger from "morgan"
import cors from "cors"
import { notFound } from "./middlewares/notFound.js"
import { errorHandler } from "./middlewares/errorHandler.js"
import usersRouter from "./routes/user.js"
import serialRouter from "./routes/serial.js"
import { PrismaClient } from "@prisma/client"
import { Server } from "socket.io"
import { setupSocketIO } from "./websocket/socketHandler.js"

const prisma = new PrismaClient()
const app = express()

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({ origin: "*" }))
app.use(cookieParser())

app.use("/", usersRouter)
app.use("/", serialRouter)

app.use(notFound)
app.use(errorHandler)

const httpServer = createServer(app)

// Initialiser Socket.IO
const io = new Server(httpServer, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
})

// Configuration des événements Socket.IO
setupSocketIO(io)

const port = process.env.PORT || 3000
const start_server = async () => {
	try {
		await prisma.$connect()
		httpServer.listen(port, () => {
			console.log(`Le serveur est en écoute sur http://localhost:${port}`)
			console.log(`WebSocket disponible sur ws://localhost:${port}`)
		})
	} catch (e) {
		console.error("Error launching the server: ", e)
		process.exit(1)
	}
}

start_server()
