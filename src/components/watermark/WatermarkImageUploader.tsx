import { ImageUploader } from "../ImageUploader";
import { toast } from "sonner";
import { Slider } from "../ui/slider";
import { Label } from "../ui/label";
import { WatermarkConfig } from "../WatermarkLayout";
import { useTranslation } from "react-i18next";

interface WatermarkImageUploaderProps {
  watermark: WatermarkConfig["watermark"];
  onWatermarkChange: (watermark: WatermarkConfig["watermark"]) => void;
  description?: string;
}

export const WatermarkImageUploader = ({
  watermark,
  onWatermarkChange,
  description,
}: WatermarkImageUploaderProps) => {
  const { t } = useTranslation();

  const handleImageUpload = (files: File[]) => {
    if (files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onWatermarkChange({
          ...watermark,
          image: e.target?.result as string,
        });
        toast.success("Watermark image uploaded");
      };
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{t('watermarkImage')}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <ImageUploader
        onImagesSelected={handleImageUpload}
        maxFiles={1}
        accept={{
          "image/png": [".png"],
        }}
      />

      {watermark.image && (
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>{t('opacity')}</Label>
            <Slider
              value={[watermark.opacity * 100]}
              onValueChange={(value) =>
                onWatermarkChange({
                  ...watermark,
                  opacity: value[0] / 100,
                })
              }
              min={0}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-4">
            <Label>{t('size')}</Label>
            <Slider
              value={[watermark.size]}
              onValueChange={(value) =>
                onWatermarkChange({
                  ...watermark,
                  size: value[0],
                })
              }
              min={5}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-4">
            <Label>{t('positionX')}</Label>
            <Slider
              value={[watermark.position.x]}
              onValueChange={(value) =>
                onWatermarkChange({
                  ...watermark,
                  position: {
                    ...watermark.position,
                    x: value[0],
                  },
                })
              }
              min={0}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-4">
            <Label>{t('positionY')}</Label>
            <Slider
              value={[watermark.position.y]}
              onValueChange={(value) =>
                onWatermarkChange({
                  ...watermark,
                  position: {
                    ...watermark.position,
                    y: value[0],
                  },
                })
              }
              min={0}
              max={100}
              step={1}
            />
          </div>

          <div className="relative w-24 h-24">
            <img
              src={watermark.image}
              alt="Watermark preview"
              className="w-full h-full object-contain"
              style={{ opacity: watermark.opacity }}
            />
          </div>
        </div>
      )}
    </div>
  );
};