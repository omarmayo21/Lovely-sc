import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Globe,
  Share2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Save,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export const AdminMarketingPage: React.FC = () => {
  const { settings, updateSettings } = useAdminData();

  // Marketing & Tracking IDs
  const [gaId, setGaId] = useState('');
  const [pixelId, setPixelId] = useState('');
  const [clarityId, setClarityId] = useState('');

  // SEO Settings
  const [siteTitle, setSiteTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [defaultOgImage, setDefaultOgImage] = useState('');
  const [googleVerification, setGoogleVerification] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setGaId(settings.googleAnalyticsId || '');
      setPixelId(settings.metaPixelId || '');
      setClarityId(settings.clarityProjectId || '');
      setSiteTitle(settings.siteTitle || 'Lovely SkinCare | منتجات العناية بالبشرة الكورية والأوروبية الأصلية');
      setMetaDesc(settings.metaDescription || 'متجر لافلي سكين كير الأول لمنتجات العناية بالبشرة الكورية والأوروبية الأصلية 100% في مصر - فرع الموسكي - القاهرة.');
      setDefaultOgImage(settings.defaultOgImage || '');
      setGoogleVerification(settings.googleVerificationCode || '');
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const success = await updateSettings({
        googleAnalyticsId: gaId.trim() || undefined,
        metaPixelId: pixelId.trim() || undefined,
        clarityProjectId: clarityId.trim() || undefined,
        siteTitle: siteTitle.trim() || undefined,
        metaDescription: metaDesc.trim() || undefined,
        defaultOgImage: defaultOgImage.trim() || undefined,
        googleVerificationCode: googleVerification.trim() || undefined,
      });

      if (success) {
        setSuccessMessage('تم حفظ إعدادات التحليلات والتسويق ومحركات البحث بنجاح في قاعدة البيانات.');
      } else {
        setErrorMessage('فشل في حفظ الإعدادات، يرجى المحاولة مرة أخرى.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'حدث خطأ غير متوقع.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-outline-variant/60 shadow-soft-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="text-secondary" size={24} />
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-primary">
              التحليلات والتسويق ومحركات البحث (SEO)
            </h1>
          </div>
          <p className="text-xs text-on-surface-muted">
            ربط أدوات التتبع الإحصائي (Google Analytics, Meta Pixel, Clarity) وإعدادات الظهور في محركات البحث
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Save size={16} />}
          isLoading={isSaving}
          onClick={handleSave}
        >
          حفظ جميع الإعدادات
        </Button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analytics & Tracking Integrations Card */}
        <div className="bg-white rounded-3xl border border-outline-variant/60 p-6 sm:p-8 shadow-soft-sm space-y-6 text-right">
          <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
            <BarChart3 size={18} className="text-secondary" />
            <h2 className="text-base font-serif font-bold text-primary">
              أدوات التتبع الإحصائي والإعلاني
            </h2>
          </div>

          {/* Google Analytics 4 */}
          <div className="space-y-2 p-4 rounded-2xl bg-surface-container-low/60 border border-outline-variant/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary">Google Analytics 4 (GA4)</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  gaId.trim() ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {gaId.trim() ? 'متصل' : 'غير متصل'}
              </span>
            </div>
            <Input
              label="Measurement ID"
              value={gaId}
              onChange={(e) => setGaId(e.target.value)}
              placeholder="مثال: G-XXXXXXXXXX"
              helperText="يبدأ بـ G- متبوعاً بحروف وأرقام التعريف من Google Analytics"
            />
          </div>

          {/* Meta Pixel (Facebook / Instagram Ads) */}
          <div className="space-y-2 p-4 rounded-2xl bg-surface-container-low/60 border border-outline-variant/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary">Meta (Facebook & Instagram) Pixel</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  pixelId.trim() ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {pixelId.trim() ? 'متصل' : 'غير متصل'}
              </span>
            </div>
            <Input
              label="Pixel ID"
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
              placeholder="مثال: 123456789012345"
              helperText="رقم المعرف الرقمي الخاص ببكسل فيسبوك لتتبع المشتريات والإعلانات"
            />
          </div>

          {/* Microsoft Clarity */}
          <div className="space-y-2 p-4 rounded-2xl bg-surface-container-low/60 border border-outline-variant/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary">Microsoft Clarity (تسجيل جلسات الزوار)</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  clarityId.trim() ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {clarityId.trim() ? 'متصل' : 'غير متصل'}
              </span>
            </div>
            <Input
              label="Project ID"
              value={clarityId}
              onChange={(e) => setClarityId(e.target.value)}
              placeholder="مثال: abcdef1234"
              helperText="معرف المشروع في Microsoft Clarity لتحليل تجربة المستخدم والخرائط الحرارية"
            />
          </div>
        </div>

        {/* SEO & Meta Configuration Card */}
        <div className="bg-white rounded-3xl border border-outline-variant/60 p-6 sm:p-8 shadow-soft-sm space-y-6 text-right">
          <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
            <Globe size={18} className="text-secondary" />
            <h2 className="text-base font-serif font-bold text-primary">
              إعدادات محركات البحث والظهور (SEO)
            </h2>
          </div>

          {/* Site Title */}
          <Input
            label="عنوان الموقع الافتراضي (Meta Title)"
            value={siteTitle}
            onChange={(e) => setSiteTitle(e.target.value)}
            placeholder="Lovely SkinCare | منتجات العناية بالبشرة الكورية والأوروبية الأصلية"
            helperText="العنوان الذي يظهر في نتائج بحث Google وشريط المتصفح"
          />

          {/* Meta Description */}
          <div className="space-y-1.5 text-right">
            <label className="block text-xs font-semibold text-primary">
              الوصف التعريفي لمحركات البحث (Meta Description)
            </label>
            <textarea
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              rows={3}
              className="w-full bg-white text-primary text-xs p-3 rounded-xl border border-outline-variant focus:outline-none focus:border-secondary"
              placeholder="وصف مختصر ومميز للمتجر يظهر في نتائج البحث..."
            />
            <span className="text-[11px] text-on-surface-muted">
              يوصى بأن يكون بين 120 إلى 160 حرفاً لتحقيق أفضل نتائج ظهور.
            </span>
          </div>

          {/* Default OG Image */}
          <Input
            label="رابط صورة المشاركة الاجتماعية (Open Graph Image)"
            value={defaultOgImage}
            onChange={(e) => setDefaultOgImage(e.target.value)}
            placeholder="https://.../og-image.webp"
            helperText="الصورة التي تظهر عند مشاركة رابط الموقع على واتساب وفيسبوك"
          />

          {/* Google Verification */}
          <Input
            label="رمز التحقق من ملكية الموقع لـ Google Search Console"
            value={googleVerification}
            onChange={(e) => setGoogleVerification(e.target.value)}
            placeholder="مثال: google-site-verification-code"
            helperText="رمز التحقق الخاص بمحرك بحث Google لإثبات ملكية المتجر"
          />
        </div>
      </form>
    </div>
  );
};
