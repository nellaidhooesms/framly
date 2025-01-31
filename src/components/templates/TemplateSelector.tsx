import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { WatermarkConfig } from "../WatermarkLayout";

interface TemplateSelectorProps {
  templates: Record<string, WatermarkConfig>;
  onTemplateSelect: (config: WatermarkConfig, templateName: string) => void;
}

export const TemplateSelector = ({
  templates,
  onTemplateSelect,
}: TemplateSelectorProps) => {
  return (
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
  );
};