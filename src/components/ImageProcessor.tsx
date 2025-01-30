import { useState } from "react";
import { ImageUploader } from "./ImageUploader";
import { ImagePreview } from "./ImagePreview";
import { ImageControls } from "./ImageControls";
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
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
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

  const handleImageRemove = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
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

  return (
    <div className="space-y-6">
      <ImageUploader onImagesSelected={handleImagesSelected} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="space-y-2">
            <ImagePreview
              src={image}
              text={text}
              textDirection={textDirection}
              selectedFont={selectedFont}
            />
            <ImageControls
              format="image/jpeg"
              onFormatChange={() => {}}
              size={1080}
              onSizeChange={() => {}}
            />
          </div>
        ))}
      </div>

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