import { ImageProcessor } from "../components/ImageProcessor";
import { Button } from "../components/ui/button";
import { Settings, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TextConfiguration } from "../components/watermark/TextConfiguration";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [textDirection, setTextDirection] = useState<"ltr" | "rtl">("ltr");
  const [selectedFont, setSelectedFont] = useState("Arial");

  const handleReset = () => {
    localStorage.removeItem('watermarkConfig');
    window.location.reload();
    toast.success(t("resetAll"));
  };

  const handleCustomFontUpload = async (file: File) => {
    try {
      const fontName = file.name.split('.')[0];
      const fontUrl = URL.createObjectURL(file);
      
      const font = new FontFace(fontName, `url(${fontUrl})`, {
        unicodeRange: 'U+0780-07BF'
      });

      await font.load();
      document.fonts.add(font);
      setSelectedFont(fontName);
      toast.success("Custom font loaded successfully");
    } catch (error) {
      console.error("Error loading custom font:", error);
      toast.error("Failed to load custom font");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/framly-logo.png" alt="FRAMLY" className="w-12 h-12" />
            <h1 className="text-2xl sm:text-3xl font-bold">FRAMLY</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleReset}>
              <Trash2 className="mr-2 h-4 w-4" />
              {t("resetAll")}
            </Button>
            <Button onClick={() => navigate('/watermark-config')}>
              <Settings className="mr-2 h-4 w-4" />
              {t("watermarkSettingsButton")}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <TextConfiguration
              text={text}
              textDirection={textDirection}
              selectedFont={selectedFont}
              onTextChange={setText}
              onDirectionChange={setTextDirection}
              onFontChange={setSelectedFont}
              onCustomFontUpload={handleCustomFontUpload}
            />
            <div 
              className="p-4 bg-secondary rounded-lg"
              style={{ 
                fontFamily: selectedFont,
                direction: textDirection,
                textAlign: textDirection === 'rtl' ? 'right' : 'left'
              }}
            >
              <h3 className="text-lg font-semibold mb-2">{t("preview")}</h3>
              <p className="break-words">{text || t("enterTextToPreview")}</p>
            </div>
          </div>
          
          <div>
            <p className="text-muted-foreground mb-4">
              {t("uploadDescription")}
            </p>
            <ImageProcessor 
              text={text}
              textDirection={textDirection}
              selectedFont={selectedFont}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;