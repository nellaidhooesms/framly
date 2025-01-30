import JSZip from 'jszip';

export const downloadAsZip = async (images: string[], filename: string = 'processed-images.zip') => {
  const zip = new JSZip();
  
  images.forEach((imageData, index) => {
    const data = atob(imageData.split(',')[1]);
    const array = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      array[i] = data.charCodeAt(i);
    }
    
    const isJPEG = imageData.startsWith('data:image/jpeg');
    const extension = isJPEG ? 'jpg' : 'png';
    
    zip.file(`image-${index + 1}.${extension}`, array);
  });
  
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(url);
};