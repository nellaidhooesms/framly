import { useState, useEffect } from "react";
import { ImageUploader } from "./ImageUploader";
import { ImagePreview } from "./ImagePreview";
import { createSquareImage, addWatermark } from "../utils/imageProcessing";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { FolderOpen, Play, Upload } from "lucide-react";
import { WatermarkConfig } from "./WatermarkLayout";
import { useDropzone } from "react-dropzone";
import { Progress } from "./ui/progress";

export const ImageProcessor = () => {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [processing, setProcessing] = useState<Set<number>>(new Set());
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [watermarkConfig, setWatermarkConfig] = useState<WatermarkConfig>({
    bottomImages: [],
    textConfig: {
      text: "",
      direction: "ltr"
    }
  });

  const onDrop = (acceptedFiles: File[]) => {
    handleImagesSelected(acceptedFiles);
    setUploadProgress(0);
    simulateUploadProgress();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    }
  });

  const simulateUploadProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

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
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    toast.success(`${files.length} images added successfully`);
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
      <div 
        {...getRootProps()} 
        className={`
          border-2 border-dashed rounded-lg p-8 transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
          hover:border-primary hover:bg-primary/5
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <Upload className="w-12 h-12 text-gray-400" />
          <p className="text-center text-gray-600">
            Drag and drop images here, or click to select files
          </p>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full max-w-xs">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-gray-500 mt-2 text-center">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      </div>

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
