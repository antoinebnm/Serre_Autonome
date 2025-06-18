import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  generateSerreId,
  createSerre,
  getUserSerres,
  getSerreById,
  deleteSerre,
  updateSerre,
} from "../controllers/greenhouseController.js";

const router = express.Router();

// Route pour générer un ID unique de serre
router.get("/api/v1/greenhouse/generate-id", authMiddleware, generateSerreId);

// Routes CRUD pour les serres
router
  .route("/api/v1/greenhouse")
  .get(authMiddleware, getUserSerres)
  .post(authMiddleware, createSerre);

router
  .route("/api/v1/greenhouse/:id")
  .get(authMiddleware, getSerreById)
  .patch(authMiddleware, updateSerre)
  .delete(authMiddleware, deleteSerre);

export default router;
