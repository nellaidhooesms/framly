import { WatermarkLayout, WatermarkConfig as WatermarkConfigType } from "../components/WatermarkLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const WatermarkConfig = () => {
  const navigate = useNavigate();

  const handleSave = (config: WatermarkConfigType) => {
    try {
      const compressedConfig = {
        ...config,
        logo: config.logo ? compressImage(config.logo) : undefined,
        overlay: config.overlay ? compressImage(config.overlay) : undefined,
        bottomImages: config.bottomImages.map(img => compressImage(img))
      };

      localStorage.setItem('watermarkConfig', JSON.stringify(compressedConfig));
      toast.success("Watermark configuration saved successfully");
      navigate('/');
    } catch (error) {
      console.error('Error saving watermark config:', error);
      toast.error("Failed to save watermark configuration. Try using smaller images.");
    }
  };

  const compressImage = (base64: string): string => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = base64;
    
    const maxWidth = 800;
    const maxHeight = 800;
    
    let width = img.width;
    let height = img.height;
    
    if (width > height) {
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
    }
    
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, width, height);
    
    return canvas.toDataURL('image/jpeg', 0.5);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">Watermark Configuration</h1>
        <p className="text-center text-muted-foreground">
          Configure your watermark layout including logo, overlay, and bottom images.
        </p>
        <WatermarkLayout onSave={handleSave} />
      </div>
    </div>
  );
};

export default WatermarkConfig;