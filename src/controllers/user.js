import { UserService } from "../services/user.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { validationResult } from "express-validator";
import { AuthService } from "../services/authService.js";

// Récupérer tous les utilisateurs
export const getAllUsers = asyncWrapper(async (req, res, next) => {
    let { $limit, $skip } = req.query;
    const limit = parseInt($limit);
    const skip = parseInt($skip);

    const searchConditions = Array.isArray(req.query.$or) ? req.query.$or.map(condition => {
        const field = Object.keys(condition)[0];
        const regex = condition[field].$regex;
        const options = condition[field].$options;
        return {
            [field]: {
                contains: regex,
                mode: options === 'i' ? 'insensitive' : 'sensitive'
            }
        };
    }) : [];
    const users = await UserService.getAllUsers(limit, skip, searchConditions);
    if (!users) {
        throw new Error("No users found");
    }
    return res.status(200).json(users);
});

// Récupérer un utilisateur par email
export const getUser = asyncWrapper(async (req, res, next) => {
    const email = req.params.email;
    const user = await UserService.getUser(email);
    if (!user) {
        throw new Error("User not found");
    }
    return res.status(200).json(user);
});

// Créer un utilisateur
export const createUser = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new Error(JSON.stringify(errors.array()));
    }
    const userToCreate = req.body;
    const { user, token } = await AuthService.register(userToCreate);
    return res.status(201).json({ user, token });
});

// Connexion utilisateur
export const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await UserService.getUser(email);
    if (!user) {
        throw new Error("User not found");
    }
    const result = await AuthService.login(email, password);
    if (!result) {
        throw new Error("Invalid login credentials");
    }
    return res.status(200).json(result);
});

// Déconnexion utilisateur
export const logout = asyncWrapper(async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        throw new Error("Token required");
    }
    await AuthService.logout(token);
    res.status(200).json({ message: 'Logged out successfully' });
});

// Récupérer un utilisateur par ID
export const getUserById = asyncWrapper(async (req, res, next) => {
    const userId = parseInt(req.params.id, 10);
    const user = await UserService.getUserById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    return res.status(200).json(user);
});

// Mettre à jour un utilisateur
export const updateUser = asyncWrapper(async (req, res, next) => {
    const userId = parseInt(req.params.id, 10);
    const userData = req.body;
    const updatedUser = await UserService.updateUser(userId, userData);
    if (!updatedUser) {
        throw new Error("User not found");
    }
    return res.status(200).json(updatedUser);
});

// Supprimer un utilisateur
export const deleteUser = asyncWrapper(async (req, res, next) => {
    const userId = parseInt(req.params.id, 10);
    const user = await UserService.getUserById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    await UserService.deleteUser(userId);
    return res.status(204).json({ message: "User deleted successfully" });
});