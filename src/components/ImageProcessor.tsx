import { useState, useEffect } from "react";
import { ImageUploader } from "./ImageUploader";
import { ImagePreview } from "./ImagePreview";
import { createSquareImage, addWatermark } from "../utils/imageProcessing";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { FolderOpen, Play } from "lucide-react";
import { WatermarkConfig } from "./WatermarkLayout";

export const ImageProcessor = () => {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [processing, setProcessing] = useState<Set<number>>(new Set());
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const [watermarkConfig, setWatermarkConfig] = useState<WatermarkConfig>({
    bottomImages: []
  });

  useEffect(() => {
    // Load watermark config from localStorage
    const savedConfig = localStorage.getItem('watermarkConfig');
    if (savedConfig) {
      setWatermarkConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleImagesSelected = (files: File[]) => {
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleFolderSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    input.multiple = true;
    
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || [])
        .filter(file => file.type.startsWith('image/'));
      
      if (files.length === 0) {
        toast.error("No image files found in the selected folder");
        return;
      }
      
      handleImagesSelected(files);
      toast.success(`${files.length} images loaded from folder`);
    };
    
    input.click();
  };

  const processImage = async (index: number) => {
    try {
      setProcessing((prev) => new Set(prev.add(index)));
      
      const img = new Image();
      img.src = images[index].preview;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const squareImage = await createSquareImage(img);
      const finalImage = await addWatermark(squareImage, watermarkConfig);

      setProcessedImages((prev) => {
        const next = [...prev];
        next[index] = finalImage;
        return next;
      });

      toast.success(`Image ${index + 1} processed successfully`);
    } catch (error) {
      toast.error(`Failed to process image ${index + 1}`);
      console.error(error);
    } finally {
      setProcessing((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }
  };

  const processAllImages = async () => {
    if (images.length === 0) {
      toast.error("No images to process");
      return;
    }

    toast.info("Processing all images...");
    
    for (let i = 0; i < images.length; i++) {
      if (!processedImages[i]) {
        await processImage(i);
      }
    }
    
    toast.success("All images processed successfully");
  };

  const downloadAll = () => {
    processedImages.forEach((image, index) => {
      const link = document.createElement("a");
      link.href = image;
      link.download = `processed-image-${index + 1}.jpg`;
      link.click();
    });
    toast.success("All processed images downloaded");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Button
          onClick={handleFolderSelect}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <FolderOpen className="mr-2" />
          Open Folder
        </Button>
        <ImageUploader onImagesSelected={handleImagesSelected} />
      </div>
      
      {images.length > 0 && (
        <>
          <div className="flex justify-center">
            <Button
              onClick={processAllImages}
              className="w-full sm:w-auto"
              disabled={processing.size > 0}
            >
              <Play className="mr-2" />
              Process All Images
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <ImagePreview
                key={index}
                src={processedImages[index] || image.preview}
                onProcess={() => processImage(index)}
                isProcessing={processing.has(index)}
              />
            ))}
          </div>
          
          {processedImages.length > 0 && (
            <div className="flex justify-center">
              <Button
                onClick={downloadAll}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Download All Processed Images
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};