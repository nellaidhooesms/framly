import JSZip from 'jszip';
import { FilterConfig } from '../components/ImageFilters';
import { WatermarkConfig } from '../components/WatermarkLayout';

export const createSquareImage = async (
  originalImage: HTMLImageElement,
  size: number = 1080,
  filterConfig?: FilterConfig
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

  // Apply filters if provided
  if (filterConfig) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Apply CSS filters using a temporary canvas
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    
    let filterString = '';
    if (filterConfig.brightness !== 100) filterString += `brightness(${filterConfig.brightness}%) `;
    if (filterConfig.contrast !== 100) filterString += `contrast(${filterConfig.contrast}%) `;
    if (filterConfig.saturation !== 100) filterString += `saturate(${filterConfig.saturation}%) `;
    if (filterConfig.blur > 0) filterString += `blur(${filterConfig.blur}px) `;
    if (filterConfig.filter !== 'none') filterString += `${filterConfig.filter}(100%) `;
    
    tempCtx.filter = filterString.trim();
    tempCtx.drawImage(canvas, 0, 0);
    
    // Copy back to main canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
  }

  return canvas.toDataURL("image/jpeg", 0.95);
};

export const addWatermark = async (
  image: string,
  watermarkConfig: WatermarkConfig,
  outputFormat: string = 'image/jpeg'
): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const img = await loadImage(image);
  
  canvas.width = img.width;
  canvas.height = img.height;
  
  // Draw original image
  ctx.drawImage(img, 0, 0);
  
  // Add logo if provided (top left)
  if (watermarkConfig.logo) {
    const logo = await loadImage(watermarkConfig.logo);
    ctx.drawImage(logo, 20, 20, 150, 150);
  }
  
  // Add overlay if provided (top right)
  if (watermarkConfig.overlay) {
    const overlay = await loadImage(watermarkConfig.overlay);
    const x = canvas.width - 320; // 300px width + 20px margin
    ctx.globalAlpha = watermarkConfig.opacity ?? 0.5;
    ctx.drawImage(overlay, x, 20, 300, 300);
    ctx.globalAlpha = 1;
  }
  
  // Add bottom images if provided (1080px x 150px)
  if (watermarkConfig.bottomImages.length > 0) {
    const bottomHeight = 150;
    const bottomWidth = Math.min(1080, canvas.width);
    const maxImages = Math.min(3, watermarkConfig.bottomImages.length);
    const spacing = 20;
    const startY = canvas.height - bottomHeight - 20;
    
    for (let i = 0; i < maxImages; i++) {
      const bottomImg = await loadImage(watermarkConfig.bottomImages[i]);
      const sectionWidth = (bottomWidth - (spacing * (maxImages - 1))) / maxImages;
      const x = (canvas.width - bottomWidth) / 2 + (i * (sectionWidth + spacing));
      ctx.drawImage(bottomImg, x, startY, sectionWidth, bottomHeight);
    }
  }

  // Add text overlay
  if (watermarkConfig.textConfig.text) {
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = watermarkConfig.textConfig.direction === "rtl" ? "right" : "left";
    ctx.textBaseline = "middle";
    
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    const x = watermarkConfig.textConfig.direction === "rtl"
      ? canvas.width - 40
      : 40;
    const y = canvas.height - 50;

    ctx.fillText(watermarkConfig.textConfig.text, x, y);

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
  
  const quality = outputFormat === 'image/jpeg' ? 0.95 : undefined;
  return canvas.toDataURL(outputFormat, quality);
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });
};

export const downloadAsZip = async (images: string[], filename: string = 'processed-images.zip') => {
  const zip = new JSZip();
  
  images.forEach((imageData, index) => {
    // Convert base64 to binary
    const data = atob(imageData.split(',')[1]);
    const array = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      array[i] = data.charCodeAt(i);
    }
    
    zip.file(`image-${index + 1}.jpg`, array);
  });
  
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(url);
};
