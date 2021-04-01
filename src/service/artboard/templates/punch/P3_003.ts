import {
  Artboard,
  CImage,
  DLine,
  DRect,
  DText,
  HTransform,
} from "../../components";
import { defaultParams } from "./base";
import { humanizeWeekday } from "../../../../utils/time";

export async function drawCardPunch_P3_003(
  params: typeof defaultParams = defaultParams,
) {
  let canvasWidth = 1125;
  let canvasHeight = 1125;
  let hWidth = canvasWidth / 2;
  let hHeight = canvasWidth / 2;

  let triWidth = canvasWidth / 3;
  let triHeight = canvasWidth / 3;

  let earlierThanNumber = Math.floor(params.totalEarlierThan / 10000) + "万";
  let isMorning = params.period == "MORNING";

  let earlierThan = isMorning
    ? `比${earlierThanNumber}人起得早`
    : `比${earlierThanNumber}人睡得早`;
  const month = params.date.slice(5, 7);
  const year = params.date.slice(0, 4);
  const day = params.date.slice(8, 10);
  const weekday = humanizeWeekday(params.date);
  const time = params.time.slice(0, 5);

  let TMPL = new Artboard(
    "TMPL",
    {
      height: canvasHeight,
      width: canvasWidth,
      quality: 0.85,
    },
    "",
    [
      //  左上方
      new CImage("background", params.backgroundBlurred, {
        position: { x: 0, y: 0 },
        width: canvasWidth,
        height: canvasHeight,
        shape: "Rect",
      }),
      new DRect("backgroundColor", {
        position: { x: 0, y: 817 },
        width: 1125,
        height: 308,
        fillStyle: "rgba(0,0,0,.35)",
        radius: 0,
        alpha: 1,
      }),
      new CImage("avatar", params.avatar, {
        position: { x: 44, y: 915 },
        border: {
          width: 4,
          color: "#fff",
        },
        width: 132,
        height: 132,
        shape: "Circle",
      }),
      //  左下
      new DText("continueTip", isMorning ? "坚持早起" : "坚持早睡", {
        position: { x: 522, y: 915 },
        fontSize: 31,
        fillStyle: "#FFF",
        shadowBlur: 0,
        shadowOffsetY: 0,
      }),
      new DText(
        "continuousTotal",
        params.totalContinuous,
        {
          position: { x: 522, y: 966 },
          fontSize: 79,
          fillStyle: "#FFF",
          fontWeight: "bold",
        },
        true,
      ),
      // 通过 transformMeasureCoord 使得坐标系落在结尾处
      new DText("continueUnit", "天", {
        position: { x: 10, y: -75 },
        fontSize: 35,
        fillStyle: "#FFF",
        fontWeight: "bold",
      }),
      new HTransform(),
      new DText("continueTip", "今日打卡", {
        position: { x: 220, y: 916 },
        fontSize: 31,
        fillStyle: "#FFF",
        shadowBlur: 0,
        shadowOffsetY: 0,
      }),
      new DText("time", time, {
        position: { x: 220, y: 967 },
        fontSize: 79,
        fillStyle: "#FFF",
        fontWeight: "bold",
      }),
      new DLine("splitLine", {
        position: {
          x1: 792,
          x2: 880,
          y1: 770,
          y2: 770,
        },
        strokeStyle: "#FFF",
        lineWidth: 4,
        type: "solid",
      }),
      new DText("ymd", `${year}.${month}.${day}`, {
        position: { x: 904, y: 747 },
        fontSize: 35,
        fillStyle: "#FFF",
      }),
      //左中
      new DText("beautifulWordsPart1", params.beautifulWordsPart1, {
        position: { x: 96, y: 315 },
        fontSize: 83,
        fillStyle: "#FFF",
        fontWeight: "bold",
      }),
      new DText("beautifulWordsPart2", params.beautifulWordsPart2, {
        position: { x: 96, y: 400 },
        fontSize: 83,
        fillStyle: "#FFF",
        fontWeight: "bold",
      }),
      //  右下
      new DText("welcomeMessage1", "扫码和我", {
        position: { x: 951, y: 856 },
        fontSize: 31,
        fillStyle: "#FFF",
      }),
      new DText("welcomeMessage2", isMorning ? "互道早安" : "互道晚安", {
        position: { x: 951, y: 898 },
        fontSize: 31,
        fillStyle: "#FFF",
      }),
      new CImage("qrcode", params.qrcode, {
        position: { x: 949, y: 949 },
        width: 132,
        height: 132,
        shape: "Rect",
      }),
    ],
  );

  await TMPL.draw();
  return TMPL;
}
