import { WatermarkConfig } from "../../components/WatermarkLayout";
import { createCanvas, hasTransparency, loadImage } from "./canvas";
import { ProcessedImage } from "./types";

export const addWatermark = async (
  image: string,
  watermarkConfig: WatermarkConfig,
  text?: string,
  textDirection?: "ltr" | "rtl",
  selectedFont?: string
): Promise<ProcessedImage> => {
  const img = await loadImage(image);
  const size = img.width;
  const { canvas, ctx } = createCanvas(size, size);
  
  ctx.clearRect(0, 0, size, size);
  const bottomHeight = size * 0.15;
  
  ctx.drawImage(img, 0, 0, size, size);
  
  if (watermarkConfig.logo) {
    const logo = await loadImage(watermarkConfig.logo);
    const logoSize = size * 0.15;
    ctx.drawImage(logo, 20, 20, logoSize, logoSize);
  }
  
  if (watermarkConfig.overlay) {
    const overlay = await loadImage(watermarkConfig.overlay);
    const overlaySize = size * 0.3;
    const x = (watermarkConfig.position?.x ?? 50) * size / 100 - overlaySize / 2;
    const y = (watermarkConfig.position?.y ?? 50) * size / 100 - overlaySize / 2;
    ctx.globalAlpha = watermarkConfig.opacity ?? 0.5;
    ctx.drawImage(overlay, x, y, overlaySize, overlaySize);
    ctx.globalAlpha = 1;
  }
  
  if (watermarkConfig.bottomImages?.length > 0) {
    const bottomWidth = Math.min(size, size * 0.8);
    const maxImages = Math.min(3, watermarkConfig.bottomImages.length);
    const spacing = size * 0.02;
    const startY = size - bottomHeight - spacing;
    
    for (let i = 0; i < maxImages; i++) {
      const bottomImg = await loadImage(watermarkConfig.bottomImages[i]);
      const sectionWidth = (bottomWidth - (spacing * (maxImages - 1))) / maxImages;
      const x = (size - bottomWidth) / 2 + (i * (sectionWidth + spacing));
      ctx.drawImage(bottomImg, x, startY, sectionWidth, bottomHeight);
    }
  }

  if (text) {
    const padding = size * 0.02;
    const fontSize = size * 0.03;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, size - bottomHeight - padding * 2, size, bottomHeight);
    
    ctx.font = `${fontSize}px ${selectedFont || 'Arial'}`;
    ctx.fillStyle = 'white';
    ctx.textAlign = textDirection === 'rtl' ? 'right' : 'left';
    ctx.direction = textDirection || 'ltr';
    
    const textX = textDirection === 'rtl' ? size - padding : padding;
    const textY = size - bottomHeight - padding / 2;
    ctx.fillText(text, textX, textY);
  }

  const imageHasTransparency = hasTransparency(ctx, size, size);
  return {
    dataUrl: canvas.toDataURL(imageHasTransparency ? "image/png" : "image/jpeg", 0.95),
    hasTransparency: imageHasTransparency
  };
};