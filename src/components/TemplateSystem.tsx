import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Save, Plus } from "lucide-react";
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
    </div>
  );
};