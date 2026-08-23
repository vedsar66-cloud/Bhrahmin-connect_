import React, { useState, useRef } from 'react';
import { Camera, UploadCloud, CheckCircle2, AlertCircle, RefreshCw, Sparkles, X } from 'lucide-react';
import { compressImage, uploadToCloudinary, CompressionResult } from './lib/cloudinary';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onAvatarChange: (url: string) => void;
  label?: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  onAvatarChange,
  label = 'Profile Photo',
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<CompressionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentAvatarUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatKB = (bytes: number) => {
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMsg(null);

      // Compress strictly to <100KB using Canvas
      const result = await compressImage(file, 100 * 1024, 700, 700);
      setStats(result);
      setPreviewUrl(result.dataUrl);

      // Attempt Cloudinary upload (falls back to compressed dataUrl)
      const uploadRes = await uploadToCloudinary(result.blob, result.dataUrl);
      onAvatarChange(uploadRes.url);
    } catch (err: any) {
      console.error('Compression/Upload error:', err);
      setErrorMsg(err.message || 'Error processing photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearPhoto = () => {
    setPreviewUrl('');
    setStats(null);
    onAvatarChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-slate-700">
        {label}
      </label>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="flex items-center space-x-4 p-3.5 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl hover:border-orange-400 transition cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />

        {/* Circular Avatar Preview */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-orange-500 bg-white shadow-sm flex items-center justify-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-8 h-8 text-slate-400" />
            )}
          </div>

          {isProcessing && (
            <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Info & Compression Meter */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
            <UploadCloud className="w-4 h-4 text-orange-600" />
            <span>Click or Drag photo here</span>
          </div>

          <p className="text-[11px] text-slate-500 mt-0.5">
            Auto-compressed strictly to <strong className="text-emerald-700 font-bold">&lt;100KB</strong> for ultra-fast loading.
          </p>

          {stats && (
            <div className="mt-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-800 flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  <strong>{formatKB(stats.compressedSize)}</strong> (Saved {stats.compressionRatio}%)
                </span>
              </div>
              <span className="font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">
                &lt;100KB Target Met
              </span>
            </div>
          )}

          {errorMsg && (
            <div className="mt-1 text-[11px] text-red-600 flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {previewUrl && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clearPhoto();
            }}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600"
            title="Remove photo"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
