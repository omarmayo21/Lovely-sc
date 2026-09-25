import { supabase } from '../lib/supabase';
import { convertToWebP } from '../utils/imageOptimizer';

export interface UploadProgressInfo {
  status: 'optimizing' | 'uploading' | 'completed' | 'error';
  originalSize?: number;
  optimizedSize?: number;
  width?: number;
  height?: number;
  url?: string;
  error?: string;
}

/**
 * Uploads an image file to Supabase Storage bucket with automatic WebP conversion and dimension preservation
 * @param file Original File object from <input type="file" />
 * @param bucket Name of the bucket (default: 'product-images')
 * @param onProgress Optional callback for progress state
 * @returns Public URL of the uploaded image or null on error
 */
export async function uploadImageToStorage(
  file: File,
  bucket: 'product-images' | 'brand-logos' = 'product-images',
  onProgress?: (info: UploadProgressInfo) => void
): Promise<{ url: string | null; error: Error | null; meta?: { width: number; height: number; size: number } }> {
  try {
    onProgress?.({ status: 'optimizing', originalSize: file.size });

    // 1. Optimize & convert to WebP preserving exact original dimensions
    const { file: optimizedFile, width, height, originalSize, optimizedSize } = await convertToWebP(file);

    onProgress?.({
      status: 'uploading',
      originalSize,
      optimizedSize,
      width,
      height,
    });

    // 2. Prepare storage path
    const fileExt = optimizedFile.name.split('.').pop() || 'webp';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    // 3. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, optimizedFile, {
        contentType: optimizedFile.type || 'image/webp',
        cacheControl: '31536000', // 1 year cache
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      onProgress?.({ status: 'error', error: uploadError.message });
      return { url: null, error: uploadError };
    }

    // 4. Retrieve public URL
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    
    onProgress?.({
      status: 'completed',
      url: data.publicUrl,
      originalSize,
      optimizedSize,
      width,
      height,
    });

    return {
      url: data.publicUrl,
      error: null,
      meta: { width, height, size: optimizedSize },
    };
  } catch (err: any) {
    console.error('Unexpected error uploading image:', err);
    onProgress?.({ status: 'error', error: err.message || 'فشل في رفع الصورة' });
    return { url: null, error: err };
  }
}
