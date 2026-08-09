import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PhotoUploader } from './components/PhotoUploader';
import { ControlPanel } from './components/ControlPanel';
import { CropModal } from './components/CropModal';
import { PrintPreview } from './components/PrintPreview';
import type { PhotoItem, PrintSettings, CropData, PhotoAdjustments } from './types';
import './styles/print.css';

export function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [cropModalPhoto, setCropModalPhoto] = useState<PhotoItem | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState<boolean>(false);

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
    crop: CropData,
    adjustments: PhotoAdjustments
  ) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, crop, adjustments } : p))
    );
  };

  const handleUpdateSettings = (newSettings: Partial<PrintSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleDownloadPNG = () => {
    window.print();
  };

  const totalPhotosCount = photos.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-300">
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        selectedPassportPreset={settings.passportPresetId}
        onSelectPassportPreset={(presetId) => {
          const found = [
            { id: 'us', w: 50.8, h: 50.8 },
            { id: 'eu', w: 35, h: 45 },
            { id: 'ca', w: 50, h: 70 },
            { id: 'cn', w: 33, h: 48 },
            { id: 'in', w: 51, h: 51 },
            { id: 'jp', w: 35, h: 45 },
          ].find((s) => s.id === presetId);

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
        }}
        onTriggerUpload={handleTriggerUpload}
        onExportPDF={handleExportPDF}
        onPrintSheet={handlePrint}
        onDownloadPNG={handleDownloadPNG}
        hasPhotos={photos.length > 0}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-8">
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
            />
          </div>
        </section>
      </main>

      <CropModal
        photo={cropModalPhoto}
        photoWidthMm={settings.photoWidthMm}
        photoHeightMm={settings.photoHeightMm}
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        onSaveCrop={handleSaveCrop}
      />
    </div>
  );
}

export default App;
