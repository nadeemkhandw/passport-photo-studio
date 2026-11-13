import { jsPDF } from 'jspdf';
import type {
  PhotoItem,
  PrintConfig,
  GridCalculatedResult,
  GridPosition,
  CutMarkType,
  PhotoTransform,
} from '../types';

const MM_TO_PX_300DPI = 300 / 25.4;

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) return { r: 136, g: 136, b: 136 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

export async function createTransformedPhotoCanvas(
  photoSrc: string,
  targetWidthPx: number,
  targetHeightPx: number,
  transform?: PhotoTransform,
  ignoreAdjustments = false
): Promise<HTMLCanvasElement> {
  const img = await loadImage(photoSrc);

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(targetWidthPx));
  canvas.height = Math.max(1, Math.round(targetHeightPx));
  const ctx = canvas.getContext('2d');

  if (!ctx) return canvas;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, targetWidthPx, targetHeightPx);

  const crop = transform?.crop;
  const adjustments = transform?.adjustments;

  // Format-only exports (US preset) must never bake in edits, even if a
  // photo was adjusted before the preset was switched.
  const brightness = ignoreAdjustments ? 0 : (adjustments?.brightness ?? 0);
  const contrast = ignoreAdjustments ? 0 : (adjustments?.contrast ?? 0);

  if (brightness !== 0 || contrast !== 0) {
    ctx.filter = `brightness(${100 + brightness}%) contrast(${100 + contrast}%)`;
  }

  const rawWidth = img.naturalWidth || img.width || targetWidthPx;
  const rawHeight = img.naturalHeight || img.height || targetHeightPx;

  const scaleRatio = Math.min(targetWidthPx / rawWidth, targetHeightPx / rawHeight);
  const fitW = rawWidth * scaleRatio;
  const fitH = rawHeight * scaleRatio;

  ctx.save();
  ctx.rect(0, 0, targetWidthPx, targetHeightPx);
  ctx.clip();

  ctx.translate(targetWidthPx / 2, targetHeightPx / 2);

  if (crop) {
    const offsetX = (crop.x / 100) * fitW;
    const offsetY = (crop.y / 100) * fitH;
    ctx.translate(offsetX, offsetY);

    const scale = crop.scale || 1;
    ctx.scale(scale, scale);

    const rotation = crop.rotation || 0;
    if (rotation !== 0) {
      ctx.rotate((rotation * Math.PI) / 180);
    }
  }

  ctx.drawImage(img, -fitW / 2, -fitH / 2, fitW, fitH);
  ctx.restore();

  return canvas;
}

function drawCanvasCutMarks(
  ctx: CanvasRenderingContext2D,
  positions: GridPosition[],
  cutMarkType: CutMarkType,
  color: string,
  markLengthMm: number,
  pxPerMm: number
) {
  if (cutMarkType === 'none' || positions.length === 0) return;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, Math.round(0.2 * pxPerMm));

  const markLenPx = markLengthMm * pxPerMm;

  for (const pos of positions) {
    const x = pos.xMm * pxPerMm;
    const y = pos.yMm * pxPerMm;
    const w = pos.widthMm * pxPerMm;
    const h = pos.heightMm * pxPerMm;

    if (cutMarkType === 'solid') {
      ctx.setLineDash([]);
      ctx.strokeRect(x, y, w, h);
    } else if (cutMarkType === 'dotted') {
      const dashPx = Math.max(2, Math.round(1 * pxPerMm));
      ctx.setLineDash([dashPx, dashPx]);
      ctx.strokeRect(x, y, w, h);
    } else if (cutMarkType === 'corner') {
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(x - markLenPx, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y - markLenPx);

      ctx.moveTo(x + w + markLenPx, y);
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w, y - markLenPx);

      ctx.moveTo(x - markLenPx, y + h);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x, y + h + markLenPx);

      ctx.moveTo(x + w + markLenPx, y + h);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x + w, y + h + markLenPx);

      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawPdfCutMarks(
  pdf: jsPDF,
  positions: GridPosition[],
  cutMarkType: CutMarkType,
  colorHex: string,
  markLengthMm: number
) {
  if (cutMarkType === 'none' || positions.length === 0) return;

  const rgb = hexToRgb(colorHex);
  pdf.setDrawColor(rgb.r, rgb.g, rgb.b);
  pdf.setLineWidth(0.2);

  for (const pos of positions) {
    const x = pos.xMm;
    const y = pos.yMm;
    const w = pos.widthMm;
    const h = pos.heightMm;

    if (cutMarkType === 'solid') {
      if (typeof (pdf as any).setLineDashPattern === 'function') {
        (pdf as any).setLineDashPattern([], 0);
      }
      pdf.rect(x, y, w, h, 'S');
    } else if (cutMarkType === 'dotted') {
      if (typeof (pdf as any).setLineDashPattern === 'function') {
        (pdf as any).setLineDashPattern([1, 1], 0);
      }
      pdf.rect(x, y, w, h, 'S');
    } else if (cutMarkType === 'corner') {
      if (typeof (pdf as any).setLineDashPattern === 'function') {
        (pdf as any).setLineDashPattern([], 0);
      }
      const len = markLengthMm;
      pdf.line(x - len, y, x, y);
      pdf.line(x, y - len, x, y);

      pdf.line(x + w + len, y, x + w, y);
      pdf.line(x + w, y - len, x + w, y);

      pdf.line(x - len, y + h, x, y + h);
      pdf.line(x, y + h + len, x, y + h);

      pdf.line(x + w + len, y + h, x + w, y + h);
      pdf.line(x + w, y + h + len, x + w, y + h);
    }
  }
}

export async function exportToPdf(
  _photos: PhotoItem[],
  config: PrintConfig,
  result: GridCalculatedResult
): Promise<void> {
  const { paperWidthMm, paperHeightMm, pages } = result;
  const orientation = (config.paperOrientation || config.orientation) === 'landscape' ? 'l' : 'p';

  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: [paperWidthMm, paperHeightMm],
  });

  const cutMarkColorHex = config.cutMarkColor || '#888888';
  const cutMarkLengthMm = config.cutMarkLengthMm || 3;
  const bgColor = config.backgroundColor || '#ffffff';

  for (let pIdx = 0; pIdx < pages.length; pIdx++) {
    if (pIdx > 0) {
      pdf.addPage([paperWidthMm, paperHeightMm], orientation);
    }

    if (bgColor && bgColor.toLowerCase() !== '#ffffff') {
      const rgb = hexToRgb(bgColor);
      pdf.setFillColor(rgb.r, rgb.g, rgb.b);
      pdf.rect(0, 0, paperWidthMm, paperHeightMm, 'F');
    }

    const page = pages[pIdx];

    for (const pos of page.positions) {
      const widthPx = Math.round(pos.widthMm * MM_TO_PX_300DPI);
      const heightPx = Math.round(pos.heightMm * MM_TO_PX_300DPI);

      const photoCanvas = await createTransformedPhotoCanvas(
        pos.photoSrc,
        widthPx,
        heightPx,
        pos.transform,
        config.formatOnly === true
      );

      const imgDataUrl = photoCanvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(
        imgDataUrl,
        'JPEG',
        pos.xMm,
        pos.yMm,
        pos.widthMm,
        pos.heightMm,
        undefined,
        'FAST'
      );
    }

    drawPdfCutMarks(
      pdf,
      page.positions,
      config.cutMarkType,
      cutMarkColorHex,
      cutMarkLengthMm
    );
  }

  pdf.save('passport-photos.pdf');
}

export async function exportToPng(
  _photos: PhotoItem[],
  config: PrintConfig,
  result: GridCalculatedResult,
  pageIndex: number = 0
): Promise<void> {
  const page = result.pages[pageIndex];
  if (!page) return;

  const canvasWidthPx = Math.round(result.paperWidthMm * MM_TO_PX_300DPI);
  const canvasHeightPx = Math.round(result.paperHeightMm * MM_TO_PX_300DPI);

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidthPx;
  canvas.height = canvasHeightPx;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const bgColor = config.backgroundColor || '#ffffff';
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasWidthPx, canvasHeightPx);

  for (const pos of page.positions) {
    const photoWidthPx = Math.round(pos.widthMm * MM_TO_PX_300DPI);
    const photoHeightPx = Math.round(pos.heightMm * MM_TO_PX_300DPI);

    const photoCanvas = await createTransformedPhotoCanvas(
      pos.photoSrc,
      photoWidthPx,
      photoHeightPx,
      pos.transform,
      config.formatOnly === true
    );

    const xPx = pos.xMm * MM_TO_PX_300DPI;
    const yPx = pos.yMm * MM_TO_PX_300DPI;

    ctx.drawImage(photoCanvas, xPx, yPx, photoWidthPx, photoHeightPx);
  }

  const cutMarkColor = config.cutMarkColor || '#888888';
  const cutMarkLengthMm = config.cutMarkLengthMm || 3;
  drawCanvasCutMarks(
    ctx,
    page.positions,
    config.cutMarkType,
    cutMarkColor,
    cutMarkLengthMm,
    MM_TO_PX_300DPI
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `passport-photos-page-${pageIndex + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      resolve();
    }, 'image/png');
  });
}

export function triggerBrowserPrint(): void {
  window.print();
}
