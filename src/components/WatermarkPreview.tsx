import { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { WatermarkConfig } from "./WatermarkLayout";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";

interface WatermarkPreviewProps {
  imageUrl?: string;
  config: WatermarkConfig;
  onPositionChange?: (x: number, y: number) => void;
  onOpacityChange?: (opacity: number) => void;
}

export const WatermarkPreview = ({
  imageUrl,
  config,
  onPositionChange,
  onOpacityChange,
}: WatermarkPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [opacity, setOpacity] = useState(100);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleOpacityChange = (value: number[]) => {
    setOpacity(value[0]);
    onOpacityChange?.(value[0] / 100);
  };

  const handlePositionChange = (axis: "x" | "y", value: number[]) => {
    const newPosition = { ...position, [axis]: value[0] };
    setPosition(newPosition);
    onPositionChange?.(newPosition.x, newPosition.y);
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-secondary">
        {isLoading && <Skeleton className="w-full h-full absolute inset-0" />}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-full object-contain"
            onLoad={handleImageLoad}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No image selected
          </div>
        )}
      </div>

      <div className="space-y-4 p-4 bg-secondary rounded-lg">
        <div className="space-y-2">
          <Label>Opacity</Label>
          <Slider
            value={[opacity]}
            onValueChange={handleOpacityChange}
            min={0}
            max={100}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label>Horizontal Position</Label>
          <Slider
            value={[position.x]}
            onValueChange={(value) => handlePositionChange("x", value)}
            min={0}
            max={100}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label>Vertical Position</Label>
          <Slider
            value={[position.y]}
            onValueChange={(value) => handlePositionChange("y", value)}
            min={0}
            max={100}
            step={1}
          />
        </div>
      </div>
    </div>
  );
};