const isBrowser =
  typeof window !== "undefined" && typeof window.document !== "undefined";
const isNode =
  typeof process !== "undefined" &&
  process.versions != null &&
  process.versions.node != null;

export async function initialCanvas(width, height, id?: string) {
  if (isNode) {
    const canvas = await import("canvas");
    return canvas.createCanvas(width, height);
  }
  return window.document.getElementById(id);
}

//加载图片
export async function loadImageHelper(src: string): Promise<any> {
  if (isNode) {
    const canvas = await import("canvas");
    return canvas.loadImage(src);
  }
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.setAttribute("crossOrigin", "anonymous");

    function cleanup() {
      image.onload = null;
      image.onerror = null;
    }

    image.onload = () => {
      cleanup();
      resolve(image);
    };
    image.onerror = err => {
      cleanup();
      reject(err);
    };

    image.src = src;
  });
}

export { isNode };
export { isBrowser };
