import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  Render,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { drawCardPunch_P1_001 } from "../../service/artboard/templates/punch/P1_001";
import { drawCardPunch_P2_001 } from "../../service/artboard/templates/punch/P2_001";
import { drawCardPunch_P3_001 } from "../../service/artboard/templates/punch/P3_001";
import { drawCardPunch_P3_002 } from "../../service/artboard/templates/punch/P3_002";
import { drawCardPunch_P3_003 } from "../../service/artboard/templates/punch/P3_003";
import { drawCardPunch_P3_004 } from "../../service/artboard/templates/punch/P3_004";
import { drawCardPunch_P3_005 } from "../../service/artboard/templates/punch/P3_005";
import { drawCardPunch_P3_006 } from "../../service/artboard/templates/punch/P3_006";
import {
  genCardAchievementContinuousDays,
  genCardAchievementSocial,
} from "../../service/artboard/templates/achievement";
import { genCardTeam } from "../../service/artboard/templates/team";
import { drawArtboard } from "../../service/services/artboard";
import { bufferToStream, getTemplate, makeArtboard } from "./canvas";
import { tmpls } from "../../service/artboard/templates";
import { cloneDeep } from "lodash";

export class DrawCanvasPayload {
  artboard: any;
}

export class DrawTemplatePayload {
  tmpl: any;
  content: any;
}

export class DrawTemplateQuery {
  tmpl: any;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // return file
  @Post("/api/canvas/draw")
  @Header("Content-type", "image/jpeg")
  async drawCanvas(@Body() payload: DrawCanvasPayload): Promise<any> {
    let buffer = await drawArtboard(payload.artboard, "buffer");
    return bufferToStream(buffer);
  }

  @Post("/api/canvas/template")
  async drawTemplate(@Body() payload: DrawTemplatePayload): Promise<any> {
    let content = payload.content;
    let tmpl = payload.tmpl;
    return (await tmpls[tmpl](content)).toBuffer();
  }

  @Get("/api/canvas/template-preview")
  async drawTemplatePreview(@Query() query: DrawTemplateQuery): Promise<any> {
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
    console.log("卧槽");
    let template = getTemplate(query.tmpl);
    console.log("卧槽", template);
    template = cloneDeep(template);
    let artboard = makeArtboard(template, content);
    let b64 = await drawArtboard(artboard);
    return `<img src="${b64}">`;
  }

  @Get("/api/canvas/template-preview-all")
  @Render("canvas_beta_preview.ejs")
  async drawTemplatePreviewAll(): Promise<any> {
    return {
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
        // {
        //   b64: (await genCardShare()).toBase64(),
        //   title: "分享卡", // need fix
        //   desc: 1024
        // },
        // {
        //   b64: (await genCardRemedy()).toBase64(),
        //   title: "补签卡", // need fix
        //   desc: 1024
        // },
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
        // {
        //   b64: (await genCardAchievementSolarTerms()).toBase64(),
        //   title: "成就图-节气类", // 跪了
        //   desc: 1024
        // },
        // {
        //   b64: (await genCardRegiment()).toBase64(),
        //   title: "邀请图-打卡团", // 跪了
        //   desc: 1024
        // },
        {
          b64: (await genCardTeam()).toBase64(),
          title: "邀请图-打卡小分队",
          desc: 1024,
        },
      ],
    };
  }
}
