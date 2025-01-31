import React from "react";
import { WatermarkConfig } from "./WatermarkLayout";
import { toast } from "sonner";
import { TemplateImportExport } from "./templates/TemplateImportExport";
import { TemplateSaver } from "./templates/TemplateSaver";
import { TemplateSelector } from "./templates/TemplateSelector";

interface TemplateSystemProps {
  currentConfig: WatermarkConfig;
  onTemplateSelect: (config: WatermarkConfig) => void;
}

export const TemplateSystem = ({
  currentConfig,
  onTemplateSelect,
}: TemplateSystemProps) => {
  const [templates, setTemplates] = React.useState<Record<string, WatermarkConfig>>({});
  const [newTemplateName, setNewTemplateName] = React.useState("");

  React.useEffect(() => {
    const savedTemplates = localStorage.getItem("watermarkTemplates");
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates));
      } catch (error) {
        console.error("Error loading templates:", error);
        toast.error("Failed to load saved templates");
      }
    }
  }, []);

  const compressImages = (config: WatermarkConfig): WatermarkConfig => {
    const compressImage = (base64: string | undefined): string | undefined => {
      if (!base64) return undefined;
      
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
      
      return canvas.toDataURL('image/jpeg', 0.7);
    };

    return {
      ...config,
      logo: compressImage(config.logo),
      bottomImages: config.bottomImages.map(img => compressImage(img) || ''),
    };
  };

  const cleanupOldTemplates = () => {
    const templateEntries = Object.entries(templates);
    if (templateEntries.length > 10) {
      const reducedTemplates = Object.fromEntries(
        templateEntries.slice(-10)
      );
      setTemplates(reducedTemplates);
      localStorage.setItem("watermarkTemplates", JSON.stringify(reducedTemplates));
    }
  };

  const handleSaveTemplate = () => {
    if (!newTemplateName) {
      toast.error("Please enter a template name");
      return;
    }

    try {
      const compressedConfig = compressImages(currentConfig);
      cleanupOldTemplates();

      const updatedTemplates = {
        ...templates,
        [newTemplateName]: compressedConfig,
      };

      try {
        localStorage.setItem("watermarkTemplates", JSON.stringify(updatedTemplates));
        setTemplates(updatedTemplates);
        setNewTemplateName("");
        toast.success("Template saved successfully");
      } catch (storageError) {
        const templateKeys = Object.keys(templates);
        if (templateKeys.length > 0) {
          const oldestTemplate = templateKeys[0];
          const reducedTemplates = { ...templates };
          delete reducedTemplates[oldestTemplate];
          
          const finalTemplates = {
            ...reducedTemplates,
            [newTemplateName]: compressedConfig,
          };
          
          localStorage.setItem("watermarkTemplates", JSON.stringify(finalTemplates));
          setTemplates(finalTemplates);
          setNewTemplateName("");
          toast.success("Template saved successfully (removed oldest template)");
        } else {
          throw new Error("Cannot save template: storage full");
        }
      }
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save template. Try using smaller images.");
    }
  };

  const handleDeleteTemplate = (templateName: string) => {
    const updatedTemplates = { ...templates };
    delete updatedTemplates[templateName];
    setTemplates(updatedTemplates);
    localStorage.setItem("watermarkTemplates", JSON.stringify(updatedTemplates));
  };

  const handleImport = (importedTemplates: Record<string, WatermarkConfig>, importedConfig: WatermarkConfig) => {
    setTemplates(importedTemplates);
    localStorage.setItem("watermarkTemplates", JSON.stringify(importedTemplates));
    onTemplateSelect(importedConfig);
  };

  return (
    <div className="space-y-4">
      <TemplateSaver
        newTemplateName={newTemplateName}
        onTemplateNameChange={setNewTemplateName}
        onSaveTemplate={handleSaveTemplate}
      />

      <TemplateSelector
        templates={templates}
        onTemplateSelect={(template) => {
          onTemplateSelect(template);
          toast.success("Template loaded successfully");
        }}
        onTemplateDelete={handleDeleteTemplate}
      />

      <TemplateImportExport
        templates={templates}
        currentConfig={currentConfig}
        onImport={handleImport}
      />
    </div>
  );
};
