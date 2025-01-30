import { loadImage } from "./canvas";

export const addLogo = async (
  ctx: CanvasRenderingContext2D,
  logo: string,
  size: number
) => {
  const logoImg = await loadImage(logo);
  const logoSize = size * 0.15;
  
  // Save context state
  ctx.save();
  
  // Set composite operation for transparency
  ctx.globalCompositeOperation = 'source-over';
  
  // Create pattern from logo
  const pattern = ctx.createPattern(logoImg, 'no-repeat');
  if (pattern) {
    // Scale pattern to desired size
    const matrix = new DOMMatrix();
    matrix.scaleSelf(
      logoSize / logoImg.width,
      logoSize / logoImg.height
    );
    pattern.setTransform(matrix);
    
    // Draw pattern
    ctx.fillStyle = pattern;
    ctx.fillRect(20, 20, logoSize, logoSize);
  }
  
  // Restore context state
  ctx.restore();
};