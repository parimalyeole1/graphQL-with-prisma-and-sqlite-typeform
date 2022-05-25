import "graphql-import-node";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./schema.graphql";
import { Artists, Prisma } from "@prisma/client";
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
    artistList: async (
      _parent: unknown,
      args: {
        filter?: string;
        skip?: number;
        take?: number;
        orderBy?: {
          name?: Prisma.SortOrder;
        };
      },
      context: GraphQLContext
    ) => {
      const where = args.filter
        ? {
            OR: [{ name: { contains: args.filter } }],
          }
        : {};
      const totalCount = await context.prisma.artists.count({ where });
      const artists = await context.prisma.artists.findMany({
        where,
        skip: args.skip || 0,
        take: args.take || 20,
        orderBy: args.orderBy,
      });
      return {
        count: totalCount,
        artists,
      };
    },
    artist: async (
      _parent: unknown,
      args: Pick<Artists, "artistId">,
      context: GraphQLContext
    ) => {
      const artist = await context.prisma.artists.findFirst({
        where: {
          artistId: parseInt(args.artistId.toString()),
        },
      });
      return artist
    },
  },
  Mutation: {
    updateArtist: async (
      _parent: unknown,
      args: Pick<Artists, "artistId" | "name">,
      context: GraphQLContext
    ) => {
      const { artistId, name } = args;
      const artistResult = await context.prisma.artists.findUnique({where: {artistId:parseInt(artistId.toString())}})
      if(!artistResult){
        throw new Error(`Artist with artistId:${artistId} not found!`)
      }
      const newArtist = await context.prisma.artists.update({
        where: { artistId: parseInt(artistId.toString()) },
        data: { name: name },
      });
      return newArtist;
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
