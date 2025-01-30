export const addText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  size: number,
  textDirection: "ltr" | "rtl" = "ltr",
  selectedFont?: string
) => {
  if (!text) return;

  const fontSize = size * 0.03;
  const padding = size * 0.02;
  
  // Save context state
  ctx.save();
  
  // Configure text style
  ctx.font = `${fontSize}px ${selectedFont || 'Arial'}`;
  ctx.textAlign = textDirection === 'rtl' ? 'right' : 'left';
  ctx.direction = textDirection;
  
  // Calculate text position
  const textX = textDirection === 'rtl' ? size - padding : padding;
  const textY = size - padding;
  
  // Add stroke for visibility
  ctx.strokeStyle = 'black';
  ctx.lineWidth = fontSize * 0.15;
  ctx.lineJoin = 'round';
  ctx.strokeText(text, textX, textY);
  
  // Draw text
  ctx.fillStyle = 'white';
  ctx.fillText(text, textX, textY);
  
  // Restore context state
  ctx.restore();
};