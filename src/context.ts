
import { PrismaClient } from "@prisma/client";
// import { Request } from "express";
// import { authenticateUser } from "./auth";
// import { pubSub } from "./pubsub";

const prisma = new PrismaClient();

export type GraphQLContext = {
  prisma: PrismaClient;
  // pubSub: typeof pubSub;
};

export async function contextFactory(): Promise<GraphQLContext> {
  return {
    prisma,
    // pubSub
  };
}