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
    textConfig: {
      text: string;
      direction: "ltr" | "rtl";
    };
    position?: {
      x: number;
      y: number;
    };
    opacity?: number;
  }
): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const img = await loadImage(image);
  
  canvas.width = img.width;
  canvas.height = img.height;
  
  // Draw original image
  ctx.drawImage(img, 0, 0);
  
  // Calculate positions based on percentages
  const getPosition = (percent: number, dimension: number) => {
    return (percent / 100) * dimension;
  };

  // Add logo if provided
  if (watermarkConfig.logo) {
    const logo = await loadImage(watermarkConfig.logo);
    const x = watermarkConfig.position 
      ? getPosition(watermarkConfig.position.x, canvas.width - 150)
      : 20;
    const y = watermarkConfig.position
      ? getPosition(watermarkConfig.position.y, canvas.height - 150)
      : 20;
    
    ctx.globalAlpha = watermarkConfig.opacity ?? 1;
    ctx.drawImage(logo, x, y, 150, 150);
    ctx.globalAlpha = 1;
  }
  
  // Add overlay if provided
  if (watermarkConfig.overlay) {
    const overlay = await loadImage(watermarkConfig.overlay);
    const x = watermarkConfig.position
      ? getPosition(watermarkConfig.position.x, canvas.width - 300)
      : canvas.width - 320;
    const y = watermarkConfig.position
      ? getPosition(watermarkConfig.position.y, canvas.height - 300)
      : 20;
    
    ctx.globalAlpha = watermarkConfig.opacity ?? 0.5;
    ctx.drawImage(overlay, x, y, 300, 300);
    ctx.globalAlpha = 1;
  }
  
  // Add bottom images if provided
  if (watermarkConfig.bottomImages.length > 0) {
    const bottomHeight = 150;
    const bottomWidth = canvas.width / 3;
    const maxImages = Math.min(3, watermarkConfig.bottomImages.length);
    const spacing = 20;
    
    ctx.globalAlpha = watermarkConfig.opacity ?? 1;
    for (let i = 0; i < maxImages; i++) {
      const bottomImg = await loadImage(watermarkConfig.bottomImages[i]);
      const x = canvas.width - ((i + 1) * (bottomWidth + spacing));
      const y = canvas.height - bottomHeight - 20;
      ctx.drawImage(bottomImg, x, y, bottomWidth, bottomHeight);
    }
    ctx.globalAlpha = 1;
  }

  // Add text overlay
  if (watermarkConfig.textConfig.text) {
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = watermarkConfig.textConfig.direction === "rtl" ? "right" : "left";
    ctx.textBaseline = "middle";
    
    // Add text shadow for better visibility
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    const x = watermarkConfig.position
      ? getPosition(watermarkConfig.position.x, canvas.width - 100)
      : watermarkConfig.textConfig.direction === "rtl"
      ? canvas.width - 40
      : 40;
    
    const y = watermarkConfig.position
      ? getPosition(watermarkConfig.position.y, canvas.height - 100)
      : canvas.height - 100;

    ctx.globalAlpha = watermarkConfig.opacity ?? 1;
    ctx.fillText(watermarkConfig.textConfig.text, x, y);
    ctx.globalAlpha = 1;

    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
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