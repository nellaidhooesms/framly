import { useState } from "react";
import { Button } from "./ui/button";
import { ImageUploader } from "./ImageUploader";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { WatermarkPreview } from "./WatermarkPreview";

interface WatermarkLayoutProps {
  onSave: (layout: WatermarkConfig) => void;
}

export interface WatermarkConfig {
  logo?: string;
  overlay?: string;
  bottomImages: string[];
  textConfig: {
    text: string;
    direction: "ltr" | "rtl";
  };
  position?: {
    x: number;
    y: number;
  };
  opacity?: number;
}

export const WatermarkLayout = ({ onSave }: WatermarkLayoutProps) => {
  const [logo, setLogo] = useState<string>();
  const [overlay, setOverlay] = useState<string>();
  const [bottomImages, setBottomImages] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [textDirection, setTextDirection] = useState<"ltr" | "rtl">("ltr");
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [opacity, setOpacity] = useState(1);

  const handleLogoUpload = (files: File[]) => {
    if (files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string);
        toast.success("Logo uploaded successfully");
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleOverlayUpload = (files: File[]) => {
    if (files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOverlay(e.target?.result as string);
        toast.success("Overlay image uploaded successfully");
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleBottomImagesUpload = (files: File[]) => {
    const promises = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((images) => {
      setBottomImages((prev) => [...prev, ...images]);
      toast.success(`${files.length} bottom images uploaded successfully`);
    });
  };

  const handleSave = () => {
    onSave({
      logo,
      overlay,
      bottomImages,
      textConfig: {
        text,
        direction: textDirection,
      },
      position,
      opacity,
    });
    toast.success("Watermark layout saved");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-8 p-6 bg-secondary rounded-lg">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Logo (Top Left)</h3>
          <ImageUploader onImagesSelected={handleLogoUpload} maxFiles={1} />
          {logo && (
            <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Overlay Image (Middle Left)</h3>
          <ImageUploader onImagesSelected={handleOverlayUpload} maxFiles={1} />
          {overlay && (
            <img
              src={overlay}
              alt="Overlay"
              className="w-32 h-32 object-contain opacity-50"
            />
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Bottom Images</h3>
          <ImageUploader onImagesSelected={handleBottomImagesUpload} />
          <div className="flex gap-4 flex-wrap">
            {bottomImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Bottom ${index + 1}`}
                className="w-24 h-24 object-cover rounded"
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Image Description</h3>
          <Input
            placeholder="Enter image description"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Text Direction</h4>
            <RadioGroup
              value={textDirection}
              onValueChange={(value: "ltr" | "rtl") => setTextDirection(value)}
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

        <Button onClick={handleSave} className="w-full">
          Save Watermark Layout
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Preview</h3>
        <WatermarkPreview
          imageUrl={overlay || logo}
          config={{
            logo,
            overlay,
            bottomImages,
            textConfig: { text, direction: textDirection },
            position,
            opacity,
          }}
          onPositionChange={(x, y) => setPosition({ x, y })}
          onOpacityChange={setOpacity}
        />
      </div>
    </div>
  );
};