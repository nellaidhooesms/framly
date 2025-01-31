import { Button } from "../ui/button";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { WatermarkConfig } from "../WatermarkLayout";

interface TemplateImportExportProps {
  templates: Record<string, WatermarkConfig>;
  currentConfig: WatermarkConfig;
  onImport: (templates: Record<string, WatermarkConfig>, config: WatermarkConfig) => void;
}

export const TemplateImportExport = ({
  templates,
  currentConfig,
  onImport,
}: TemplateImportExportProps) => {
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

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const { templates: importedTemplates, currentConfig: importedConfig } = JSON.parse(content);
          onImport(importedTemplates, importedConfig);
          toast.success("Configurations imported successfully");
        } catch (error) {
          toast.error("Failed to import configurations");
          console.error(error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
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
  );
};