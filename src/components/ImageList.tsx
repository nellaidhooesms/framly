import { ImagePreview } from "./ImagePreview";
import { ImageControls } from "./ImageControls";
import { FilterConfig } from "./ImageFilters";

interface ImageListProps {
  images: string[];
  text?: string;
  textDirection?: "ltr" | "rtl";
  selectedFont?: string;
  isProcessing: boolean;
  onProcess: (index: number) => void;
}

export const ImageList = ({
  images,
  text,
  textDirection,
  selectedFont,
  isProcessing,
  onProcess,
}: ImageListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div key={index} className="space-y-2">
          <ImagePreview
            src={image}
            onProcess={() => onProcess(index)}
            isProcessing={isProcessing}
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
  );
};