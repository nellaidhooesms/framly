import { TextConfiguration } from "./watermark/TextConfiguration";
import { useTranslation } from "react-i18next";

interface TextConfigurationSectionProps {
  text: string;
  textDirection: "ltr" | "rtl";
  selectedFont: string;
  onTextChange: (text: string) => void;
  onDirectionChange: (direction: "ltr" | "rtl") => void;
  onFontChange: (font: string) => void;
  onCustomFontUpload: (file: File) => void;
}

export const TextConfigurationSection = ({
  text,
  textDirection,
  selectedFont,
  onTextChange,
  onDirectionChange,
  onFontChange,
  onCustomFontUpload,
}: TextConfigurationSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <TextConfiguration
        text={text}
        textDirection={textDirection}
        selectedFont={selectedFont}
        onTextChange={onTextChange}
        onDirectionChange={onDirectionChange}
        onFontChange={onFontChange}
        onCustomFontUpload={onCustomFontUpload}
      />
      <div 
        className="p-4 bg-secondary rounded-lg"
        style={{ 
          fontFamily: selectedFont,
          direction: textDirection,
          textAlign: textDirection === 'rtl' ? 'right' : 'left'
        }}
      >
        <h3 className="text-lg font-semibold mb-2">{t('preview')}</h3>
        <p className="break-words">{text || t('enterTextToPreview')}</p>
      </div>
    </div>
  );
};