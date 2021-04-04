import fp from "fastify-plugin";
import * as chalk from "chalk";

export const PluginBlipp = fp(function (fastify, opts, next) {
  const routes = [];
  let i = 0;

  const { blippLog = console.log } = opts;

  fastify.addHook("onRoute", (routeOptions) => {
    i++;
    routes.push({ ...routeOptions });
  });

  fastify.decorate("blipp", () => {
    if (routes.length === 0) {
      return;
    }

    // sort the routes alphabetically ASC by urls, then by method ASC
    routes.sort((a, b) =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      a.url !== b.url ? a.url > b.url : a.method > b.method,
    );

    let output = "";
    for (const route of routes) {
      let methods = [];
      // one route can support more than one method
      if (!Array.isArray(route.method)) {
        methods.push(route.method);
      } else {
        methods = route.method.sort((a, b) => a > b);
      }

      methods.forEach((method) => {
        output += `${chalk.green(method.toUpperCase())}\t${route.url.replace(
          /(?:\:[\w]+|\[\:\w+\])/g,
          chalk.gray("$&"),
        )}\n`;
      });
    }

    if (routes.length > 0) {
      blippLog(`🏷️  Routes:`);
      blippLog(output);
    }
  });

  next();
});
