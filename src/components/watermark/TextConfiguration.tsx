import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { FontSelector } from "../FontSelector";

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
  return (
    <div className="space-y-4 p-4 bg-secondary rounded-lg">
      <h3 className="text-lg font-semibold">Text Configuration</h3>
      <div className="space-y-2">
        <Label htmlFor="text-input">Image Description</Label>
        <Input
          id="text-input"
          placeholder="Enter image description"
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
        <Label>Text Direction</Label>
        <RadioGroup
          value={textDirection}
          onValueChange={onDirectionChange}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ltr" id="ltr" />
            <Label htmlFor="ltr">Left to Right</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rtl" id="rtl" />
            <Label htmlFor="rtl">Right to Left</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};