import { useState } from "react";
import { Button } from "./ui/button";
import { WatermarkPreview } from "./WatermarkPreview";
import { LogoUploader } from "./watermark/LogoUploader";
import { BottomImagesUploader } from "./watermark/BottomImagesUploader";
import { WatermarkImageUploader } from "./watermark/WatermarkImageUploader";
import { Card } from "./ui/card";
import { useTranslation } from "react-i18next";

interface WatermarkLayoutProps {
  onSave: (layout: WatermarkConfig) => void;
}

export interface WatermarkConfig {
  logo?: string;
  bottomImages: string[];
  watermark?: {
    image?: string;
    opacity: number;
    size: number;
    position: {
      x: number;
      y: number;
    };
  };
}

export const WatermarkLayout = ({ onSave }: WatermarkLayoutProps) => {
  const { t } = useTranslation();
  const [logo, setLogo] = useState<string>();
  const [bottomImages, setBottomImages] = useState<string[]>([]);
  const [watermark, setWatermark] = useState<WatermarkConfig["watermark"]>({
    opacity: 0.5,
    size: 30,
    position: { x: 50, y: 50 },
  });

  const getCurrentConfig = (): WatermarkConfig => ({
    logo,
    bottomImages,
    watermark,
  });

  const handleSave = () => {
    onSave(getCurrentConfig());
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6 space-y-8">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{t('frameConfiguration')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('frameConfigDescription')}
          </p>
        </div>

        <LogoUploader 
          logo={logo} 
          onLogoChange={setLogo}
          description={t('logoDescription')}
        />
        
        <BottomImagesUploader
          bottomImages={bottomImages}
          onBottomImagesChange={setBottomImages}
          description={t('bottomImageDescription')}
        />

        <WatermarkImageUploader
          watermark={watermark}
          onWatermarkChange={setWatermark}
          description={t('watermarkDescription')}
        />

        <Button onClick={handleSave} className="w-full">
          {t('saveFrameConfiguration')}
        </Button>
      </Card>

      <div className="space-y-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">{t('preview')}</h3>
          <WatermarkPreview
            config={{
              logo,
              bottomImages,
              watermark,
            }}
          />
        </Card>
      </div>
    </div>
  );
};