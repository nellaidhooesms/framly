import { useState } from "react";
import { Button } from "./ui/button";
import { WatermarkPreview } from "./WatermarkPreview";
import { LogoUploader } from "./watermark/LogoUploader";
import { BottomImagesUploader } from "./watermark/BottomImagesUploader";
import { Card } from "./ui/card";

interface WatermarkLayoutProps {
  onSave: (layout: WatermarkConfig) => void;
}

export interface WatermarkConfig {
  logo?: string;
  bottomImages: string[];
}

export const WatermarkLayout = ({ onSave }: WatermarkLayoutProps) => {
  const [logo, setLogo] = useState<string>();
  const [bottomImages, setBottomImages] = useState<string[]>([]);

  const getCurrentConfig = (): WatermarkConfig => ({
    logo,
    bottomImages,
  });

  const handleSave = () => {
    onSave(getCurrentConfig());
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6 space-y-8">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Frame Configuration</h2>
          <p className="text-sm text-muted-foreground">
            Upload your logo and bottom images to create a 1080x1080 frame
          </p>
        </div>

        <LogoUploader 
          logo={logo} 
          onLogoChange={setLogo}
          description="Logo will be placed in the top-left corner (15% of frame size)"
        />
        
        <BottomImagesUploader
          bottomImages={bottomImages}
          onBottomImagesChange={setBottomImages}
          description="Up to 3 images will be placed at the bottom (15% height, 80% total width)"
        />

        <Button onClick={handleSave} className="w-full">
          Save Frame Configuration
        </Button>
      </Card>

      <div className="space-y-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Preview (1080x1080)</h3>
          <WatermarkPreview
            config={{
              logo,
              bottomImages,
            }}
          />
        </Card>
      </div>
    </div>
  );
};