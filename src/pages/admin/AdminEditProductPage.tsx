import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Sparkles, Save, Image, DollarSign, Boxes, ShieldCheck } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { RoutineStep } from '../../types';
import { uploadImageToStorage } from '../../services/storageService';

export const AdminEditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, updateProduct, categories, brands } = useAdminData();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);

  const [name, setName] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [brand, setBrand] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [sku, setSku] = useState('');
  const [volume, setVolume] = useState('');
  const [routineStep, setRoutineStep] = useState<RoutineStep>('protect');
  const [description, setDescription] = useState('');
  const [keyIngredientsInput, setKeyIngredientsInput] = useState('');
  const [howToUse, setHowToUse] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number>(0);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [isBestSeller, setIsBestSeller] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setEnglishName(product.englishName || '');
      setBrand(product.brand);
      setCategorySlug(product.categorySlug);
      setSku(product.sku);
      setVolume(product.volume || '');
      setRoutineStep(product.routineStep || 'treat');
      setDescription(product.description);
      setKeyIngredientsInput(product.keyIngredients?.join(', ') || '');
      setHowToUse(product.howToUse || '');
      setIngredients(product.ingredients || '');
      setImageUrl(product.images[0] || '');
      setPrice(product.price);
      setDiscountPrice(product.discountPrice);
      setStock(product.stock);
      setIsNew(!!product.isNew);
      setIsBestSeller(!!product.isBestSeller);
      setIsActive(product.isActive);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4" dir="rtl">
        <h2 className="text-xl font-serif font-bold text-primary">المستحضر غير موجود</h2>
        <Link to="/admin/products">
          <Button variant="primary">العودة لكتالوج المنتجات</Button>
        </Link>
      </div>
    );
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedCat = categories.find((c) => c.slug === categorySlug);
      const selectedBr = brands.find((b) => b.name === brand);
      const brandSlug = selectedBr?.slug || brand.toLowerCase().replace(/\s+/g, '-');

      const keyIngredients = keyIngredientsInput
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);

      await updateProduct(product.id, {
        name: name.trim(),
        englishName: englishName.trim() || undefined,
        brand,
        brandSlug,
        category: selectedCat?.name || product.category,
        categorySlug,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        images: [imageUrl.trim()],
        description: description.trim(),
        volume: volume.trim() || undefined,
        keyIngredients,
        ingredients: ingredients.trim() || undefined,
        howToUse: howToUse.trim() || undefined,
        routineStep,
        stock: Number(stock),
        sku: sku.trim(),
        isBestSeller,
        isNew,
        isActive,
      });

      navigate('/admin/products');
    } catch (err) {
      console.error('Error updating product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-right max-w-5xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-on-surface-muted">
            <Link to="/admin/products" className="hover:text-primary">المنتجات</Link>
            <span>←</span>
            <span className="text-primary font-bold">تعديل: {product.name}</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary">تعديل بيانات المستحضر</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/products">
            <Button variant="outline" size="sm">
              إلغاء
            </Button>
          </Link>
          <Button type="submit" variant="primary" size="sm" icon={<Save size={16} />}>
            حفظ التعديلات
          </Button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-3xl border border-outline-variant p-6 sm:p-8 shadow-soft-sm space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
          <Sparkles size={18} className="text-secondary" />
          <h2 className="text-base font-serif font-bold text-primary">المعلومات الأساسية</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="الاسم التجاري للمستحضر (بالعربية)"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <Input
            label="الاسم بالإنجليزية"
            value={englishName}
            onChange={(e) => setEnglishName(e.target.value)}
            dir="ltr"
            className="text-right"
          />

          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5">الماركة</label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full bg-white text-primary text-xs px-4 py-3 rounded-lg border border-outline-variant focus:outline-none focus:border-secondary"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5">القسم</label>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full bg-white text-primary text-xs px-4 py-3 rounded-lg border border-outline-variant focus:outline-none focus:border-secondary"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5">خطوة الروتين</label>
            <select
              value={routineStep}
              onChange={(e) => setRoutineStep(e.target.value as RoutineStep)}
              className="w-full bg-white text-primary text-xs px-4 py-3 rounded-lg border border-outline-variant focus:outline-none focus:border-secondary"
            >
              <option value="cleanse">1. غسول وتنظيف</option>
              <option value="tone">2. تونر وتهدئة</option>
              <option value="treat">3. سيروم وعلاج</option>
              <option value="moisturize">4. ترطيب وترميم</option>
              <option value="protect">5. واقي شمس وحماية</option>
            </select>
          </div>

          <Input
            label="رمز التخزين والباركود (SKU)"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            dir="ltr"
            className="text-right"
          />

          <Input
            label="حجم / سعة العبوة"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
          />

          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-xs font-semibold text-primary">الوصف</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white text-primary text-xs p-3.5 rounded-xl border border-outline-variant focus:outline-none focus:border-secondary"
            />
          </div>
        </div>
      </div>

      {/* Media Section */}
      <div className="bg-white rounded-3xl border border-outline-variant p-6 sm:p-8 shadow-soft-sm space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
          <Image size={18} className="text-secondary" />
          <h2 className="text-base font-serif font-bold text-primary">
            معرض الصور والوسائط الرقمية
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
          <div className="sm:col-span-8 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">
                تغيير الصورة من الجهاز إلى Supabase Storage (PNG, JPG, WEBP)
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                disabled={isUploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setIsUploading(true);
                    setUploadError(null);
                    try {
                      const { url, error } = await uploadImageToStorage(file, 'product-images');
                      if (error || !url) {
                        setUploadError('فشل رفع الصورة إلى التخزين السحابي. يرجى المحاولة مرة أخرى.');
                      } else {
                        setImageUrl(url);
                      }
                    } catch (err) {
                      console.error('Upload exception:', err);
                      setUploadError('حدث خطأ أثناء رفع الصورة');
                    } finally {
                      setIsUploading(false);
                    }
                  }
                }}
                className="w-full text-xs text-primary file:mr-0 file:ml-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-secondary/15 file:text-secondary hover:file:bg-secondary/25 cursor-pointer border border-outline-variant rounded-xl p-2 bg-surface"
              />
              {isUploading && (
                <p className="text-xs text-secondary mt-1 font-medium animate-pulse">
                  جاري رفع الصورة إلى Supabase Storage...
                </p>
              )}
              {uploadError && (
                <p className="text-xs text-red-500 mt-1 font-medium">{uploadError}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-on-surface-muted">أو</span>
              <div className="h-px bg-outline-variant/60 flex-1"></div>
            </div>

            <Input
              label="أو رابط الصورة المباشر (URL)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              dir="ltr"
              className="text-right"
            />
          </div>
          <div className="sm:col-span-4 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold text-primary mb-2">معاينة الصورة</span>
            <div className="w-28 h-28 rounded-2xl bg-oatmeal p-2 border border-outline-variant flex items-center justify-center overflow-hidden relative group">
              {imageUrl ? (
                <>
                  <img src={imageUrl} alt="معاينة الصورة" className="w-full h-full object-contain mix-blend-multiply" />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute inset-0 bg-primary/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold rounded-2xl"
                  >
                    إزالة
                  </button>
                </>
              ) : (
                <span className="text-xs text-on-surface-muted">لا توجد صورة</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="bg-white rounded-3xl border border-outline-variant p-6 sm:p-8 shadow-soft-sm space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
          <DollarSign size={18} className="text-emerald-600" />
          <h2 className="text-base font-serif font-bold text-primary">التسعير والمخزون</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="السعر الأساسي (ج.م)"
            type="number"
            required
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />

          <Input
            label="سعر الخصم (ج.م)"
            type="number"
            value={discountPrice ?? ''}
            onChange={(e) =>
              setDiscountPrice(e.target.value ? Number(e.target.value) : undefined)
            }
          />

          <Input
            label="الكمية بالمخزون"
            type="number"
            required
            min="0"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-outline-variant/60">
          <label className="flex items-center gap-2 text-xs font-semibold text-primary cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="accent-secondary w-4 h-4 rounded"
            />
            <span>ظاهر بالمتجر</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-primary cursor-pointer">
            <input
              type="checkbox"
              checked={isBestSeller}
              onChange={(e) => setIsBestSeller(e.target.checked)}
              className="accent-secondary w-4 h-4 rounded"
            />
            <span>الأكثر مبيعاً ⭐</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-primary cursor-pointer">
            <input
              type="checkbox"
              checked={isNew}
              onChange={(e) => setIsNew(e.target.checked)}
              className="accent-secondary w-4 h-4 rounded"
            />
            <span>وصل حديثاً ✨</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Link to="/admin/products">
          <Button variant="outline" size="md">
            إلغاء ورجوع
          </Button>
        </Link>
        <Button type="submit" variant="primary" size="lg" icon={<Save size={18} />}>
          حفظ التعديلات
        </Button>
      </div>
    </form>
  );
};
