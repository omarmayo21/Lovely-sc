import React, { useState } from 'react';
import { Settings, Save, MapPin, Phone, MessageCircle, Store, Check } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useAdminData();

  const [storeName, setStoreName] = useState(settings.storeName);
  const [storeSubtitle, setStoreSubtitle] = useState(settings.storeSubtitle);
  const [primaryPhone, setPrimaryPhone] = useState(settings.primaryPhone);
  const [secondaryPhone, setSecondaryPhone] = useState(settings.secondaryPhone);
  const [branchAddress, setBranchAddress] = useState(settings.branchAddress);
  const [branchLandmark, setBranchLandmark] = useState(settings.branchLandmark);
  const [workingHours, setWorkingHours] = useState(settings.workingHours);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateSettings({
      storeName,
      storeSubtitle,
      primaryPhone,
      secondaryPhone,
      branchAddress,
      branchLandmark,
      workingHours,
      whatsappNumber,
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 text-right max-w-4xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-bold text-primary">الإعدادات العامة للفرع والمتجر</h1>
          <p className="text-xs text-on-surface-muted mt-0.5">
            تحديث بيانات فرع الموسكي، أرقام التواصل، ورسائل الواتساب التلقائية
          </p>
        </div>

        <Button type="submit" variant="primary" size="sm" icon={<Save size={16} />}>
          {isSaved ? 'تم الحفظ بنجاح ✓' : 'حفظ الإعدادات'}
        </Button>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check size={16} />
          <span>تم حفظ الإعدادات بنجاح وتحديث المتجر فوراً!</span>
        </div>
      )}

      {/* Store Identity Card */}
      <div className="bg-white rounded-3xl border border-outline-variant p-6 sm:p-8 shadow-soft-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
          <Store size={18} className="text-secondary" />
          <h2 className="text-base font-serif font-bold text-primary">هوية البوتيك والمتجر</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="اسم المتجر"
            required
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
          <Input
            label="الوصف الترويجي المختصر"
            value={storeSubtitle}
            onChange={(e) => setStoreSubtitle(e.target.value)}
          />
        </div>
      </div>

      {/* Branch & Location Card */}
      <div className="bg-white rounded-3xl border border-outline-variant p-6 sm:p-8 shadow-soft-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
          <MapPin size={18} className="text-secondary" />
          <h2 className="text-base font-serif font-bold text-primary">بيانات فرع الموسكي الفعلي</h2>
        </div>

        <div className="space-y-4">
          <Input
            label="العنوان التفصيلي للفرع"
            required
            value={branchAddress}
            onChange={(e) => setBranchAddress(e.target.value)}
          />
          <Input
            label="العلامة المميزة والموقع"
            value={branchLandmark}
            onChange={(e) => setBranchLandmark(e.target.value)}
          />
          <Input
            label="مواعيد العمل واستقبال الزبائن"
            value={workingHours}
            onChange={(e) => setWorkingHours(e.target.value)}
          />
        </div>
      </div>

      {/* Contact Phones Card */}
      <div className="bg-white rounded-3xl border border-outline-variant p-6 sm:p-8 shadow-soft-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
          <Phone size={18} className="text-secondary" />
          <h2 className="text-base font-serif font-bold text-primary">أرقام التواصل والواتساب</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="هاتف الإدارة (أ. سراج بدوي)"
            required
            value={primaryPhone}
            onChange={(e) => setPrimaryPhone(e.target.value)}
            dir="ltr"
            className="text-right"
          />
          <Input
            label="هاتف المبيعات (أ. حسن بدوي)"
            required
            value={secondaryPhone}
            onChange={(e) => setSecondaryPhone(e.target.value)}
            dir="ltr"
            className="text-right"
          />
          <Input
            label="رقم واتساب المباشر (مع كود الدولة 20)"
            required
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            dir="ltr"
            className="text-right"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" size="lg" icon={<Save size={18} />}>
          حفظ وتطبيق التغييرات
        </Button>
      </div>
    </form>
  );
};
