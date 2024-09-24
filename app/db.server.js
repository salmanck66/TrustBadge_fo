// db.server.js
import { PrismaClient } from "@prisma/client";

let prisma;

if (!global.__db__) {
  prisma = new PrismaClient();
  if (process.env.NODE_ENV === "development") global.__db__ = prisma;
  prisma.$connect();
}

export { prisma };
