import { pubSub } from "./pubsub";
import { dbInit } from "./database";
import { PrismaClient } from "@prisma/client";

export type GraphQLContext = {
  prisma: PrismaClient;
  pubSub: typeof pubSub;
};

export async function contextFactory(): Promise<GraphQLContext> {
  console.log('===>contexFactory init');
  
  return {
    prisma: dbInit(),
    pubSub,
  };
}
