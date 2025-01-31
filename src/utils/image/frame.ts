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
    
    // Preserve aspect ratio for logo
    const logoAspectRatio = logoImg.width / logoImg.height;
    const logoWidth = logoSize;
    const logoHeight = logoSize / logoAspectRatio;
    
    ctx.drawImage(logoImg, padding, padding, logoWidth, logoHeight);
  }

  // Add bottom image if provided
  if (bottomImages.length > 0) {
    const bottomHeight = 50; // Fixed 50px height
    const bottomWidth = size; // Full width (1080px)
    const startY = size - bottomHeight;

    const img = await new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = bottomImages[0]; // Only use the first image
    });

    // Preserve aspect ratio while fitting within the specified dimensions
    const imgAspectRatio = img.width / img.height;
    const targetAspectRatio = bottomWidth / bottomHeight;

    let drawWidth = bottomWidth;
    let drawHeight = bottomHeight;
    let x = 0;
    let y = startY;

    if (imgAspectRatio > targetAspectRatio) {
      // Image is wider than the target area
      drawHeight = bottomHeight;
      drawWidth = drawHeight * imgAspectRatio;
      x = (bottomWidth - drawWidth) / 2;
    } else {
      // Image is taller than the target area
      drawWidth = bottomWidth;
      drawHeight = drawWidth / imgAspectRatio;
      y = startY + (bottomHeight - drawHeight) / 2;
    }

    ctx.drawImage(img, x, y, drawWidth, drawHeight);
  }

  return canvas.toDataURL('image/png', 1.0);
};