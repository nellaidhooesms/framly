import { ImageUploader } from "../ImageUploader";
import { toast } from "sonner";

interface LogoUploaderProps {
  logo?: string;
  onLogoChange: (logo: string) => void;
}

export const LogoUploader = ({ logo, onLogoChange }: LogoUploaderProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Logo (Top Left)</h3>
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
        <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
      )}
    </div>
  );
};