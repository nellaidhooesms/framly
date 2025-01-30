import { WatermarkConfig } from "../../components/WatermarkLayout";
import { createCanvas, hasTransparency } from "./canvas";
import { addLogo } from "./watermarkLogo";
import { addOverlay } from "./watermarkOverlay";
import { addBottomImages } from "./watermarkBottomImages";
import { addText } from "./watermarkText";

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
  const { canvas, ctx } = createCanvas(size, size);
  
  // Clear canvas and set it to be transparent
  ctx.clearRect(0, 0, size, size);
  
  // Draw base image
  ctx.drawImage(img, 0, 0, size, size);
  
  // Add watermark elements
  if (watermarkConfig.logo) {
    await addLogo(ctx, watermarkConfig.logo, size);
  }
  
  if (watermarkConfig.overlay) {
    await addOverlay(
      ctx,
      watermarkConfig.overlay,
      size,
      watermarkConfig.position || { x: 50, y: 50 },
      watermarkConfig.opacity
    );
  }
  
  if (watermarkConfig.bottomImages?.length > 0) {
    await addBottomImages(ctx, watermarkConfig.bottomImages, size);
  }
  
  if (text) {
    addText(ctx, text, size, textDirection, selectedFont);
  }
  
  return {
    dataUrl: canvas.toDataURL('image/png', 1.0),
    hasTransparency: hasTransparency(ctx, size, size)
  };
};