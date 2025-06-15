import { UserPrismaService } from "../../prisma/user.js";

export class UserService {
    static async getAllUsers($limit, $skip, query) {
        return await UserPrismaService.getAllUsers($limit, $skip, query);
    }

    static async getUser(email) {
        return await UserPrismaService.getUser(email);
    }

    static async getUserById(id) {
        return await UserPrismaService.getUserById(id);
    }

    static async createUser(user) {
        return await UserPrismaService.createUser(user);
    }

    static async updateUser(id, user) {
        return await UserPrismaService.updateUser(id, user);
    }

    static async deleteUser(id) {
        return await UserPrismaService.deleteUser(id);
    }
}