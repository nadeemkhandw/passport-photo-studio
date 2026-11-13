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

export const PAPER_PRESETS: PaperPreset[] = [
  { id: 'A4', name: 'A4 (210 × 297 mm)', widthMm: 210, heightMm: 297, category: 'standard' },
  { id: 'Letter', name: 'Letter (215.9 × 279.4 mm)', widthMm: 215.9, heightMm: 279.4, category: 'standard' },
  { id: 'Legal', name: 'Legal (215.9 × 355.6 mm)', widthMm: 215.9, heightMm: 355.6, category: 'standard' },
  { id: '4x6', name: '4 × 6" Photo Paper (101.6 × 152.4 mm)', widthMm: 101.6, heightMm: 152.4, category: 'photo' },
  { id: '5x7', name: '5 × 7" Photo Paper (127 × 177.8 mm)', widthMm: 127, heightMm: 177.8, category: 'photo' },
  { id: '8x10', name: '8 × 10" Photo Paper (203.2 × 254 mm)', widthMm: 203.2, heightMm: 254, category: 'photo' },
  { id: 'A5', name: 'A5 (148 × 210 mm)', widthMm: 148, heightMm: 210, category: 'standard' },
  { id: 'custom', name: 'Custom Paper Dimensions...', widthMm: 210, heightMm: 297, category: 'custom' },
];

export interface PassportPreset {
  id: string;
  name: string;
  country: string;
  widthMm: number;
  heightMm: number;
  description: string;
  aspect: number;
}

export const PASSPORT_STANDARDS: PassportPreset[] = [
  {
    id: 'us',
    name: 'US Passport / Visa',
    country: 'United States',
    widthMm: 50.8,
    heightMm: 50.8,
    description: '2 × 2 in (50.8 × 50.8 mm)',
    aspect: 1,
  },
  {
    id: 'eu',
    name: 'EU / UK / Schengen / India',
    country: 'EU / UK / India',
    widthMm: 35,
    heightMm: 45,
    description: '35 × 45 mm Standard',
    aspect: 35 / 45,
  },
  {
    id: 'cn',
    name: 'China Passport',
    country: 'China',
    widthMm: 33,
    heightMm: 48,
    description: '33 × 48 mm Standard',
    aspect: 33 / 48,
  },
  {
    id: 'ca',
    name: 'Canada Passport',
    country: 'Canada',
    widthMm: 50,
    heightMm: 70,
    description: '50 × 70 mm Standard',
    aspect: 50 / 70,
  },
  {
    id: 'jp',
    name: 'Japan Passport',
    country: 'Japan',
    widthMm: 35,
    heightMm: 45,
    description: '35 × 45 mm Standard',
    aspect: 35 / 45,
  },
  {
    id: 'in',
    name: 'India OCI / PAN Card',
    country: 'India',
    widthMm: 51,
    heightMm: 51,
    description: '2 × 2 in (51 × 51 mm)',
    aspect: 1,
  },
  {
    id: 'custom',
    name: 'Custom Photo Dimensions...',
    country: 'Custom',
    widthMm: 35,
    heightMm: 45,
    description: 'User specified width and height',
    aspect: 35 / 45,
  },
];

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
  /** US format-only mode: ignore any stored brightness / contrast
   *  adjustments when rendering, so exports stay unaltered. */
  formatOnly?: boolean;
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
