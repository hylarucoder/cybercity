import { ApolloServer, gql } from "apollo-server-fastify";
import { RootResolver } from "./graphql/resolver";
import { buildSchema } from "type-graphql";
import { FastifyInstance } from "fastify";

async function createGraphqlHandler() {
  // build TypeGraphQL executable schema
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
  const handler = server.createHandler({
    path: "/graphql",
  });
  return handler;
}

export async function routes(bp: FastifyInstance, opts, next) {
  bp.addHook("preHandler", function(req, reply, done) {
    bp.log.info("bp, home --->");
    done();
  });
  bp.get("/", async (req, res) => {
    res.status(200).send({ hello: "world" });
  });
  bp.get("/ws", { websocket: true }, (connection /* SocketStream */, req /* FastifyRequest */) => {
    connection.socket.on("message", (message) => {
      // message === 'hi from client'
      connection.socket.send("hi from server");
    });
  });
  bp.post("/params/:params", {}, function(request, reply) {
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
  bp.get("/whiteboard", async function(request, reply) {
    return reply.view("/views/whiteboard.ejs");
  });
  const handler = await createGraphqlHandler();
  bp.register(handler);
}
