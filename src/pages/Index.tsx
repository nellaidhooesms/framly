import { ImageProcessor } from "../components/ImageProcessor";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Social Media Image Processor</h1>
        <p className="text-center text-muted-foreground">
          Upload your images to process them for social media - includes square cropping, 
          background blur for portrait images, and watermarking.
        </p>
        <ImageProcessor />
      </div>
    </div>
  );
};

export default Index;