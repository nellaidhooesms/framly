import { useState } from "react";
import { toast } from "sonner";
import { Header } from "../components/Header";
import { TextConfigurationSection } from "../components/TextConfigurationSection";
import { ImageProcessingSection } from "../components/ImageProcessingSection";
import { useTranslation } from "react-i18next";

const Index = () => {
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
        <Header onReset={handleReset} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextConfigurationSection
            text={text}
            textDirection={textDirection}
            selectedFont={selectedFont}
            onTextChange={setText}
            onDirectionChange={setTextDirection}
            onFontChange={setSelectedFont}
            onCustomFontUpload={handleCustomFontUpload}
          />
          
          <ImageProcessingSection
            text={text}
            textDirection={textDirection}
            selectedFont={selectedFont}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;