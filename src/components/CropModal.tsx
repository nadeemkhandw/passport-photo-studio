import React, { useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
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
import { getCroppedImg } from '../utils/cropImage';

interface CropModalProps {
  photo: PhotoItem | null;
  photoWidthMm?: number;
  photoHeightMm?: number;
  isOpen: boolean;
  onClose: () => void;
  onSaveCrop: (
    photoId: string,
    croppedUrl: string,
    crop: CropData,
    adjustments: PhotoAdjustments
  ) => void;
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

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(photo.crop?.scale ?? 1);
  const [rotation, setRotation] = useState<number>(photo.crop?.rotation ?? 0);

  const [brightness, setBrightness] = useState<number>(photo.adjustments?.brightness ?? 0);
  const [contrast, setContrast] = useState<number>(photo.adjustments?.contrast ?? 0);
  const [showGuides, setShowGuides] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  useEffect(() => {
    if (photo) {
      setCrop({ x: photo.crop?.x ?? 0, y: photo.crop?.y ?? 0 });
      setZoom(photo.crop?.scale ?? 1);
      setRotation(photo.crop?.rotation ?? 0);
      setBrightness(photo.adjustments?.brightness ?? 0);
      setContrast(photo.adjustments?.contrast ?? 0);
    }
  }, [photo]);

  const targetAspect = (photoWidthMm || 35) / (photoHeightMm || 45);

  const onCropCompleteHandler = (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setBrightness(0);
    setContrast(0);
  };

  const handleApply = async () => {
    if (!croppedAreaPixels) return;

    try {
      setIsProcessing(true);
      const sourceImage = photo.originalUrl || photo.url || photo.src;
      const croppedUrl = await getCroppedImg(
        sourceImage,
        croppedAreaPixels,
        rotation,
        brightness,
        contrast
      );

      onSaveCrop(
        photo.id,
        croppedUrl,
        { x: crop.x, y: crop.y, scale: zoom, rotation },
        { brightness, contrast }
      );
      setIsProcessing(false);
      onClose();
    } catch (err) {
      console.error('Failed to crop image:', err);
      setIsProcessing(false);
    }
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
                Standard Aspect Ratio:{' '}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {photoWidthMm} × {photoHeightMm} mm
                </span>
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
          <div className="md:col-span-7 flex flex-col items-center justify-center gap-3 bg-slate-950 p-4 rounded-2xl border border-gray-800 relative select-none min-h-[380px]">
            <div className="relative w-full h-[360px] rounded-xl overflow-hidden shadow-2xl border-2 border-indigo-500/80">
              <Cropper
                image={photo.originalUrl || photo.url || photo.src}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={targetAspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropCompleteHandler}
                style={{
                  containerStyle: {
                    filter: `brightness(${100 + brightness}%) contrast(${100 + contrast}%)`,
                  },
                }}
              />

              {showGuides && (
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <line
                    x1="50"
                    y1="0"
                    x2="50"
                    y2="100"
                    stroke="rgba(255, 255, 255, 0.4)"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                  />
                  <ellipse
                    cx="50"
                    cy="45"
                    rx="25"
                    ry="28"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="0.8"
                    strokeDasharray="2 2"
                  />
                  <line
                    x1="20"
                    y1="38"
                    x2="80"
                    y2="38"
                    stroke="#3b82f6"
                    strokeWidth="0.6"
                  />
                  <line
                    x1="30"
                    y1="68"
                    x2="70"
                    y2="68"
                    stroke="#3b82f6"
                    strokeWidth="0.6"
                  />
                </svg>
              )}
            </div>

            <div className="flex items-center justify-between w-full px-2 text-xs text-gray-400">
              <span>Drag to position • Pinch / scroll to zoom</span>
              <button
                onClick={() => setShowGuides((prev) => !prev)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  showGuides
                    ? 'bg-indigo-600/30 text-indigo-300'
                    : 'bg-gray-800 text-gray-400 hover:text-gray-200'
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
                    {Math.round(zoom * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setZoom((z) => Math.max(1, Number((z - 0.1).toFixed(2))))}
                    className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 accent-indigo-600 cursor-pointer"
                  />
                  <button
                    onClick={() => setZoom((z) => Math.min(3, Number((z + 0.1).toFixed(2))))}
                    className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <RotateCw className="w-4 h-4 text-indigo-500" />
                  Rotation:{' '}
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    {rotation}°
                  </span>
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
                disabled={isProcessing}
                className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
              <button
                onClick={handleApply}
                disabled={isProcessing}
                className="flex-1 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                {isProcessing ? 'Processing Crop...' : 'Apply Crop & Adjustments'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
