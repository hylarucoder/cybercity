import { Artboard, CImage, DText } from '../components'
import { defaultParams } from './achievementParams'
export async function genCardAchievement(
  params: typeof defaultParams = defaultParams
) {
  let defaultBackground =
    'http://schedule-1253442168.file.myqcloud.com/background/social_achievement.png'

  let canvasWidth = 1005
  let canvasHeight = 1128
  let hWidth = canvasWidth / 2
  let hHeight = canvasWidth / 2

  let triWidth = canvasWidth / 3
  let triHeight = canvasWidth / 3

  let TMPL = new Artboard(
    'TMPL',
    {
      height: canvasHeight,
      width: canvasWidth,
      quality: 0.85,
    },
    defaultBackground,
    [
      // 中上方
      new CImage('metal', params.imageUrl, {
        position: { x: 281, y: 116 },
        width: 446,
        height: 446,
        shape: 'Rect',
      }),
      // 中下方

      new DText('xxx', params.title, {
        position: { x: hWidth, y: 605 },
        fontSize: 49,
        fillStyle: '#2C2C2C',
        textAlign: 'center',
        fontWeight: 'bold',
        shadowBlur: 0,
        shadowOffsetY: 0,
        shadowOffsetX: 0,
      }),
      new DText('xxx', params.achievedCopy, {
        position: { x: hWidth, y: 672 },
        fontSize: 38,
        fillStyle: '#8D8D8D',
        textAlign: 'center',
        shadowBlur: 0,
        shadowOffsetY: 0,
        shadowOffsetX: 0,
      }),

      // 下方
      new CImage('avatar', params.avatar, {
        position: { x: 89, y: 881 },
        width: 105,
        height: 105,
        shape: 'Circle',
        border: {
          width: 4,
          color: '#FFF',
        },
      }),
      new DText('xxx', params.date, {
        position: { x: 216, y: 890 },
        fontSize: 34,
        fillStyle: '#BCBEC1',
        shadowBlur: 0,
        shadowOffsetY: 0,
        shadowOffsetX: 0,
      }),
      new DText('xxx', params.earlierThan, {
        position: { x: 216, y: 930 },
        fontSize: 34,
        fillStyle: '#BCBEC1',
        shadowBlur: 0,
        shadowOffsetY: 0,
        shadowOffsetX: 0,
      }),
      new CImage('qrcode', params.qrcode, {
        position: { x: 749, y: 848 },
        width: 159,
        height: 159,
        shape: 'Rect',
      }),
    ]
  )

  await TMPL.draw()
  return TMPL
}

export const genCardAchievementSocial = genCardAchievement
export const genCardAchievementSolarTerms = genCardAchievement
export const genCardAchievementContinuousDays = genCardAchievement
