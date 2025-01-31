import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Save } from "lucide-react";
import { WatermarkConfig } from "../WatermarkLayout";

interface TemplateSaverProps {
  newTemplateName: string;
  onTemplateNameChange: (name: string) => void;
  onSaveTemplate: () => void;
}

export const TemplateSaver = ({
  newTemplateName,
  onTemplateNameChange,
  onSaveTemplate,
}: TemplateSaverProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <Input
        placeholder="Template name"
        value={newTemplateName}
        onChange={(e) => onTemplateNameChange(e.target.value)}
        className="w-full"
      />
      <Button onClick={onSaveTemplate} className="w-full sm:w-auto whitespace-nowrap">
        <Save className="w-4 h-4 mr-2" />
        Save Template
      </Button>
    </div>
  );
};