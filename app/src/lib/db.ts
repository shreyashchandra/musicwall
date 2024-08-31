import { PrismaClient } from "@prisma/client/extension";

export const prismaClient = new PrismaClient();
// not the best way should generate singleton
