import { Artboard, CImage, DRect, DText, HTransform } from "../../../../utils/canvas/components";
import { defaultParams } from "./base";

export async function drawCardPunch_P3_005(
  params: typeof defaultParams = defaultParams,
) {
  let canvasWidth = 1125;
  let canvasHeight = 1125;
  let hWidth = canvasWidth / 2;
  let hHeight = canvasWidth / 2;

  let triWidth = canvasWidth / 3;
  let triHeight = canvasWidth / 3;

  let isMorning = params.period == "MORNING";

  const month = params.date.slice(5, 7);
  const year = params.date.slice(0, 4);
  const day = params.date.slice(8, 10);

  let TMPL = new Artboard(
    "TMPL",
    {
      height: canvasHeight,
      width: canvasWidth,
      quality: 0.85,
    },
    "",
    [
      new DRect("backgroundColor", {
        position: { x: 0, y: 0 },
        width: canvasWidth,
        height: canvasHeight,
        fillStyle: "#ffffff",
        radius: 0,
        alpha: 1,
      }),
      new CImage("landscapePic", params.background, {
        position: { x: 44, y: 44 },
        width: 1037,
        height: 659,
        shape: "SlicingRect",
      }),
      new DText("continueTip", isMorning ? "连续早起第" : "连续早睡第", {
        position: { x: 450, y: 1056 },
        fontSize: 26,
        fillStyle: "#000000",
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      }),
      new DText(
        "continuousTotal",
        params.totalContinuous,
        {
          position: { x: 583, y: 1056 },
          fontSize: 26,
          fillStyle: "#000000",
          shadowBlur: 0,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
        },
        true,
      ),
      // 通过 transformMeasureCoord 使得坐标系落在结尾处
      new DText("xxx", "天", {
        position: { x: 2, y: -38 },
        fontSize: 25,
        fillStyle: "#000000",
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      }),
      new HTransform(),
      new DText("day", day, {
        position: { x: 88, y: 554 },
        fontSize: 79,
        fillStyle: "#fff",
      }),
      new DText("yearMonth", `${year}.${month}`, {
        position: { x: 89, y: 650 },
        fontSize: 26,
        fillStyle: "#fff",
      }),
      new DText("xxx", params.beautifulWordsPart1, {
        position: { x: 44, y: 747 },
        fontSize: 35,
        fillStyle: "#000000",
        letterSpacing: 10,
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      }),
      new DText("xxx", params.beautifulWordsPart2, {
        position: { x: 44, y: 805 },
        fontSize: 36,
        fillStyle: "#000000",
        letterSpacing: 10,
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      }),
      //  右下
      new DText("welcomeMessage1", "扫码和我", {
        position: { x: 990, y: 931 },
        fontSize: 22,
        fillStyle: "#000000",
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      }),
      new DText("welcomeMessage2", isMorning ? "互道早安" : "互道晚安", {
        position: { x: 990, y: 961 },
        fontSize: 22,
        fillStyle: "#000000",
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      }),
      new CImage("qrcode", params.qrcode, {
        position: { x: 989, y: 989 },
        width: 92,
        height: 92,
        shape: "Rect",
      }),
    ],
  );

  await TMPL.draw();
  return TMPL;
}