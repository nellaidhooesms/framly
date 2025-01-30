import { ImageUploader } from "../ImageUploader";
import { toast } from "sonner";

interface OverlayUploaderProps {
  overlay?: string;
  onOverlayChange: (overlay: string) => void;
}

export const OverlayUploader = ({ overlay, onOverlayChange }: OverlayUploaderProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Overlay Image (Middle Left)</h3>
      <ImageUploader
        onImagesSelected={(files) => {
          if (files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
              onOverlayChange(e.target?.result as string);
              toast.success("Overlay image uploaded successfully");
            };
            reader.readAsDataURL(files[0]);
          }
        }}
        maxFiles={1}
      />
      {overlay && (
        <img
          src={overlay}
          alt="Overlay"
          className="w-32 h-32 object-contain opacity-50"
        />
      )}
    </div>
  );
};