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
        className="p-6 bg-secondary rounded-lg shadow-md smooth-transition hover:shadow-lg border border-border/50 animate-fade-in"
        style={{ 
          fontFamily: selectedFont,
          direction: textDirection,
          textAlign: textDirection === 'rtl' ? 'right' : 'left'
        }}
      >
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full"></span>
          {t('preview')}
        </h3>
        <p className="break-words text-muted-foreground leading-relaxed">{text || t('enterTextToPreview')}</p>
      </div>
    </div>
  );
};