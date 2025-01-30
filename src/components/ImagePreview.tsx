import { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { Play } from "lucide-react";

interface ImagePreviewProps {
  src: string;
  onProcess: () => void;
  isProcessing: boolean;
  text?: string;
  textDirection?: "ltr" | "rtl";
  selectedFont?: string;
}

export const ImagePreview = ({
  src,
  onProcess,
  isProcessing,
  text,
  textDirection,
  selectedFont,
}: ImagePreviewProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative rounded-lg overflow-hidden animate-fade-up">
      {!isLoaded && <Skeleton className="w-full aspect-square" />}
      <img
        src={src}
        alt="Preview"
        className={`w-full aspect-square object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
      />
      {text && (
        <div
          className="absolute bottom-0 left-0 right-0 p-4 bg-black/50"
          style={{
            fontFamily: selectedFont,
            direction: textDirection,
            textAlign: textDirection === "rtl" ? "right" : "left",
          }}
        >
          <p className="text-white break-words">{text}</p>
        </div>
      )}
      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
        {isProcessing ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-white text-sm font-medium">Processing...</span>
          </div>
        ) : (
          <button
            onClick={onProcess}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Play className="w-4 h-4" />
            Process
          </button>
        )}
      </div>
    </div>
  );
};