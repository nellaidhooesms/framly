import { memo } from "react";
import { ImagePreview } from "./ImagePreview";
import { FilterConfig } from "./ImageFilters";
import { Button } from "./ui/button";
import { Download, Trash2 } from "lucide-react";

interface ImageListProps {
  images: string[];
  text?: string;
  textDirection?: "ltr" | "rtl";
  selectedFont?: string;
  isProcessing: boolean;
  onProcess: (index: number) => void;
  filterConfig: FilterConfig;
  onFilterChange: (config: FilterConfig) => void;
  onRemove: (index: number) => void;
  onDownloadSingle?: (index: number) => void;
  processedImages?: string[];
}

export const ImageList = memo(({
  images,
  text,
  textDirection,
  selectedFont,
  isProcessing,
  onProcess,
  filterConfig,
  onFilterChange,
  onRemove,
  onDownloadSingle,
  processedImages = [],
}: ImageListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div key={index} className="space-y-2 animate-fade-up">
          <div className="relative group">
            <ImagePreview
              src={image}
              onProcess={() => onProcess(index)}
              isProcessing={isProcessing}
              text={text}
              textDirection={textDirection}
              selectedFont={selectedFont}
            />
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onRemove(index)}
                className="rounded-full"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              {processedImages[index] && onDownloadSingle && (
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => onDownloadSingle(index)}
                  className="rounded-full"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

ImageList.displayName = "ImageList";