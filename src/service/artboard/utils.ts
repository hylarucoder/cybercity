import { loadImageHelper } from "../../utils/canvas_helper";

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore

export function drawTextBackground(ctx, txt, x, y, height) {
  ctx.save();
  ctx.fillStyle = "#f50";
  let width = ctx.measureText(txt).width;
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = "#000";
  ctx.fillText(txt, x, y);
  ctx.restore();
}

export async function drawBackgroundImage(ctx, background, size) {
  const baseImage = await loadImageHelper(background);
  ctx.drawImage(baseImage, 0, 0, size.width, size.height);
}

export function selectCircleRange(ctx, x, y, width, height) {
  ctx.beginPath();
  ctx.arc(x + width / 2, y + height / 2, width / 2, 0, Math.PI * 2, false);
  ctx.clip();
}

export function selectRoundRectRange(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.clip();
}

export function selectShapeRadius(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.clip();
}
