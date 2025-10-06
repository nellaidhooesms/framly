import { ImageProcessor } from "./ImageProcessor";
import { useTranslation } from "react-i18next";

interface ImageProcessingSectionProps {
  text: string;
  textDirection: "ltr" | "rtl";
  selectedFont: string;
}

export const ImageProcessingSection = ({
  text,
  textDirection,
  selectedFont,
}: ImageProcessingSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4 animate-fade-in">
        <span className="w-1 h-5 bg-primary rounded-full"></span>
        <p className="text-muted-foreground">
          {t("uploadDescription")}
        </p>
      </div>
      <ImageProcessor 
        text={text}
        textDirection={textDirection}
        selectedFont={selectedFont}
      />
    </div>
  );
};