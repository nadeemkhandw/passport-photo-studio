import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Printer,
  Layers,
} from 'lucide-react';
import type { PhotoItem, PrintSettings } from '../types';

interface PrintPreviewProps {
  photos: PhotoItem[];
  settings: PrintSettings;
  onPrint: () => void;
}

export const PrintPreview: React.FC<PrintPreviewProps> = ({
  photos,
  settings,
  onPrint,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomScale, setZoomScale] = useState<number>(0.85);

  const MM_TO_PX = 3.7795275591;

  const effectivePaperWidthMm =
    settings.orientation === 'portrait' ? settings.paperWidthMm : settings.paperHeightMm;
  const effectivePaperHeightMm =
    settings.orientation === 'portrait' ? settings.paperHeightMm : settings.paperWidthMm;

  const printableWidth =
    effectivePaperWidthMm - settings.marginLeftMm - settings.marginRightMm;
  const printableHeight =
    effectivePaperHeightMm - settings.marginTopMm - settings.marginBottomMm;

  const cols =
    printableWidth > 0 && settings.photoWidthMm > 0
      ? Math.max(
          0,
          Math.floor(
            (printableWidth + settings.columnGapMm) /
              (settings.photoWidthMm + settings.columnGapMm)
          )
        )
      : 0;

  const rows =
    printableHeight > 0 && settings.photoHeightMm > 0
      ? Math.max(
          0,
          Math.floor(
            (printableHeight + settings.rowGapMm) /
              (settings.photoHeightMm + settings.rowGapMm)
          )
        )
      : 0;

  const photosPerSheet = cols * rows;

  const flatPhotos: PhotoItem[] = [];
  photos.forEach((photo) => {
    for (let i = 0; i < photo.quantity; i++) {
      flatPhotos.push(photo);
    }
  });

  const totalPages =
    flatPhotos.length > 0 && photosPerSheet > 0
      ? Math.ceil(flatPhotos.length / photosPerSheet)
      : 1;

  const activePageNo = Math.min(currentPage, totalPages);
  const startIndex = (activePageNo - 1) * photosPerSheet;
  const pageItems = flatPhotos.slice(startIndex, startIndex + photosPerSheet);

  const paperPxW = effectivePaperWidthMm * MM_TO_PX * zoomScale;
  const paperPxH = effectivePaperHeightMm * MM_TO_PX * zoomScale;

  const marginTopPx = settings.marginTopMm * MM_TO_PX * zoomScale;
  const marginLeftPx = settings.marginLeftMm * MM_TO_PX * zoomScale;
  const photoW = settings.photoWidthMm * MM_TO_PX * zoomScale;
  const photoH = settings.photoHeightMm * MM_TO_PX * zoomScale;
  const colGapPx = settings.columnGapMm * MM_TO_PX * zoomScale;
  const rowGapPx = settings.rowGapMm * MM_TO_PX * zoomScale;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-gray-200/80 dark:border-gray-800/80 shadow-md no-print">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={activePageNo <= 1}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-gray-800 dark:text-gray-200 font-mono">
            Page {activePageNo} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={activePageNo >= totalPages}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomScale((z) => Math.max(0.4, z - 0.1))}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {[0.5, 0.75, 1.0].map((z) => (
              <button
                key={z}
                onClick={() => setZoomScale(z)}
                className={`px-2 py-1 rounded-md text-[11px] font-bold font-mono transition-colors cursor-pointer ${
                  Math.abs(zoomScale - z) < 0.02
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {Math.round(z * 100)}%
              </button>
            ))}
          </div>

          <button
            onClick={() => setZoomScale((z) => Math.min(1.5, z + 0.1))}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoomScale(0.85)}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
            title="Fit Preview"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onPrint}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Print Current Sheet
        </button>
      </div>

      <div className="w-full flex justify-center items-start overflow-auto p-8 rounded-3xl bg-slate-200/60 dark:bg-gray-950/60 border border-gray-300/50 dark:border-gray-800/50 min-h-[500px]">
        {flatPhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400 dark:text-gray-600">
            <Layers className="w-12 h-12 mb-3 stroke-[1.5] animate-bounce text-indigo-400" />
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
              No photos uploaded yet
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
              Upload photo files to generate a live print preview sheet with millimeter layout.
            </p>
          </div>
        ) : (
          <div
            className="print-page relative bg-white shadow-2xl transition-all duration-200 border border-gray-300/80"
            style={{
              width: `${paperPxW}px`,
              height: `${paperPxH}px`,
            }}
          >
            <div
              className="absolute pointer-events-none border border-dashed border-sky-400/40 no-print"
              style={{
                top: `${marginTopPx}px`,
                left: `${marginLeftPx}px`,
                width: `${printableWidth * MM_TO_PX * zoomScale}px`,
                height: `${printableHeight * MM_TO_PX * zoomScale}px`,
              }}
            />

            {Array.from({ length: rows }).map((_, rIdx) => (
              <React.Fragment key={`row-${rIdx}`}>
                {Array.from({ length: cols }).map((_, cIdx) => {
                  const itemIndex = rIdx * cols + cIdx;
                  const item = pageItems[itemIndex];
                  if (!item) return null;

                  const tileLeftPx = marginLeftPx + cIdx * (photoW + colGapPx);
                  const tileTopPx = marginTopPx + rIdx * (photoH + rowGapPx);

                  return (
                    <div
                      key={`tile-${rIdx}-${cIdx}`}
                      className="absolute overflow-hidden flex items-center justify-center"
                      style={{
                        left: `${tileLeftPx}px`,
                        top: `${tileTopPx}px`,
                        width: `${photoW}px`,
                        height: `${photoH}px`,
                        boxSizing: 'border-box',
                      }}
                    >
                      <div
                        className="w-full h-full relative overflow-hidden flex items-center justify-center bg-white"
                        style={{
                          filter: item.adjustments
                            ? `brightness(${100 + item.adjustments.brightness}%) contrast(${100 + item.adjustments.contrast}%)`
                            : 'none',
                        }}
                      >
                        <img
                          src={item.url || item.src}
                          alt={item.name}
                          className="max-w-full max-h-full object-contain pointer-events-none"
                          style={{
                            transform: item.crop
                              ? `translate(${item.crop.x}%, ${item.crop.y}%) scale(${item.crop.scale}) rotate(${item.crop.rotation}deg)`
                              : 'none',
                          }}
                        />
                      </div>

                      {settings.cutMarkType === 'solid' && (
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            border: `1px solid ${settings.cutMarkColor}`,
                          }}
                        />
                      )}

                      {settings.cutMarkType === 'dotted' && (
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            border: `1px dotted ${settings.cutMarkColor}`,
                          }}
                        />
                      )}

                      {settings.cutMarkType === 'corner' && (
                        <>
                          <div
                            className="absolute top-0 left-0 w-2.5 h-2.5 pointer-events-none"
                            style={{
                              borderTop: `1.5px solid ${settings.cutMarkColor}`,
                              borderLeft: `1.5px solid ${settings.cutMarkColor}`,
                            }}
                          />
                          <div
                            className="absolute top-0 right-0 w-2.5 h-2.5 pointer-events-none"
                            style={{
                              borderTop: `1.5px solid ${settings.cutMarkColor}`,
                              borderRight: `1.5px solid ${settings.cutMarkColor}`,
                            }}
                          />
                          <div
                            className="absolute bottom-0 left-0 w-2.5 h-2.5 pointer-events-none"
                            style={{
                              borderBottom: `1.5px solid ${settings.cutMarkColor}`,
                              borderLeft: `1.5px solid ${settings.cutMarkColor}`,
                            }}
                          />
                          <div
                            className="absolute bottom-0 right-0 w-2.5 h-2.5 pointer-events-none"
                            style={{
                              borderBottom: `1.5px solid ${settings.cutMarkColor}`,
                              borderRight: `1.5px solid ${settings.cutMarkColor}`,
                            }}
                          />
                        </>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
