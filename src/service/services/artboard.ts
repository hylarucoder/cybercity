import { flatten, merge } from "lodash";
import * as _ from "lodash";
import { createCanvas, loadImage, registerFont } from "canvas";
import * as assert from "assert";

process.env.PANGOCAIRO_BACKEND = "fontconfig";

let fontPath = __dirname + "../../../../../assets/fonts";

registerFont(`${fontPath}/PingFang-SC-Regular.ttf`, {
  family: "PingFang SC",
});

registerFont(`${fontPath}/PingFang-SC-Light.ttf`, {
  family: "PingFang SC",
  weight: "light",
});

registerFont(`${fontPath}/PingFang-SC-Bold.ttf`, {
  family: "PingFang SC",
  weight: "bold",
});

function selectByRadius(ctx, x, y, width, height, radius) {
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

function selectRoundRange(ctx, x, y, width, height) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + width / 2, y + height / 2, width / 2, 0, Math.PI * 2, false);
  ctx.clip();
}

function drawRoundRectPath(ctx, width, height, radius) {
  ctx.beginPath();
  // 从右下角顺时针绘制，弧度从0到1/2PI
  ctx.arc(width - radius, height - radius, radius, 0, Math.PI / 2);
  // 矩形下边线
  ctx.lineTo(radius, height);
  // 左下角圆弧，弧度从1/2PI到PI
  ctx.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);
  // 矩形左边线
  ctx.lineTo(0, radius);
  // 左上角圆弧，弧度从PI到3/2PI
  ctx.arc(radius, radius, radius, Math.PI, (Math.PI * 3) / 2);
  // 上边线
  ctx.lineTo(width - radius, 0);
  // 右上角圆弧
  ctx.arc(width - radius, radius, radius, (Math.PI * 3) / 2, Math.PI * 2);
  // 右边线
  ctx.lineTo(width, height - radius);
  ctx.closePath();
}

async function drawBackgroundImage(ctx, background, size) {
  const baseImage = await loadImage(background);
  ctx.drawImage(baseImage, 0, 0, size.width, size.height);
}

async function drawImageComponent(ctx, draw) {
  assert.strict(draw.imageUrl.startsWith("http") === true);
  const _image = await loadImage(draw.imageUrl);
  // TODO: DO TIMING
  // TODO: DO LOGGING
  if (draw.shape && draw.shape.type === "circle") {
    selectRoundRange(ctx, draw.x, draw.y, draw.width, draw.height);
  }
  if (draw.borderRadius) {
    selectByRadius(
      ctx,
      draw.x,
      draw.y,
      draw.width,
      draw.height,
      draw.borderRadius,
    );
    ctx.drawImage(_image, draw.x, draw.y, draw.width, draw.height);
    ctx.restore();
    return;
  }
  ctx.drawImage(_image, draw.x, draw.y, draw.width, draw.height);
  ctx.restore();
  if (draw.shape && draw.shape.line) {
    selectRoundRange(ctx, draw.x, draw.y, draw.width, draw.height);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 4;
    // 阴影的x偏移
    ctx.shadowOffsetX = 0;
    // 阴影的y偏移
    ctx.shadowOffsetY = 0;
    // 阴影颜色
    ctx.shadowColor = "#333";
    // 阴影的模糊半径
    ctx.shadowBlur = 3;
    ctx.stroke();
    ctx.restore();
  }
}

function drawTextComponent(ctx, draw) {
  // TODO: 支持字体
  let fontSize = draw.size || "12";
  ctx.font = `${draw.fontWeight} ${fontSize}px "PingFang SC"`;
  // ctx.fontWeight = draw.fontWeight
  ctx.fillStyle = draw.color;
  Object.assign(ctx, draw);
  ctx.fillText(draw.content, draw.x + (draw.limit || 0), draw.y);
}

function drawContinuousTextComponent(ctx, draw) {
  // TODO: 支持字体
  let fontSize = draw.size || "12";
  ctx.fillStyle = "#EEE";
  ctx.font = `${draw.fontWeight} ${fontSize}px "PingFang SC"`;
  ctx.fillStyle = draw.color;
  Object.assign(ctx, draw);
  let leftText = ctx.measureText(draw.content);
  ctx.fillText(draw.content, draw.x, draw.y);
  // let dayDraw = {
  //   fillStyle: '#FFF',
  //   content: '天',
  //   fontWeight: 'bold',
  //   name: 'continueUnit',
  //   size: 44,
  //   type: 'continuousText',
  //   x: 50.5,
  //   y: 357,
  // };

  let dayDraw = draw.affiliate;
  ctx.font = `${dayDraw.fontWeight} ${dayDraw.size}px "PingFang SC"`;
  Object.assign(ctx, dayDraw);
  ctx.fillText(dayDraw.content, dayDraw.x + leftText.width + 5, dayDraw.y);
}

function drawLineShapeComponent(ctx, draw) {
  ctx.beginPath();
  if (draw.lineDash) {
    ctx.setLineDash(draw.lineDash);
  }
  ctx.moveTo(draw.x1, draw.y1);
  ctx.lineTo(draw.x1, draw.y1);
  ctx.lineTo(draw.x2, draw.y2);
  ctx.stroke();
}

function drawTipLineShapeComponent(ctx, draw) {
  ctx.beginPath();
  ctx.lineCap = "round";
  for (let i = 0; i < draw.repeat; i++) {
    ctx.moveTo(draw.x1 + draw.tipMargin * i, draw.y1);
    ctx.lineTo(
      draw.x1 + draw.tipMargin * i + draw.tipWidth,
      draw.y1 + draw.tipHeight,
    );
    ctx.lineTo(draw.x2 + draw.tipMargin * i, draw.y2);
  }
  ctx.stroke();
}

function drawShape(ctx, draw) {
  ctx.save();
  if (draw.gradient) {
    let gradientInfo = draw.gradient;
    let gradient = ctx.createLinearGradient(
      gradientInfo.x1,
      gradientInfo.y1,
      gradientInfo.x2,
      gradientInfo.y2,
    );
    gradient.addColorStop(
      gradientInfo.color.startPosition,
      gradientInfo.color.startColor,
    );
    gradient.addColorStop(
      gradientInfo.color.endPosition,
      gradientInfo.color.endColor,
    );
    ctx.fillStyle = gradient;
    ctx.fillRect(draw.x, draw.y, draw.width, draw.height);
  }
  if (draw.radius) {
    selectByRadius(ctx, draw.x, draw.y, draw.width, draw.height, draw.radius);
    ctx.fillStyle = draw.fillStyle;
    ctx.fill();
  }
  ctx.restore();
}

function mergeCanvasConfigs(...roles) {
  // TODO: 以后可以剔除掉非ctx的设置
  // TODO: 依据字体进行修改
  const merger = function(a, b) {
    if (_.isObject(a)) {
      return _.merge({}, a, b, merger);
    } else {
      return a || b;
    }
  };
  const args = flatten([{}, roles, merger]);
  return merge.apply(_, args);
}

function assignCanvasConfig(ctx, ...config) {
  return Object.assign(ctx, mergeCanvasConfigs({}, ...config));
}

export async function drawArtboard(artboard, exportType = "base64") {
  const width = artboard.size.width;
  const height = artboard.size.height;

  // 单图层绘图
  // STEP 1. 创建空白CANVAS
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  drawRoundRectPath(ctx, width, height, 0);
  ctx.fillStyle = "#fff";
  ctx.fill();

  // STEP 2. 添加背景图

  if (artboard.background) {
    await drawBackgroundImage(ctx, artboard.background, artboard.size);
  }
  // STEP 3. 添加组件
  const globalStyle = artboard.globalStyle;

  for (let draw of artboard.components) {
    // STEP 3.1 绘制基础组件
    // 3.1.1 图片
    // 3.1.2 文本
    // 3.1.3 形状-LINE
    if (draw.type === "shape") {
      drawShape(ctx, draw);
    }
    if (draw.type === "image") {
      assignCanvasConfig(ctx, globalStyle.base, globalStyle.image, draw);
      await drawImageComponent(ctx, draw);
    }
    if (draw.type === "text") {
      assignCanvasConfig(ctx, globalStyle.base, globalStyle.text, draw);
      drawTextComponent(ctx, draw);
    }
    if (draw.type === "severalDays") {
      assignCanvasConfig(ctx, globalStyle.base, globalStyle.text, draw);
      drawContinuousTextComponent(ctx, draw);
    }
    if (draw.type === "line") {
      assignCanvasConfig(ctx, globalStyle.base, globalStyle.line, draw);
      drawLineShapeComponent(ctx, draw);
    }
    if (draw.type === "tipLine") {
      assignCanvasConfig(ctx, globalStyle.base, globalStyle.line, draw);
      drawTipLineShapeComponent(ctx, draw);
    }

    // STEP 3.3 绘制高级组件( qrcode 等等 )
  }
  if (exportType === "base64") {
    return canvas.toDataURL("image/jpeg", artboard.size.quality);
  } else {
    return canvas.toBuffer("image/jpeg", {
      quality: artboard.size.quality,
    });
  }
}
