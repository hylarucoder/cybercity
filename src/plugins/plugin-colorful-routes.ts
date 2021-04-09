import fp from "fastify-plugin";

export const PluginColorfulRoutes = fp(function (app, opts, next) {
  const routes = [];
  app.addHook("onRoute", (routeOptions) => {
    routes.push({ ...routeOptions });
  });

  app.decorate("printAllRoutes", () => {
    if (routes.length === 0) {
      return;
    }

    // sort the routes alphabetically ASC by urls, then by method ASC
    routes.sort((a, b) =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      a.url !== b.url ? a.url > b.url : a.method > b.method,
    );

    app.log.info(`-> routes`)
    for (const route of routes) {
      let methods = [];
      // one route can support more than one method
      if (!Array.isArray(route.method)) {
        methods.push(route.method);
      } else {
        methods = route.method.sort((a, b) => a > b);
      }
      app.log.info(`${route.method.toString().padStart(8)} - ${route.url}`)
    }
  });

  next();
});
