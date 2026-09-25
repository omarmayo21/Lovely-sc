import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Calendar,
  Link as LinkIcon,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { Offer } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { uploadImageToStorage, UploadProgressInfo } from '../../services/storageService';

export const AdminOffersPage: React.FC = () => {
  const { offers, addOffer, updateOffer, toggleOffer, deleteOffer } = useAdminData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [discountText, setDiscountText] = useState('');
  const [linkUrl, setLinkUrl] = useState('/shop');
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [uploadProgress, setUploadProgress] = useState<UploadProgressInfo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingOffer(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setDiscountText('');
    setLinkUrl('/shop');
    setIsActive(true);
    setStartDate('');
    setEndDate('');
    setUploadProgress(null);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (offer: Offer) => {
    setEditingOffer(offer);
    setTitle(offer.title);
    setDescription(offer.description || '');
    setImageUrl(offer.imageUrl || '');
    setDiscountText(offer.discountText || '');
    setLinkUrl(offer.linkUrl || '/shop');
    setIsActive(offer.isActive);
    setStartDate(offer.startDate ? offer.startDate.split('T')[0] : '');
    setEndDate(offer.endDate ? offer.endDate.split('T')[0] : '');
    setUploadProgress(null);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('يرجى اختيار صورة بصيغة JPG أو PNG أو WebP.');
      return;
    }

    // Upload with automatic WebP conversion and original dimension preservation
    const result = await uploadImageToStorage(file, 'product-images', (info) => {
      setUploadProgress(info);
    });

    if (result.url) {
      setImageUrl(result.url);
    } else {
      setErrorMessage(result.error?.message || 'فشل في رفع الصورة.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('يرجى إدخال عنوان العرض.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (editingOffer) {
        await updateOffer(editingOffer.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
          discountText: discountText.trim() || undefined,
          linkUrl: linkUrl.trim() || undefined,
          isActive,
          startDate: startDate ? new Date(startDate).toISOString() : undefined,
          endDate: endDate ? new Date(endDate).toISOString() : undefined,
        });
      } else {
        await addOffer({
          title: title.trim(),
          description: description.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
          discountText: discountText.trim() || undefined,
          linkUrl: linkUrl.trim() || undefined,
          isActive,
          startDate: startDate ? new Date(startDate).toISOString() : undefined,
          endDate: endDate ? new Date(endDate).toISOString() : undefined,
        });
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err?.message || 'حدث خطأ أثناء حفظ العرض.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-outline-variant/60 shadow-soft-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Tag className="text-secondary" size={24} />
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-primary">
              إدارة العروض الترويجية والبوب أب
            </h1>
          </div>
          <p className="text-xs text-on-surface-muted">
            إدارة عروض الخصم والبوب أب الترويجي التلقائي لزوار المتجر
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Plus size={16} />}
          onClick={openCreateModal}
        >
          إضافة عرض ترويجي جديد
        </Button>
      </div>

      {/* Offers Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={`bg-white rounded-3xl border transition-all overflow-hidden flex flex-col justify-between ${
              offer.isActive
                ? 'border-secondary/30 shadow-soft-sm'
                : 'border-outline-variant/50 opacity-75'
            }`}
          >
            {/* Offer Image Header */}
            {offer.imageUrl ? (
              <div className="relative h-44 w-full bg-surface-container-low overflow-hidden">
                <img
                  src={offer.imageUrl}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {offer.discountText && (
                  <span className="absolute bottom-3 right-3 px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full shadow-md">
                    {offer.discountText}
                  </span>
                )}
                <span
                  className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    offer.isActive
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}
                >
                  {offer.isActive ? 'نشط الآن' : 'غير نشط'}
                </span>
              </div>
            ) : (
              <div className="p-6 pb-0 flex items-center justify-between">
                {offer.discountText ? (
                  <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full">
                    {offer.discountText}
                  </span>
                ) : <div />}
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    offer.isActive
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {offer.isActive ? 'نشط الآن' : 'غير نشط'}
                </span>
              </div>
            )}

            {/* Offer Body */}
            <div className="p-6 flex-1 space-y-3">
              <h3 className="text-base font-bold text-primary font-serif leading-snug">
                {offer.title}
              </h3>
              {offer.description && (
                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                  {offer.description}
                </p>
              )}

              {/* Dates & Link */}
              <div className="pt-2 border-t border-outline-variant/40 space-y-1.5 text-[11px] text-on-surface-muted">
                {offer.linkUrl && (
                  <div className="flex items-center gap-1.5 truncate">
                    <LinkIcon size={12} className="text-secondary flex-shrink-0" />
                    <span>الرابط: {offer.linkUrl}</span>
                  </div>
                )}
                {(offer.startDate || offer.endDate) && (
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-secondary flex-shrink-0" />
                    <span>
                      {offer.startDate ? new Date(offer.startDate).toLocaleDateString('ar-EG') : 'الآن'}
                      {' - '}
                      {offer.endDate ? new Date(offer.endDate).toLocaleDateString('ar-EG') : 'بدون نهاية'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 bg-surface-container-low/50 border-t border-outline-variant/40 flex items-center justify-between">
              <button
                onClick={() => toggleOffer(offer.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
                  offer.isActive
                    ? 'text-amber-700 hover:bg-amber-100'
                    : 'text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {offer.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{offer.isActive ? 'تعطيل' : 'تفعيل'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(offer)}
                  className="p-2 text-on-surface-muted hover:text-primary hover:bg-white rounded-lg transition-colors"
                  title="تعديل"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => {
                    if (confirm('هل أنتِ متأكدة من حذف هذا العرض؟')) {
                      deleteOffer(offer.id);
                    }
                  }}
                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                  title="حذف"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {offers.length === 0 && (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-outline-variant/60 text-center space-y-3">
            <Sparkles size={32} className="text-secondary mx-auto" />
            <h3 className="text-base font-bold text-primary font-serif">لا توجد عروض ترويجية حالياً</h3>
            <p className="text-xs text-on-surface-muted max-w-sm mx-auto">
              أضيفي عروضاً ترويجية لتظهر تلقائياً كنافذة منبثقة (Popup) لزوار المتجر مع أكواد الخصم والمنتجات المميزة.
            </p>
          </div>
        )}
      </div>

      {/* Modal / Dialog for Create/Edit Offer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-primary/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 z-10 border border-outline-variant/60 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 left-5 text-on-surface-muted hover:text-primary"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 pb-4 border-b border-outline-variant/60">
              <Tag className="text-secondary" size={20} />
              <h2 className="text-lg font-bold font-serif text-primary">
                {editingOffer ? 'تعديل العرض الترويجي' : 'إضافة عرض ترويجي جديد'}
              </h2>
            </div>

            {errorMessage && (
              <div className="my-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {/* Title */}
              <Input
                label="عنوان العرض الرئيسي"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: خصم حصري 20% على تشكيلة الصيف الكورية"
                required
              />

              {/* Description */}
              <div className="space-y-1.5 text-right">
                <label className="block text-xs font-semibold text-primary">
                  تفاصيل العرض الترويجي
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتبي تفاصيل العرض وكود الخصم وطريقة الاستفادة..."
                  rows={3}
                  className="w-full bg-white text-primary text-xs p-3 rounded-xl border border-outline-variant focus:outline-none focus:border-secondary"
                />
              </div>

              {/* Discount Text & Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="نص الخصم (اختياري)"
                  value={discountText}
                  onChange={(e) => setDiscountText(e.target.value)}
                  placeholder="مثال: خصم 15%"
                />
                <Input
                  label="رابط التوجيه (اختياري)"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="/shop أو رابط قسم"
                />
              </div>

              {/* Image Upload (WEBP Compression) */}
              <div className="space-y-2 text-right">
                <label className="block text-xs font-semibold text-primary">
                  صورة العرض (تحويل تلقائي لـ WebP مع الحفاظ على الأبعاد)
                </label>
                
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-xs font-semibold text-primary hover:bg-white transition-colors">
                    <Upload size={14} className="text-secondary" />
                    <span>اختيار صورة</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {imageUrl && (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={13} />
                      <span>تم تحسين ورفع الصورة</span>
                    </span>
                  )}
                </div>

                {uploadProgress && uploadProgress.status === 'uploading' && (
                  <p className="text-[11px] text-secondary animate-pulse">جاري ضغط وتحويل الصورة إلى WebP ورفعها...</p>
                )}

                {imageUrl && (
                  <div className="relative h-28 rounded-xl overflow-hidden border border-outline-variant/60 mt-2">
                    <img src={imageUrl} alt="معاينة" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Start & End Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="تاريخ البداية (اختياري)"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  type="date"
                  label="تاريخ الانتهاء (اختياري)"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveOffer"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-secondary focus:ring-secondary cursor-pointer"
                />
                <label htmlFor="isActiveOffer" className="text-xs font-semibold text-primary cursor-pointer">
                  تفعيل العرض فوراً ليظهر لزوار المتجر
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/60">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setIsModalOpen(false)}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                >
                  {editingOffer ? 'حفظ التعديلات' : 'إضافة العرض'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
