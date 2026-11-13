import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PhotoUploader } from './components/PhotoUploader';
import { ControlPanel } from './components/ControlPanel';
import { CropModal } from './components/CropModal';
import { PrintPreview } from './components/PrintPreview';
import { Landing } from './components/Landing';
import { LegalPage, LEGAL_LINKS, type LegalPageId } from './components/LegalPages';
import { PaywallModal } from './components/PaywallModal';
import type { PhotoItem, PrintSettings, CropData, PhotoAdjustments, PrintConfig } from './types';
import { calculateGrid } from './utils/gridCalculator';
import { exportToPdf, exportToPng } from './utils/exportEngine';
import { hasPaid, setPaidForTesting, formatPrice } from './lib/payments';
import './styles/print.css';

/**
 * US preset ids, in both id schemes used in this repo ('us' in
 * src/types.ts, 'us-passport' in src/constants/presets.ts).
 */
export function isUsPreset(presetId: string): boolean {
  return presetId === 'us' || presetId === 'us-passport';
}

const PASSPORT_SIZES: Record<string, { w: number; h: number }> = {
  us: { w: 50.8, h: 50.8 },
  eu: { w: 35, h: 45 },
  ca: { w: 50, h: 70 },
  cn: { w: 33, h: 48 },
  in: { w: 51, h: 51 },
  jp: { w: 35, h: 45 },
};

export function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [cropModalPhoto, setCropModalPhoto] = useState<PhotoItem | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState<boolean>(false);
  const [paid, setPaid] = useState<boolean>(() => hasPaid());
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Lightweight hash routing for the legal pages (#/terms, #/privacy,
  // #/refund) — no router dependency, works as a static Vite SPA.
  const getLegalPageFromHash = (): LegalPageId | null => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (hash === 'terms' || hash === 'privacy' || hash === 'refund') return hash;
    return null;
  };
  const [legalPage, setLegalPage] = useState<LegalPageId | null>(() =>
    getLegalPageFromHash()
  );

  useEffect(() => {
    const onHashChange = () => {
      setLegalPage(getLegalPageFromHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const [settings, setSettings] = useState<PrintSettings>({
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
  });

  // US format-only mode (Jan 2026 US State Dept rule): crop and resize
  // only — no brightness / contrast or other edits.
  const formatOnly = isUsPreset(settings.passportPresetId);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleUploadPhotos = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    fileArray.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          const newPhoto: PhotoItem = {
            id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            url: result,
            originalUrl: result,
            src: result,
            name: file.name,
            quantity: 4,
            count: 4,
          };
          setPhotos((prev) => [...prev, newPhoto]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleTriggerUpload = () => {
    const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.click();
    }
  };

  const handleStartFromLanding = () => {
    document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
    handleTriggerUpload();
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newQty = Math.max(1, p.quantity + delta);
          return { ...p, quantity: newQty, count: newQty };
        }
        return p;
      })
    );
  };

  const handleSetQuantity = (id: string, qty: number) => {
    const newQty = Math.max(1, qty);
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: newQty, count: newQty } : p))
    );
  };

  const handleSetAllQuantities = (qty: number) => {
    const newQty = Math.max(1, qty);
    setPhotos((prev) => prev.map((p) => ({ ...p, quantity: newQty, count: newQty })));
  };

  const handleDuplicatePhoto = (photo: PhotoItem) => {
    const duplicate: PhotoItem = {
      ...photo,
      id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: `${photo.name} (Copy)`,
    };
    setPhotos((prev) => [...prev, duplicate]);
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleOpenCropModal = (photo: PhotoItem) => {
    setCropModalPhoto(photo);
    setIsCropModalOpen(true);
  };

  const handleSaveCrop = (
    photoId: string,
    croppedUrl: string,
    crop: CropData,
    adjustments: PhotoAdjustments
  ) => {
    // Defence in depth: in format-only mode no adjustments are ever stored.
    const safeAdjustments: PhotoAdjustments = formatOnly
      ? { brightness: 0, contrast: 0 }
      : adjustments;
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photoId
          ? { ...p, url: croppedUrl, src: croppedUrl, crop, adjustments: safeAdjustments }
          : p
      )
    );
  };

  const handleUpdateSettings = (newSettings: Partial<PrintSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleSelectPassportPreset = (presetId: string) => {
    const found = PASSPORT_SIZES[presetId];
    if (found) {
      setSettings((prev) => ({
        ...prev,
        passportPresetId: presetId,
        photoWidthMm: found.w,
        photoHeightMm: found.h,
      }));
    } else {
      setSettings((prev) => ({ ...prev, passportPresetId: presetId }));
    }
    if (isUsPreset(presetId)) {
      // Strip stored adjustment metadata. Note: a photo cropped earlier
      // with brightness / contrast already has those edits baked into its
      // pixels — re-crop from the original to be safe.
      setPhotos((prev) =>
        prev.map((p) => {
          const hadEdits =
            (p.adjustments?.brightness ?? 0) !== 0 || (p.adjustments?.contrast ?? 0) !== 0;
          if (hadEdits) {
            setExportStatus(
              'Switched to US format-only: a photo edited earlier may still carry baked-in edits — re-crop it from the original to be safe.'
            );
          }
          return { ...p, adjustments: { brightness: 0, contrast: 0 } };
        })
      );
    }
  };

  const buildPrintConfig = (): PrintConfig => ({
    paperPreset: settings.paperPresetId,
    passportPreset: settings.passportPresetId,
    paperOrientation: settings.orientation,
    customPaperWidthMm: settings.paperWidthMm,
    customPaperHeightMm: settings.paperHeightMm,
    customPhotoWidthMm: settings.photoWidthMm,
    customPhotoHeightMm: settings.photoHeightMm,
    marginTopMm: settings.marginTopMm,
    marginBottomMm: settings.marginBottomMm,
    marginLeftMm: settings.marginLeftMm,
    marginRightMm: settings.marginRightMm,
    rowGapMm: settings.rowGapMm,
    columnGapMm: settings.columnGapMm,
    cutMarkType: settings.cutMarkType,
    cutMarkColor: settings.cutMarkColor,
    formatOnly,
  });

  const handlePrint = () => {
    window.print();
  };

  // Previously these two handlers just called window.print() — the real
  // 300 DPI export engine existed but was never wired up. They now run
  // the real export, gated by the paywall.
  const handleExportPDF = async () => {
    if (photos.length === 0) return;
    if (!paid) {
      setIsPaywallOpen(true);
      return;
    }
    setIsExporting(true);
    setExportStatus(null);
    try {
      const config = buildPrintConfig();
      const result = calculateGrid(photos, config);
      await exportToPdf(photos, config, result);
      setExportStatus('PDF downloaded — 300 DPI, print at 100% scale (Actual size).');
    } catch (err) {
      console.error('PDF export failed:', err);
      setExportStatus('PDF export failed. Try again, or use Print Sheet instead.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPNG = async () => {
    if (photos.length === 0) return;
    if (!paid) {
      setIsPaywallOpen(true);
      return;
    }
    setIsExporting(true);
    setExportStatus(null);
    try {
      const config = buildPrintConfig();
      const result = calculateGrid(photos, config);
      await exportToPng(photos, config, result, 0);
      setExportStatus('PNG downloaded — 300 DPI, print at 100% scale (Actual size).');
    } catch (err) {
      console.error('PNG export failed:', err);
      setExportStatus('PNG export failed. Try again, or use Print Sheet instead.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleTestUnlock = () => {
    // Test-only unlock (see src/lib/payments.ts). Remove before launch.
    setPaidForTesting(true);
    setPaid(true);
    setIsPaywallOpen(false);
    setExportStatus('Test unlock enabled — downloads are unlocked for testing only.');
  };

  const totalPhotosCount = photos.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-300">
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        selectedPassportPreset={settings.passportPresetId}
        onSelectPassportPreset={handleSelectPassportPreset}
        onTriggerUpload={handleTriggerUpload}
        onExportPDF={handleExportPDF}
        onPrintSheet={handlePrint}
        onDownloadPNG={handleDownloadPNG}
        hasPhotos={photos.length > 0}
        isPaid={paid}
      />

      <main
        id="studio"
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-8"
      >
        {legalPage ? (
          <LegalPage page={legalPage} />
        ) : (
          <>
        {photos.length === 0 && <Landing onStart={handleStartFromLanding} />}

        {formatOnly ? (
          <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/50 px-4 py-3 text-xs text-amber-800 dark:text-amber-200 no-print">
            <strong>Format-only for US passports — crop and resize only, no edits.</strong>{' '}
            Since January 2026 the US Department of State rejects photos that have been
            digitally altered. Brightness and contrast controls are disabled for the US
            preset, and exports ignore any earlier edits.
          </div>
        ) : (
          photos.length > 0 && (
            <div className="rounded-2xl bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 px-4 py-3 text-xs text-gray-600 dark:text-gray-400 no-print">
              Edited photos may be rejected — the US bans edited passport photos
              outright, and other countries restrict editing too. Use the original,
              unedited photo where possible.
            </div>
          )
        )}

        {!paid && photos.length > 0 && (
          <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/50 px-4 py-3 text-xs text-indigo-800 dark:text-indigo-200 flex flex-wrap items-center justify-between gap-2 no-print">
            <span>
              Free preview — watermarked. Pay once ({formatPrice()}) for the clean,
              print-ready 300 DPI PDF and PNG.
            </span>
            <button
              onClick={() => setIsPaywallOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
            >
              Unlock download
            </button>
          </div>
        )}

        {exportStatus && (
          <div className="rounded-2xl bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 px-4 py-3 text-xs text-gray-700 dark:text-gray-300 no-print">
            {exportStatus}
          </div>
        )}

        <section>
          <PhotoUploader
            photos={photos}
            onUploadPhotos={handleUploadPhotos}
            onUpdateQuantity={handleUpdateQuantity}
            onSetQuantity={handleSetQuantity}
            onSetAllQuantities={handleSetAllQuantities}
            onOpenCropModal={handleOpenCropModal}
            onDuplicatePhoto={handleDuplicatePhoto}
            onDeletePhoto={handleDeletePhoto}
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <ControlPanel
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              totalPhotosCount={totalPhotosCount}
            />
          </div>

          <div className="lg:col-span-8">
            <PrintPreview
              photos={photos}
              settings={settings}
              onPrint={handlePrint}
              isPaid={paid}
            />
          </div>
        </section>

        {photos.length > 0 && <Landing onStart={handleStartFromLanding} compact />}
          </>
        )}
      </main>

      <footer className="no-print border-t border-gray-200 dark:border-gray-800 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-2 text-center text-[11px] text-gray-500 dark:text-gray-400">
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-semibold">
            <a href="#/" className="text-indigo-600 dark:text-indigo-400 hover:underline no-underline">
              Studio
            </a>
            {LEGAL_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="text-indigo-600 dark:text-indigo-400 hover:underline no-underline"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <p className="m-0">
            Passport Photo Studio — photos are processed in your browser and never
            uploaded. This tool sizes and lays out photos to official dimensions; acceptance
            is always decided by the issuing authority. Always check the latest official
            photo rules before applying.
          </p>
        </div>
      </footer>

      <CropModal
        photo={cropModalPhoto}
        photoWidthMm={settings.photoWidthMm}
        photoHeightMm={settings.photoHeightMm}
        isOpen={isCropModalOpen}
        formatOnly={formatOnly}
        onClose={() => setIsCropModalOpen(false)}
        onSaveCrop={handleSaveCrop}
      />

      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onTestUnlock={handleTestUnlock}
      />

      {isExporting && (
        <div className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-semibold shadow-lg no-print">
          Preparing your 300 DPI download…
        </div>
      )}
    </div>
  );
}

export default App;
