import { AuthService } from "../services/authService.js";
import { prisma } from "../../prisma/user.js";

const verifyAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decoded = await AuthService.verifyToken(token);
    req.user = decoded;

    const user = await prisma.users.findUnique({
        where: { id: req.user.userId }
    });
    if (user?.role !== 'admin') {
        return res.status(403).json({ error: 'Accès refusé' });
    }
    next();
};

export { verifyAdmin };