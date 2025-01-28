import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Progress } from "./ui/progress";

interface ImageUploaderProps {
  onImagesSelected: (files: File[]) => void;
  maxFiles?: number;
}

export const ImageUploader = ({ onImagesSelected, maxFiles }: ImageUploaderProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
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

      setIsUploading(true);
      setUploadProgress(0);

      // Simulate progress for demonstration
      const steps = 10;
      for (let i = 1; i <= steps; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress((i / steps) * 100);
      }
      
      onImagesSelected(imageFiles);
      toast.success(`${imageFiles.length} images added`);
      
      setIsUploading(false);
      setUploadProgress(0);
    },
    [onImagesSelected, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles,
    disabled: isUploading,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : isUploading
            ? "border-muted bg-muted/50 cursor-not-allowed"
            : "border-muted hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <div className="text-2xl">📸</div>
          {isDragActive ? (
            <p>Drop the images here...</p>
          ) : isUploading ? (
            <p className="text-muted-foreground">Uploading images...</p>
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
      {isUploading && (
        <div className="mt-4">
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
    </div>
  );
};