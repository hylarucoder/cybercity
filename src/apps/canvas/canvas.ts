import * as Joi from "joi";
import { ALL_TEMPLATES } from "../../service/services/template";
import { drawArtboard } from "../../service/services/artboard";
import { Readable } from "stream";
import { cloneDeep } from "lodash";
import {
  genCardAchievementContinuousDays,
  genCardAchievementSocial,
  genCardAchievementSolarTerms,
} from "../../service/artboard/templates/achievement";
import { genCardRemedy } from "../../service/artboard/templates/remedy";
import { genCardShare } from "../../service/artboard/templates/share";
import { genCardRegiment } from "../../service/artboard/templates/regiment";
import { genCardTeam } from "../../service/artboard/templates/team";
import { drawCardPunch_P1_001 } from "../../service/artboard/templates/punch/P1_001";
import { drawCardPunch_P2_001 } from "../../service/artboard/templates/punch/P2_001";
import { tmpls } from "../../service/artboard/templates";
import { drawCardPunch_P3_001 } from "../../service/artboard/templates/punch/P3_001";
import { drawCardPunch_P3_002 } from "../../service/artboard/templates/punch/P3_002";
import { drawCardPunch_P3_003 } from "../../service/artboard/templates/punch/P3_003";
import { drawCardPunch_P3_004 } from "../../service/artboard/templates/punch/P3_004";
import { drawCardPunch_P3_005 } from "../../service/artboard/templates/punch/P3_005";
import { drawCardPunch_P3_006 } from "../../service/artboard/templates/punch/P3_006";

export function makeArtboard(template, content) {
  let newTmpl = Object.assign({}, template);
  if (newTmpl.background && content.background) {
    newTmpl.background = content.background;
  }
  console.log(newTmpl);

  for (let component of newTmpl.components) {
    if (Object.keys(content).includes(component.name)) {
      if (component.type === "image") {
        component.imageUrl = content[component.name];
      } else {
        component.content = content[component.name];
      }
    }
  }
  return newTmpl;
}

export function bufferToStream(binary) {
  return new Readable({
    read() {
      this.push(binary);
      this.push(null);
    },
  });
}

export function getTemplate(tmpl) {
  let template = ALL_TEMPLATES[tmpl];
  if (!template) {
    return false;
  }
  template = cloneDeep(template);
  return template;
}

async function exportOldTemplate(tmpl, content) {
  let template = getTemplate(tmpl);
  let artboard = makeArtboard(template, content);
  let buffer = await drawArtboard(artboard, "buffer");
  return bufferToStream(buffer);
}

export default [
  {
    method: "POST",
    path: "/api/canvas/draw",
    config: {
      description: "原生绘图 - 用于直接传artboard",
      validate: {
        payload: Joi.object({
          artboard: Joi.object(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        let buffer = await drawArtboard(request.payload.artboard, "buffer");
        let streamData = bufferToStream(buffer);
        return h
          .response(streamData)
          .header("Content-Type", "image/jpeg")
          .header("Content-Disposition", "attachment; filename=test.jpeg");
      } catch (error) {
        request.sentryScope.setExtra("生成图片失败", request.payload);
        throw error;
      }
    },
  },
  {
    method: "POST",
    path: "/api/canvas/template",
    config: {
      description: "模板绘图 - 用于使用已有模板",
      validate: {
        payload: Joi.object({
          tmpl: Joi.string(),
          content: Joi.object(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        let content = request.payload.content;
        let tmpl = request.payload.tmpl;
        if (Object.keys(tmpls).includes(tmpl)) {
          let streamData = (await tmpls[tmpl](content)).toBuffer();
          return h
            .response(streamData)
            .header("Content-Type", "image/jpeg")
            .header("Content-Disposition", "attachment; filename=test.jpeg");
        } else {
          let streamData = await exportOldTemplate(tmpl, content);
          return h
            .response(streamData)
            .header("Content-Type", "image/jpeg")
            .header("Content-Disposition", "attachment; filename=test.jpeg");
        }
      } catch (error) {
        console.log(error);
        request.sentryScope.setExtra("生成图片失败", request.payload);
        throw error;
      }
    },
  },
  {
    method: "GET",
    path: "/api/canvas/template_preview",
    config: {
      description: "模板绘图 - 用于调试预览数据",
      validate: {
        query: Joi.object({
          tmpl: Joi.string().default("TMPL_ACHIEVEMENT_SOCIAL"),
        }).options({ stripUnknown: true }),
      },
    },
    handler: async (request, h) => {
      let content = {
        background:
          "https://tva1.sinaimg.cn/large/006y8mN6gy1g7yzu5fqb3j30im0izqes.jpg",
        qrcode:
          "http://img.laiye.com/G0gmxRbVb4GgMwAk5B4VKeX6a0mfB5HXtjdv9YMZkj03D0A.png",
        avatar:
          "http://img.laiye.com/ajNVdqHZLLCjOXLicIVrSh3OtofBx98A33VZRIxRTZ3pbM0WmuEREicrGONaBvmVKnx6aibQ3cjhr2heCCKjcB4nuEqBT0o74nrQ1AARIzvwzU.jpg",
        month: "九月",
        day: "18",
        continuousTotal: "1111",
        punchTime: "12:40",
        join: "799398421人正在参与",
        earlierThan: "比1万人起的早",
        beautifulWordsPart: "不管多么崎岖不平",
        //  beautifulWordsPart2: '也比站在原地更接近幸福',
      };
      let template = getTemplate(request.query.tmpl);
      template = cloneDeep(template);
      let artboard = makeArtboard(template, content);
      let b64 = await drawArtboard(artboard);
      return `<img src="${b64}">`;
    },
  },
  {
    method: "GET",
    path: "/api/canvas/beta",
    config: {
      description: "模板绘图 - 用于调试Component",
    },
    handler: async (request, h) => {
      let b64 = (await drawCardPunch_P3_005()).toBase64();
      return h.view("canvas_beta", {
        b64: b64,
        width: 1024,
        height: 1024,
      });
    },
  },
  {
    method: "GET",
    path: "/api/canvas/beta/preview",
    config: {
      description: "模板绘图 - 用于预览所有图片",
    },
    handler: async (request, h) => {
      return h.view("canvas_beta_preview", {
        artboards: [
          {
            b64: (await drawCardPunch_P1_001()).toBase64(),
            title: "打卡图-v1-白天模式",
            desc: 1024,
          },
          {
            b64: (await drawCardPunch_P2_001()).toBase64(),
            title: "打卡图-v2-白天模式",
            desc: 1024,
          },
          {
            b64: (await drawCardPunch_P2_001()).toBase64(),
            title: "打卡图-v2-夜间模式",
            desc: 1024,
          },
          {
            b64: (await drawCardPunch_P3_001()).toBase64(),
            title: "打卡图-v3-p1",
            desc: 1024,
          },
          {
            b64: (await drawCardPunch_P3_002()).toBase64(),
            title: "打卡图-v3-p2",
            desc: 1024,
          },
          {
            b64: (await drawCardPunch_P3_003()).toBase64(),
            title: "打卡图-v3-p3",
            desc: 1024,
          },
          {
            b64: (await drawCardPunch_P3_004()).toBase64(),
            title: "打卡图-v3-p4",
            desc: 1024,
          },
          {
            b64: (await drawCardPunch_P3_005()).toBase64(),
            title: "打卡图-v3-p5",
            desc: 1024,
          },
          {
            b64: (await drawCardPunch_P3_006()).toBase64(),
            title: "打卡图-v3-p6",
            desc: 1024,
          },
          {
            b64: (await genCardShare()).toBase64(),
            title: "分享卡",
            desc: 1024,
          },
          {
            b64: (await genCardRemedy()).toBase64(),
            title: "补签卡",
            desc: 1024,
          },
          {
            b64: (await genCardAchievementSocial()).toBase64(),
            title: "成就图-社交类",
            desc: 1024,
          },
          {
            b64: (await genCardAchievementContinuousDays()).toBase64(),
            title: "成就图-连续天数",
            desc: 1024,
          },
          {
            b64: (await genCardAchievementSolarTerms()).toBase64(),
            title: "成就图-节气类",
            desc: 1024,
          },
          {
            b64: (await genCardRegiment()).toBase64(),
            title: "邀请图-打卡团",
            desc: 1024,
          },
          {
            b64: (await genCardTeam()).toBase64(),
            title: "邀请图-打卡小分队",
            desc: 1024,
          },
        ],
      });
    },
  },
];
