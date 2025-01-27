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
    // Calculate scaling to fit height while maintaining aspect ratio
    const scale = size / originalImage.height;
    const scaledWidth = originalImage.width * scale;
    
    // Calculate blur background scale to ensure it fills the square
    const blurScale = Math.max(size / originalImage.width, size / originalImage.height);
    const blurWidth = originalImage.width * blurScale;
    const blurHeight = originalImage.height * blurScale;
    const blurX = (size - blurWidth) / 2;
    const blurY = (size - blurHeight) / 2;
    
    // Draw blurred background (scaled to fill)
    ctx.filter = "blur(20px)";
    ctx.drawImage(
      originalImage,
      blurX,
      blurY,
      blurWidth,
      blurHeight
    );
    
    // Reset filter and draw main image centered
    ctx.filter = "none";
    ctx.drawImage(
      originalImage,
      (size - scaledWidth) / 2,
      0,
      scaledWidth,
      size
    );
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
  watermarkConfig: {
    logo?: string;
    overlay?: string;
    bottomImages: string[];
  }
): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const img = await loadImage(image);
  
  canvas.width = img.width;
  canvas.height = img.height;
  
  // Draw original image
  ctx.drawImage(img, 0, 0);
  
  // Add logo if provided (top left, 150x150)
  if (watermarkConfig.logo) {
    const logo = await loadImage(watermarkConfig.logo);
    const logoSize = 150;
    ctx.drawImage(logo, 20, 20, logoSize, logoSize);
  }
  
  // Add overlay if provided (top right, 300x300)
  if (watermarkConfig.overlay) {
    const overlay = await loadImage(watermarkConfig.overlay);
    ctx.globalAlpha = 0.5;
    ctx.drawImage(overlay, canvas.width - 320, 20, 300, 300);
    ctx.globalAlpha = 1;
  }
  
  // Add bottom images if provided (1080x150)
  if (watermarkConfig.bottomImages.length > 0) {
    const bottomHeight = 150;
    const bottomWidth = 1080;
    const maxImages = Math.min(3, watermarkConfig.bottomImages.length);
    const spacing = 20;
    
    for (let i = 0; i < maxImages; i++) {
      const bottomImg = await loadImage(watermarkConfig.bottomImages[i]);
      const x = canvas.width - ((i + 1) * (bottomWidth + spacing));
      const y = canvas.height - bottomHeight - 20;
      ctx.drawImage(bottomImg, x, y, bottomWidth, bottomHeight);
    }
  }
  
  return canvas.toDataURL("image/jpeg", 0.95);
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });
};