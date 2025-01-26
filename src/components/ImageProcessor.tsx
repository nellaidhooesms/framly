import { useState } from "react";
import { ImageUploader } from "./ImageUploader";
import { ImagePreview } from "./ImagePreview";
import { createSquareImage, addWatermark } from "../utils/imageProcessing";
import { toast } from "sonner";

export const ImageProcessor = () => {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [processing, setProcessing] = useState<Set<number>>(new Set());
  const [processedImages, setProcessedImages] = useState<string[]>([]);

  const handleImagesSelected = (files: File[]) => {
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
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
      const finalImage = await addWatermark(squareImage, "© My Brand");

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
      <ImageUploader onImagesSelected={handleImagesSelected} />
      
      {images.length > 0 && (
        <>
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
              <button
                onClick={downloadAll}
                className="px-6 py-3 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
              >
                Download All Processed Images
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};