import { ImageUploader } from "../ImageUploader";
import { toast } from "sonner";

interface BottomImagesUploaderProps {
  bottomImages: string[];
  onBottomImagesChange: (images: string[]) => void;
}

export const BottomImagesUploader = ({
  bottomImages,
  onBottomImagesChange,
}: BottomImagesUploaderProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Bottom Images</h3>
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
            onBottomImagesChange([...bottomImages, ...images]);
            toast.success(`${files.length} bottom images uploaded successfully`);
          });
        }}
      />
      <div className="flex gap-4 flex-wrap">
        {bottomImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Bottom ${index + 1}`}
            className="w-24 h-24 object-cover rounded"
          />
        ))}
      </div>
    </div>
  );
};