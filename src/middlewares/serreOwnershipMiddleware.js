import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Middleware pour vérifier que l'utilisateur connecté possède la serre demandée
 * Ce middleware doit être utilisé après authMiddleware
 */
export const serreOwnershipMiddleware = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    
    // Récupérer l'ID de serre depuis les paramètres, query ou body
    const serreId = req.params.serreId || req.query.serreId || req.body.serreId;
    
    if (!serreId) {
      return res.status(400).json({
        success: false,
        message: "ID de serre requis",
      });
    }

    // Vérifier que la serre existe et appartient à l'utilisateur
    const serre = await prisma.serre.findFirst({
      where: {
        identifiant_serre: serreId,
        user_id: userId,
      },
    });

    if (!serre) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé : cette serre ne vous appartient pas",
      });
    }

    // Ajouter les informations de la serre à la requête pour usage ultérieur
    req.serre = serre;
    next();
  } catch (error) {
    console.error("Erreur dans serreOwnershipMiddleware:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    });
  }
};
