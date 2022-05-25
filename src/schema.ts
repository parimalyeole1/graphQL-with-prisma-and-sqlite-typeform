import "graphql-import-node";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./schema.graphql";
import { Artists, Prisma } from "@prisma/client";
import { GraphQLContext } from "./context";
import { Channels } from "./pubsub";
import { withFilter } from "graphql-subscriptions";
import { getInt } from "./utils";

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
          artistId: getInt(args.artistId)
        },
      });
      return artist;
    },
  },
  Mutation: {
    updateArtist: async (
      _parent: unknown,
      args: Pick<Artists, "artistId" | "name">,
      context: GraphQLContext
    ) => {
      const { artistId, name } = args;
      const artistResult = await context.prisma.artists.findUnique({
        where: { artistId: getInt(artistId) },
      });
      if (!artistResult) {
        throw new Error(`Artist with artistId:${artistId} not found!`);
      }
      const newArtist = await context.prisma.artists.update({
        where: { artistId: getInt(artistId) },
        data: { name: name },
      });
      context.pubSub.publish("ARTIST_UPDATED", { updatedArtist: newArtist });
      return newArtist;
    },
  },
  Subscription: {
    listenToArtist: {
      subscribe: withFilter(
        (_parent: unknown, _args: {}, context: GraphQLContext) =>
          context.pubSub.asyncIterator("ARTIST_UPDATED"),
        (payload: { updatedArtist: Artists }, variables) => {
          return (
            getInt(payload.updatedArtist.artistId) ===
            getInt(variables.artistId)
          );
        }
      ),
      resolve: (payload: Channels["ARTIST_UPDATED"][0]) => {
        return payload.updatedArtist;
      },
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
