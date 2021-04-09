import mercurius from "mercurius";
import { buildSchema } from "type-graphql";
import { RootResolver, RootResolver2 } from "./graphql/views";
import { ViewAccount } from "@/apps/admin/account/views";
import { TDate, TDateTime } from "@/graphql/scalar";
import { FastifyInstance } from "fastify";
import { Socket } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { Celery } from "@/plugins/plugin-celery";
import { AuthMiddleware } from "@/apps/admin/auth";

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

export async function routes(bp: FastifyInstance, opts, next) {
  const schema = await buildSchema({
    resolvers: [RootResolver, RootResolver2, ViewAccount],
    scalarsMap: [
      { type: Date, scalar: TDate },
      { type: Date, scalar: TDateTime },
    ],
    globalMiddlewares: [AuthMiddleware],
  });
  bp.register(mercurius, {
    schema,
    graphiql: "playground",
  });

  bp.addHook("preHandler", function (req, reply, done) {
    // TODO: fetch user in restful?
    done();
  });

  bp.get("/testGraphql", async function (req, reply) {
    const query = "{ add(x: 2, y: 2) }";
    return reply.graphql(query);
  });
}
