import { FilterConfig } from "../../components/ImageFilters";
import { createCanvas, hasTransparency } from "./canvas";
import { applyFilters } from "./filters";
import { ProcessedImage } from "./types";

export const createSquareImage = async (
  originalImage: HTMLImageElement,
  size: number = 1080,
  filterConfig?: FilterConfig
): Promise<ProcessedImage> => {
  const { canvas, ctx } = createCanvas(size, size);

  // Set white background for JPEGs
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, size, size);

  // If image is portrait, add blurred background
  if (originalImage.height > originalImage.width) {
    const scale = size / originalImage.height;
    const scaledWidth = originalImage.width * scale;
    
    const blurScale = Math.max(size / originalImage.width, size / originalImage.height);
    const blurWidth = originalImage.width * blurScale;
    const blurHeight = originalImage.height * blurScale;
    const blurX = (size - blurWidth) / 2;
    const blurY = (size - blurHeight) / 2;
    
    ctx.filter = "blur(20px)";
    ctx.drawImage(originalImage, blurX, blurY, blurWidth, blurHeight);
    
    ctx.filter = "none";
    ctx.drawImage(originalImage, (size - scaledWidth) / 2, 0, scaledWidth, size);
  } else {
    const scale = size / Math.min(originalImage.width, originalImage.height);
    const scaledWidth = originalImage.width * scale;
    const scaledHeight = originalImage.height * scale;
    const x = (size - scaledWidth) / 2;
    const y = (size - scaledHeight) / 2;
    ctx.drawImage(originalImage, x, y, scaledWidth, scaledHeight);
  }

  if (filterConfig) {
    const filteredCanvas = applyFilters(canvas, filterConfig);
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(filteredCanvas, 0, 0);
  }

  const imageHasTransparency = hasTransparency(ctx, size, size);
  return {
    dataUrl: canvas.toDataURL(imageHasTransparency ? "image/png" : "image/jpeg", 0.95),
    hasTransparency: imageHasTransparency
  };
};