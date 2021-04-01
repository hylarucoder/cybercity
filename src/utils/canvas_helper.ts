const isBrowser =
  typeof window !== 'undefined' && typeof window.document !== 'undefined'
// @ts-ignore
const isNode =
  typeof process !== 'undefined' &&
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  process.versions != null &&
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  process.versions.node != null

export async function initialCanvas(width, height, id?: string) {
  if (isNode) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const canvas = await import('canvas')
    return canvas.createCanvas(width, height)
  }
  return window.document.getElementById(id)
}

//加载图片
export async function loadImageHelper(src: string): Promise<any> {
  if (isNode) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const canvas = await import('canvas')
    return canvas.loadImage(src)
  }
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.setAttribute('crossOrigin', 'anonymous')

    function cleanup() {
      image.onload = null
      image.onerror = null
    }

    image.onload = () => {
      cleanup()
      resolve(image)
    }
    image.onerror = (err) => {
      cleanup()
      reject(err)
    }

    image.src = src
  })
}

export { isNode }
export { isBrowser }
