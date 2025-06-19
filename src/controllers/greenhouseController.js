import { PrismaClient } from "@prisma/client";
import { asyncWrapper } from "../utils/asyncWrapper.js";

const prisma = new PrismaClient();

// Générer un ID unique pour une serre
export const generateSerreId = asyncWrapper(async (req, res) => {
  // Générer un identifiant unique de 8 caractères
  const generateId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  let identifiant_serre;
  let isUnique = false;

  // Vérifier que l'ID généré est unique
  while (!isUnique) {
    identifiant_serre = generateId();

    // Vérifier si cet ID existe déjà
    const existingSerre = await prisma.serre.findUnique({
      where: { identifiant_serre },
    });

    if (!existingSerre) {
      isUnique = true;
    }
  }

  res.status(200).json({
    success: true,
    identifiant_serre,
  });
});

// Créer une nouvelle serre
export const createSerre = asyncWrapper(async (req, res) => {
  const { identifiant_serre, nom, description } = req.body;
  const userId = req.user.userId;
  console.log(req.body);
  // Vérifier que l'utilisateur est connecté
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentification requise",
    });
  }

  // Créer la serre
  const newSerre = await prisma.serre.create({
    data: {
      identifiant_serre,
      nom: nom || "Ma Serre",
      description: description || "Serre automatisée",
      user_id: userId,
    },
  });

  res.status(201).json({
    success: true,
    message: "Serre créée avec succès",
    serre: newSerre,
  });
});

// Récupérer toutes les serres d'un utilisateur
export const getUserSerres = asyncWrapper(async (req, res) => {
  const userId = req.user.userId;

  const serres = await prisma.serre.findMany({
    where: { user_id: userId },
  });

  res.status(200).json({
    success: true,
    serres,
  });
});

// Récupérer une serre par ID
export const getSerreById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  const serre = await prisma.serre.findFirst({
    where: {
      identifiant_serre: id,
      user_id: userId,
    },
  });

  if (!serre) {
    return res.status(404).json({
      success: false,
      message: "Serre non trouvée",
    });
  }

  res.status(200).json({
    success: true,
    serre,
  });
});

// Supprimer une serre
export const deleteSerre = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  // Vérifier que la serre appartient à l'utilisateur
  const serre = await prisma.serre.findFirst({
    where: {
      identifiant_serre: id,
      user_id: userId,
    },
  });

  if (!serre) {
    return res.status(404).json({
      success: false,
      message: "Serre non trouvée",
    });
  }

  // Supprimer la serre
  await prisma.serre.delete({
    where: { id: serre.id },
  });

  res.status(200).json({
    success: true,
    message: "Serre supprimée avec succès",
  });
});

// Mettre à jour une serre
export const updateSerre = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { nom, description } = req.body;

  // Vérifier que la serre appartient à l'utilisateur
  const serre = await prisma.serre.findFirst({
    where: {
      identifiant_serre: id,
      user_id: userId,
    },
  });

  if (!serre) {
    return res.status(404).json({
      success: false,
      message: "Serre non trouvée",
    });
  }

  // Mettre à jour la serre
  const updatedSerre = await prisma.serre.update({
    where: { id: serre.id },
    data: {
      nom: nom || serre.nom,
      description: description || serre.description,
    },
  });

  res.status(200).json({
    success: true,
    message: "Serre mise à jour avec succès",
    serre: updatedSerre,
  });
});
