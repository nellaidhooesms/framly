import { ImageProcessor } from "../components/ImageProcessor";
import { Button } from "../components/ui/button";
import { Settings, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();

  const handleReset = () => {
    // Clear local storage or any saved state
    localStorage.removeItem('watermarkConfig');
    window.location.reload();
    toast.success("All images and settings have been reset");
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Social Media Image Processor</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleReset}>
              <Trash2 className="mr-2" />
              Reset All
            </Button>
            <Button onClick={() => navigate('/watermark-config')}>
              <Settings className="mr-2" />
              Watermark Settings
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">
          Upload your images to process them for social media - includes square cropping, 
          background blur for portrait images, and watermarking.
        </p>
        <ImageProcessor />
      </div>
    </div>
  );
};

export default Index;