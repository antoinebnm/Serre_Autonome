import { AuthService } from '../services/authService.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = await AuthService.verifyToken(token);
            req.user = { userId: parseInt(String(decoded.userId)) };
            next();
        } catch (error) {
            return res.status(401).json({ message: error.message });
        }
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};