import {
  Artboard,
  CImage,
  DLine,
  DRect,
  DText,
  HTransform,
} from "../../../../utils/canvas/components";
import { defaultParams } from "./base";
import { humanizeWeekday } from "../../../../utils/time";

export async function drawCardPunch_P3_002(
  params: typeof defaultParams = defaultParams,
) {
  let canvasWidth = 1125;
  let canvasHeight = 1125;
  let hWidth = canvasWidth / 2;
  let hHeight = canvasWidth / 2;

  let triWidth = canvasWidth / 3;
  let triHeight = canvasWidth / 3;
  let isMorning = params.period == "MORNING";

  let earlierThanNumber = Math.floor(params.totalEarlierThan / 10000) + "万";
  let earlierThan = isMorning
    ? `比${earlierThanNumber}人起得早`
    : `比${earlierThanNumber}人睡得早`;

  const month = params.date.slice(5, 7);
  const year = params.date.slice(0, 4);
  const day = params.date.slice(8, 10);
  const weekday = humanizeWeekday(params.date);
  const time = params.time.slice(0, 5);

  let dayOrNightIcon = isMorning
    ? "http://schedule-1253442168.file.myqcloud.com/upload/file1575280694534.jpg"
    : "http://schedule-1253442168.file.myqcloud.com/upload/file1575355697809.jpg";

  let TMPL = new Artboard(
    "TMPL",
    {
      height: canvasHeight,
      width: canvasWidth,
      quality: 0.85,
    },
    params.background,
    [
      //  左上方
      new CImage("avatar", params.avatar, {
        position: { x: 44, y: 661 },
        border: {
          width: 4,
          color: "#fff",
        },
        width: 132,
        height: 132,
        shape: "Circle",
      }),
      new CImage("dayOrNightIcon", dayOrNightIcon, {
        position: { x: 44, y: 850 },
        width: 59,
        height: 59,
        shape: "Rect",
      }),
      //  左中
      new DText("continueTip", isMorning ? "坚持早起" : "坚持早睡", {
        position: { x: 208, y: 753 },
        fontSize: 31,
        fillStyle: "#FFF",
      }),
      new DText(
        "continuousTotal",
        params.totalContinuous,
        {
          position: { x: 208, y: 672 },
          fontSize: 66,
          fillStyle: "#FFF",
          fontWeight: "bold",
        },
        true,
      ),
      // 通过 transformMeasureCoord 使得坐标系落在结尾处
      new DText("continueUnit", "天", {
        position: { x: 10, y: -65 },
        fontSize: 33,
        fillStyle: "#FFF",
      }),
      new HTransform(),
      //  左中
      new DText("time", time, {
        position: { x: 120, y: 825 },
        fontSize: 79,
        fillStyle: "#FFF",
        fontWeight: "bold",
      }),
      new DLine("splitLine", {
        position: {
          x1: 377,
          x2: 377,
          y1: 821,
          y2: 933,
        },
        strokeStyle: "#FFF",
        lineWidth: 4,
        type: "solid",
      }),
      new DText("join", `${params.totalJoin}人正在参与`, {
        position: { x: 423, y: 829 },
        fontSize: 35,
        fillStyle: "#FFF",
      }),
      new DText("earlierThan", earlierThan, {
        position: { x: 423, y: 870 },
        fontSize: 37,
        fillStyle: "#FFF",
      }),
      //  右上
      new DLine("splitLine", {
        position: {
          x1: 929,
          x2: 1083,
          y1: 44,
          y2: 44,
        },
        strokeStyle: "#fff",
        lineWidth: 4,
        type: "solid",
      }),
      new DLine("splitLine", {
        position: {
          x1: 1081,
          x2: 1081,
          y1: 44,
          y2: 231,
        },
        strokeStyle: "#fff",
        lineWidth: 4,
        type: "solid",
      }),
      new DLine("splitLine", {
        position: {
          x1: 1083,
          x2: 929,
          y1: 231,
          y2: 231,
        },
        strokeStyle: "#fff",
        lineWidth: 4,
        type: "solid",
      }),
      new DLine("splitLine", {
        position: {
          x1: 931,
          x2: 931,
          y1: 44,
          y2: 231,
        },
        strokeStyle: "#fff",
        lineWidth: 4,
        type: "solid",
      }),
      new DLine("splitLine", {
        position: {
          x1: 929,
          x2: 1083,
          y1: 44,
          y2: 44,
        },
        strokeStyle: "#fff",
        lineWidth: 4,
        type: "solid",
      }),
      new DLine("splitLine", {
        position: {
          x1: 930,
          x2: 1082,
          y1: 171,
          y2: 171,
        },
        strokeStyle: "#fff",
        lineWidth: 4,
        type: "solid",
      }),
      new DText("day", day, {
        position: { x: 962, y: 54 },
        fontSize: 79,
        fillStyle: "#FFF",
      }),
      new DText("yearMonth", `${year}.${month}`, {
        position: { x: 946, y: 180 },
        fontSize: 33,
        fillStyle: "#FFF",
      }),
      //左下
      new DText("beautifulWordsPart1", params.beautifulWordsPart1, {
        position: { x: 40, y: 949 },
        fontSize: 59,
        fillStyle: "#FFF",
        fontWeight: "bold",
      }),
      new DText("beautifulWordsPart2", params.beautifulWordsPart2, {
        position: { x: 40, y: 1012 },
        fontSize: 59,
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
