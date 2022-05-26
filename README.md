<details>
<summary>Problem Statement</summary>
This sandbox is a skeleton for a simple GraphQL server application. Please fork this sandbox and build out the functionality described below. Here's a few things to keep in mind:

- The sandbox includes a sample SQLite database. See [here](https://www.sqlitetutorial.net/sqlite-sample-database) for more information about the sample database, including a diagram of the available tables. You should only need to work with the `artists` and `albums` tables.
- For convenience, the sandbox already has `sqlite` as a dependency and already exposes a [Database](https://github.com/kriasoft/node-sqlite/blob/master/docs/classes/_src_database_.database.md) instance through the resolver context for querying the database. However, you can use any database driver, ORM or query builder you're comfortable with to query the database.
- The existing schema is created using `graphql-js`, but you're welcome to use whatever library to create the schema that you'd like.
- Your schema will be a reflection of how you approach schema design. It should utilize whatever conventions and design patterns you feel are important for a production application.

Your forked sandbox should implement the following functionality:

- The ability to query all artists and the albums for each artist
- The ability to update an artist's name
- The ability to subscribe to changes to an individual artist
</details>

### Solution 

#### Folder structure in porject

```
  |-database.db
  |-.env
  |-.gitignore
  |-package.json
  |-tsconfig.json
  |-prisma
  |  |-schema.prisma
  |-src
  |  |-schema.graphql
  |  |-schema.ts
  |  |-pubsub.ts
  |  |-database.ts
  |  |-context.ts
  |  |-utils.ts
  |  |-server.ts
  |  |-index.ts
  ```

- Using Prisma ORM for connecting to sqlite db.
   - `schema.prisma` file defines Table schema and table relation.
   - `npx prisma generate` or `yarn create:prisma:client`  creates  **Prisma Client**: An auto-generated and type-safe query builder for Node.js
        - run this command when you make changes to `schema.prisma` file
   - `npx prisma studio` or `yarn start:prisma:studio` : this start GUI to view and edit data in your database.
- `schema.graphql` file A GraphQL schema can be written with GraphQL SDL (defines servers graphql contract)
- `schema.ts` file define actual executable schema and data resolver
- `pubsub.ts` file is using `graphql-subscriptions` package to create memory based pubsub for our subscriptions
   - memory based pubsub is not ideal for production app or when we run app's multiple isntace with cluster module
   - `graphql-subscriptions` package can be extended to work with redis, google pubsub, RabbitMQ etc. to avoid above mentioned issue.
- `database.ts` initialising db connection with Prisma client
- `context.ts` managing graphQL context (hold Db connection and pubsub channels)

### How to start project
 - Clone repo
 - `yarn install`
 - `yarn dev` will start server in development mode
 - `yarn start` will start project.

 ### Try example Quries

> Query all the Artist with Albums
```
query {
  artistList {
	count
    artists {
      artistId
      name
      albums {
        title
      }
    }
  }
}
```
> Query artist list with pagination
```
query {
  artistList(skip: 5, take: 20) {
	count
    artists {
      artistId
      name
      albums {
        title
      }
    }
  }
}
```
> Query artist list and filter on name
```
query {
  artistList(filter: "Mar") {
	count
    artists {
      artistId
      name
      albums {
        title
      }
    }
  }
}
```

> Query artist list and order by name
```
query {
  artistList(orderBy: {name: desc}) {
		count
    artists {
      artistId
      name
      albums {
        title
      }
    }
  }
}
```

> Query Artist list with filter, pagination, orderby
```
query {
  artistList(filter: "Mar", skip: 3, take: 5, orderBy: {name: desc}) {
		count
    artists {
      artistId
      name
      albums {
        title
      }
    }
  }
}
```

> Query Artist by artistId
```
query {
  artist(artistId: 103){
    artistId
    name
    albums {
      title
    }
  }
}
```
> Update Artist name by artistId
```
mutation {
  updateArtist(artistId: "103", name: "Marisa Monte + ABC") {
    artistId
    name
    albums{
      title
    }
  }
}
```

> Subscribe to changes to an individual artist 
```
subscription{
  listenToArtist(artistId:103){
    artistId
    name
    albums{
      title
    }
  }
}
```
and then do mutation
```
mutation {
  updateArtist(artistId: "103", name: "Marisa Monte + ABCD") {
    artistId
    name
    albums{
      title
    }
  }
}
```

#### Addition Note
- .env file is commited so this sandbox should work properly
- `schema.prisma` file has all the table schema but we are only working on Artists and Albums
- Error handling can be better for production.
