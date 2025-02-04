import { WatermarkLayout, WatermarkConfig as WatermarkConfigType } from "../components/WatermarkLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

const WatermarkConfig = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSave = (config: WatermarkConfigType) => {
    try {
      localStorage.setItem('watermarkConfig', JSON.stringify(config));
      toast.success("Watermark configuration saved successfully");
      navigate('/');
    } catch (error) {
      console.error('Error saving watermark config:', error);
      toast.error("Failed to save watermark configuration. Try using smaller images.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{t('watermarkConfigTitle')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('watermarkConfigDescription')}
            </p>
          </div>
        </div>
        <WatermarkLayout onSave={handleSave} />
      </div>
    </div>
  );
};

export default WatermarkConfig;