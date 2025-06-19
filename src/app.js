// @ts-nocheck
import express from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import usersRouter from "./routes/user.js";
import serialRouter from "./routes/serial.js";
import greenhouseRouter from "./routes/greenhouse.js";
import sensorsRouter from "./routes/sensors.js";
import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";
import { setupSocketIO } from "./websocket/socketHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));
app.use(cookieParser());

// Servir les fichiers statiques
app.use("/style", express.static(path.join(__dirname, "../style")));
app.use("/script", express.static(path.join(__dirname, "../script")));
app.use("/image", express.static(path.join(__dirname, "../image")));

// Route pour la page home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../vue/home.html"));
});

// Route pour la page home explicite
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "../vue/home.html"));
});

// Routes pour les autres pages
app.get("/connexion", (req, res) => {
  res.sendFile(path.join(__dirname, "../vue/connexionUtilisateur.html"));
});

app.get("/inscription", (req, res) => {
  res.sendFile(path.join(__dirname, "../vue/inscription.html"));
});

app.get("/produit", (req, res) => {
  res.sendFile(path.join(__dirname, "../vue/produit.html"));
});

app.get("/profil", (req, res) => {
  res.sendFile(path.join(__dirname, "../vue/profil.html"));
});

app.get("/gestion", (req, res) => {
  res.sendFile(path.join(__dirname, "../vue/gestion.html"));
});

app.get("/donnees", (req, res) => {
  res.sendFile(path.join(__dirname, "../vue/donnees.html"));
});

app.get("/affichage", (req, res) => {
  res.sendFile(path.join(__dirname, "../vue/affichage.html"));
});

app.get("/tos", (req, res) => {
  res.sendFile(path.join(__dirname, "../vue/tos.html"));
});

app.get("/mdp-oublie", (req, res) => {
  res.sendFile(path.join(__dirname, "../vue/mdpOublie.html"));
});

// Route pour servir le header HTML
app.get("/api/header", (req, res) => {
  res.sendFile(path.join(__dirname, "../vue/header.html"));
});

// Route pour servir le footer HTML
app.get("/api/footer", (req, res) => {
  res.sendFile(path.join(__dirname, "../vue/footer.html"));
});

app.use("/", usersRouter);
app.use("/", serialRouter);
app.use("/", greenhouseRouter);
app.use("/api/v1/sensors", sensorsRouter);

app.use(notFound);
app.use(errorHandler);

const httpServer = createServer(app);

// Initialiser Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Configuration des événements Socket.IO
setupSocketIO(io);

const port = process.env.PORT || 3000;
const start_server = async () => {
  try {
    await prisma.$connect();
    httpServer.listen(port, () => {
      console.log(`Le serveur est en écoute sur http://localhost:${port}`);
      console.log(`WebSocket disponible sur ws://localhost:${port}`);
    });
  } catch (e) {
    console.error("Error launching the server: ", e);
    process.exit(1);
  }
};

start_server();
