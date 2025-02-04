import { useState } from "react";
import { FilterConfig } from "../components/ImageFilters";
import { WatermarkConfig } from "../components/WatermarkLayout";
import { createSquareImage, addWatermark } from "../utils/imageProcessing";
import { toast } from "sonner";

export const useImageProcessing = () => {
  const [images, setImages] = useState<string[]>([]);
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    filter: "none",
  });
  const [format, setFormat] = useState("image/jpeg");
  const [size, setSize] = useState(1080);

  const handleImagesSelected = (newImages: File[]) => {
    const imageUrls = newImages.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...imageUrls]);
    setProcessedImages([]);
  };

  const processImage = async (image: string, text?: string, textDirection?: "ltr" | "rtl", selectedFont?: string) => {
    const img = new Image();
    img.src = image;
    await new Promise((resolve) => (img.onload = resolve));

    const squareResult = await createSquareImage(img, size, filterConfig);

    const savedConfig = localStorage.getItem("watermarkConfig");
    if (!savedConfig) {
      throw new Error("No watermark configuration found");
    }
    
    const watermarkConfig: WatermarkConfig = JSON.parse(savedConfig);

    // Create a new canvas to apply the watermark
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Draw the squared image
    const squareImage = new Image();
    squareImage.src = squareResult.dataUrl;
    await new Promise((resolve) => (squareImage.onload = resolve));
    ctx.drawImage(squareImage, 0, 0);

    // Apply watermark
    const result = await addWatermark(
      canvas.toDataURL('image/png'),
      watermarkConfig,
      text,
      textDirection,
      selectedFont
    );

    return result.dataUrl;
  };

  const handleProcess = async (text?: string, textDirection?: "ltr" | "rtl", selectedFont?: string) => {
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    if (!localStorage.getItem("watermarkConfig")) {
      toast.error("Please configure watermark settings");
      return;
    }

    setIsProcessing(true);

    try {
      const processed = await Promise.all(
        images.map(image => processImage(image, text, textDirection, selectedFont))
      );
      setProcessedImages(processed);
      toast.success("Images processed successfully!");
    } catch (error) {
      console.error("Error processing images:", error);
      toast.error("Error processing images");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setProcessedImages(prev => prev.filter((_, i) => i !== index));
    toast.success("Image removed successfully");
  };

  return {
    images,
    processedImages,
    isProcessing,
    filterConfig,
    format,
    size,
    setFilterConfig,
    setFormat,
    setSize,
    handleImagesSelected,
    handleProcess,
    handleRemoveImage,
  };
};