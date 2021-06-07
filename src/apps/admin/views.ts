import { buildSchema } from "type-graphql";
import { RootResolver, RootResolver2 } from "./graphql/views";
import { ViewAccount } from "@/apps/admin/account/views";
import { TDate, TDateTime } from "@/graphql/scalar";
import { FastifyInstance } from "fastify";
import { Socket } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { Celery } from "@/plugins/plugin-celery";
import { AuthMiddleware } from "@/apps/admin/auth";
import { ApolloServer } from "apollo-server-fastify";

declare module "fastify" {
  interface FastifyRequest {
    user: string;
  }

  interface FastifyReply {
    myPluginProp: number;
  }

  interface FastifyInstance {
    printAllRoutes: () => void;
    io: Socket;
    prisma: PrismaClient;
    celery: Celery;
  }
}
const users = {
  "Bearer 1": {
    id: 1,
    name: "name",
  },
};

function getUser(req) {
  const auth = req.headers.authorization; // Headers can be provided within GraphQL Playground, e.g { "authorization": "alice" }
  console.log("auth", auth);
  if (users[auth]) {
    return users[auth];
  } else {
    return null;
  }
}

async function createGraphqlHandler() {
  const schema = await buildSchema({
    resolvers: [RootResolver, RootResolver2, ViewAccount],
    scalarsMap: [
      { type: Date, scalar: TDate },
      { type: Date, scalar: TDateTime },
    ],
    globalMiddlewares: [AuthMiddleware],
  });
  const server = new ApolloServer({
    introspection: true,
    playground: true,
    schema,
  });
  await server.start();
  return server.createHandler({
    path: "/graphql",
  });
}

export async function routes(bp: FastifyInstance, opts, next) {
  const handler = await createGraphqlHandler();
  bp.register(handler);
}
