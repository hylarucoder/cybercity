import { ApolloServer } from "apollo-server-fastify";

import { buildSchema } from "type-graphql";
import { RootResolver } from "./graphql/resolver";

async function createGraphqlHandler() {
  const schema = await buildSchema({
    resolvers: [RootResolver],
  });
  const server = new ApolloServer({
    schema,
    tracing: true,
    introspection: true,
    playground: true,
  });
  await server.start();
  return server.createHandler({
    path: "/graphql",
  });
}

export async function routes(bp, opts, next) {
  const handler = await createGraphqlHandler();
  bp.register(handler);
}
