import "graphql-import-node";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./schema.graphql";
import { Artists } from "@prisma/client";
import { GraphQLContext } from "./context";

const resolvers = {
  Artist: {
    artistId: (parent: Artists) => parent.artistId,
    name: (parent: Artists) => parent.name,
    albums: (parent: Artists, _args: {}, context: GraphQLContext) =>
      context.prisma.artists
        .findUnique({ where: { artistId: parent.artistId } })
        .albums(),
  },
  Query: {
    artists: async (_parent: unknown, _args: {}, context: GraphQLContext) => {
      return context.prisma.artists.findMany();
    },
  },
  Mutation: {
    updateArtist: (
      _parent: unknown,
      args: { name: string },
      context: GraphQLContext
    ) => {
      const newArtist = context.prisma.artists.create({
        data: {
          name: args.name,
        },
      });
      return newArtist;
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
