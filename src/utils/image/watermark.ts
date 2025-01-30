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
  
  // Set initial canvas to be transparent
  ctx.clearRect(0, 0, size, size);
  
  // Draw the main image
  ctx.drawImage(img, 0, 0, size, size);
  
  // Function to draw PNG with proper transparency
  const drawPNGWithTransparency = async (
    imageSrc: string,
    x: number,
    y: number,
    width: number,
    height: number,
    opacity: number = 1
  ) => {
    const image = await loadImage(imageSrc);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true })!;
    
    // Clear temp canvas
    tempCtx.clearRect(0, 0, width, height);
    
    // Draw image on temp canvas
    tempCtx.globalAlpha = opacity;
    tempCtx.drawImage(image, 0, 0, width, height);
    
    // Draw from temp canvas to main canvas with preserve-transparency mode
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(tempCanvas, x, y);
  };

  // Handle logo
  if (watermarkConfig.logo) {
    const logoSize = size * 0.15;
    await drawPNGWithTransparency(
      watermarkConfig.logo,
      20,
      20,
      logoSize,
      logoSize
    );
  }
  
  // Handle overlay
  if (watermarkConfig.overlay) {
    const overlaySize = size * 0.3;
    const x = (watermarkConfig.position?.x ?? 50) * size / 100 - overlaySize / 2;
    const y = (watermarkConfig.position?.y ?? 50) * size / 100 - overlaySize / 2;
    await drawPNGWithTransparency(
      watermarkConfig.overlay,
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
      const sectionWidth = (bottomWidth - (spacing * (maxImages - 1))) / maxImages;
      const x = (size - bottomWidth) / 2 + (i * (sectionWidth + spacing));
      await drawPNGWithTransparency(
        watermarkConfig.bottomImages[i],
        x,
        startY,
        sectionWidth,
        bottomHeight
      );
    }
  }

  // Handle text overlay with stroke for better visibility
  if (text) {
    const fontSize = size * 0.03;
    ctx.save();
    
    // Configure text style
    ctx.font = `${fontSize}px ${selectedFont || 'Arial'}`;
    ctx.textAlign = textDirection === 'rtl' ? 'right' : 'left';
    ctx.direction = textDirection || 'ltr';
    
    // Calculate text position
    const padding = size * 0.02;
    const textX = textDirection === 'rtl' ? size - padding : padding;
    const textY = size - padding;
    
    // Add stroke to make text visible on any background
    ctx.strokeStyle = 'black';
    ctx.lineWidth = fontSize * 0.15;
    ctx.lineJoin = 'round';
    ctx.strokeText(text, textX, textY);
    
    // Draw text in white
    ctx.fillStyle = 'white';
    ctx.fillText(text, textX, textY);
    
    ctx.restore();
  }

  // Check if result has transparency
  const imageHasTransparency = hasTransparency(ctx, size, size);
  
  // Return as PNG to preserve transparency
  return {
    dataUrl: canvas.toDataURL('image/png', 1.0),
    hasTransparency: imageHasTransparency
  };
};