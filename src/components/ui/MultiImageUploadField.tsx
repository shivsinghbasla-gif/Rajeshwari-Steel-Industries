import React, { useRef, useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  X,
  RefreshCw,
  AlertCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
} from 'lucide-react';
import { optimizeAndProcessImage, saveImageToPersistentStorage } from '../../services/imageStorage.ts';

interface MultiImageUploadFieldProps {
  images: string[];
  mainImage: string;
  onChange: (images: string[], mainImage: string) => void;
  label?: string;
  recommendedSizeText?: string;
  entityId?: string;
}

export const MultiImageUploadField: React.FC<MultiImageUploadFieldProps> = ({
  images = [],
  mainImage = '',
  onChange,
  label = 'Product Photographs',
  recommendedSizeText = 'Upload photos from device gallery or camera (JPEG, PNG, WEBP)',
  entityId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Normalize image list
  const currentImages: string[] = (() => {
    const list = [...images];
    if (mainImage && !list.includes(mainImage)) {
      list.unshift(mainImage);
    }
    return list.filter((img) => typeof img === 'string' && img.trim().length > 0);
  })();

  const activeMain: string = mainImage || currentImages[0] || '';

  // Handle new images upload (can select multiple files at once on mobile/desktop)
  const handleFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      const uploadedDataUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const dataUrl = await optimizeAndProcessImage(file);
        const storageKey = `img_${entityId || 'product'}_${Date.now()}_${i}`;
        await saveImageToPersistentStorage(storageKey, dataUrl, {
          name: file.name,
          type: file.type,
        });
        uploadedDataUrls.push(dataUrl);
      }

      const combined = [...currentImages, ...uploadedDataUrls];
      const newMain = activeMain || combined[0] || '';
      onChange(combined, newMain);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload selected image(s).');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Replace specific image at index
  const handleReplaceSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (replacingIndex === null) return;
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      const dataUrl = await optimizeAndProcessImage(file);
      const storageKey = `img_${entityId || 'product'}_rep_${Date.now()}`;
      await saveImageToPersistentStorage(storageKey, dataUrl, {
        name: file.name,
        type: file.type,
      });

      const updated = [...currentImages];
      const wasMain = updated[replacingIndex] === activeMain;
      updated[replacingIndex] = dataUrl;
      const newMain = wasMain ? dataUrl : activeMain;

      onChange(updated, newMain);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to replace image.');
    } finally {
      setIsProcessing(false);
      setReplacingIndex(null);
      if (replaceInputRef.current) {
        replaceInputRef.current.value = '';
      }
    }
  };

  // Delete image
  const handleDelete = (index: number) => {
    const target = currentImages[index];
    const updated = currentImages.filter((_, i) => i !== index);
    let newMain = activeMain;
    if (target === activeMain) {
      newMain = updated[0] || '';
    }
    onChange(updated, newMain);
  };

  // Set Main photo
  const handleSetMain = (index: number) => {
    const selected = currentImages[index];
    if (!selected) return;
    // Move main to the beginning
    const updated = [selected, ...currentImages.filter((_, i) => i !== index)];
    onChange(updated, selected);
  };

  // Reorder left / earlier
  const handleMoveLeft = (index: number) => {
    if (index <= 0) return;
    const updated = [...currentImages];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(updated, activeMain);
  };

  // Reorder right / later
  const handleMoveRight = (index: number) => {
    if (index >= currentImages.length - 1) return;
    const updated = [...currentImages];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(updated, activeMain);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold text-stone-200">
            {label} *
          </label>
          <p className="text-[11px] text-stone-400 mt-0.5">
            {recommendedSizeText}
          </p>
        </div>
        <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
          {currentImages.length} photo{currentImages.length === 1 ? '' : 's'}
        </span>
      </div>

      {errorMessage && (
        <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFilesSelect}
        className="hidden"
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/*"
        onChange={handleReplaceSelect}
        className="hidden"
      />

      {/* Thumbnails grid */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {currentImages.map((imgUri, index) => {
            const isMain = imgUri === activeMain || (index === 0 && !activeMain);
            return (
              <div
                key={`${index}-${imgUri.slice(0, 30)}`}
                className={`relative rounded-xl border bg-stone-950 overflow-hidden flex flex-col ${
                  isMain
                    ? 'border-amber-500 ring-2 ring-amber-500/30'
                    : 'border-stone-800 hover:border-stone-700'
                }`}
              >
                {/* Image display */}
                <div className="relative h-28 w-full bg-black">
                  <img
                    src={imgUri}
                    alt={`Product photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {isMain && (
                    <span className="absolute top-1.5 left-1.5 bg-amber-500 text-stone-950 font-bold text-[10px] px-2 py-0.5 rounded shadow flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-stone-950" />
                      <span>Main Cover</span>
                    </span>
                  )}
                  <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-stone-300 text-[10px] px-1.5 py-0.5 rounded font-mono">
                    #{index + 1}
                  </span>
                </div>

                {/* Photo action controls */}
                <div className="p-2 bg-stone-900 border-t border-stone-800/80 flex items-center justify-between gap-1 text-[11px]">
                  {!isMain ? (
                    <button
                      type="button"
                      onClick={() => handleSetMain(index)}
                      className="px-2 py-1 rounded bg-stone-800 hover:bg-amber-500/20 text-stone-300 hover:text-amber-300 font-semibold text-[10px] transition-colors"
                      title="Set as Main Cover Photo"
                    >
                      Make Main
                    </button>
                  ) : (
                    <span className="text-[10px] text-amber-400 font-bold px-1">
                      Primary
                    </span>
                  )}

                  <div className="flex items-center gap-1 ml-auto">
                    {/* Move left */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveLeft(index)}
                      className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-30 disabled:hover:bg-stone-800"
                      title="Move left / up"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    {/* Move right */}
                    <button
                      type="button"
                      disabled={index === currentImages.length - 1}
                      onClick={() => handleMoveRight(index)}
                      className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-30 disabled:hover:bg-stone-800"
                      title="Move right / down"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                    {/* Replace */}
                    <button
                      type="button"
                      onClick={() => {
                        setReplacingIndex(index);
                        replaceInputRef.current?.click();
                      }}
                      className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300"
                      title="Replace this photo"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400"
                      title="Delete this photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Upload Button */}
      <div
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className="border-2 border-dashed border-stone-700 hover:border-amber-500 rounded-xl p-4 text-center cursor-pointer transition-all bg-stone-950/60 hover:bg-stone-950 group flex flex-col items-center justify-center gap-1"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            fileInputRef.current?.click();
          }
        }}
      >
        <div className="w-10 h-10 rounded-lg bg-stone-900 border border-stone-800 group-hover:border-amber-500/50 group-hover:bg-amber-500/10 text-stone-400 group-hover:text-amber-400 flex items-center justify-center transition-colors">
          {isProcessing ? (
            <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </div>
        <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
          {isProcessing
            ? 'Optimizing & Saving Photo(s)...'
            : currentImages.length === 0
            ? 'Upload Product Photo(s) from Device Gallery'
            : '+ Add More Photos for this Product'}
        </span>
        <span className="text-[10px] text-stone-400">
          Tap to open phone gallery or camera. Select one or multiple images.
        </span>
      </div>
    </div>
  );
};
