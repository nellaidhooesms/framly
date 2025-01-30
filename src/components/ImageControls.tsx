import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";

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
      
      <div className="space-y-2">
        <Label>Image Size (px)</Label>
        <div className="flex items-center gap-4">
          <Slider
            value={[size]}
            onValueChange={(value) => onSizeChange(value[0])}
            min={300}
            max={2000}
            step={100}
            className="flex-1"
          />
          <span className="min-w-[60px] text-right">{size}px</span>
        </div>
      </div>
    </div>
  );
};