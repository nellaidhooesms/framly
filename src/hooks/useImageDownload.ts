import { useCallback } from "react";
import { toast } from "sonner";
import { downloadAsZip } from "../utils/imageProcessing";

export const useImageDownload = (processedImages: string[]) => {
  const handleDownloadAll = useCallback(async () => {
    if (processedImages.length === 0) {
      toast.error("No processed images to download");
      return;
    }

    try {
      await downloadAsZip(processedImages);
      toast.success("Images downloaded successfully!");
    } catch (error) {
      console.error("Error downloading images:", error);
      toast.error("Error downloading images");
    }
  }, [processedImages]);

  const handleDownloadAllIndividually = useCallback(async () => {
    if (processedImages.length === 0) {
      toast.error("No processed images to download");
      return;
    }

    try {
      processedImages.forEach((imageUrl, index) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `processed-image-${index + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
      toast.success("All images downloaded successfully!");
    } catch (error) {
      console.error("Error downloading images:", error);
      toast.error("Error downloading images");
    }
  }, [processedImages]);

  const handleDownloadSingle = useCallback(async (index: number) => {
    if (!processedImages[index]) {
      toast.error("Image not processed yet");
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = processedImages[index];
      link.download = `processed-image-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Error downloading image");
    }
  }, [processedImages]);

  return {
    handleDownloadAll,
    handleDownloadAllIndividually,
    handleDownloadSingle,
  };
};