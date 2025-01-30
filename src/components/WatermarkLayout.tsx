import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { WatermarkPreview } from "./WatermarkPreview";
import { TemplateSystem } from "./TemplateSystem";
import { LogoUploader } from "./watermark/LogoUploader";
import { OverlayUploader } from "./watermark/OverlayUploader";
import { BottomImagesUploader } from "./watermark/BottomImagesUploader";

interface WatermarkLayoutProps {
  onSave: (layout: WatermarkConfig) => void;
}

export interface WatermarkConfig {
  logo?: string;
  overlay?: string;
  bottomImages: string[];
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
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [opacity, setOpacity] = useState(1);

  const getCurrentConfig = (): WatermarkConfig => ({
    logo,
    overlay,
    bottomImages,
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