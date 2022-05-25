import { PubSub } from "graphql-subscriptions";
import { TypedPubSub } from "typed-graphql-subscriptions";
import { Artists } from "@prisma/client";


export type Channels = {
    ARTIST_UPDATED: [{updatedArtist: Artists}]
};

export const pubSub = new TypedPubSub<Channels>(new PubSub());