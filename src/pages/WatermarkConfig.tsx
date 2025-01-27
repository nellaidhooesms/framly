import { WatermarkLayout } from "../components/WatermarkLayout";

const WatermarkConfig = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Watermark Configuration</h1>
        <p className="text-center text-muted-foreground">
          Configure your watermark layout including logo, overlay, and bottom images.
        </p>
        <WatermarkLayout />
      </div>
    </div>
  );
};

export default WatermarkConfig;