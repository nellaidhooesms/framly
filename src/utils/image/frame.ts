import { createCanvas } from "./canvas";
import { WatermarkConfig } from "../../components/WatermarkLayout";

export const createFrame = async (
  logo: string | undefined,
  bottomImages: string[],
  watermark?: WatermarkConfig["watermark"],
  size: number = 1080
): Promise<string> => {
  const { canvas, ctx } = createCanvas(size, size);
  
  // Make the canvas transparent initially
  ctx.clearRect(0, 0, size, size);

  // Add logo if provided
  if (logo) {
    const logoImg = await new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = logo;
    });
    
    const logoSize = size * 0.15;
    const padding = size * 0.02;
    
    const logoAspectRatio = logoImg.width / logoImg.height;
    const logoWidth = logoSize;
    const logoHeight = logoSize / logoAspectRatio;
    
    ctx.drawImage(logoImg, padding, padding, logoWidth, logoHeight);
  }

  // Add watermark if provided
  if (watermark?.image) {
    const watermarkImg = await new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = watermark.image;
    });

    const watermarkSize = (size * watermark.size) / 100;
    const watermarkX = (size * watermark.position.x) / 100 - watermarkSize / 2;
    const watermarkY = (size * watermark.position.y) / 100 - watermarkSize / 2;

    ctx.globalAlpha = watermark.opacity;
    ctx.drawImage(watermarkImg, watermarkX, watermarkY, watermarkSize, watermarkSize);
    ctx.globalAlpha = 1;
  }

  // Add bottom image if provided
  if (bottomImages.length > 0) {
    const bottomHeight = size * 0.15;
    const bottomWidth = size * 0.8;
    const startY = size - bottomHeight - (size * 0.02);

    const img = await new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = bottomImages[0];
    });

    const imgAspectRatio = img.width / img.height;
    const targetAspectRatio = bottomWidth / bottomHeight;

    let drawWidth = bottomWidth;
    let drawHeight = bottomHeight;
    let x = (size - bottomWidth) / 2;
    let y = startY;

    if (imgAspectRatio > targetAspectRatio) {
      drawHeight = bottomHeight;
      drawWidth = drawHeight * imgAspectRatio;
      x = (size - drawWidth) / 2;
    } else {
      drawWidth = bottomWidth;
      drawHeight = drawWidth / imgAspectRatio;
      y = startY + (bottomHeight - drawHeight) / 2;
    }

    ctx.drawImage(img, x, y, drawWidth, drawHeight);
  }

  return canvas.toDataURL('image/png', 1.0);
};