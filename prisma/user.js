import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();


export class UserPrismaService {

    static async getAllUsers($limit, $skip, query = []) {
        const limit = isNaN(Number($limit)) ? 20 : Number($limit);
        const skip = isNaN(Number($skip)) ? 0 : Number($skip);

        const total = await prisma.users.count();
        const users = await prisma.users.findMany({
            skip: skip,
            take: limit,
            where: {
                OR: query.length > 0 ? query : undefined,
            },
        });

        return {
            total: total,
            limit: limit,
            skip: skip,
            data: users
        };
    }

    static async getUser(email) {
        return prisma.users.findUnique({
            where: { email }
        });
    }

    static async getUserById(id) {
        return prisma.users.findUnique({
            where: { id }
        });
    }

    static async createUser(user) {
        return prisma.users.create({
            data: user
        });
    }

    static async updateUser(id, user) {
        return prisma.users.update({
            where: { id },
            data: user
        });
    }

    static async deleteUser(id) {
        await prisma.users.delete({
            where: { id }
        });
    }
}

async function main() {

}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
    });