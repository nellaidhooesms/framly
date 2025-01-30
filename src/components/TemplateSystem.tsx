import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Save, Plus, Download, Upload } from "lucide-react";
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
      setTemplates(JSON.parse(savedTemplates));
    }
  }, []);

  const saveTemplate = () => {
    if (!newTemplateName) {
      toast.error("Please enter a template name");
      return;
    }

    const updatedTemplates = {
      ...templates,
      [newTemplateName]: currentConfig,
    };

    setTemplates(updatedTemplates);
    localStorage.setItem("watermarkTemplates", JSON.stringify(updatedTemplates));
    setNewTemplateName("");
    toast.success("Template saved successfully");
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
    input.onchange = (e) => {
      if (e.target instanceof HTMLInputElement) {
        importConfigurations(e as React.ChangeEvent<HTMLInputElement>);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Template name"
          value={newTemplateName}
          onChange={(e) => setNewTemplateName(e.target.value)}
        />
        <Button onClick={saveTemplate} className="whitespace-nowrap">
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
        <SelectTrigger>
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

      <div className="flex gap-2">
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