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
  
  // Initialize canvas with transparency
  ctx.clearRect(0, 0, size, size);
  
  // Draw the main image first
  ctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(img, 0, 0, size, size);
  
  // Function to draw PNG image with proper transparency
  const drawPNGWithTransparency = (
    image: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    alpha: number = 1
  ) => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d')!;
    
    // Draw on temporary canvas
    tempCtx.drawImage(image, 0, 0, width, height);
    
    // Set transparency and composite mode
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = 'source-over';
    
    // Draw from temp canvas to main canvas
    ctx.drawImage(tempCanvas, x, y);
    
    // Reset alpha
    ctx.globalAlpha = 1;
  };

  // Handle logo
  if (watermarkConfig.logo) {
    const logo = await loadImage(watermarkConfig.logo);
    const logoSize = size * 0.15;
    drawPNGWithTransparency(logo, 20, 20, logoSize, logoSize);
  }
  
  // Handle overlay
  if (watermarkConfig.overlay) {
    const overlay = await loadImage(watermarkConfig.overlay);
    const overlaySize = size * 0.3;
    const x = (watermarkConfig.position?.x ?? 50) * size / 100 - overlaySize / 2;
    const y = (watermarkConfig.position?.y ?? 50) * size / 100 - overlaySize / 2;
    drawPNGWithTransparency(
      overlay,
      x,
      y,
      overlaySize,
      overlaySize,
      watermarkConfig.opacity ?? 0.5
    );
  }
  
  // Handle bottom images
  if (watermarkConfig.bottomImages?.length > 0) {
    const bottomHeight = size * 0.15;
    const bottomWidth = Math.min(size, size * 0.8);
    const maxImages = Math.min(3, watermarkConfig.bottomImages.length);
    const spacing = size * 0.02;
    const startY = size - bottomHeight - spacing;
    
    for (let i = 0; i < maxImages; i++) {
      const bottomImg = await loadImage(watermarkConfig.bottomImages[i]);
      const sectionWidth = (bottomWidth - (spacing * (maxImages - 1))) / maxImages;
      const x = (size - bottomWidth) / 2 + (i * (sectionWidth + spacing));
      drawPNGWithTransparency(bottomImg, x, startY, sectionWidth, bottomHeight);
    }
  }

  // Handle text overlay
  if (text) {
    const padding = size * 0.02;
    const fontSize = size * 0.03;
    const bottomHeight = size * 0.15;
    
    ctx.save();
    // Semi-transparent background for text
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, size - bottomHeight - padding * 2, size, bottomHeight);
    
    ctx.font = `${fontSize}px ${selectedFont || 'Arial'}`;
    ctx.fillStyle = 'white';
    ctx.textAlign = textDirection === 'rtl' ? 'right' : 'left';
    ctx.direction = textDirection || 'ltr';
    
    const textX = textDirection === 'rtl' ? size - padding : padding;
    const textY = size - bottomHeight - padding / 2;
    ctx.fillText(text, textX, textY);
    ctx.restore();
  }

  const imageHasTransparency = hasTransparency(ctx, size, size);
  
  // Always use PNG for output to preserve transparency
  return {
    dataUrl: canvas.toDataURL('image/png', 1.0),
    hasTransparency: imageHasTransparency
  };
};