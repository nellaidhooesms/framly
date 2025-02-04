import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { FontSelector } from "../FontSelector";
import { useTranslation } from "react-i18next";

interface TextConfigurationProps {
  text: string;
  textDirection: "ltr" | "rtl";
  selectedFont: string;
  onTextChange: (text: string) => void;
  onDirectionChange: (direction: "ltr" | "rtl") => void;
  onFontChange: (font: string) => void;
  onCustomFontUpload: (file: File) => void;
}

export const TextConfiguration = ({
  text,
  textDirection,
  selectedFont,
  onTextChange,
  onDirectionChange,
  onFontChange,
  onCustomFontUpload,
}: TextConfigurationProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 p-4 bg-secondary rounded-lg">
      <h3 className="text-lg font-semibold">{t("textConfiguration")}</h3>
      <div className="space-y-2">
        <Label htmlFor="text-input">{t("imageDescription")}</Label>
        <Input
          id="text-input"
          placeholder={t("enterImageDescription")}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          style={{ 
            fontFamily: selectedFont,
            direction: textDirection,
            textAlign: textDirection === 'rtl' ? 'right' : 'left'
          }}
        />
      </div>

      <FontSelector
        selectedFont={selectedFont}
        onFontChange={onFontChange}
        onCustomFontUpload={onCustomFontUpload}
      />

      <div className="space-y-2">
        <Label>{t("textDirection")}</Label>
        <RadioGroup
          value={textDirection}
          onValueChange={onDirectionChange}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ltr" id="ltr" />
            <Label htmlFor="ltr">{t("leftToRight")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rtl" id="rtl" />
            <Label htmlFor="rtl">{t("rightToLeft")}</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};