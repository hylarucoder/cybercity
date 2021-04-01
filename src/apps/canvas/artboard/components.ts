import {
  drawBackgroundImage,
  selectRoundRectRange,
  selectCircleRange,
  selectShapeRadius,
} from './utils'
import { initialCanvas, loadImageHelper } from '../../../utils/canvas_helper'

let AUXILIARY_LINE_SHOW = false
let EXTRA_AUXILIARY_LINE_SHOW = false

function drawBorderCircle(
  ctx,
  x: number,
  y: number,
  width: number,
  borderColor,
  borderLineWidth: number
) {
  ctx.beginPath()
  ctx.moveTo(x + width, y + width / 2)
  ctx.arc(x + width / 2, y + width / 2, width / 2, 0, 2 * Math.PI, true)
  ctx.setLineDash([])
  ctx.lineWidth = borderLineWidth
  ctx.strokeStyle = borderColor
  ctx.stroke()
}

interface HelperComponent {
  readonly type: string
  readonly iInterface: 'HelperComponent'

  /**
   * @param ctx
   * 绘制基础组件
   * 1.1 图片
   * 1.2 文本
   * 1.3 形状
   * 1.3.1 线段
   * 1.3.2 矩形
   */
  draw(ctx: CanvasRenderingContext2D): void
}

export class HTransform implements HelperComponent {
  // draws
  readonly type = 'Transform'
  readonly iInterface = 'HelperComponent'

  constructor(readonly x: number = 0, readonly y: number = 0) {}

  async draw(ctx: CanvasRenderingContext2D): Promise<void> {
    ctx.setTransform(1, 0, 0, 1, this.x, this.y)
  }
}

interface PrimitiveComponent {
  readonly type: string
  readonly iInterface: 'PrimitiveComponent'

  /**
   * @param ctx
   * 绘制基础组件
   * 1.1 图片
   * 1.2 文本
   * 1.3 形状
   * 1.3.1 线段
   * 1.3.2 矩形
   */
  draw(ctx: CanvasRenderingContext2D): void
}

const defaultPosition = {
  x: 0,
  y: 0,
}

interface DTextStyleType {
  position: typeof defaultPosition
  fontSize: number
  fillStyle: string
  strokeStyle?: string
  fontName?: '苹方'
  shadowBlur?: number
  shadowColor?: string
  shadowOffsetX?: number
  shadowOffsetY?: number
  fontWeight?:
    | 'normal'
    | 'bold'
    | 'bolder'
    | 'lighter'
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900
  textBaseline?: 'top'
  textAlign?: 'left' | 'right' | 'center'
  letterSpacing?: number
}

export class DText implements PrimitiveComponent {
  // draw
  readonly type = 'Text'
  readonly iInterface = 'PrimitiveComponent'
  readonly style: DTextStyleType
  private transformMeasuredCoord: boolean

  constructor(
    readonly name: string,
    readonly text: string | number,
    style: DTextStyleType,
    transformMeasuredCoord: boolean = false
  ) {
    this.style = Object.assign(
      {
        position: {
          x: 0,
          y: 0,
        },
        fillStyle: '#000000',
        strokeStyle: '#000000',
        fontName: 'PingFang SC',
        fontSize: 14,
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowOffsetX: 3,
        shadowOffsetY: 6,
        fontWeight: 'normal',
        textBaseline: 'top',
        textAlign: 'left',
      },
      style
    )
    this.transformMeasuredCoord = transformMeasuredCoord
  }

  get font(): string {
    return `${this.style.fontWeight} ${this.style.fontSize}px ${this.style.fontName}`
  }

  private postDraw(ctx: CanvasRenderingContext2D) {
    if (this.transformMeasuredCoord) {
      let { x2, y2 } = this.measure(ctx)
      ctx.setTransform(1, 0, 0, 1, x2, y2)
    }
  }

  async draw(ctx: CanvasRenderingContext2D): Promise<void> {
    let style = this.style
    let position = style.position
    this.applyStyle(ctx, style)
    let width = ctx.measureText(`${this.text}`).width
    let height = style.fontSize * 1.5
    if (AUXILIARY_LINE_SHOW) {
      ctx.save()
      ctx.setLineDash([6])
      ctx.lineWidth = 2
      ctx.strokeStyle = 'grey'
      let strokeX = style.position.x
      if (ctx.textAlign === 'right') {
        strokeX = strokeX - width
      }
      if (ctx.textAlign === 'center') {
        strokeX = strokeX - width / 2
      }

      ctx.strokeRect(strokeX, style.position.y, width, height)
      ctx.restore()
    }
    if (style.letterSpacing) {
      let tmpText = this.text.toString()
      let textArray = tmpText.split('')
      let sx = position.x
      textArray.map((item) => {
        ctx.fillText(`${item}`, sx, position.y)
        sx = sx + style.fontSize + style.letterSpacing
      })
      this.postDraw(ctx)
      return
    }

    ctx.fillText(`${this.text}`, position.x, position.y)
    this.postDraw(ctx)
    // ctx.strokeText(this.text, position.x, position.y)
  }

  measure(ctx) {
    let style = this.style
    this.applyStyle(ctx, style)
    let width = ctx.measureText(this.text).width
    let height = style.fontSize * 1.5
    let transform = ctx.currentTransform
    let { e, f } = transform
    return {
      x1: 0,
      y1: 0,
      x2: style.position.x + width,
      y2: style.position.y + height,
    }
  }

  private applyStyle(ctx: CanvasRenderingContext2D, style) {
    ctx.font = this.font
    ctx.fillStyle = style.fillStyle
    ctx.textBaseline = style.textBaseline
    ctx.textAlign = style.textAlign
    ctx.shadowBlur = style.shadowBlur
    ctx.shadowColor = style.shadowColor
    ctx.shadowOffsetX = style.shadowOffsetX
    ctx.shadowOffsetY = style.shadowOffsetY
  }
}

interface DImageStyleType {
  position: typeof defaultPosition
  width: number
  height: number
}

export class DImage implements PrimitiveComponent {
  readonly type = 'Image'
  readonly iInterface = 'PrimitiveComponent'
  style: DImageStyleType
  private followTransform: boolean

  constructor(
    readonly name: string,
    readonly src: string,
    style: DImageStyleType,
    followTransform: boolean = false
  ) {
    this.style = Object.assign(
      {
        position: {
          x: 0,
          y: 0,
        },
        height: 100,
        width: 100,
      },
      style
    )
  }

  async draw(ctx: CanvasRenderingContext2D): Promise<void> {
    const style = this.style
    const _image = await loadImageHelper(this.src)
    ctx.drawImage(
      _image,
      style.position.x,
      style.position.y,
      style.width,
      style.height
    )
    ctx.restore()
  }
}

const defaultLinePosition = {
  x1: 0,
  y1: 0,
  x2: 100,
  y2: 100,
}

interface DLineStyleType {
  readonly position: typeof defaultLinePosition
  readonly strokeStyle: string
  readonly shadow?: Boolean
  readonly lineWidth: number
  readonly type: 'solid' | 'dotted' | 'dashed'
}

export class DLine implements PrimitiveComponent {
  readonly type = 'Line'
  readonly iInterface = 'PrimitiveComponent'

  constructor(readonly name: string, readonly style: DLineStyleType) {
    this.style = Object.assign(
      {
        position: defaultLinePosition,
        strokeStyle: '#FFF',
        lineWidth: 1,
        type: 'solid',
      },
      style
    )
  }

  async draw(ctx: CanvasRenderingContext2D): Promise<void> {
    const style = this.style
    ctx.beginPath()
    ctx.lineWidth = style.lineWidth
    if (style.type === 'dotted') {
      ctx.setLineDash([3, 3])
    } else {
      ctx.setLineDash([])
    }

    ctx.strokeStyle = style.strokeStyle
    const pos = style.position
    ctx.moveTo(pos.x1, pos.y1)
    ctx.lineTo(pos.x1, pos.y1)
    ctx.lineTo(pos.x2, pos.y2)
    ctx.stroke()
  }
}

const defaultDRectPosition = {
  x: 0,
  y: 0,
}

interface DRectStyleType {
  readonly position: typeof defaultDRectPosition
  readonly width: number
  readonly height: number
  readonly radius: number
  readonly fillStyle: string
  readonly strokeStyle?: string
  readonly alpha?: number
}

export class DRect implements PrimitiveComponent {
  readonly type = 'Rect'
  readonly iInterface = 'PrimitiveComponent'

  constructor(readonly name: string, readonly style: DRectStyleType) {
    this.style = Object.assign(
      {
        position: {
          x: 0,
          y: 0,
        },
        width: 100,
        height: 100,
        radius: 0,
        fillStyle: '#000000',
        strokeStyle: '#000000',
        alpha: 0.9,
      },
      style
    )
  }

  async draw(ctx: CanvasRenderingContext2D): Promise<void> {
    const style = this.style
    let pos = style.position
    if (style.radius) {
      selectShapeRadius(
        ctx,
        pos.x,
        pos.y,
        style.width,
        style.height,
        style.radius
      )
    }
    ctx.globalAlpha = style.alpha
    let grd = ctx.createLinearGradient(0, 0, 170, 0)
    grd.addColorStop(0, '#EEE')
    grd.addColorStop(1, '#FFF')
    // ctx.fillStyle = this.style.fillStyle
    ctx.fillStyle = style.fillStyle
    ctx.fillRect(pos.x, pos.y, style.width, style.height)
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.restore()
  }
}

interface AdvancedComponent {
  readonly type: string
  readonly iInterface: 'AdvancedComponent'

  /**
   * @param ctx
   * 绘制高级组件
   * 2.1 头像
   */
  draw(ctx: CanvasRenderingContext2D): void
}

interface CImageBorderType {
  width: number
  color: string
  shadowBlur?: number
  shadowColor?: string
  shadowOffsetX?: number
  shadowOffsetY?: number
}

interface CImageStyleType {
  readonly shape: 'Rect' | 'Circle' | 'RoundRect' | 'SlicingRect'
  position: typeof defaultPosition
  width: number
  height: number
  border?: CImageBorderType
  radius?: number
}

export class CImage implements AdvancedComponent {
  // draws
  readonly type = 'Image'
  readonly iInterface = 'AdvancedComponent'

  constructor(
    readonly name: string,
    readonly src: string,
    readonly style: CImageStyleType
  ) {}

  async draw(ctx: CanvasRenderingContext2D): Promise<void> {
    ctx.save()
    const _image = await loadImageHelper(this.src)
    const style = this.style
    const position = this.style.position
    if (this.style.shape === 'Circle') {
      selectCircleRange(ctx, position.x, position.y, style.width, style.height)
    }
    if (this.style.shape === 'RoundRect') {
      selectRoundRectRange(
        ctx,
        position.x,
        position.y,
        style.width,
        style.height,
        style.radius
      )
    }
    if (this.style.shape === 'Rect') {
    }
    if (this.style.shape === 'SlicingRect') {
      let ratio = _image.width / style.width
      let sx = 0
      let sy = (_image.height - style.height * ratio) / 2
      let sWidth = _image.width
      let sHeight = _image.height - 2 * sy
      ctx.drawImage(
        _image,
        sx,
        sy,
        sWidth,
        sHeight,
        style.position.x,
        style.position.y,
        style.width,
        style.height
      )
      return
    }
    ctx.drawImage(
      _image,
      style.position.x,
      style.position.y,
      style.width,
      style.height
    )
    ctx.restore()
    if (style.border) {
      // TODO: 应该用叠加色块会更加合理
      drawBorderCircle(
        ctx,
        position.x,
        position.y,
        style.width,
        style.border.color,
        style.border.width
      )
    }
  }
}

class CText implements AdvancedComponent {
  // draws
  readonly type = 'Text'
  readonly iInterface = 'AdvancedComponent'

  constructor(readonly name: string, readonly backgroundColor: string) {}

  async draw(ctx: CanvasRenderingContext2D): Promise<void> {}
}

const DefaultSize = {
  height: 1125,
  width: 1125,
  quality: 0.85,
}

function contextReset(ctx) {
  ctx.lineWidth = 0
  ctx.setLineDash([])
  ctx.strokeStyle = '#FFF'
  ctx.fillStyle = '#000'
  ctx.shadowBlur = 0
  ctx.shadowColor = 'rgba(0, 0, 0, 0)'
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.textBaseline = 'top'
  ctx.textAlign = 'left'
}

export class Artboard {
  readonly type = 'Artboard'
  canvas: any

  constructor(
    readonly name: string,
    readonly size: typeof DefaultSize,
    readonly background: string | Boolean,
    readonly components: Array<
      AdvancedComponent | PrimitiveComponent | HelperComponent
    >
  ) {}

  get width(): number {
    return this.size.width
  }

  get height(): number {
    return this.size.height
  }

  get hWidth(): number {
    return this.width / 2
  }

  get hHeight(): number {
    return this.height / 2
  }

  get triWidth(): number {
    return this.width / 3
  }

  get triHeight(): number {
    return this.height / 3
  }

  async draw() {
    let canvas = await initialCanvas(this.size.width, this.size.height)
    this.canvas = canvas
    // @ts-ignore
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw Error('无法初始化ctx')
    }
    if (this.background) {
      await drawBackgroundImage(ctx, this.background, this.size)
    }

    if (EXTRA_AUXILIARY_LINE_SHOW) {
      ctx.setLineDash([6])
      ctx.strokeStyle = '#DD0000'
      ctx.lineWidth = 1
      ctx.beginPath()
      // ctx.moveTo(this.size.height / 2, this.size.width / 2)
      // ctx.lineTo(this.size.height / 2, this.size.width / 2)
      ctx.moveTo(0, 0)
      ctx.lineTo(this.width, this.height)
      ctx.stroke()
      ctx.moveTo(this.width, 0)
      ctx.lineTo(0, this.height)
      ctx.stroke()
      ctx.moveTo(this.hWidth, 0)
      ctx.lineTo(this.hWidth, this.height)
      ctx.stroke()
      ctx.moveTo(0, this.hHeight)
      ctx.lineTo(this.width, this.hHeight)
      ctx.stroke()
      ctx.lineWidth = 1
      ctx.strokeStyle = '#000'
    }
    for (let component of this.components) {
      if (component.iInterface === 'PrimitiveComponent') {
        await component.draw(ctx)
      }
      if (component.iInterface === 'AdvancedComponent') {
        await component.draw(ctx)
      }
      if (component.iInterface === 'HelperComponent') {
        await component.draw(ctx)
      }
      contextReset(ctx)
      // 工具组件
      // 3.1 偏移位置
    }
  }

  toBase64() {
    return this.canvas.toDataURL('image/jpeg', this.size.quality)
  }

  toBuffer() {
    return this.canvas.toBuffer('image/jpeg', {
      quality: this.size.quality,
    })
  }
}
