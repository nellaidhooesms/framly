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
    const logoImg = await new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = logo;
    });
    
    const logoSize = size * 0.15; // 15% of frame size
    const padding = size * 0.02; // 2% padding
    ctx.drawImage(logoImg, padding, padding, logoSize, logoSize);
  }

  // Add bottom images if provided
  if (bottomImages.length > 0) {
    const bottomHeight = size * 0.15; // 15% of frame size
    const bottomWidth = size * 0.8; // 80% of frame width
    const maxImages = Math.min(3, bottomImages.length);
    const spacing = size * 0.02; // 2% spacing
    const startY = size - bottomHeight - spacing;
    const startX = (size - bottomWidth) / 2;

    await Promise.all(bottomImages.map(async (imgSrc, index) => {
      if (index >= maxImages) return;

      const img = await new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = imgSrc;
      });

      const sectionWidth = (bottomWidth - (spacing * (maxImages - 1))) / maxImages;
      const x = startX + (index * (sectionWidth + spacing));
      
      ctx.drawImage(img, x, startY, sectionWidth, bottomHeight);
    }));
  }

  return canvas.toDataURL('image/png', 1.0);
};