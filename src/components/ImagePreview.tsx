import { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { Play } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <div className="relative rounded-lg overflow-hidden">
      {!isLoaded && <Skeleton className="w-full aspect-square animate-pulse" />}
      <img
        src={src}
        alt="Preview"
        className={`w-full aspect-square object-cover smooth-transition ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onLoad={() => setIsLoaded(true)}
      />
      {text && (
        <div
          className="absolute left-0 right-0 p-4 animate-fade-in"
          style={{
            bottom: "40px",
            fontFamily: selectedFont,
            direction: textDirection,
            textAlign: textDirection === "rtl" ? "right" : "left",
          }}
        >
          <p className="text-white text-stroke-black break-words drop-shadow-lg">{text}</p>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 hover:opacity-100 smooth-transition flex items-center justify-center backdrop-blur-[2px]">
        {isProcessing ? (
          <div className="flex flex-col items-center gap-3 animate-fade-in">
            <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-white text-sm font-medium drop-shadow-lg">{t('processing')}</span>
          </div>
        ) : (
          <button
            onClick={onProcess}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 smooth-transition shadow-xl hover:scale-105 hover:shadow-2xl"
          >
            <Play className="w-5 h-5" />
            <span className="font-medium">{t('processImage')}</span>
          </button>
        )}
      </div>
    </div>
  );
};