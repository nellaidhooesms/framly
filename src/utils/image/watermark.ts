import { WatermarkConfig } from "../../components/WatermarkLayout";
import { ProcessedImage } from "./types";
import { createCanvas } from "./canvas";
import { addText } from "./watermarkText";
import { createFrame } from "./frame";

export const addWatermark = async (
  image: string,
  watermarkConfig: WatermarkConfig,
  text?: string,
  textDirection?: "ltr" | "rtl",
  selectedFont?: string
): Promise<ProcessedImage> => {
  const img = new Image();
  img.src = image;
  await new Promise((resolve) => (img.onload = resolve));
  
  const size = img.width;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  canvas.width = size;
  canvas.height = size;
  
  // Draw base image
  ctx.drawImage(img, 0, 0, size, size);
  
  // Create and add frame if logo or bottom images exist
  if (watermarkConfig.logo || (watermarkConfig.bottomImages && watermarkConfig.bottomImages.length > 0)) {
    const frame = await createFrame(
      watermarkConfig.logo,
      watermarkConfig.bottomImages || [],
      size
    );
    
    const frameImg = new Image();
    frameImg.src = frame;
    await new Promise((resolve) => (frameImg.onload = resolve));
    
    // Apply opacity if specified
    if (typeof watermarkConfig.opacity === 'number') {
      ctx.globalAlpha = watermarkConfig.opacity;
    }
    
    ctx.drawImage(frameImg, 0, 0, size, size);
    ctx.globalAlpha = 1.0; // Reset opacity
  }
  
  // Add text if present
  if (text) {
    addText(ctx, text, size, textDirection, selectedFont);
  }
  
  return {
    dataUrl: canvas.toDataURL('image/png', 1.0),
    hasTransparency: true
  };
};