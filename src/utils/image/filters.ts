import { FilterConfig } from "../../components/ImageFilters";
import { createCanvas } from "./canvas";

export const applyFilters = (
  sourceCanvas: HTMLCanvasElement,
  filterConfig: FilterConfig
): HTMLCanvasElement => {
  const { canvas: tempCanvas, ctx: tempCtx } = createCanvas(
    sourceCanvas.width,
    sourceCanvas.height
  );
  
  let filterString = '';
  if (filterConfig.brightness !== 100) filterString += `brightness(${filterConfig.brightness}%) `;
  if (filterConfig.contrast !== 100) filterString += `contrast(${filterConfig.contrast}%) `;
  if (filterConfig.saturation !== 100) filterString += `saturate(${filterConfig.saturation}%) `;
  if (filterConfig.blur > 0) filterString += `blur(${filterConfig.blur}px) `;
  if (filterConfig.filter !== 'none') filterString += `${filterConfig.filter}(100%) `;
  
  tempCtx.filter = filterString.trim();
  tempCtx.drawImage(sourceCanvas, 0, 0);
  
  return tempCanvas;
};