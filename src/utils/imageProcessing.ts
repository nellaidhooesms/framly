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
  const img = new Image();
  
  return new Promise((resolve) => {
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Add logo if provided
      if (watermarkConfig.logo) {
        const logo = new Image();
        await new Promise((resolve) => {
          logo.onload = resolve;
          logo.src = watermarkConfig.logo;
        });
        
        const logoSize = canvas.width * 0.15; // 15% of image width
        ctx.drawImage(logo, 20, 20, logoSize, logoSize);
      }
      
      // Add overlay if provided
      if (watermarkConfig.overlay) {
        const overlay = new Image();
        await new Promise((resolve) => {
          overlay.onload = resolve;
          overlay.src = watermarkConfig.overlay;
        });
        
        const overlayWidth = canvas.width * 0.2;
        const overlayHeight = canvas.height * 0.3;
        ctx.globalAlpha = 0.5;
        ctx.drawImage(
          overlay,
          20,
          canvas.height / 2 - overlayHeight / 2,
          overlayWidth,
          overlayHeight
        );
        ctx.globalAlpha = 1;
      }
      
      // Add bottom images if provided
      if (watermarkConfig.bottomImages.length > 0) {
        const bottomHeight = canvas.height * 0.1; // 10% of image height
        const spacing = 20;
        const maxImages = 3;
        
        for (let i = 0; i < Math.min(maxImages, watermarkConfig.bottomImages.length); i++) {
          const bottomImg = new Image();
          await new Promise((resolve) => {
            bottomImg.onload = resolve;
            bottomImg.src = watermarkConfig.bottomImages[i];
          });
          
          const x = canvas.width - ((i + 1) * (bottomHeight + spacing));
          const y = canvas.height - bottomHeight - 20;
          
          ctx.drawImage(bottomImg, x, y, bottomHeight, bottomHeight);
        }
      }
      
      resolve(canvas.toDataURL("image/jpeg", 0.95));
    };
    img.src = image;
  });
};