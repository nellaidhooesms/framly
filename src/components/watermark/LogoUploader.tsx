import { ImageUploader } from "../ImageUploader";
import { toast } from "sonner";

interface LogoUploaderProps {
  logo?: string;
  onLogoChange: (logo: string) => void;
  description?: string;
}

export const LogoUploader = ({ logo, onLogoChange, description }: LogoUploaderProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Logo (Top Left)</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <ImageUploader
        onImagesSelected={(files) => {
          if (files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
              onLogoChange(e.target?.result as string);
              toast.success("Logo uploaded successfully");
            };
            reader.readAsDataURL(files[0]);
          }
        }}
        maxFiles={1}
      />
      {logo && (
        <img src={logo} alt="Logo" className="w-24 h-24 object-contain bg-secondary rounded-lg p-2" />
      )}
    </div>
  );
};