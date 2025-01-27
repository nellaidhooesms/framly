import { useState } from "react";
import { Skeleton } from "./ui/skeleton";

interface ImagePreviewProps {
  src: string;
  onProcess: () => void;
  isProcessing: boolean;
}

export const ImagePreview = ({
  src,
  onProcess,
  isProcessing,
}: ImagePreviewProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative rounded-lg overflow-hidden animate-fade-up">
      {!isLoaded && <Skeleton className="w-full aspect-square" />}
      <img
        src={src}
        alt="Preview"
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
        {isProcessing ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-white text-sm">Processing...</span>
          </div>
        ) : (
          <button
            onClick={onProcess}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Process
          </button>
        )}
      </div>
    </div>
  );
};