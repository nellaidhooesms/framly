import { FilterConfig } from "../../components/ImageFilters";
import { WatermarkConfig } from "../../components/WatermarkLayout";

export type ImageFormat = "image/jpeg" | "image/png" | "image/webp";

export interface ProcessedImage {
  dataUrl: string;
  hasTransparency: boolean;
}