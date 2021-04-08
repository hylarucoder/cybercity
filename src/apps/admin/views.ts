import mercurius from "mercurius";
import { buildSchema } from "type-graphql";
import { RootResolver, RootResolver2 } from "./graphql/views";
import { ViewAccount } from "@/apps/admin/account/views";
import { TDate, TDateTime } from "@/graphql/scalar";

export async function routes(bp, opts, next) {
  bp.addHook("preHandler", function (req, reply, done) {
    req.user = "Bob Dylan";
    done();
  });
  const schema = await buildSchema({
    resolvers: [RootResolver, RootResolver2, ViewAccount],
    scalarsMap: [
      { type: Date, scalar: TDate },
      { type: Date, scalar: TDateTime },
    ],
  });
  bp.register(mercurius, {
    schema,
    graphiql: "playground",
  });

  bp.get("/testGraphql", async function (req, reply) {
    const query = "{ add(x: 2, y: 2) }";
    return reply.graphql(query);
  });
}
