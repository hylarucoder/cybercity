export async function routes(bp, opts, next) {
  bp.addHook("preHandler", function (req, reply, done) {
    console.log("bp, canvas --->");
    done();
  });
  bp.get("/", async (req, res) => {
    res.status(200).send({ data: "index" });
  });
  bp.post("/draw", async (req, res) => {
    res.status(200).send("pong\n");
  });
}
