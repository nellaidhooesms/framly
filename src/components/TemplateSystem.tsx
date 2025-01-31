import React from "react";
import { WatermarkConfig } from "./WatermarkLayout";
import { toast } from "sonner";

interface TemplateSystemProps {
  currentConfig: WatermarkConfig;
  onTemplateSelect: (config: WatermarkConfig) => void;
}

export const TemplateSystem = ({
  currentConfig,
  onTemplateSelect,
}: TemplateSystemProps) => {
  React.useEffect(() => {
    const savedTemplate = localStorage.getItem("defaultWatermarkTemplate");
    if (savedTemplate) {
      try {
        onTemplateSelect(JSON.parse(savedTemplate));
      } catch (error) {
        console.error("Error loading default template:", error);
        toast.error("Failed to load default template");
      }
    }
  }, [onTemplateSelect]);

  const handleSaveTemplate = () => {
    try {
      localStorage.setItem("defaultWatermarkTemplate", JSON.stringify(currentConfig));
      toast.success("Default template saved successfully");
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save default template");
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleSaveTemplate}
        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
      >
        Save as Default Template
      </button>
    </div>
  );
};