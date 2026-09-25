import React, { useState } from 'react';
import { Percent, Plus, Trash2, CheckCircle2, Tag, Calendar } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';

export const AdminCouponsPage: React.FC = () => {
  const { coupons, addCoupon, toggleCoupon, deleteCoupon } = useAdminData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(500);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    await addCoupon({
      code: code.trim().toUpperCase(),
      discountPercentage: Number(discountPercentage),
      minOrderAmount: Number(minOrderAmount),
      expiryDate,
      isActive: true,
    });

    setIsModalOpen(false);
    setCode('');
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-bold text-primary">الكوبونات وقسائم الخصم</h1>
          <p className="text-xs text-on-surface-muted mt-0.5">
            إنشاء وتفعيل أكواد الخصم الترويجية لزبائن المتجر وفرع الموسكي
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} variant="primary" size="sm" icon={<Plus size={16} />}>
          إنشاء كود خصم جديد
        </Button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-3xl border border-outline-variant p-6 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blush text-secondary flex items-center justify-center">
                  <Tag size={18} />
                </div>
                <button
                  onClick={() => toggleCoupon(c.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                    c.isActive
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}
                >
                  {c.isActive ? 'مفعل وشغال' : 'معطل'}
                </button>
              </div>

              <div>
                <span className="text-xs font-semibold text-on-surface-muted">كود الخصم:</span>
                <h3 className="font-mono font-bold text-xl text-primary tracking-wider">{c.code}</h3>
              </div>

              <div className="space-y-1 text-xs text-on-surface-variant pt-2 border-t border-outline-variant/60">
                <div className="flex justify-between">
                  <span>نسبة الخصم:</span>
                  <span className="font-bold text-secondary text-sm">{c.discountPercentage}%</span>
                </div>
                {c.minOrderAmount && (
                  <div className="flex justify-between text-[11px] text-on-surface-muted">
                    <span>الحد الأدنى للطلب:</span>
                    <span>{c.minOrderAmount} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] text-on-surface-muted">
                  <span>مرات الاستخدام:</span>
                  <span className="font-bold text-primary">{c.usageCount} مرة</span>
                </div>
                <div className="flex justify-between text-[11px] text-on-surface-muted">
                  <span>تاريخ الانتهاء:</span>
                  <span>{c.expiryDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-outline-variant/60 flex justify-end">
              <button
                onClick={() => {
                  if (window.confirm(`هل أنتِ متأكدة من حذف كوبون "${c.code}"؟`)) {
                    deleteCoupon(c.id);
                  }
                }}
                className="text-xs text-red-600 hover:underline font-semibold flex items-center gap-1"
              >
                <Trash2 size={14} />
                <span>حذف الكوبون</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="إنشاء كود خصم جديد"
          maxWidth="md"
        >
          <form onSubmit={handleCreateCoupon} className="space-y-4 text-right text-xs">
            <Input
              label="رمز الكوبون (كود الخصم)"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="مثال: LOVELY15"
              dir="ltr"
              className="text-right uppercase font-mono font-bold"
            />
            <Input
              label="نسبة الخصم (%)"
              type="number"
              min="1"
              max="90"
              required
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(Number(e.target.value))}
            />
            <Input
              label="الحد الأدنى لقيمة الأوردر (ج.م)"
              type="number"
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(Number(e.target.value))}
            />
            <Input
              label="تاريخ الانتهاء"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />

            <Button type="submit" variant="primary" className="w-full mt-4">
              حفظ وتفعيل الكوبون
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};
