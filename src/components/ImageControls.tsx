import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";

interface ImageControlsProps {
  format: string;
  onFormatChange: (value: string) => void;
  size: number;
  onSizeChange: (value: number) => void;
}

export const ImageControls = ({
  format,
  onFormatChange,
  size,
  onSizeChange,
}: ImageControlsProps) => {
  return (
    <div className="space-y-4 p-4 border rounded-lg w-full">
      <div className="space-y-2">
        <Label>Output Format</Label>
        <Select value={format} onValueChange={onFormatChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="image/jpeg">JPEG</SelectItem>
            <SelectItem value="image/png">PNG</SelectItem>
            <SelectItem value="image/webp">WEBP</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};