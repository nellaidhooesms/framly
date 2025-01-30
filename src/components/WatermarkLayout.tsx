import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { WatermarkPreview } from "./WatermarkPreview";
import { TemplateSystem } from "./TemplateSystem";
import { LogoUploader } from "./watermark/LogoUploader";
import { OverlayUploader } from "./watermark/OverlayUploader";
import { BottomImagesUploader } from "./watermark/BottomImagesUploader";
import { TextConfiguration } from "./watermark/TextConfiguration";

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

        <LogoUploader logo={logo} onLogoChange={setLogo} />
        <OverlayUploader overlay={overlay} onOverlayChange={setOverlay} />
        <BottomImagesUploader
          bottomImages={bottomImages}
          onBottomImagesChange={setBottomImages}
        />
        <TextConfiguration
          text={text}
          textDirection={textDirection}
          selectedFont={selectedFont}
          onTextChange={setText}
          onDirectionChange={setTextDirection}
          onFontChange={setSelectedFont}
          onCustomFontUpload={handleCustomFontUpload}
        />

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