export const createSquareImage = async (
  originalImage: HTMLImageElement,
  size: number = 1080
): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = size;
  canvas.height = size;

  // If image is portrait, add blurred background
  if (originalImage.height > originalImage.width) {
    // Create blur effect
    ctx.filter = "blur(10px)";
    const scale = size / originalImage.width;
    const scaledHeight = originalImage.height * scale;
    ctx.drawImage(
      originalImage,
      0,
      -(scaledHeight - size) / 2,
      size,
      scaledHeight
    );
    
    // Clear filter and draw main image
    ctx.filter = "none";
    const targetWidth = size;
    const targetHeight = (originalImage.height * size) / originalImage.width;
    const y = (size - targetHeight) / 2;
    ctx.drawImage(originalImage, 0, y, targetWidth, targetHeight);
  } else {
    // For landscape or square images, center crop
    const scale = size / Math.min(originalImage.width, originalImage.height);
    const scaledWidth = originalImage.width * scale;
    const scaledHeight = originalImage.height * scale;
    const x = (size - scaledWidth) / 2;
    const y = (size - scaledHeight) / 2;
    ctx.drawImage(originalImage, x, y, scaledWidth, scaledHeight);
  }

  return canvas.toDataURL("image/jpeg", 0.95);
};

export const addWatermark = async (
  image: string,
  watermarkText: string
): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const img = new Image();
  
  return new Promise((resolve) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Add watermark
      ctx.font = "bold 32px Arial";
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.textAlign = "end";
      ctx.textBaseline = "bottom";
      ctx.fillText(watermarkText, canvas.width - 20, canvas.height - 20);
      
      resolve(canvas.toDataURL("image/jpeg", 0.95));
    };
    img.src = image;
  });
};