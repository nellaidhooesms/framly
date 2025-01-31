import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { WatermarkConfig } from "../WatermarkLayout";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface TemplateSelectorProps {
  templates: Record<string, WatermarkConfig>;
  onTemplateSelect: (config: WatermarkConfig, templateName: string) => void;
  onTemplateDelete: (templateName: string) => void;
}

export const TemplateSelector = ({
  templates,
  onTemplateSelect,
  onTemplateDelete,
}: TemplateSelectorProps) => {
  return (
    <div className="space-y-2">
      <Select
        onValueChange={(templateName) => {
          const template = templates[templateName];
          if (template) {
            onTemplateSelect(template, templateName);
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

      <div className="grid grid-cols-1 gap-2">
        {Object.keys(templates).map((templateName) => (
          <div key={templateName} className="flex items-center justify-between p-2 bg-secondary rounded-md">
            <span className="text-sm">{templateName}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onTemplateDelete(templateName);
                toast.success(`Template "${templateName}" deleted`);
              }}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};