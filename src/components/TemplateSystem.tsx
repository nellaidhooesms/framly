import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Save, Download, Upload } from "lucide-react";
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
      
      // Set maximum dimensions
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
      overlay: compressImage(config.overlay),
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

  const saveTemplate = () => {
    if (!newTemplateName) {
      toast.error("Please enter a template name");
      return;
    }

    try {
      // Compress images before saving
      const compressedConfig = compressImages(currentConfig);
      
      // Cleanup old templates if we have too many
      cleanupOldTemplates();

      const updatedTemplates = {
        ...templates,
        [newTemplateName]: compressedConfig,
      };

      // Try to save to localStorage
      try {
        localStorage.setItem("watermarkTemplates", JSON.stringify(updatedTemplates));
        setTemplates(updatedTemplates);
        setNewTemplateName("");
        toast.success("Template saved successfully");
      } catch (storageError) {
        // If storage fails, try to remove the oldest template
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

  const exportConfigurations = () => {
    try {
      const dataStr = JSON.stringify({
        templates,
        currentConfig
      });
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'watermark-configurations.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Configurations exported successfully");
    } catch (error) {
      toast.error("Failed to export configurations");
      console.error(error);
    }
  };

  const importConfigurations = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const { templates: importedTemplates, currentConfig: importedConfig } = JSON.parse(content);
        
        setTemplates(importedTemplates);
        localStorage.setItem("watermarkTemplates", JSON.stringify(importedTemplates));
        onTemplateSelect(importedConfig);
        
        toast.success("Configurations imported successfully");
      } catch (error) {
        toast.error("Failed to import configurations");
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: Event) => {
      if (e.target instanceof HTMLInputElement && e.target.files && e.target.files.length > 0) {
        const syntheticEvent = {
          target: e.target,
          currentTarget: e.target,
          preventDefault: () => e.preventDefault(),
          stopPropagation: () => e.stopPropagation(),
          nativeEvent: e,
          bubbles: e.bubbles,
          cancelable: e.cancelable,
          defaultPrevented: e.defaultPrevented,
          eventPhase: e.eventPhase,
          isTrusted: e.isTrusted,
          timeStamp: e.timeStamp,
          type: e.type,
          isDefaultPrevented: () => false,
          isPropagationStopped: () => false,
          persist: () => {}
        } as React.ChangeEvent<HTMLInputElement>;
        
        importConfigurations(syntheticEvent);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <Input
          placeholder="Template name"
          value={newTemplateName}
          onChange={(e) => setNewTemplateName(e.target.value)}
          className="w-full"
        />
        <Button onClick={saveTemplate} className="w-full sm:w-auto whitespace-nowrap">
          <Save className="w-4 h-4 mr-2" />
          Save Template
        </Button>
      </div>

      <Select
        onValueChange={(templateName) => {
          const template = templates[templateName];
          if (template) {
            onTemplateSelect(template);
            toast.success(`Template "${templateName}" loaded`);
          }
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Load template" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(templates).map((templateName) => (
            <SelectItem key={templateName} value={templateName}>
              {templateName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={exportConfigurations} variant="outline" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Export Configurations
        </Button>
        <Button onClick={handleImportClick} variant="outline" className="w-full">
          <Upload className="w-4 h-4 mr-2" />
          Import Configurations
        </Button>
      </div>
    </div>
  );
};
