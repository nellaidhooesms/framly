import React, { useState, useEffect } from "react";
import { ImageUploader } from "./ImageUploader";
import { ImagePreview } from "./ImagePreview";
import { createSquareImage, addWatermark, downloadAsZip } from "../utils/imageProcessing";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { FolderOpen, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import { WatermarkConfig } from "./WatermarkLayout";
import { Skeleton } from "./ui/skeleton";
import { ImageFilters, FilterConfig } from "./ImageFilters";
import { ProcessingControls } from "./ProcessingControls";
import { ImageControls } from "./ImageControls";

export const ImageProcessor = () => {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [processing, setProcessing] = useState<Set<number>>(new Set());
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [outputFormat, setOutputFormat] = useState("image/jpeg");
  const [imageSize, setImageSize] = useState(1080);
  const [watermarkConfig, setWatermarkConfig] = useState<WatermarkConfig>({
    bottomImages: [],
    textConfig: {
      text: "",
      direction: "ltr"
    }
  });
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    filter: "none"
  });

  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('watermarkConfig');
      if (savedConfig) {
        setWatermarkConfig(JSON.parse(savedConfig));
      }
    } catch (error) {
      console.error('Error loading watermark config:', error);
      toast.error('Failed to load watermark configuration');
    }
  }, []);

  const handleImagesSelected = (files: File[]) => {
    setIsLoading(true);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    setIsLoading(false);
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

      const squareImage = await createSquareImage(img, imageSize, filterConfig);
      const finalImage = await addWatermark(squareImage, watermarkConfig, outputFormat);

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
    if (processedImages.length === 0) {
      toast.error("No processed images to download");
      return;
    }
    
    toast.promise(
      downloadAsZip(processedImages),
      {
        loading: 'Creating ZIP file...',
        success: 'Images downloaded successfully',
        error: 'Failed to create ZIP file'
      }
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Image Processing</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowControls(!showControls)}
            title={showControls ? "Hide controls" : "Show controls"}
          >
            {showControls ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <>
          {showControls && (
            <>
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
                  <ImageControls
                    format={outputFormat}
                    onFormatChange={setOutputFormat}
                    size={imageSize}
                    onSizeChange={setImageSize}
                  />
                  <ImageFilters config={filterConfig} onChange={setFilterConfig} />
                  <ProcessingControls
                    onProcessAll={processAllImages}
                    onDownloadAll={downloadAll}
                    hasImages={images.length > 0}
                    hasProcessedImages={processedImages.length > 0}
                    isProcessing={processing.size > 0}
                  />
                </>
              )}
            </>
          )}
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square">
                  <Skeleton className="w-full h-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : images.length > 0 ? (
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
          ) : null}
        </>
      )}
    </div>
  );
};