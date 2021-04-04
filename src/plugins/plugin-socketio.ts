import fp from "fastify-plugin";
import * as socketio from "socket.io";

export const PluginSocketIO = fp(
  async function (fastify, opts) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fastify.decorate("io", socketio(fastify.server, opts));
    fastify.addHook("onClose", (fastify, done) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fastify.io.close();
      done();
    });
  },
  { fastify: "3.x" },
);
