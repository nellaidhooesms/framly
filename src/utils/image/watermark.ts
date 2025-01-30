import { WatermarkConfig } from "../../components/WatermarkLayout";
import { ProcessedImage } from "./types";
import { createCanvas, hasTransparency } from "./canvas";
import { addOverlay } from "./watermarkOverlay";
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
  const { canvas, ctx } = createCanvas(size, size);
  
  // Draw base image
  ctx.drawImage(img, 0, 0, size, size);
  
  // Create and add frame (logo + bottom images)
  if (watermarkConfig.logo || watermarkConfig.bottomImages?.length > 0) {
    const frame = await createFrame(
      watermarkConfig.logo,
      watermarkConfig.bottomImages || []
    );
    
    const frameImg = new Image();
    await new Promise((resolve) => {
      frameImg.onload = resolve;
      frameImg.src = frame;
    });
    
    // Use source-over to preserve transparency
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(frameImg, 0, 0, size, size);
  }
  
  // Add overlay if present
  if (watermarkConfig.overlay) {
    await addOverlay(
      ctx,
      watermarkConfig.overlay,
      size,
      watermarkConfig.position || { x: 50, y: 50 },
      watermarkConfig.opacity
    );
  }
  
  // Add text if present
  if (text) {
    addText(ctx, text, size, textDirection, selectedFont);
  }
  
  return {
    dataUrl: canvas.toDataURL('image/png', 1.0),
    hasTransparency: hasTransparency(ctx, size, size)
  };
};