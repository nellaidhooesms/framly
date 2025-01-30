import { loadImage } from "./canvas";

export const addBottomImages = async (
  ctx: CanvasRenderingContext2D,
  images: string[],
  size: number
) => {
  const bottomHeight = size * 0.15;
  const bottomWidth = Math.min(size, size * 0.8);
  const maxImages = Math.min(3, images.length);
  const spacing = size * 0.02;
  const startY = size - bottomHeight - spacing;

  // Save context state
  ctx.save();
  
  for (let i = 0; i < maxImages; i++) {
    const img = await loadImage(images[i]);
    const sectionWidth = (bottomWidth - (spacing * (maxImages - 1))) / maxImages;
    const x = (size - bottomWidth) / 2 + (i * (sectionWidth + spacing));
    
    // Set composite operation
    ctx.globalCompositeOperation = 'source-over';
    
    // Create pattern from image
    const pattern = ctx.createPattern(img, 'no-repeat');
    if (pattern) {
      // Scale pattern to desired size
      const matrix = new DOMMatrix();
      matrix.scaleSelf(
        sectionWidth / img.width,
        bottomHeight / img.height
      );
      pattern.setTransform(matrix);
      
      // Draw pattern
      ctx.fillStyle = pattern;
      ctx.fillRect(x, startY, sectionWidth, bottomHeight);
    }
  }
  
  // Restore context state
  ctx.restore();
};