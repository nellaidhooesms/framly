import { createCanvas } from "./canvas";

export const createFrame = async (
  logo: string | undefined,
  bottomImages: string[],
  size: number = 1080
): Promise<string> => {
  const { canvas, ctx } = createCanvas(size, size);
  
  // Make the canvas transparent initially
  ctx.clearRect(0, 0, size, size);

  // Add logo if provided
  if (logo) {
    const logoImg = new Image();
    await new Promise((resolve) => {
      logoImg.onload = resolve;
      logoImg.src = logo;
    });
    
    const logoSize = size * 0.15;
    ctx.drawImage(logoImg, 20, 20, logoSize, logoSize);
  }

  // Add bottom images if provided
  if (bottomImages.length > 0) {
    const bottomHeight = size * 0.15;
    const bottomWidth = Math.min(size, size * 0.8);
    const maxImages = Math.min(3, bottomImages.length);
    const spacing = size * 0.02;
    const startY = size - bottomHeight - spacing;

    await Promise.all(bottomImages.map(async (imgSrc, i) => {
      const img = new Image();
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = imgSrc;
      });

      const sectionWidth = (bottomWidth - (spacing * (maxImages - 1))) / maxImages;
      const x = (size - bottomWidth) / 2 + (i * (sectionWidth + spacing));
      ctx.drawImage(img, x, startY, sectionWidth, bottomHeight);
    }));
  }

  return canvas.toDataURL('image/png', 1.0);
};