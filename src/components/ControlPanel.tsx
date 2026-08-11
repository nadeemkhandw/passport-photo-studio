import React, { useState } from 'react';
import {
  FileText,
  Maximize2,
  Grid,
  Scissors,
  CheckCircle2,
  PieChart,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import type { PrintSettings } from '../types';
import { PAPER_PRESETS, PASSPORT_STANDARDS } from '../types';

interface ControlPanelProps {
  settings: PrintSettings;
  onUpdateSettings: (newSettings: Partial<PrintSettings>) => void;
  totalPhotosCount: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  settings,
  onUpdateSettings,
  totalPhotosCount,
}) => {
  const [activeTab, setActiveTab] = useState<'paper' | 'photo' | 'margins' | 'cut'>('paper');

  const handlePaperPresetChange = (presetId: string) => {
    const found = PAPER_PRESETS.find((p) => p.id === presetId);
    if (found) {
      if (presetId === 'custom') {
        onUpdateSettings({ paperPresetId: presetId });
      } else {
        onUpdateSettings({
          paperPresetId: presetId,
          paperWidthMm: found.widthMm,
          paperHeightMm: found.heightMm,
        });
      }
    }
  };

  const handlePassportPresetChange = (presetId: string) => {
    const found = PASSPORT_STANDARDS.find((s) => s.id === presetId);
    if (found) {
      if (presetId === 'custom') {
        onUpdateSettings({ passportPresetId: presetId });
      } else {
        onUpdateSettings({
          passportPresetId: presetId,
          photoWidthMm: found.widthMm,
          photoHeightMm: found.heightMm,
        });
      }
    }
  };

  const effectivePaperWidth =
    settings.orientation === 'portrait' ? settings.paperWidthMm : settings.paperHeightMm;
  const effectivePaperHeight =
    settings.orientation === 'portrait' ? settings.paperHeightMm : settings.paperWidthMm;

  const printableWidth =
    effectivePaperWidth - settings.marginLeftMm - settings.marginRightMm;
  const printableHeight =
    effectivePaperHeight - settings.marginTopMm - settings.marginBottomMm;

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
  const totalSheets =
    totalPhotosCount > 0 && photosPerSheet > 0
      ? Math.ceil(totalPhotosCount / photosPerSheet)
      : totalPhotosCount > 0
      ? 1
      : 0;

  const usedArea = photosPerSheet * settings.photoWidthMm * settings.photoHeightMm;
  const totalPaperArea = effectivePaperWidth * effectivePaperHeight;
  const efficiencyPct =
    totalPaperArea > 0 ? Math.min(100, Math.round((usedArea / totalPaperArea) * 100)) : 0;

  return (
    <aside className="w-full flex flex-col gap-5 p-5 rounded-3xl backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-gray-200/80 dark:border-gray-800/80 shadow-xl no-print">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 m-0">
          <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
          Layout & Print Settings
        </h2>
        <button
          onClick={() =>
            onUpdateSettings({
              paperPresetId: 'A4',
              paperWidthMm: 210,
              paperHeightMm: 297,
              orientation: 'portrait',
              passportPresetId: 'us',
              photoWidthMm: 50.8,
              photoHeightMm: 50.8,
              marginTopMm: 10,
              marginBottomMm: 10,
              marginLeftMm: 10,
              marginRightMm: 10,
              columnGapMm: 5,
              rowGapMm: 5,
              cutMarkType: 'solid',
              cutMarkColor: '#94a3b8',
            })
          }
          className="text-[11px] font-semibold text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors cursor-pointer"
          title="Reset to Default Settings"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40 border border-indigo-200/50 dark:border-indigo-800/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
            <PieChart className="w-4 h-4" /> Layout Efficiency
          </span>
          <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
            {efficiencyPct}%
          </span>
        </div>

        <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${efficiencyPct}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-white/70 dark:bg-gray-800/60 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
            <span className="block text-[10px] text-gray-500 dark:text-gray-400">Grid</span>
            <span className="font-bold text-gray-900 dark:text-gray-100 font-mono">
              {cols} × {rows}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white/70 dark:bg-gray-800/60 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
            <span className="block text-[10px] text-gray-500 dark:text-gray-400">Per Sheet</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
              {photosPerSheet}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white/70 dark:bg-gray-800/60 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
            <span className="block text-[10px] text-gray-500 dark:text-gray-400">Total Sheets</span>
            <span className="font-bold text-purple-600 dark:text-purple-400 font-mono">
              {totalSheets}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800/70">
        <button
          onClick={() => setActiveTab('paper')}
          className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'paper'
              ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Paper</span>
        </button>

        <button
          onClick={() => setActiveTab('photo')}
          className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'photo'
              ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Photo</span>
        </button>

        <button
          onClick={() => setActiveTab('margins')}
          className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'margins'
              ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Spacing</span>
        </button>

        <button
          onClick={() => setActiveTab('cut')}
          className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'cut'
              ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Marks</span>
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {activeTab === 'paper' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Paper Preset Size
              </label>
              <select
                value={settings.paperPresetId}
                onChange={(e) => handlePaperPresetChange(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {PAPER_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {settings.paperPresetId === 'custom' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-gray-600 dark:text-gray-400">
                    Width (mm)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="1000"
                    value={settings.paperWidthMm}
                    onChange={(e) =>
                      onUpdateSettings({ paperWidthMm: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-600 dark:text-gray-400">
                    Height (mm)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="1000"
                    value={settings.paperHeightMm}
                    onChange={(e) =>
                      onUpdateSettings({ paperHeightMm: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Paper Orientation
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ orientation: 'portrait' })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    settings.orientation === 'portrait'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-300 shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <div className="w-3 h-4 border-2 border-current rounded-xs" />
                  Portrait
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ orientation: 'landscape' })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    settings.orientation === 'landscape'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-300 shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <div className="w-4 h-3 border-2 border-current rounded-xs" />
                  Landscape
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'photo' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Passport Photo Standard
              </label>
              <select
                value={settings.passportPresetId}
                onChange={(e) => handlePassportPresetChange(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {PASSPORT_STANDARDS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.description})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-gray-600 dark:text-gray-400">
                  Photo Width (mm)
                </label>
                <input
                  type="number"
                  min="10"
                  max="200"
                  value={settings.photoWidthMm}
                  onChange={(e) =>
                    onUpdateSettings({ photoWidthMm: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-600 dark:text-gray-400">
                  Photo Height (mm)
                </label>
                <input
                  type="number"
                  min="10"
                  max="200"
                  value={settings.photoHeightMm}
                  onChange={(e) =>
                    onUpdateSettings({ photoHeightMm: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'margins' && (
          <div className="flex flex-col gap-3 animate-fade-in text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span>Top Margin</span>
                  <span className="font-mono font-bold">{settings.marginTopMm} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={settings.marginTopMm}
                  onChange={(e) =>
                    onUpdateSettings({ marginTopMm: parseInt(e.target.value, 10) })
                  }
                  className="w-full h-1.5 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
              <div>
                <div className="flex justify-between font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span>Bottom Margin</span>
                  <span className="font-mono font-bold">{settings.marginBottomMm} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={settings.marginBottomMm}
                  onChange={(e) =>
                    onUpdateSettings({ marginBottomMm: parseInt(e.target.value, 10) })
                  }
                  className="w-full h-1.5 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span>Left Margin</span>
                  <span className="font-mono font-bold">{settings.marginLeftMm} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={settings.marginLeftMm}
                  onChange={(e) =>
                    onUpdateSettings({ marginLeftMm: parseInt(e.target.value, 10) })
                  }
                  className="w-full h-1.5 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
              <div>
                <div className="flex justify-between font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span>Right Margin</span>
                  <span className="font-mono font-bold">{settings.marginRightMm} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={settings.marginRightMm}
                  onChange={(e) =>
                    onUpdateSettings({ marginRightMm: parseInt(e.target.value, 10) })
                  }
                  className="w-full h-1.5 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div>
                <div className="flex justify-between font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span>Column Gap</span>
                  <span className="font-mono font-bold">{settings.columnGapMm} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={settings.columnGapMm}
                  onChange={(e) =>
                    onUpdateSettings({ columnGapMm: parseInt(e.target.value, 10) })
                  }
                  className="w-full h-1.5 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
              <div>
                <div className="flex justify-between font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span>Row Gap</span>
                  <span className="font-mono font-bold">{settings.rowGapMm} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={settings.rowGapMm}
                  onChange={(e) =>
                    onUpdateSettings({ rowGapMm: parseInt(e.target.value, 10) })
                  }
                  className="w-full h-1.5 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cut' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Cut Marks Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'solid', label: 'Solid Box' },
                  { id: 'dotted', label: 'Dotted Line' },
                  { id: 'corner', label: 'Corner Marks' },
                  { id: 'none', label: 'None' },
                ].map((mark) => (
                  <button
                    key={mark.id}
                    type="button"
                    onClick={() =>
                      onUpdateSettings({
                        cutMarkType: mark.id as PrintSettings['cutMarkType'],
                      })
                    }
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-between cursor-pointer ${
                      settings.cutMarkType === mark.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-300 shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <span>{mark.label}</span>
                    {settings.cutMarkType === mark.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {settings.cutMarkType !== 'none' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
                  <span>Stroke Color</span>
                  <span className="font-mono text-[11px] text-gray-500">{settings.cutMarkColor}</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.cutMarkColor}
                    onChange={(e) => onUpdateSettings({ cutMarkColor: e.target.value })}
                    className="w-9 h-9 rounded-xl border-0 bg-transparent cursor-pointer p-0"
                  />
                  <div className="flex items-center gap-2">
                    {['#94a3b8', '#000000', '#6366f1', '#ef4444', '#10b981'].map((c) => (
                      <button
                        key={c}
                        onClick={() => onUpdateSettings({ cutMarkColor: c })}
                        className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-700 cursor-pointer shadow-xs transition-transform hover:scale-110"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
