import { useState } from "react";
import { Button } from "./ui/button";
import { ImageUploader } from "./ImageUploader";
import { toast } from "sonner";

interface WatermarkLayoutProps {
  onSave: (layout: WatermarkConfig) => void;
}

export interface WatermarkConfig {
  logo?: string;
  overlay?: string;
  bottomImages: string[];
}

export const WatermarkLayout = ({ onSave }: WatermarkLayoutProps) => {
  const [logo, setLogo] = useState<string>();
  const [overlay, setOverlay] = useState<string>();
  const [bottomImages, setBottomImages] = useState<string[]>([]);

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
    });
    toast.success("Watermark layout saved");
  };

  return (
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

      <Button onClick={handleSave} className="w-full">
        Save Watermark Layout
      </Button>
    </div>
  );
};