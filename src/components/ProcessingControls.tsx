import { Button } from "./ui/button";
import { Play, Archive } from "lucide-react";

interface ProcessingControlsProps {
  onProcessAll: () => void;
  onDownloadAll: () => void;
  hasImages: boolean;
  hasProcessedImages: boolean;
  isProcessing: boolean;
}

export const ProcessingControls = ({
  onProcessAll,
  onDownloadAll,
  hasImages,
  hasProcessedImages,
  isProcessing,
}: ProcessingControlsProps) => {
  return (
    <div className="flex justify-center gap-4">
      <Button
        onClick={onProcessAll}
        className="w-full sm:w-auto"
        disabled={!hasImages || isProcessing}
      >
        <Play className="mr-2" />
        Process All Images
      </Button>
      {hasProcessedImages && (
        <Button
          onClick={onDownloadAll}
          variant="secondary"
          className="w-full sm:w-auto"
        >
          <Archive className="mr-2" />
          Download ZIP
        </Button>
      )}
    </div>
  );
};