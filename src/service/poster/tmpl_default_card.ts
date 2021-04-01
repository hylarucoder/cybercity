import {
  Poster,
  CImage,
  DLine,
  DText,
  HTransform,
  DRect,
} from "@/utils/canvas/components";
import { defaultParams } from "./base";
import { humanizeWeekday } from "@/utils/time";

export async function drawCard(params: typeof defaultParams = defaultParams) {
  const defaultBackground =
    "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3791918726,2864900975&fm=26&gp=0.jpg";
  const canvasWidth = 1125;
  const canvasHeight = 1125;
  const hWidth = canvasWidth / 2;
  const hHeight = canvasWidth / 2;

  const triWidth = canvasWidth / 3;
  const triHeight = canvasWidth / 3;

  const earlierThanNumber = Math.floor(params.totalEarlierThan / 10000) + "万";
  const isMorning = params.period == "MORNING";

  const earlierThan = isMorning
    ? `比${earlierThanNumber}人起得早`
    : `比${earlierThanNumber}人睡得早`;
  const month = params.date.slice(5, 7);
  const year = params.date.slice(0, 4);
  const day = params.date.slice(8, 10);
  const weekday = humanizeWeekday(params.date);
  const time = params.time.slice(0, 5);

  const TMPL = new Poster(
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
      new CImage("background", defaultBackground, {
        position: { x: 0, y: 0 },
        width: canvasWidth,
        height: canvasHeight,
        shape: "Rect",
      }),
      new DRect("avatarBackground", {
        position: { x: 64, y: 969 },
        width: 92,
        height: 92,
        fillStyle: "#333",
        radius: 0,
        alpha: 1,
      }),
      new DRect("avatarBackground", {
        position: { x: 69, y: 962 },
        width: 92,
        height: 92,
        fillStyle: "#333",
        radius: 0,
        alpha: 1,
      }),
      new CImage("avatar", params.avatar, {
        position: { x: 74, y: 967 },
        width: 82,
        height: 82,
        shape: "Rect",
      }),
      new CImage("landscapePic", params.background, {
        position: { x: 292, y: 315 },
        width: 824,
        height: 494,
        shape: "SlicingRect",
      }),
      //  下
      new DText("xxx", params.nickname, {
        position: { x: 183, y: 964 },
        fontSize: 35,
        fillStyle: "#333",
        shadowBlur: 0,
        shadowOffsetY: 0,
        shadowOffsetX: 0,
      }),
      new DRect("earlierThanBg", {
        position: { x: 183, y: 1013 },
        width: 213,
        height: 37,
        fillStyle: "#333333",
        radius: 0,
        alpha: 1,
      }),
      new DText("earlierThan", earlierThan, {
        position: { x: 194, y: 1014 },
        fontSize: 26,
        fillStyle: "#fff",
        shadowBlur: 0,
        shadowOffsetY: 0,
        shadowOffsetX: 0,
        fontWeight: "bold",
      }),
      new DRect("earlierThanBackground", {
        position: { x: 505, y: 969 },
        width: 176,
        height: 70,
        fillStyle: "#333333",
        radius: 0,
        alpha: 1,
      }),
      new DText("continueTip", isMorning ? "坚持早起" : "坚持早睡", {
        position: { x: 523, y: 980 },
        fontSize: 35,
        fillStyle: "#fff",
        shadowBlur: 0,
        shadowOffsetY: 0,
        shadowOffsetX: 0,
        fontWeight: "bold",
      }),
      new DText(
        "continuousTotal",
        params.totalContinuous,
        {
          position: { x: 714, y: 945 },
          fontSize: 79,
          fillStyle: "#333",
          fontWeight: "bold",
          shadowBlur: 0,
          shadowOffsetY: 0,
          shadowOffsetX: 0,
        },
        true,
      ),
      // 通过 transformMeasureCoord 使得坐标系落在结尾处
      new DText("continueUnit", "天", {
        position: { x: 10, y: -65 },
        fontSize: 31,
        fillStyle: "#333",
        fontWeight: "bold",
        shadowBlur: 0,
        shadowOffsetY: 0,
        shadowOffsetX: 0,
      }),
      new HTransform(),
      new DText("time", time, {
        position: { x: 907, y: 199 },
        fontSize: 53,
        fillStyle: "#333",
        fontWeight: "bold",
        shadowBlur: 0,
        shadowOffsetY: 0,
        shadowOffsetX: 0,
      }),
      new DLine("splitLine", {
        position: {
          x1: 183,
          x2: 396,
          y1: 1061,
          y2: 1061,
        },
        strokeStyle: "#333",
        lineWidth: 4,
        type: "solid",
      }),
      new DText("ymd", `${year}/${month}/${day}`, {
        position: { x: 758, y: 261 },
        fontSize: 31,
        fillStyle: "#333",
        fontWeight: "bold",
        shadowBlur: 0,
        shadowOffsetY: 0,
        shadowOffsetX: 0,
      }),
      new DText("week", `${weekday}`, {
        position: { x: 955, y: 261 },
        fontSize: 31,
        fillStyle: "#333",
        fontWeight: 800,
        shadowBlur: 0,
        shadowOffsetY: 0,
        shadowOffsetX: 0,
      }),

      //左中
      new DText("beautifulWordsPart1", params.beautifulWordsPart1, {
        position: { x: 170, y: 118 },
        fontSize: 46,
        fillStyle: "#333",
        fontWeight: "bold",
        shadowBlur: 0,
        shadowOffsetY: 0,
        shadowOffsetX: 0,
      }),
      new DText("beautifulWordsPart2", params.beautifulWordsPart2, {
        position: { x: 170, y: 170 },
        fontSize: 46,
        fillStyle: "#333",
        fontWeight: "bold",
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      }),
      //  右下
      new DText("welcomeMessage1", "扫码加入", {
        position: { x: 952, y: 924 },
        fontSize: 20,
        fillStyle: "#333",
        fontWeight: "bold",
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      }),
      new CImage("qrcode", params.qrcode, {
        position: { x: 947, y: 947 },
        width: 92,
        height: 92,
        shape: "Rect",
      }),
    ],
  );

  await TMPL.draw();
  return TMPL;
}
