import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface ImageUploaderProps {
  onImagesSelected: (files: File[]) => void;
  maxFiles?: number;
}

export const ImageUploader = ({ onImagesSelected, maxFiles }: ImageUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const imageFiles = acceptedFiles.filter((file) =>
        file.type.startsWith("image/")
      );
      
      if (imageFiles.length === 0) {
        toast.error("Please upload image files only");
        return;
      }

      if (maxFiles && imageFiles.length > maxFiles) {
        toast.error(`Please upload a maximum of ${maxFiles} ${maxFiles === 1 ? 'file' : 'files'}`);
        return;
      }
      
      onImagesSelected(imageFiles);
      toast.success(`${imageFiles.length} images added`);
    },
    [onImagesSelected, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive
          ? "border-primary bg-primary/10"
          : "border-muted hover:border-primary/50"
      }`}
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        <div className="text-2xl">📸</div>
        {isDragActive ? (
          <p>Drop the images here...</p>
        ) : (
          <>
            <p className="text-lg font-medium">Drag & drop images here</p>
            <p className="text-sm text-muted-foreground">
              or click to select files
            </p>
          </>
        )}
      </div>
    </div>
  );
};