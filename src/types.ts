export interface CropData {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface PhotoAdjustments {
  brightness: number;
  contrast: number;
}

export interface PhotoTransform {
  crop?: CropData;
  adjustments?: PhotoAdjustments;
}

export interface PhotoItem {
  id: string;
  url: string;
  originalUrl?: string;
  src: string;
  name: string;
  quantity: number;
  count: number;
  crop?: CropData;
  adjustments?: PhotoAdjustments;
  transform?: PhotoTransform;
  customWidthMm?: number;
  customHeightMm?: number;
}

export interface PaperPreset {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
  category?: string;
}

export interface PassportPreset {
  id: string;
  name: string;
  country: string;
  widthMm: number;
  heightMm: number;
  description: string;
  aspect: number;
}

export type PhotoPreset = PassportPreset;

export type CutMarkType = 'none' | 'solid' | 'dotted' | 'corner';

export interface PrintSettings {
  paperPresetId: string;
  paperWidthMm: number;
  paperHeightMm: number;
  orientation: 'portrait' | 'landscape';
  passportPresetId: string;
  photoWidthMm: number;
  photoHeightMm: number;
  marginTopMm: number;
  marginBottomMm: number;
  marginLeftMm: number;
  marginRightMm: number;
  columnGapMm: number;
  rowGapMm: number;
  cutMarkType: CutMarkType;
  cutMarkColor: string;
}

export interface PrintConfig {
  paperPreset: PaperPreset | string;
  passportPreset?: PassportPreset | string;
  photoPreset?: PassportPreset | string;
  paperOrientation?: 'portrait' | 'landscape';
  orientation?: 'portrait' | 'landscape';
  customPaperWidth?: number;
  customPaperHeight?: number;
  customPaperWidthMm?: number;
  customPaperHeightMm?: number;
  customPhotoWidth?: number;
  customPhotoHeight?: number;
  customPhotoWidthMm?: number;
  customPhotoHeightMm?: number;
  marginTopMm?: number;
  marginBottomMm?: number;
  marginLeftMm?: number;
  marginRightMm?: number;
  rowGapMm?: number;
  colGapMm?: number;
  columnGapMm?: number;
  margins?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  spacing?: {
    rowGap: number;
    colGap: number;
  };
  cutMarkType: CutMarkType;
  cutMarkColor?: string;
  cutMarkLengthMm?: number;
  showBackground?: boolean;
  backgroundColor?: string;
  align?: 'center' | 'top-left';
}

export interface GridPosition {
  photoId: string;
  photoSrc: string;
  transform?: PhotoTransform;
  xMm: number;
  yMm: number;
  widthMm: number;
  heightMm: number;
  col: number;
  row: number;
  pageIndex: number;
}

export interface PageLayout {
  pageIndex: number;
  positions: GridPosition[];
}

export interface GridCalculatedResult {
  pages: PageLayout[];
  totalPhotos: number;
  totalPages: number;
  paperWidthMm: number;
  paperHeightMm: number;
  photoWidthMm: number;
  photoHeightMm: number;
  maxCols: number;
  maxRows: number;
  photosPerPage: number;
  effectiveMarginLeftMm: number;
  effectiveMarginTopMm: number;
}
