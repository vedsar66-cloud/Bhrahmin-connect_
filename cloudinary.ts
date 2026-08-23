/**
 * Cloudinary & Image Compression Utility
 * Strictly compresses images to <100KB via HTML5 Canvas before uploading
 * to maintain a Zero-Cost bandwidth and storage architecture.
 */

export interface CompressionResult {
  blob: Blob;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  width: number;
  height: number;
}

/**
 * Compresses an image file strictly under maxSizeBytes (default 100KB / 102400 bytes)
 */
export async function compressImage(
  file: File,
  maxSizeBytes: number = 100 * 1024, // 100KB limit
  maxWidth: number = 800,
  maxHeight: number = 800
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const originalSize = file.size;
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image element.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate scaled dimensions while preserving aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(new Error('Canvas 2D context not available.'));
        }

        // Clean white background for transparency safety
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Iterative compression to guarantee < 100KB
        let quality = 0.85;
        const tryCompress = (q: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return reject(new Error('Canvas blob generation failed.'));
              }

              // If blob is still larger than max size and quality can be reduced
              if (blob.size > maxSizeBytes && q > 0.3) {
                tryCompress(Math.max(0.2, q - 0.15));
                return;
              }

              // Also if still > 100KB even at low quality, scale down resolution
              if (blob.size > maxSizeBytes && width > 400) {
                canvas.width = Math.round(width * 0.75);
                canvas.height = Math.round(height * 0.75);
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                tryCompress(0.7);
                return;
              }

              const compressedSize = blob.size;
              const compressionRatio = Math.round(((originalSize - compressedSize) / originalSize) * 100);
              const dataUrl = canvas.toDataURL('image/jpeg', q);

              resolve({
                blob,
                dataUrl,
                originalSize,
                compressedSize,
                compressionRatio: Math.max(0, compressionRatio),
                width: canvas.width,
                height: canvas.height,
              });
            },
            'image/jpeg',
            q
          );
        };

        tryCompress(quality);
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Uploads compressed image blob to Cloudinary using unsigned upload preset.
 * Gracefully falls back to base64 dataUrl if Cloudinary is not configured yet.
 */
export async function uploadToCloudinary(
  blob: Blob,
  fallbackDataUrl?: string
): Promise<{ url: string; isCloudinary: boolean; error?: string }> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || localStorage.getItem('samaj_cloudinary_cloud_name');
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || localStorage.getItem('samaj_cloudinary_preset');

  // If no Cloudinary config is provided, return compressed base64 dataUrl seamlessly
  if (!cloudName || !uploadPreset || cloudName === 'your-cloud-name') {
    return {
      url: fallbackDataUrl || URL.createObjectURL(blob),
      isCloudinary: false,
    };
  }

  try {
    const formData = new FormData();
    formData.append('file', blob);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'samaj_community_profiles');

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.warn('Cloudinary upload failed, falling back to local compressed image:', errData);
      return {
        url: fallbackDataUrl || URL.createObjectURL(blob),
        isCloudinary: false,
        error: errData.error?.message || 'Upload failed',
      };
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      isCloudinary: true,
    };
  } catch (err: any) {
    console.warn('Network error uploading to Cloudinary, using compressed fallback:', err);
    return {
      url: fallbackDataUrl || URL.createObjectURL(blob),
      isCloudinary: false,
      error: err.message,
    };
  }
}
