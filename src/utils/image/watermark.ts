import { WatermarkConfig } from "../../components/WatermarkLayout";
import { createCanvas, loadImage } from "./canvas";

export const addWatermark = async (
  imageUrl: string,
  watermarkConfig: WatermarkConfig,
  text?: string,
  textDirection?: "ltr" | "rtl",
  selectedFont?: string
): Promise<{ dataUrl: string }> => {
  const size = 1080;
  const { canvas, ctx } = createCanvas(size, size);

  // Draw the original image
  const img = await loadImage(imageUrl);
  ctx.drawImage(img, 0, 0, size, size);

  // Add watermark if available
  if (watermarkConfig.watermark?.image) {
    const watermarkImg = await loadImage(watermarkConfig.watermark.image);
    const watermarkSize = (size * watermarkConfig.watermark.size) / 100;
    const watermarkX = (size * watermarkConfig.watermark.position.x) / 100 - watermarkSize / 2;
    const watermarkY = (size * watermarkConfig.watermark.position.y) / 100 - watermarkSize / 2;

    ctx.globalAlpha = watermarkConfig.watermark.opacity;
    ctx.drawImage(watermarkImg, watermarkX, watermarkY, watermarkSize, watermarkSize);
    ctx.globalAlpha = 1;
  }

  // Add frame if available
  if (watermarkConfig.logo || watermarkConfig.bottomImages.length > 0) {
    const frame = await createFrame(watermarkConfig.logo, watermarkConfig.bottomImages);
    const frameImg = await loadImage(frame);
    ctx.drawImage(frameImg, 0, 0, size, size);
  }
  
  // Add text if present
  if (text) {
    const fontSize = size * 0.03;
    const padding = size * 0.02;
    
    ctx.font = `${fontSize}px ${selectedFont || 'Arial'}`;
    ctx.textAlign = textDirection === 'rtl' ? 'right' : 'left';
    ctx.direction = textDirection || 'ltr';
    
    const textX = textDirection === 'rtl' ? size - padding : padding;
    const textY = size - padding;
    
    ctx.strokeStyle = 'black';
    ctx.lineWidth = fontSize * 0.15;
    ctx.lineJoin = 'round';
    ctx.strokeText(text, textX, textY);
    
    ctx.fillStyle = 'white';
    ctx.fillText(text, textX, textY);
  }

  return {
    dataUrl: canvas.toDataURL('image/jpeg', 0.95),
  };
};

// Helper function to create frame
const createFrame = async (
  logo?: string,
  bottomImages: string[] = []
): Promise<string> => {
  const size = 1080;
  const { canvas, ctx } = createCanvas(size, size);
  
  // Add logo if provided
  if (logo) {
    const logoImg = await loadImage(logo);
    const logoSize = size * 0.15;
    const padding = size * 0.02;
    
    const logoAspectRatio = logoImg.width / logoImg.height;
    const logoWidth = logoSize;
    const logoHeight = logoSize / logoAspectRatio;
    
    ctx.drawImage(logoImg, padding, padding, logoWidth, logoHeight);
  }

  // Add bottom image if provided
  if (bottomImages.length > 0) {
    const bottomHeight = size * 0.15;
    const bottomWidth = size * 0.8;
    const startY = size - bottomHeight - (size * 0.02);

    const img = await loadImage(bottomImages[0]);
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