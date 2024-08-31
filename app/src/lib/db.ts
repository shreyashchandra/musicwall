import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient();
// not the best way should generate singleton
