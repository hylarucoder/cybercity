import { genCardRegiment } from "./regiment";
import { genCardRemedy } from "./remedy";
import { genCardShare } from "./share";
import { genCardTeam } from "./team";
import {
  genCardAchievementContinuousDays,
  genCardAchievementSocial,
  genCardAchievementSolarTerms,
} from "./achievement";
import { drawCardPunch_P3_001 } from "./punch/P3_001";
import { drawCardPunch_P3_002 } from "./punch/P3_002";
import { drawCardPunch_P3_003 } from "./punch/P3_003";
import { drawCardPunch_P3_004 } from "./punch/P3_004";
import { drawCardPunch_P3_005 } from "./punch/P3_005";
import { drawCardPunch_P3_006 } from "./punch/P3_006";

export const tmpls = {
  CardRegiment: genCardRegiment,
  CardRemedy: genCardRemedy,
  CardShare: genCardShare,
  CardTeam: genCardTeam,
  CardAchievementSocial: genCardAchievementSocial,
  CardAchievementSolarTerms: genCardAchievementSolarTerms,
  CardAchievementContinuousDays: genCardAchievementContinuousDays,
  CardPunch_P3_001: drawCardPunch_P3_001,
  CardPunch_P3_002: drawCardPunch_P3_002,
  CardPunch_P3_003: drawCardPunch_P3_003,
  CardPunch_P3_004: drawCardPunch_P3_004,
  CardPunch_P3_005: drawCardPunch_P3_005,
  CardPunch_P3_006: drawCardPunch_P3_006,
};
