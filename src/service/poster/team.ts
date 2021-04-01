// 打卡团
import { Poster, CImage, DLine, DRect, DText } from "../../utils/canvas/components";
import { defaultParams } from "./teamParams";
export async function genCardTeam(
  params: typeof defaultParams = defaultParams,
) {
  let defaultBackground =
    "http://schedule-1253442168.file.myqcloud.com/upload/file1575275462011.jpg";
  let defaultAvatar =
    "http://img.laiye.com/ajNVdqHZLLCjOXLicIVrSh3OtofBx98A33VZRIxRTZ3pbM0WmuEREicrGONaBvmVKnx6aibQ3cjhr2heCCKjcB4nuEqBT0o74nrQ1AARIzvwzU.jpg";
  let defaultQrcode =
    "http://img.laiye.com/G0gmxRbVb4GgMwAk5B4VKeX6a0mfB5HXtjdv9YMZkj03D0A.png";

  let canvasWidth = 915;
  let canvasHeight = 1245;
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
      // 中间
      new CImage("avatar", params.avatar, {
        position: { x: 45, y: 1049 },
        width: 126,
        height: 126,
        shape: "Circle",
      }),
      new DRect("xxx", {
        position: { x: 45, y: 465 },
        width: 150,
        height: 150,
        fillStyle: "#f4f5f8",
        radius: 25,
      }),
      new CImage("regimentAvatar", params.regimentAvatar, {
        position: { x: 45, y: 465 },
        width: 150,
        height: 150,
        shape: "RoundRect",
        radius: 25,
      }),
      new CImage("qrcode", params.qrcode, {
        position: { x: 690, y: 1020 },
        width: 180,
        height: 180,
        shape: "Rect",
      }),
      // 中下方
      new DText("xxx", params.regimentMembers, {
        position: { x: 225, y: 560 },
        fontSize: 36,
        fillStyle: "#9c9c9c",
        shadowBlur: 0,
        shadowOffsetY: 0,
        shadowOffsetX: 0,
      }),
      new DText("xxx", params.userName, {
        position: { x: 201, y: 1062 },
        fontSize: 42,
        fillStyle: "#333333",
        shadowBlur: 0,
        shadowOffsetY: 0,
        shadowOffsetX: 0,
      }),
      new DText("xxx", params.continuousTotal, {
        position: { x: 200, y: 1125 },
        fontSize: 36,
        fillStyle: "#2C2C2C",
        shadowBlur: 0,
        shadowOffsetY: 0,
        shadowOffsetX: 0,
      }),
      new DLine("xxx", {
        position: {
          x1: 82,
          x2: 832,
          y1: 975,
          y2: 975,
        },
        strokeStyle: "#2C2C2C",
        lineWidth: 1,
        type: "solid",
      }),
      new DText("xxx", params.regimentName, {
        position: { x: 225, y: 479 },
        fontSize: 45,
        fillStyle: "#E6E6E6",
      }),
    ],
  );

  await TMPL.draw();
  return TMPL;
}
