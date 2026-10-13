import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, RefreshCw, AlertCircle, Check, Link } from 'lucide-react';
import { optimizeAndProcessImage, saveImageToPersistentStorage } from '../../services/imageStorage.ts';

interface ImageUploadFieldProps {
  value: string;
  onChange: (imageUri: string) => void;
  label?: string;
  recommendedSizeText?: string;
  entityId?: string; // used for unique storage key
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  label = 'Photo / Image',
  recommendedSizeText = 'Choose photo from phone gallery or files (JPEG, PNG, WEBP)',
  entityId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      // Compress and optimize image to web standards
      const optimizedDataUrl = await optimizeAndProcessImage(file);

      // Persistently store in IndexedDB
      const storageKey = `img_${entityId || 'upload'}_${Date.now()}`;
      await saveImageToPersistentStorage(storageKey, optimizedDataUrl, {
        name: file.name,
        type: file.type,
      });

      // Pass persistent dataUrl to parent state
      onChange(optimizedDataUrl);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process selected image');
    } finally {
      setIsProcessing(false);
      // Reset input so same file can be re-selected if desired
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = () => {
    if (customUrl.trim()) {
      onChange(customUrl.trim());
      setShowUrlInput(false);
      setCustomUrl('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-stone-200">
          {label} *
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-1"
        >
          <Link className="w-3 h-3" />
          <span>{showUrlInput ? 'Back to File Upload' : 'Enter Image URL instead'}</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Hidden file input supporting mobile gallery & camera */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {showUrlInput ? (
        /* Alternate URL Input */
        <div className="flex items-center gap-2">
          <input
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            value={customUrl || value}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3.5 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold"
          >
            Apply
          </button>
        </div>
      ) : value ? (
        /* Preview with Change & Remove options */
        <div className="relative rounded-xl border border-stone-700/80 bg-stone-950 p-2.5 flex items-center gap-3">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-black shrink-0 border border-stone-800">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => setErrorMessage('Could not load image preview. Please re-upload.')}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              <span>Image Ready</span>
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">
              Stored persistently in database
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin text-amber-400' : ''}`} />
                <span>Change Image</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                disabled={isProcessing}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 text-xs font-medium transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Button Area */
        <div
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className="border-2 border-dashed border-stone-700 hover:border-amber-500 rounded-xl p-5 text-center cursor-pointer transition-all bg-stone-950/60 hover:bg-stone-950 group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              fileInputRef.current?.click();
            }
          }}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-800 group-hover:border-amber-500/50 group-hover:bg-amber-500/10 text-stone-400 group-hover:text-amber-400 flex items-center justify-center mb-2.5 transition-colors">
              {isProcessing ? (
                <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>
            <span className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
              {isProcessing ? 'Processing & Optimizing Image...' : 'Click to Upload Image from Phone Gallery'}
            </span>
            <span className="text-[11px] text-stone-400 mt-1">
              {recommendedSizeText}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
