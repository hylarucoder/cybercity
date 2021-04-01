// 补签卡
import { Poster, CImage, DText } from "../../utils/canvas/components";
import { defaultParams } from "./remedyParams";
export async function genCardRemedy(
  params: typeof defaultParams = defaultParams,
) {
  let defaultBackground =
    "http://staticqc-schedule.yiqishequn.com/img/remedy-save-img.8bdb4af3.png";
  let canvasWidth = 924;
  let canvasHeight = 1149;
  let hWidth = canvasWidth / 2;
  let hHeight = canvasWidth / 2;

  let triWidth = canvasWidth / 3;
  let triHeight = canvasWidth / 3;

  let TMPL = new Poster(
    "TMPL",
    {
      height: canvasHeight,
      width: canvasWidth,
      quality: 0.85,
    },
    defaultBackground,
    [
      new CImage("qrcode", params.qrcode, {
        position: { x: 705, y: 915 },
        width: 180,
        height: 180,
        shape: "Rect",
      }),
    ],
  );

  await TMPL.draw();
  return TMPL;
}
