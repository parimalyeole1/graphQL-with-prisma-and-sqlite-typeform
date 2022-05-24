import "graphql-import-node";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./schema.graphql";

type Artist = {
  ArtistId: number;
  Name: string;
}

// 2
const artistsTable: Artist[] = [{
  ArtistId: 1,
  Name: 'Shankar Mahadevan'
}]

const resolvers = {
  Artist: {
    ArtistId: (parent: Artist) => parent.ArtistId,
    Name: (parent: Artist) => parent.Name,
  },
  Query: {
    info: () => 'Test',
    artist: () => artistsTable
  },
  Mutation : {
    artist: (_parent: unknown, args: { Name: string }) => {
      // 1
      let idCount = artistsTable.length;

      // 2
      const artist: Artist = {
        ArtistId: idCount+ 1,
        Name: args.Name
      };

      artistsTable.push(artist);

      return artist;
    },
  }
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});