import { PrismaClient } from "@prisma/client";

const db: { prismaInstance: PrismaClient | undefined } = {
  prismaInstance: undefined,
};

export const dbInit = (): PrismaClient => {
  if (db.prismaInstance) {
    return db.prismaInstance;
  }
  db.prismaInstance = new PrismaClient();
  return db.prismaInstance;
};
