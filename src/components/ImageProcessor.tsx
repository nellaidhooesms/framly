import { useState } from "react";
import { ImageUploader } from "./ImageUploader";
import { ImageList } from "./ImageList";
import { ProcessingControls } from "./ProcessingControls";
import { FilterConfig } from "./ImageFilters";
import { createSquareImage, addWatermark, downloadAsZip } from "../utils/imageProcessing";
import { toast } from "sonner";

interface ImageProcessorProps {
  text?: string;
  textDirection?: "ltr" | "rtl";
  selectedFont?: string;
}

export const ImageProcessor = ({ text, textDirection, selectedFont }: ImageProcessorProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterConfig] = useState<FilterConfig>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    filter: "none",
  });

  const handleImagesSelected = (newImages: File[]) => {
    const imageUrls = newImages.map(file => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...imageUrls]);
    setProcessedImages([]);
  };

  const handleProcess = async () => {
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsProcessing(true);
    const processed: string[] = [];

    try {
      for (const image of images) {
        const img = new Image();
        img.src = image;
        await new Promise((resolve) => (img.onload = resolve));

        let processedImage = await createSquareImage(img, 1080, filterConfig);

        const watermarkConfig = localStorage.getItem("watermarkConfig");
        if (watermarkConfig) {
          processedImage = await addWatermark(processedImage, JSON.parse(watermarkConfig));
        }

        processed.push(processedImage);
      }

      setProcessedImages(processed);
      toast.success("Images processed successfully!");
    } catch (error) {
      console.error("Error processing images:", error);
      toast.error("Error processing images");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (processedImages.length === 0) {
      toast.error("No processed images to download");
      return;
    }

    try {
      await downloadAsZip(processedImages);
      toast.success("Images downloaded successfully!");
    } catch (error) {
      console.error("Error downloading images:", error);
      toast.error("Error downloading images");
    }
  };

  const handleSingleImageProcess = (index: number) => {
    // For now, process all images - in a future iteration this could be optimized
    // to process only the selected image
    handleProcess();
  };

  return (
    <div className="space-y-6">
      <ImageUploader onImagesSelected={handleImagesSelected} />
      
      <ImageList
        images={images}
        text={text}
        textDirection={textDirection}
        selectedFont={selectedFont}
        isProcessing={isProcessing}
        onProcess={handleSingleImageProcess}
      />

      <ProcessingControls
        onProcessAll={handleProcess}
        onDownloadAll={handleDownload}
        hasImages={images.length > 0}
        hasProcessedImages={processedImages.length > 0}
        isProcessing={isProcessing}
      />
    </div>
  );
};