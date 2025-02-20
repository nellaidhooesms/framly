import { Button } from "./ui/button";
import { Play, Archive, Download } from "lucide-react";

interface ProcessingControlsProps {
  onProcessAll: () => void;
  onDownloadAll: () => void;
  onDownloadAllIndividually: () => void;
  hasImages: boolean;
  hasProcessedImages: boolean;
  isProcessing: boolean;
}

export const ProcessingControls = ({
  onProcessAll,
  onDownloadAll,
  onDownloadAllIndividually,
  hasImages,
  hasProcessedImages,
  isProcessing,
}: ProcessingControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 w-full">
      <Button
        onClick={onProcessAll}
        className="w-full"
        disabled={!hasImages || isProcessing}
      >
        <Play className="mr-2 h-4 w-4" />
        Process All Images
      </Button>
      {hasProcessedImages && (
        <>
          <Button
            onClick={onDownloadAll}
            variant="secondary"
            className="w-full"
          >
            <Archive className="mr-2 h-4 w-4" />
            Download as ZIP
          </Button>
          <Button
            onClick={onDownloadAllIndividually}
            variant="outline"
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Download All
          </Button>
        </>
      )}
    </div>
  );
};