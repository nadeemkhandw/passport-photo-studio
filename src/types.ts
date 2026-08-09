export interface CropData {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  width?: number;
  height?: number;
}

export type PhotoCrop = CropData;

export interface PhotoAdjustments {
  brightness: number;
  contrast: number;
}

export interface PhotoTransform {
  crop?: CropData;
  adjustments?: PhotoAdjustments;
  scale?: number;
  rotation?: number;
  brightness?: number;
  contrast?: number;
}

export interface PhotoItem {
  id: string;
  url: string;
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

export interface PassportStandard {
  id: string;
  name: string;
  country: string;
  widthMm: number;
  heightMm: number;
  description: string;
  aspect?: number;
}

export interface PassportPreset extends PassportStandard {}
export type PhotoPreset = PassportPreset;

export type CutMarkType = 'solid' | 'dotted' | 'corner' | 'none';

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
  passportPreset: PassportPreset | string;
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
  marginTopMm?: number;
  marginBottomMm?: number;
  marginLeftMm?: number;
  marginRightMm?: number;
  rowGapMm?: number;
  colGapMm?: number;
  columnGapMm?: number;
  cutMarkType: CutMarkType;
  cutMarkColor: string;
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

export const PAPER_PRESETS: PaperPreset[] = [
  { id: 'A4', name: 'A4 (210 × 297 mm)', widthMm: 210, heightMm: 297, category: 'standard' },
  { id: 'Letter', name: 'US Letter (8.5 × 11 in / 215.9 × 279.4 mm)', widthMm: 215.9, heightMm: 279.4, category: 'standard' },
  { id: '4x6', name: '4 × 6 in (101.6 × 152.4 mm)', widthMm: 101.6, heightMm: 152.4, category: 'photo' },
  { id: '5x7', name: '5 × 7 in (127 × 177.8 mm)', widthMm: 127, heightMm: 177.8, category: 'photo' },
  { id: 'A5', name: 'A5 (148 × 210 mm)', widthMm: 148, heightMm: 210, category: 'standard' },
  { id: 'custom', name: 'Custom Size', widthMm: 210, heightMm: 297, category: 'custom' },
];

export const PASSPORT_STANDARDS: PassportStandard[] = [
  { id: 'us', name: 'US Passport / Visa', country: 'United States', widthMm: 50.8, heightMm: 50.8, description: '2 × 2 inches (50.8 × 50.8 mm)', aspect: 1 },
  { id: 'eu', name: 'EU / Schengen / UK', country: 'Europe & UK', widthMm: 35, heightMm: 45, description: '35 × 45 mm standard ICAO', aspect: 35 / 45 },
  { id: 'ca', name: 'Canada Passport', country: 'Canada', widthMm: 50, heightMm: 70, description: '50 × 70 mm', aspect: 50 / 70 },
  { id: 'cn', name: 'China Visa / Passport', country: 'China', widthMm: 33, heightMm: 48, description: '33 × 48 mm', aspect: 33 / 48 },
  { id: 'in', name: 'India Passport / OCI', country: 'India', widthMm: 51, heightMm: 51, description: '2 × 2 inches (51 × 51 mm)', aspect: 1 },
  { id: 'jp', name: 'Japan Passport', country: 'Japan', widthMm: 35, heightMm: 45, description: '35 × 45 mm', aspect: 35 / 45 },
  { id: 'custom', name: 'Custom Dimension', country: 'Custom', widthMm: 35, heightMm: 45, description: 'User-defined width & height', aspect: 35 / 45 },
];
