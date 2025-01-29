import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export interface FilterConfig {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  filter: string;
}

interface ImageFiltersProps {
  config: FilterConfig;
  onChange: (config: FilterConfig) => void;
}

const defaultFilters = [
  { label: "None", value: "none" },
  { label: "Grayscale", value: "grayscale" },
  { label: "Sepia", value: "sepia" },
];

export const ImageFilters = ({ config, onChange }: ImageFiltersProps) => {
  const handleFilterChange = (value: string) => {
    onChange({ ...config, filter: value });
  };

  const handleSliderChange = (key: keyof Omit<FilterConfig, "filter">, value: number[]) => {
    onChange({ ...config, [key]: value[0] });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="space-y-2">
        <Label>Filter</Label>
        <Select value={config.filter} onValueChange={handleFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a filter" />
          </SelectTrigger>
          <SelectContent>
            {defaultFilters.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Brightness ({config.brightness}%)</Label>
        <Slider
          value={[config.brightness]}
          min={0}
          max={200}
          step={1}
          onValueChange={(value) => handleSliderChange("brightness", value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Contrast ({config.contrast}%)</Label>
        <Slider
          value={[config.contrast]}
          min={0}
          max={200}
          step={1}
          onValueChange={(value) => handleSliderChange("contrast", value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Saturation ({config.saturation}%)</Label>
        <Slider
          value={[config.saturation]}
          min={0}
          max={200}
          step={1}
          onValueChange={(value) => handleSliderChange("saturation", value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Blur ({config.blur}px)</Label>
        <Slider
          value={[config.blur]}
          min={0}
          max={10}
          step={0.1}
          onValueChange={(value) => handleSliderChange("blur", value)}
        />
      </div>
    </div>
  );
};