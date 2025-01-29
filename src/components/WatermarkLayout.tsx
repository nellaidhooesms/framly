import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ImageUploader } from "./ImageUploader";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { WatermarkPreview } from "./WatermarkPreview";
import { FontSelector } from "./FontSelector";
import { TemplateSystem } from "./TemplateSystem";

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
    font?: string;
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
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [opacity, setOpacity] = useState(1);
  const [customFonts, setCustomFonts] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Open+Sans:wght@400;700&family=Lato:wght@400;700&family=Montserrat:wght@400;700&family=Playfair+Display:wght@400;700&family=Source+Sans+Pro:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const handleCustomFontUpload = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fontData = e.target?.result as string;
        const fontName = file.name.split('.')[0];
        const fontFace = new FontFace(fontName, fontData);
        
        await fontFace.load();
        document.fonts.add(fontFace);
        
        setCustomFonts(prev => ({
          ...prev,
          [fontName]: fontData
        }));
        
        setSelectedFont(fontName);
        toast.success(`Custom font "${fontName}" loaded successfully`);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to load custom font");
      console.error(error);
    }
  };

  const getCurrentConfig = (): WatermarkConfig => ({
    logo,
    overlay,
    bottomImages,
    textConfig: {
      text,
      direction: textDirection,
      font: selectedFont,
    },
    position,
    opacity,
  });

  const handleSave = () => {
    onSave(getCurrentConfig());
    toast.success("Watermark layout saved");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-8 p-6 bg-secondary rounded-lg">
        <TemplateSystem
          currentConfig={getCurrentConfig()}
          onTemplateSelect={(config) => {
            setLogo(config.logo);
            setOverlay(config.overlay);
            setBottomImages(config.bottomImages);
            setText(config.textConfig.text);
            setTextDirection(config.textConfig.direction);
            setSelectedFont(config.textConfig.font || "Arial");
            setPosition(config.position || { x: 50, y: 50 });
            setOpacity(config.opacity || 1);
          }}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Logo (Top Left)</h3>
          <ImageUploader onImagesSelected={(files) => {
            if (files[0]) {
              const reader = new FileReader();
              reader.onload = (e) => {
                setLogo(e.target?.result as string);
                toast.success("Logo uploaded successfully");
              };
              reader.readAsDataURL(files[0]);
            }
          }} maxFiles={1} />
          {logo && (
            <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Overlay Image (Middle Left)</h3>
          <ImageUploader onImagesSelected={(files) => {
            if (files[0]) {
              const reader = new FileReader();
              reader.onload = (e) => {
                setOverlay(e.target?.result as string);
                toast.success("Overlay image uploaded successfully");
              };
              reader.readAsDataURL(files[0]);
            }
          }} maxFiles={1} />
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
          <ImageUploader onImagesSelected={(files) => {
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
          }} />
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
          <h3 className="text-lg font-semibold">Text Configuration</h3>
          <Input
            placeholder="Enter image description"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          <FontSelector
            selectedFont={selectedFont}
            onFontChange={setSelectedFont}
            onCustomFontUpload={handleCustomFontUpload}
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
            textConfig: { 
              text, 
              direction: textDirection,
              font: selectedFont
            },
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
