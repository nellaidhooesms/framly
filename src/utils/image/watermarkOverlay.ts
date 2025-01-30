import { loadImage } from "./canvas";

export const addOverlay = async (
  ctx: CanvasRenderingContext2D,
  overlay: string,
  size: number,
  position: { x: number; y: number },
  opacity: number = 0.5
) => {
  const overlayImg = await loadImage(overlay);
  const overlaySize = size * 0.3;
  const x = (position.x * size / 100) - (overlaySize / 2);
  const y = (position.y * size / 100) - (overlaySize / 2);

  // Save context state
  ctx.save();
  
  // Set composite operation and opacity
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = opacity;
  
  // Create pattern from overlay
  const pattern = ctx.createPattern(overlayImg, 'no-repeat');
  if (pattern) {
    // Scale pattern to desired size
    const matrix = new DOMMatrix();
    matrix.scaleSelf(
      overlaySize / overlayImg.width,
      overlaySize / overlayImg.height
    );
    pattern.setTransform(matrix);
    
    // Draw pattern
    ctx.fillStyle = pattern;
    ctx.fillRect(x, y, overlaySize, overlaySize);
  }
  
  // Restore context state
  ctx.restore();
};