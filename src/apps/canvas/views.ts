// import { drawCard } from "@/service/poster/tmpl_default_card";

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
  bp.get("/template-preview-all", async (req, res) => {
    // return res.view("/views/preview.ejs", {
    //   posters: [
    //     {
    //       b64: (await drawCard()).toBase64(),
    //       title: "海报",
    //       desc: 1024,
    //     },
    //   ],
    // });
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
}
