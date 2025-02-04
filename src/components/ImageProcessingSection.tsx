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
    <div>
      <p className="text-muted-foreground mb-4">
        {t("uploadDescription")}
      </p>
      <ImageProcessor 
        text={text}
        textDirection={textDirection}
        selectedFont={selectedFont}
      />
    </div>
  );
};