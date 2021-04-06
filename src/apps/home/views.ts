import mercurius from "mercurius";
import { RootResolver } from "./graphql/resolver";
import { buildSchema } from "type-graphql";
import { FastifyInstance } from "fastify";

export async function routes(bp: FastifyInstance, opts, next) {
  bp.addHook("preHandler", function (req, reply, done) {
    bp.log.info("bp, home --->");
    done();
  });
  bp.get("/", async (req, res) => {
    res.status(200).send({ hello: "world" });
  });
  bp.get("/ping", async (req, res) => {
    res.status(200).send("pong\n");
  });
  bp.get("/ws", { websocket: true }, (connection /* SocketStream */, req /* FastifyRequest */) => {
    connection.socket.on("message", (message) => {
      // message === 'hi from client'
      connection.socket.send("hi from server");
    });
  });

  bp.io.on("connection", (socket) => {
    socket.on("drawing", (data) => socket.broadcast.emit("drawing", data));
  });
  bp.get("/whiteboard", async function (request, reply) {
    return reply.view("/views/whiteboard.ejs");
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
