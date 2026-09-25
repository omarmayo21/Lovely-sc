/**
 * Image Optimization Utility
 * Converts JPG, JPEG, PNG to WebP while strictly preserving original dimensions (width x height).
 */

export interface ImageOptimizationResult {
  file: File;
  width: number;
  height: number;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
}

export async function convertToWebP(
  file: File,
  quality: number = 0.85
): Promise<ImageOptimizationResult> {
  // If it's already an SVG, preserve as is
  if (file.type === 'image/svg+xml') {
    return {
      file,
      width: 0,
      height: 0,
      originalSize: file.size,
      optimizedSize: file.size,
      compressionRatio: 1,
    };
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('فشل في قراءة ملف الصورة.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('فشل في فك تشفير أبعاد الصورة.'));
      img.onload = () => {
        // EXACT ORIGINAL DIMENSIONS - NO RESIZING
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original
          resolve({
            file,
            width,
            height,
            originalSize: file.size,
            optimizedSize: file.size,
            compressionRatio: 1,
          });
          return;
        }

        // Draw image onto canvas preserving crispness
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({
                file,
                width,
                height,
                originalSize: file.size,
                optimizedSize: file.size,
                compressionRatio: 1,
              });
              return;
            }

            const originalBaseName = file.name.replace(/\.[^/.]+$/, '');
            const webpFileName = `${originalBaseName}.webp`;
            const webpFile = new File([blob], webpFileName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });

            resolve({
              file: webpFile,
              width,
              height,
              originalSize: file.size,
              optimizedSize: webpFile.size,
              compressionRatio: Number((blob.size / file.size).toFixed(2)),
            });
          },
          'image/webp',
          quality
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
