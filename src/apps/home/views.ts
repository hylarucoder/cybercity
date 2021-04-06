import mercurius from "mercurius";
import { RootResolver } from "./graphql/resolver";
import { buildSchema } from "type-graphql";

export async function routes(bp, opts, next) {
  bp.addHook("preHandler", function (req, reply, done) {
    console.log("bp, home --->");
    done();
  });
  bp.get("/", async (req, res) => {
    res.status(200).send({ hello: "world" });
  });
  bp.get("/ping", async (req, res) => {
    res.status(200).send("pong\n");
  });
  bp.get("/ws", { websocket: true }, (
    connection /* SocketStream */,
    req /* FastifyRequest */,
  ) => {
    connection.socket.on("message", (message) => {
      // message === 'hi from client'
      connection.socket.send("hi from server");
    });
  });
  bp.post("/params/:params", {}, function (request, reply) {
    console.log(request.body);
    console.log(request.query);
    console.log(request.params);
    console.log(request.headers);
    console.log(request.raw);
    console.log(request.id);
    console.log(request.ip);
    console.log(request.ips);
    console.log(request.hostname);
    console.log(request.protocol);
    request.log.info("some info");
  });

  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [RootResolver],
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
