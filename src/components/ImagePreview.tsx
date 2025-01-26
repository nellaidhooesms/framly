import { useState } from "react";

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
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
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