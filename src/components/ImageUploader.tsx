import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Progress } from "./ui/progress";

interface ImageUploaderProps {
  onImagesSelected: (files: File[]) => void;
  maxFiles?: number;
  accept?: Record<string, string[]>;
}

export const ImageUploader = ({ onImagesSelected, maxFiles, accept }: ImageUploaderProps) => {
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
    accept,
    maxFiles,
    disabled: isUploading,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer smooth-transition ${
          isDragActive
            ? "border-primary bg-primary/10 scale-[1.02] shadow-lg"
            : isUploading
            ? "border-muted bg-muted/50 cursor-not-allowed"
            : "border-muted hover:border-primary/50 hover:bg-accent/30 hover:shadow-md"
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-3">
          <div className={`text-4xl transition-transform duration-300 ${isDragActive ? 'scale-125' : 'scale-100'}`}>
            📸
          </div>
          {isDragActive ? (
            <p className="text-lg font-medium animate-pulse">Drop the images here...</p>
          ) : isUploading ? (
            <p className="text-muted-foreground animate-pulse">Uploading images...</p>
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
        <div className="mt-4 animate-fade-in">
          <Progress value={uploadProgress} className="h-2 smooth-transition" />
        </div>
      )}
    </div>
  );
};