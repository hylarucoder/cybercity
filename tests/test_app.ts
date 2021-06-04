import "reflect-metadata";
import "module-alias/register";
import { test } from "tap";
import { createApp } from "../src/app";

test("GET `/` route", (t) => {
  t.plan(4);

  const app = createApp();

  // At the end of your tests it is highly recommended to call `.close()`
  // to ensure that all connections to external services get closed.
  t.teardown(() => app.close());

  app.inject(
    {
      method: "GET",
      url: "/",
    },
    (err, response) => {
      t.error(err);
      t.equal(response.statusCode, 200);
      t.equal(response.headers["content-type"], "application/json; charset=utf-8");
      t.deepEqual(response.json(), { hello: "world" });
    },
  );
});
