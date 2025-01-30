export const createCanvas = (width: number, height: number) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  canvas.width = width;
  canvas.height = height;
  return { canvas, ctx };
};

export const hasTransparency = (ctx: CanvasRenderingContext2D, width: number, height: number): boolean => {
  const imageData = ctx.getImageData(0, 0, width, height);
  return Array.from(imageData.data).some((value, index) => (index + 1) % 4 === 0 && value < 255);
};

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });
};