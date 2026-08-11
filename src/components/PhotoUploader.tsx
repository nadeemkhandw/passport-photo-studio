import React, { useRef, useState } from 'react';
import {
  Upload,
  Crop,
  Copy,
  Trash2,
  Plus,
  Minus,
  Image as ImageIcon,
  Layers,
  Sparkles,
} from 'lucide-react';
import type { PhotoItem } from '../types';

interface PhotoUploaderProps {
  photos: PhotoItem[];
  onUploadPhotos: (files: FileList | File[]) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onSetQuantity: (id: string, qty: number) => void;
  onSetAllQuantities: (qty: number) => void;
  onOpenCropModal: (photo: PhotoItem) => void;
  onDuplicatePhoto: (photo: PhotoItem) => void;
  onDeletePhoto: (id: string) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photos,
  onUploadPhotos,
  onUpdateQuantity,
  onSetQuantity,
  onSetAllQuantities,
  onOpenCropModal,
  onDuplicatePhoto,
  onDeletePhoto,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [globalQtyInput, setGlobalQtyInput] = useState<string>('4');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUploadPhotos(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadPhotos(e.target.files);
      e.target.value = '';
    }
  };

  const handleApplyGlobalQty = () => {
    const val = parseInt(globalQtyInput, 10);
    if (!isNaN(val) && val >= 1) {
      onSetAllQuantities(val);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 no-print">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 p-8 text-center backdrop-blur-xl ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 scale-[1.01] shadow-xl shadow-indigo-500/10'
            : 'border-gray-300 dark:border-gray-700/80 bg-white/50 dark:bg-gray-800/40 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-white/80 dark:hover:bg-gray-800/70 shadow-sm'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
            <Upload className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
              Drag & Drop your photos here
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Supports <span className="font-semibold text-gray-700 dark:text-gray-300">JPG, PNG, WEBP</span> files. Select single or multiple images.
            </p>
          </div>
          <button
            type="button"
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/25 active:scale-95 transition-all"
          >
            <ImageIcon className="w-4 h-4" />
            Browse Files
          </button>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60 shadow-sm">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              Total Photos: {photos.length} ({photos.reduce((sum, p) => sum + p.quantity, 0)} total copies)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="global-qty" className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Set quantity for all:
            </label>
            <input
              id="global-qty"
              type="number"
              min="1"
              max="100"
              value={globalQtyInput}
              onChange={(e) => setGlobalQtyInput(e.target.value)}
              className="w-16 px-2 py-1 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleApplyGlobalQty}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors cursor-pointer"
            >
              Apply All
            </button>
          </div>
        </div>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative flex flex-col rounded-2xl overflow-hidden backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200/70 dark:border-gray-700/70 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative w-full aspect-[4/5] bg-gray-900/10 dark:bg-gray-900/50 overflow-hidden flex items-center justify-center p-3">
                <div className="w-full h-full relative overflow-hidden rounded-lg shadow-inner bg-white dark:bg-gray-950 flex items-center justify-center">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {(photo.crop || photo.adjustments) && (
                  <div className="absolute top-4 left-4 bg-indigo-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Adjusted
                  </div>
                )}
              </div>

              <div className="p-3 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[140px]" title={photo.name}>
                    {photo.name}
                  </span>
                  
                  <div className="flex items-center rounded-lg bg-gray-100 dark:bg-gray-900 p-0.5 border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => onUpdateQuantity(photo.id, -1)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-300 transition-colors"
                      title="Decrease Quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={photo.quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val >= 1) onSetQuantity(photo.id, val);
                      }}
                      className="w-8 text-center text-xs font-bold text-gray-900 dark:text-gray-100 bg-transparent focus:outline-none"
                    />
                    <button
                      onClick={() => onUpdateQuantity(photo.id, 1)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-300 transition-colors"
                      title="Increase Quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-gray-200/50 dark:border-gray-700/50">
                  <button
                    onClick={() => onOpenCropModal(photo)}
                    className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-300 transition-colors cursor-pointer"
                    title="Crop & Adjust Image"
                  >
                    <Crop className="w-3 h-3" />
                    Crop
                  </button>

                  <button
                    onClick={() => onDuplicatePhoto(photo)}
                    className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold bg-gray-100 dark:bg-gray-700/60 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                    title="Duplicate Photo"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>

                  <button
                    onClick={() => onDeletePhoto(photo.id)}
                    className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
