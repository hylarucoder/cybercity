// 邀请图
import { Artboard, CImage, DText } from "../components";
import { defaultParams } from "./shareParams";
export async function genCardShare(
  params: typeof defaultParams = defaultParams,
) {
  let canvasWidth = 1005;
  let canvasHeight = 945;
  let hWidth = canvasWidth / 2;
  let hHeight = canvasWidth / 2;

  let triWidth = canvasWidth / 3;
  let triHeight = canvasWidth / 3;

  let TMPL = new Artboard(
    "TMPL",
    {
      height: canvasHeight,
      width: canvasWidth,
      quality: 0.85,
    },
    params.background,
    [
      // 中下方
      new CImage("metal", params.avatar, {
        position: { x: 45, y: 504 },
        width: 126,
        height: 126,
        shape: "Circle",
        border: {
          width: 4,
          color: "#FFF",
        },
      }),
      new DText("xxx", params.userName, {
        position: { x: 200, y: 518 },
        fontSize: 42,
        fillStyle: "#FFF",
      }),
      new DText("xxx", params.continuousTotal, {
        position: { x: 200, y: 581 },
        fontSize: 36,
        fillStyle: "#FFF",
      }),

      // 下方
      new CImage("avatar", params.qrcode, {
        position: { x: 780, y: 720 },
        width: 180,
        height: 180,
        shape: "Rect",
      }),
    ],
  );

  await TMPL.draw();
  return TMPL;
}
