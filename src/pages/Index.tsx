import { ImageProcessor } from "../components/ImageProcessor";
import { Button } from "../components/ui/button";
import { Settings, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TextConfiguration } from "../components/watermark/TextConfiguration";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [textDirection, setTextDirection] = useState<"ltr" | "rtl">("ltr");
  const [selectedFont, setSelectedFont] = useState("Arial");

  const handleReset = () => {
    localStorage.removeItem('watermarkConfig');
    window.location.reload();
    toast.success("All images and settings have been reset");
  };

  const handleCustomFontUpload = async (file: File) => {
    try {
      const fontName = file.name.split('.')[0];
      const fontUrl = URL.createObjectURL(file);
      
      const font = new FontFace(fontName, `url(${fontUrl})`, {
        unicodeRange: 'U+0780-07BF' // Thaana Script range
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Social Media Image Processor</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
              <Trash2 className="mr-2 h-4 w-4" />
              Reset All
            </Button>
            <Button onClick={() => navigate('/watermark-config')} className="w-full sm:w-auto">
              <Settings className="mr-2 h-4 w-4" />
              Watermark Settings
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
          </div>
          
          <div>
            <p className="text-muted-foreground mb-4">
              Upload your images to process them for social media - includes square cropping, 
              background blur for portrait images, and watermarking.
            </p>
            <ImageProcessor />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;