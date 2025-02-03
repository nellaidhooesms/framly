import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { WatermarkConfig } from "./WatermarkLayout";
import { createFrame } from "../utils/image/frame";

interface WatermarkPreviewProps {
  imageUrl?: string;
  config: WatermarkConfig;
}

export const WatermarkPreview = ({
  imageUrl,
  config,
}: WatermarkPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [frameUrl, setFrameUrl] = useState<string>();

  useEffect(() => {
    const generateFrame = async () => {
      if (config.logo || config.bottomImages.length > 0) {
        const frame = await createFrame(config.logo, config.bottomImages);
        setFrameUrl(frame);
      }
    };
    generateFrame();
  }, [config.logo, config.bottomImages]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-secondary">
        {isLoading && <Skeleton className="w-full h-full absolute inset-0" />}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-full object-contain"
            onLoad={handleImageLoad}
          />
        )}
        {frameUrl && (
          <img
            src={frameUrl}
            alt="Frame"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />
        )}
        {!imageUrl && !frameUrl && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No image selected
          </div>
        )}
      </div>
    </div>
  );
};