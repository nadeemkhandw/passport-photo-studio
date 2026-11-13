import React from 'react';
import {
  Camera,
  Upload,
  FileDown,
  Printer,
  Image,
  Sun,
  Moon,
  Sparkles,
  Lock,
} from 'lucide-react';
import { PASSPORT_STANDARDS } from '../types';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  selectedPassportPreset: string;
  onSelectPassportPreset: (presetId: string) => void;
  onTriggerUpload: () => void;
  onExportPDF: () => void;
  onPrintSheet: () => void;
  onDownloadPNG: () => void;
  hasPhotos: boolean;
  /** Paid users download clean files; free users see the paywall. */
  isPaid?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  selectedPassportPreset,
  onSelectPassportPreset,
  onTriggerUpload,
  onExportPDF,
  onPrintSheet,
  onDownloadPNG,
  hasPhotos,
  isPaid = false,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm transition-colors duration-300 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-gray-900 rounded-[10px] flex items-center justify-center">
                <Camera className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent leading-none m-0">
                  Passport Photo Studio
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/50">
                  <Sparkles className="w-3 h-3 mr-1" /> Pro
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block leading-tight mt-0.5">
                Print-Ready Passport & ID Photos
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xs">
            <label htmlFor="navbar-preset" className="text-xs font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">
              Preset:
            </label>
            <select
              id="navbar-preset"
              value={selectedPassportPreset}
              onChange={(e) => onSelectPassportPreset(e.target.value)}
              className="w-full bg-gray-100/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-100 text-xs font-medium rounded-lg border border-gray-300/60 dark:border-gray-700/60 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer shadow-inner"
            >
              {PASSPORT_STANDARDS.map((preset) => (
                <option key={preset.id} value={preset.id} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                  {preset.name} ({preset.widthMm}x{preset.heightMm}mm)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onTriggerUpload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
              title="Upload Photo Files"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload Photos</span>
            </button>

            <button
              onClick={onPrintSheet}
              disabled={!hasPhotos}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                hasPhotos
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 active:scale-95 border-transparent'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700/50 cursor-not-allowed'
              }`}
              title="Print Sheet"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Sheet</span>
            </button>

            <button
              onClick={onExportPDF}
              disabled={!hasPhotos}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                hasPhotos
                  ? 'bg-white/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300/80 dark:border-gray-700 shadow-sm active:scale-95'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700/50 cursor-not-allowed'
              }`}
              title="Export PDF Document — paid download, free preview is watermarked"
            >
              <FileDown className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden md:inline">Export PDF</span>
              {hasPhotos && !isPaid && <Lock className="w-3 h-3 text-gray-400" />}
            </button>

            <button
              onClick={onDownloadPNG}
              disabled={!hasPhotos}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                hasPhotos
                  ? 'bg-white/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300/80 dark:border-gray-700 shadow-sm active:scale-95'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700/50 cursor-not-allowed'
              }`}
              title="Download High-Res PNG Sheet — paid download, free preview is watermarked"
            >
              <Image className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden lg:inline">Download PNG</span>
              {hasPhotos && !isPaid && <Lock className="w-3 h-3 text-gray-400" />}
            </button>

            <div className="h-5 w-px bg-gray-300/60 dark:bg-gray-700/60 mx-1 hidden sm:block" />

            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200/80 dark:border-gray-700/80 transition-all cursor-pointer active:scale-95"
              title={`Switch to ${darkMode ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
