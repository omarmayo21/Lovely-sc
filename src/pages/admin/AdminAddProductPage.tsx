import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Save,
  Image,
  DollarSign,
  Boxes,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { RoutineStep } from '../../types';
import { uploadImageToStorage } from '../../services/storageService';

export const AdminAddProductPage: React.FC = () => {
  const { addProduct, categories, brands } = useAdminData();
  const navigate = useNavigate();

  // 1. Basic Info
  const [name, setName] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [brand, setBrand] = useState(brands[0]?.name || 'Beauty of Joseon');
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug || 'sunscreen');
  const [sku, setSku] = useState('');
  const [volume, setVolume] = useState('50ml');
  const [routineStep, setRoutineStep] = useState<RoutineStep>('protect');
  const [description, setDescription] = useState('');

  // 2. Clinical Formulation
  const [keyIngredientsInput, setKeyIngredientsInput] = useState('');
  const [howToUse, setHowToUse] = useState('');
  const [ingredients, setIngredients] = useState('');

  // 3. Media
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
  );

  // 4. Pricing
  const [price, setPrice] = useState<number>(550);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(undefined);

  // 5. Stock & Visibility
  const [stock, setStock] = useState<number>(25);
  const [isNew, setIsNew] = useState<boolean>(true);
  const [isBestSeller, setIsBestSeller] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrors({ name: 'يرجى إدخال اسم المستحضر بالعربية' });
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedCat = categories.find((c) => c.slug === categorySlug);
      const selectedBr = brands.find((b) => b.name === brand);
      const brandSlug = selectedBr?.slug || brand.toLowerCase().replace(/\s+/g, '-');
      const slug = `${brandSlug}-${name.trim().toLowerCase().replace(/[\s\W]+/g, '-')}-${Date.now().toString().slice(-4)}`;

      const keyIngredients = keyIngredientsInput
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);

      await addProduct({
        name: name.trim(),
        englishName: englishName.trim() || undefined,
        slug,
        brand,
        brandSlug,
        category: selectedCat?.name || 'عناية بالبشرة',
        categorySlug,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        images: [imageUrl.trim()],
        description: description.trim() || 'مستحضر كوري أصلي للعناية الفاخرة بالبشرة.',
        volume: volume.trim() || undefined,
        skinType: ['جميع أنواع البشرة'],
        keyIngredients: keyIngredients.length > 0 ? keyIngredients : ['خلاصات طبيعية نقية'],
        ingredients: ingredients.trim() || undefined,
        howToUse: howToUse.trim() || undefined,
        routineStep,
        stock: Number(stock),
        sku: sku.trim() || `LSC-${Math.floor(100 + Math.random() * 900)}`,
        featured: true,
        isBestSeller,
        isNew,
        rating: 5.0,
        reviewsCount: 1,
        isActive,
      });

      navigate('/admin/products');
    } catch (err) {
      console.error('Error adding product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-right max-w-5xl mx-auto" dir="rtl">
      {/* Header from Stitch (screen_3.html) */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-on-surface-muted">
            <Link to="/admin/products" className="hover:text-primary">المنتجات</Link>
            <span>←</span>
            <span className="text-primary font-bold">إضافة مستحضر جديد</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary">إضافة مستحضر عناية جديد</h1>
          <p className="text-xs text-on-surface-muted">
            أدخلي البيانات الكاملة للمستحضر وتفاصيل التركيبة والتسعير بالجنيه المصري
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/products">
            <Button variant="outline" size="sm">
              إلغاء
            </Button>
          </Link>
          <Button type="submit" variant="primary" size="sm" icon={<Save size={16} />}>
            حفظ المستحضر ونشره
          </Button>
        </div>
      </div>

      {/* 1. Basic Info Section from Stitch */}
      <div className="bg-white rounded-3xl border border-outline-variant p-6 sm:p-8 shadow-soft-sm space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
          <Sparkles size={18} className="text-secondary" />
          <h2 className="text-base font-serif font-bold text-primary">
            المعلومات الأساسية للمستحضر
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="الاسم التجاري للمستحضر (بالعربية)"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({});
              }}
              placeholder="مثال: واقي شمس الأرز العضوي والبروبيوتيك SPF50+"
              error={errors.name}
            />
          </div>

          <Input
            label="الاسم بالإنجليزية (اختياري)"
            value={englishName}
            onChange={(e) => setEnglishName(e.target.value)}
            placeholder="Relief Sun: Rice + Probiotics SPF50+"
            dir="ltr"
            className="text-right"
          />

          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5">
              الماركة التجارية <span className="text-red-500">*</span>
            </label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full bg-white text-primary text-xs px-4 py-3 rounded-lg border border-outline-variant focus:outline-none focus:border-secondary"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name} ({b.origin === 'korean' ? 'كوري' : 'فرنسي'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5">
              قسم المتجر <span className="text-red-500">*</span>
            </label>
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
            <label className="block text-xs font-semibold text-primary mb-1.5">
              خطوة الروتين (Routine Step)
            </label>
            <select
              value={routineStep}
              onChange={(e) => setRoutineStep(e.target.value as RoutineStep)}
              className="w-full bg-white text-primary text-xs px-4 py-3 rounded-lg border border-outline-variant focus:outline-none focus:border-secondary"
            >
              <option value="cleanse">1. غسول وتنظيف (Cleanse)</option>
              <option value="tone">2. تونر وتهدئة (Tone)</option>
              <option value="treat">3. سيروم وعلاج (Treat)</option>
              <option value="moisturize">4. ترطيب وترميم (Moisturize)</option>
              <option value="protect">5. واقي شمس وحماية (Protect)</option>
            </select>
          </div>

          <Input
            label="رمز التخزين والباركود (SKU)"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="مثال: BOJ-RS-50"
            dir="ltr"
            className="text-right"
          />

          <Input
            label="حجم / سعة العبوة"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            placeholder="مثال: 50ml أو 100ml"
          />

          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-xs font-semibold text-primary">وصف المستحضر وفوائده</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتبي وصفاً جذاباً يشرح فوائد المنتج للبشرة وكيفية تأثيره..."
              className="w-full bg-white text-primary text-xs p-3.5 rounded-xl border border-outline-variant focus:outline-none focus:border-secondary"
            />
          </div>
        </div>
      </div>

      {/* 2. Clinical Formulation & Ingredients Section from Stitch */}
      <div className="bg-white rounded-3xl border border-outline-variant p-6 sm:p-8 shadow-soft-sm space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
          <ShieldCheck size={18} className="text-tertiary" />
          <h2 className="text-base font-serif font-bold text-primary">
            تفاصيل التركيبة والعناية السريرية
          </h2>
        </div>

        <div className="space-y-4">
          <Input
            label="المكونات الفعالة الرئيسية (مفصولة بفواصل)"
            value={keyIngredientsInput}
            onChange={(e) => setKeyIngredientsInput(e.target.value)}
            placeholder="مثال: خلاصة الأرز 30%, مجمع البروبيوتيك, النياسيناميد 2%"
            helperText="افصلي بين كل مكون فعال بفاصلة (،)"
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-primary">طريقة الاستخدام المقترحة</label>
            <textarea
              rows={2}
              value={howToUse}
              onChange={(e) => setHowToUse(e.target.value)}
              placeholder="مثال: في الخطوة الأخيرة من الروتين الصباحي، وزعي كمية وفيرة على الوجه والرقبة..."
              className="w-full bg-white text-primary text-xs p-3.5 rounded-xl border border-outline-variant focus:outline-none focus:border-secondary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-primary">
              قائمة المكونات الكاملة (INCI)
            </label>
            <textarea
              rows={3}
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Water, Oryza Sativa (Rice) Extract, Niacinamide, Glycerin..."
              dir="ltr"
              className="w-full bg-white text-primary text-xs p-3.5 rounded-xl border border-outline-variant focus:outline-none focus:border-secondary font-mono"
            />
          </div>
        </div>
      </div>

      {/* 3. Media Section */}
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
                رفع صورة من الجهاز إلى Supabase Storage (PNG, JPG, WEBP)
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

      {/* 4. Pricing & Margin */}
      <div className="bg-white rounded-3xl border border-outline-variant p-6 sm:p-8 shadow-soft-sm space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
          <DollarSign size={18} className="text-emerald-600" />
          <h2 className="text-base font-serif font-bold text-primary">التسعير والعروض</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="سعر البيع الأساسي (ج.م)"
            type="number"
            required
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="550"
          />

          <Input
            label="سعر البيع بعد الخصم / في العرض (اختياري)"
            type="number"
            value={discountPrice ?? ''}
            onChange={(e) =>
              setDiscountPrice(e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="مثال: 480 (اتركيه فارغاً إذا لم يوجد خصم)"
          />
        </div>
      </div>

      {/* 5. Inventory & Visibility Switches from Stitch */}
      <div className="bg-white rounded-3xl border border-outline-variant p-6 sm:p-8 shadow-soft-sm space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
          <Boxes size={18} className="text-primary" />
          <h2 className="text-base font-serif font-bold text-primary">المخزون والتوافر</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          <Input
            label="الكمية المتاحة بالمخزون"
            type="number"
            required
            min="0"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
          />

          <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-primary cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="accent-secondary w-4 h-4 rounded"
              />
              <span>إتاحة المستحضر فوراً بالمتجر</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-primary cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="accent-secondary w-4 h-4 rounded"
              />
              <span>تمييز كـ (الأكثر مبيعاً ⭐)</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-primary cursor-pointer">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="accent-secondary w-4 h-4 rounded"
              />
              <span>تمييز كـ (وصل حديثاً ✨)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Submit Actions */}
      <div className="flex justify-end gap-4">
        <Link to="/admin/products">
          <Button variant="outline" size="md">
            إلغاء ورجوع
          </Button>
        </Link>
        <Button type="submit" variant="primary" size="lg" icon={<Save size={18} />}>
          حفظ ونشر المستحضر
        </Button>
      </div>
    </form>
  );
};
