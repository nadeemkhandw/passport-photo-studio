export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  brightness = 0,
  contrast = 0
): Promise<string> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = imageSrc;
  });

  const rotRad = (rotation * Math.PI) / 180;

  const bBoxWidth =
    Math.abs(Math.cos(rotRad) * image.naturalWidth) +
    Math.abs(Math.sin(rotRad) * image.naturalHeight);
  const bBoxHeight =
    Math.abs(Math.sin(rotRad) * image.naturalWidth) +
    Math.abs(Math.cos(rotRad) * image.naturalHeight);

  const rotCanvas = document.createElement('canvas');
  rotCanvas.width = Math.max(1, Math.round(bBoxWidth));
  rotCanvas.height = Math.max(1, Math.round(bBoxHeight));
  const rotCtx = rotCanvas.getContext('2d');

  if (!rotCtx) return imageSrc;

  rotCtx.imageSmoothingEnabled = true;
  rotCtx.imageSmoothingQuality = 'high';

  if (brightness !== 0 || contrast !== 0) {
    rotCtx.filter = `brightness(${100 + brightness}%) contrast(${100 + contrast}%)`;
  }

  rotCtx.translate(bBoxWidth / 2, bBoxHeight / 2);
  rotCtx.rotate(rotRad);
  rotCtx.translate(-image.naturalWidth / 2, -image.naturalHeight / 2);
  rotCtx.drawImage(image, 0, 0);

  const cropCanvas = document.createElement('canvas');
  cropCanvas.width = Math.max(1, Math.round(pixelCrop.width));
  cropCanvas.height = Math.max(1, Math.round(pixelCrop.height));
  const cropCtx = cropCanvas.getContext('2d');

  if (!cropCtx) return imageSrc;

  cropCtx.imageSmoothingEnabled = true;
  cropCtx.imageSmoothingQuality = 'high';

  cropCtx.drawImage(
    rotCanvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return cropCanvas.toDataURL('image/jpeg', 0.98);
}
