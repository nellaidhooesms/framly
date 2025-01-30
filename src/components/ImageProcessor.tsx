import { useState, useCallback } from "react";
import { ImageUploader } from "./ImageUploader";
import { ImageList } from "./ImageList";
import { ProcessingControls } from "./ProcessingControls";
import { FilterConfig } from "./ImageFilters";
import { createSquareImage, addWatermark, downloadAsZip } from "../utils/imageProcessing";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { WatermarkConfig } from "./WatermarkLayout";

interface ImageProcessorProps {
  text?: string;
  textDirection?: "ltr" | "rtl";
  selectedFont?: string;
}

export const ImageProcessor = ({ text, textDirection, selectedFont }: ImageProcessorProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("default");
  const [templates, setTemplates] = useState<Record<string, WatermarkConfig>>({});
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    filter: "none",
  });
  const [format, setFormat] = useState("image/jpeg");
  const [size, setSize] = useState(1080);

  // Load templates on component mount
  useState(() => {
    const savedTemplates = localStorage.getItem("watermarkTemplates");
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates));
      } catch (error) {
        console.error("Error loading templates:", error);
        toast.error("Failed to load saved templates");
      }
    }
  });

  const handleImagesSelected = useCallback((newImages: File[]) => {
    const imageUrls = newImages.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...imageUrls]);
    setProcessedImages([]);
  }, []);

  const processImage = async (image: string) => {
    const img = new Image();
    img.src = image;
    await new Promise((resolve) => (img.onload = resolve));

    const squareResult = await createSquareImage(img, size, filterConfig);

    const watermarkConfig = selectedTemplate !== "default"
      ? templates[selectedTemplate]
      : JSON.parse(localStorage.getItem("watermarkConfig") || "{}");

    const watermarkResult = await addWatermark(
      squareResult.dataUrl,
      watermarkConfig,
      text,
      textDirection,
      selectedFont
    );

    return watermarkResult.dataUrl;
  };

  const handleProcess = async () => {
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    if (selectedTemplate === "default" && !localStorage.getItem("watermarkConfig")) {
      toast.error("Please select a template or configure watermark settings");
      return;
    }

    setIsProcessing(true);

    try {
      const processed = await Promise.all(images.map(processImage));
      setProcessedImages(processed);
      toast.success("Images processed successfully!");
    } catch (error) {
      console.error("Error processing images:", error);
      toast.error("Error processing images");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAll = useCallback(async () => {
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
  }, [processedImages]);

  const handleDownloadSingle = useCallback(async (index: number) => {
    if (!processedImages[index]) {
      toast.error("Image not processed yet");
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = processedImages[index];
      link.download = `processed-image-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Error downloading image");
    }
  }, [processedImages]);

  const handleRemoveImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setProcessedImages(prev => prev.filter((_, i) => i !== index));
    toast.success("Image removed successfully");
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <ImageUploader onImagesSelected={handleImagesSelected} />
        
        <div className="flex flex-col space-y-2">
          <label htmlFor="template-select" className="text-sm font-medium">
            Select Template (Optional)
          </label>
          <Select
            value={selectedTemplate}
            onValueChange={setSelectedTemplate}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default Configuration</SelectItem>
              {Object.keys(templates).map((templateName) => (
                <SelectItem key={templateName} value={templateName}>
                  {templateName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <ImageList
        images={images}
        text={text}
        textDirection={textDirection}
        selectedFont={selectedFont}
        isProcessing={isProcessing}
        onProcess={handleProcess}
        filterConfig={filterConfig}
        onFilterChange={setFilterConfig}
        onFormatChange={setFormat}
        onSizeChange={setSize}
        onRemove={handleRemoveImage}
        onDownloadSingle={handleDownloadSingle}
        processedImages={processedImages}
      />

      <ProcessingControls
        onProcessAll={handleProcess}
        onDownloadAll={handleDownloadAll}
        hasImages={images.length > 0}
        hasProcessedImages={processedImages.length > 0}
        isProcessing={isProcessing}
      />
    </div>
  );
};