import { ImageUploader } from "../ImageUploader";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface BottomImagesUploaderProps {
  bottomImages: string[];
  onBottomImagesChange: (images: string[]) => void;
  description?: string;
}

export const BottomImagesUploader = ({
  bottomImages,
  onBottomImagesChange,
  description,
}: BottomImagesUploaderProps) => {
  const handleRemoveImage = () => {
    onBottomImagesChange([]);
    toast.success("Image removed successfully");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Bottom Image</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <ImageUploader
        onImagesSelected={(files) => {
          const promises = files.map((file) => {
            return new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.readAsDataURL(file);
            });
          });

          Promise.all(promises).then((images) => {
            onBottomImagesChange([images[0]]);
            toast.success("Bottom image uploaded");
          });
        }}
        maxFiles={1}
      />
      <div className="flex gap-4 flex-wrap">
        {bottomImages.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt="Bottom"
              className="w-24 h-24 object-cover rounded-lg bg-secondary"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemoveImage()}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};