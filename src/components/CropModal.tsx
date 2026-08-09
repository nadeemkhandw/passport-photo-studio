import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  RotateCw,
  Sun,
  Sliders,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  Eye,
  User,
} from 'lucide-react';
import type { PhotoItem, CropData, PhotoAdjustments } from '../types';

interface CropModalProps {
  photo: PhotoItem | null;
  photoWidthMm?: number;
  photoHeightMm?: number;
  isOpen: boolean;
  onClose: () => void;
  onSaveCrop: (photoId: string, crop: CropData, adjustments: PhotoAdjustments) => void;
}

export const CropModal: React.FC<CropModalProps> = ({
  photo,
  photoWidthMm = 35,
  photoHeightMm = 45,
  isOpen,
  onClose,
  onSaveCrop,
}) => {
  if (!isOpen || !photo) return null;

  const [scale, setScale] = useState<number>(photo.crop?.scale ?? 1);
  const [posX, setPosX] = useState<number>(photo.crop?.x ?? 0);
  const [posY, setPosY] = useState<number>(photo.crop?.y ?? 0);
  const [rotation, setRotation] = useState<number>(photo.crop?.rotation ?? 0);

  const [brightness, setBrightness] = useState<number>(photo.adjustments?.brightness ?? 0);
  const [contrast, setContrast] = useState<number>(photo.adjustments?.contrast ?? 0);
  const [showGuides, setShowGuides] = useState<boolean>(true);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ mouseX: number; mouseY: number; initialX: number; initialY: number }>({
    mouseX: 0,
    mouseY: 0,
    initialX: 0,
    initialY: 0,
  });

  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (photo) {
      setScale(photo.crop?.scale ?? 1);
      setPosX(photo.crop?.x ?? 0);
      setPosY(photo.crop?.y ?? 0);
      setRotation(photo.crop?.rotation ?? 0);
      setBrightness(photo.adjustments?.brightness ?? 0);
      setContrast(photo.adjustments?.contrast ?? 0);
    }
  }, [photo]);

  const targetAspect = (photoWidthMm || 35) / (photoHeightMm || 45);
  const maxBoxWidth = 340;
  const maxBoxHeight = 380;

  let boxWidth = maxBoxWidth;
  let boxHeight = maxBoxWidth / targetAspect;

  if (boxHeight > maxBoxHeight) {
    boxHeight = maxBoxHeight;
    boxWidth = maxBoxHeight * targetAspect;
  }

  const handleStartDrag = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({
      mouseX: clientX,
      mouseY: clientY,
      initialX: posX,
      initialY: posY,
    });
  };

  const handleMoveDrag = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = ((clientX - dragStart.mouseX) / boxWidth) * 100;
    const deltaY = ((clientY - dragStart.mouseY) / boxHeight) * 100;

    const nextX = Math.max(-150, Math.min(150, dragStart.initialX + deltaX));
    const nextY = Math.max(-150, Math.min(150, dragStart.initialY + deltaY));

    setPosX(nextX);
    setPosY(nextY);
  };

  const handleEndDrag = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setScale((prev) => Math.max(0.5, Math.min(4, Number((prev + delta).toFixed(2)))));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setScale(1);
    setPosX(0);
    setPosY(0);
    setRotation(0);
    setBrightness(0);
    setContrast(0);
  };

  const handleApply = () => {
    onSaveCrop(
      photo.id,
      { x: posX, y: posY, scale, rotation },
      { brightness, contrast }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in no-print">
      <div
        className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/80 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 m-0 leading-snug">
                Passport Photo Crop & Biometric Alignment
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 m-0">
                Target Aspect: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{photoWidthMm} × {photoHeightMm} mm</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 p-6 overflow-y-auto">
          <div className="md:col-span-7 flex flex-col items-center justify-center gap-3 bg-slate-950/90 dark:bg-black/90 p-6 rounded-2xl border border-gray-800 relative select-none">
            <div
              ref={viewportRef}
              onMouseDown={(e) => handleStartDrag(e.clientX, e.clientY)}
              onMouseMove={(e) => handleMoveDrag(e.clientX, e.clientY)}
              onMouseUp={handleEndDrag}
              onMouseLeave={handleEndDrag}
              onTouchStart={(e) => handleStartDrag(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchMove={(e) => handleMoveDrag(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchEnd={handleEndDrag}
              onWheel={handleWheel}
              className="relative bg-slate-900 rounded-xl overflow-hidden shadow-2xl border-2 border-indigo-500/80 cursor-grab active:cursor-grabbing flex items-center justify-center"
              style={{
                width: `${boxWidth}px`,
                height: `${boxHeight}px`,
              }}
            >
              <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                <img
                  src={photo.url || photo.src}
                  alt="Crop Target"
                  draggable={false}
                  className="max-w-full max-h-full object-contain pointer-events-none transition-filter duration-75"
                  style={{
                    transform: `translate(${posX}%, ${posY}%) scale(${scale}) rotate(${rotation}deg)`,
                    filter: `brightness(${100 + brightness}%) contrast(${100 + contrast}%)`,
                  }}
                />
              </div>

              {showGuides && (
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox={`0 0 ${boxWidth} ${boxHeight}`}
                >
                  <rect
                    x="2"
                    y="2"
                    width={boxWidth - 4}
                    height={boxHeight - 4}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    rx="6"
                  />
                  <line
                    x1={boxWidth / 2}
                    y1={0}
                    x2={boxWidth / 2}
                    y2={boxHeight}
                    stroke="rgba(255, 255, 255, 0.35)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <ellipse
                    cx={boxWidth / 2}
                    cy={boxHeight * 0.44}
                    rx={boxWidth * 0.28}
                    ry={boxHeight * 0.28}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1={boxWidth * 0.15}
                    y1={boxHeight * 0.38}
                    x2={boxWidth * 0.85}
                    y2={boxHeight * 0.38}
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                  />
                  <line
                    x1={boxWidth * 0.25}
                    y1={boxHeight * 0.68}
                    x2={boxWidth * 0.75}
                    y2={boxHeight * 0.68}
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                  />
                </svg>
              )}
            </div>

            <div className="flex items-center justify-between w-full max-w-[340px] px-2 text-xs text-gray-400">
              <span>Drag image to position • Scroll to zoom</span>
              <button
                onClick={() => setShowGuides((prev) => !prev)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  showGuides ? 'bg-indigo-600/30 text-indigo-300' : 'bg-gray-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                {showGuides ? 'Guides On' : 'Guides Off'}
              </button>
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <ZoomIn className="w-4 h-4 text-indigo-500" /> Zoom Scale
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                    {Math.round(scale * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setScale((s) => Math.max(0.5, Number((s - 0.1).toFixed(2))))}
                    className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="0.5"
                    max="4.0"
                    step="0.05"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="flex-1 accent-indigo-600 cursor-pointer"
                  />
                  <button
                    onClick={() => setScale((s) => Math.min(4.0, Number((s + 0.1).toFixed(2))))}
                    className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <RotateCw className="w-4 h-4 text-indigo-500" />
                  Rotation: <span className="font-mono text-indigo-600 dark:text-indigo-400">{rotation}°</span>
                </div>
                <button
                  onClick={handleRotate}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5" /> Rotate 90°
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-500" /> Brightness
                  </span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">
                    {brightness > 0 ? `+${brightness}` : brightness}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="5"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-emerald-500" /> Contrast
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                    {contrast > 0 ? `+${contrast}` : contrast}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="5"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset All
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" /> Apply Crop & Adjustments
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
