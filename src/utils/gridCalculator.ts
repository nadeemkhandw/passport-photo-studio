import type {
  PaperPreset,
  PhotoPreset,
  PhotoItem,
  PrintConfig,
  GridCalculatedResult,
  PageLayout,
  GridPosition,
} from '../types';

export const PAPER_DIMENSIONS_MM: Record<string, { width: number; height: number }> = {
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 },
  A6: { width: 105, height: 148 },
  '4x6': { width: 101.6, height: 152.4 },
  '5x7': { width: 127, height: 177.8 },
  '8x10': { width: 203.2, height: 254 },
  letter: { width: 215.9, height: 279.4 },
};

export const PHOTO_DIMENSIONS_MM: Record<string, { width: number; height: number }> = {
  us_passport: { width: 50.8, height: 50.8 },
  uk_eu_passport: { width: 35, height: 45 },
  ca_passport: { width: 50, height: 70 },
  cn_passport: { width: 33, height: 48 },
  in_passport: { width: 35, height: 45 },
  jp_passport: { width: 35, height: 45 },
  pan_card: { width: 25, height: 35 },
  stamp_size: { width: 20, height: 25 },
};

export function getPaperDimensions(
  preset: PaperPreset | string,
  customWidthMm?: number,
  customHeightMm?: number,
  orientation: 'portrait' | 'landscape' = 'portrait'
): { width: number; height: number } {
  let width: number;
  let height: number;

  const presetId = typeof preset === 'string' ? preset : preset.id;

  if (presetId === 'custom') {
    width = customWidthMm && customWidthMm > 0 ? customWidthMm : 210;
    height = customHeightMm && customHeightMm > 0 ? customHeightMm : 297;
  } else {
    const dim = PAPER_DIMENSIONS_MM[presetId] || PAPER_DIMENSIONS_MM.A4;
    width = dim.width;
    height = dim.height;
  }

  const minDim = Math.min(width, height);
  const maxDim = Math.max(width, height);

  if (orientation === 'landscape') {
    return { width: maxDim, height: minDim };
  } else {
    return { width: minDim, height: maxDim };
  }
}

export function getPhotoDimensions(
  preset: PhotoPreset | string,
  customWidthMm?: number,
  customHeightMm?: number
): { width: number; height: number } {
  const presetId = typeof preset === 'string' ? preset : preset.id;

  if (presetId === 'custom') {
    return {
      width: customWidthMm && customWidthMm > 0 ? customWidthMm : 35,
      height: customHeightMm && customHeightMm > 0 ? customHeightMm : 45,
    };
  }

  const dim = PHOTO_DIMENSIONS_MM[presetId] || { width: 35, height: 45 };
  return { width: dim.width, height: dim.height };
}

export function calculateGrid(photos: PhotoItem[], config: PrintConfig): GridCalculatedResult {
  const paperOrientation = config.paperOrientation || config.orientation || 'portrait';
  const paper = getPaperDimensions(
    config.paperPreset,
    config.customPaperWidth || config.customPaperWidthMm,
    config.customPaperHeight || config.customPaperHeightMm,
    paperOrientation
  );

  const defaultPhoto = getPhotoDimensions(
    config.passportPreset || config.photoPreset || 'us_passport',
    config.customPhotoWidth || config.customPhotoWidthMm,
    config.customPhotoHeight || config.customPhotoHeightMm
  );

  const paperWidthMm = paper.width;
  const paperHeightMm = paper.height;
  const photoWidthMm = defaultPhoto.width;
  const photoHeightMm = defaultPhoto.height;

  const colGap = Math.max(0, config.colGapMm || config.columnGapMm || config.spacing?.colGap || 0);
  const rowGap = Math.max(0, config.rowGapMm || config.spacing?.rowGap || 0);

  const marginTop = config.marginTopMm ?? config.margins?.top ?? 10;
  const marginBottom = config.marginBottomMm ?? config.margins?.bottom ?? 10;
  const marginLeft = config.marginLeftMm ?? config.margins?.left ?? 10;
  const marginRight = config.marginRightMm ?? config.margins?.right ?? 10;

  const actualUsableWidth = paperWidthMm - marginLeft - marginRight;
  const actualUsableHeight = paperHeightMm - marginTop - marginBottom;

  const maxCols =
    photoWidthMm > 0 && actualUsableWidth >= photoWidthMm
      ? Math.floor((actualUsableWidth + colGap) / (photoWidthMm + colGap))
      : 0;

  const maxRows =
    photoHeightMm > 0 && actualUsableHeight >= photoHeightMm
      ? Math.floor((actualUsableHeight + rowGap) / (photoHeightMm + rowGap))
      : 0;

  const photosPerPage = maxCols * maxRows;

  const pages: PageLayout[] = [];
  let currentPageIndex = 0;
  let currentCol = 0;
  let currentRow = 0;
  let currentPositions: GridPosition[] = [];
  let totalPhotos = 0;

  for (const photo of photos) {
    const count = Math.max(0, photo.quantity ?? photo.count ?? 0);
    totalPhotos += count;

    const pWidth = photo.customWidthMm || photoWidthMm;
    const pHeight = photo.customHeightMm || photoHeightMm;
    const pSrc = photo.url || photo.src || '';

    for (let i = 0; i < count; i++) {
      if (photosPerPage > 0 && currentPositions.length >= photosPerPage) {
        pages.push({
          pageIndex: currentPageIndex,
          positions: currentPositions,
        });
        currentPageIndex++;
        currentPositions = [];
        currentCol = 0;
        currentRow = 0;
      }

      if (photosPerPage > 0) {
        const xMm = marginLeft + currentCol * (photoWidthMm + colGap);
        const yMm = marginTop + currentRow * (photoHeightMm + rowGap);

        currentPositions.push({
          photoId: photo.id,
          photoSrc: pSrc,
          transform: {
            crop: photo.crop,
            adjustments: photo.adjustments,
          },
          xMm,
          yMm,
          widthMm: pWidth,
          heightMm: pHeight,
          col: currentCol,
          row: currentRow,
          pageIndex: currentPageIndex,
        });

        currentCol++;
        if (currentCol >= maxCols) {
          currentCol = 0;
          currentRow++;
        }
      }
    }
  }

  if (currentPositions.length > 0) {
    pages.push({
      pageIndex: currentPageIndex,
      positions: currentPositions,
    });
  }

  if (pages.length === 0) {
    pages.push({
      pageIndex: 0,
      positions: [],
    });
  }

  return {
    pages,
    totalPhotos,
    totalPages: pages.length,
    paperWidthMm,
    paperHeightMm,
    photoWidthMm,
    photoHeightMm,
    maxCols,
    maxRows,
    photosPerPage,
    effectiveMarginLeftMm: marginLeft,
    effectiveMarginTopMm: marginTop,
  };
}
