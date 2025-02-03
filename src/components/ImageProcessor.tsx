import { ImageUploader } from "./ImageUploader";
import { ImageList } from "./ImageList";
import { ProcessingControls } from "./ProcessingControls";
import { useImageProcessing } from "../hooks/useImageProcessing";
import { useImageDownload } from "../hooks/useImageDownload";

interface ImageProcessorProps {
  text?: string;
  textDirection?: "ltr" | "rtl";
  selectedFont?: string;
}

export const ImageProcessor = ({ text, textDirection, selectedFont }: ImageProcessorProps) => {
  const {
    images,
    processedImages,
    isProcessing,
    filterConfig,
    setFilterConfig,
    handleImagesSelected,
    handleProcess,
    handleRemoveImage,
  } = useImageProcessing();

  const {
    handleDownloadAll,
    handleDownloadAllIndividually,
    handleDownloadSingle,
  } = useImageDownload(processedImages);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <ImageUploader onImagesSelected={handleImagesSelected} />
      </div>
      
      <ImageList
        images={images}
        text={text}
        textDirection={textDirection}
        selectedFont={selectedFont}
        isProcessing={isProcessing}
        onProcess={() => handleProcess(text, textDirection, selectedFont)}
        filterConfig={filterConfig}
        onFilterChange={setFilterConfig}
        onRemove={handleRemoveImage}
        onDownloadSingle={handleDownloadSingle}
        processedImages={processedImages}
      />

      <ProcessingControls
        onProcessAll={() => handleProcess(text, textDirection, selectedFont)}
        onDownloadAll={handleDownloadAll}
        onDownloadAllIndividually={handleDownloadAllIndividually}
        hasImages={images.length > 0}
        hasProcessedImages={processedImages.length > 0}
        isProcessing={isProcessing}
      />
    </div>
  );
};