import fp from "fastify-plugin";
import * as socketio from "socket.io";

export const PluginSocketIO = fp(
  async function (app, opts) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    app.decorate("io", socketio(app.server, opts));
    app.addHook("onClose", (app, done) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      app.io.close();
      done();
    });
  },
  { fastify: "3.x" },
);
