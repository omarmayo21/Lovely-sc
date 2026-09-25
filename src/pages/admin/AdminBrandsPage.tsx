import React, { useState } from 'react';
import { Plus, Trash2, Edit, Award, Sparkles } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Brand } from '../../types';

export const AdminBrandsPage: React.FC = () => {
  const { brands, addBrand, updateBrand, deleteBrand } = useAdminData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const [name, setName] = useState('');
  const [origin, setOrigin] = useState<'korean' | 'european'>('korean');
  const [description, setDescription] = useState('');

  const openAddModal = () => {
    setEditingBrand(null);
    setName('');
    setOrigin('korean');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (b: Brand) => {
    setEditingBrand(b);
    setName(b.name);
    setOrigin(b.origin);
    setDescription(b.description || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.trim().toLowerCase().replace(/[\s\W]+/g, '-');
    const originLabel = origin === 'korean' ? 'كوري أصلي 100%' : 'فرنسي درماتولوجي';

    if (editingBrand) {
      await updateBrand(editingBrand.id, {
        name: name.trim(),
        origin,
        originLabel,
        description: description.trim() || undefined,
      });
    } else {
      await addBrand({
        name: name.trim(),
        slug,
        origin,
        originLabel,
        description: description.trim() || undefined,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-bold text-primary">الشركات والماركات التجارية</h1>
          <p className="text-xs text-on-surface-muted mt-0.5">
            إدارة الماركات الكورية والفرنسية المعتمدة في المتجر وفرع الموسكي
          </p>
        </div>

        <Button onClick={openAddModal} variant="primary" size="sm" icon={<Plus size={16} />}>
          إضافة ماركة جديدة
        </Button>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl border border-outline-variant p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-cream text-secondary flex items-center justify-center">
                  <Award size={20} />
                </div>
                <span className="text-xs font-bold text-tertiary-dark bg-tertiary-container px-2.5 py-1 rounded-full">
                  {b.origin === 'korean' ? '🇰🇷 كوري' : '🇫🇷 فرنسي'}
                </span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-base text-primary">{b.name}</h3>
                <p className="text-[11px] text-secondary font-semibold mt-0.5">{b.originLabel}</p>
              </div>

              <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                {b.description || 'ماركة مستحضرات عناية أصلية 100% مستوردة.'}
              </p>
            </div>

            <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-between">
              <span className="text-xs font-bold text-primary">
                {b.productCount} مستحضرات
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(b)}
                  className="p-1.5 text-primary hover:bg-surface-container-low rounded-lg transition-colors"
                  title="تعديل"
                >
                  <Edit size={15} />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`هل أنتِ متأكدة من حذف ماركة "${b.name}"؟`)) {
                      deleteBrand(b.id);
                    }
                  }}
                  className="p-1.5 text-on-surface-muted hover:text-red-600 rounded-lg transition-colors"
                  title="حذف"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingBrand ? 'تعديل بيانات الماركة' : 'إضافة ماركة جديدة'}
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-4 text-right text-xs">
            <Input
              label="اسم الماركة التجارية"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: Beauty of Joseon"
            />
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-primary">بلد المنشأ</label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value as 'korean' | 'european')}
                className="w-full bg-white border border-outline-variant rounded-lg p-2.5 text-xs text-primary"
              >
                <option value="korean">كوريا الجنوبية (كوري 🇰🇷)</option>
                <option value="european">فرنسا / أوروبا (فرنسي 🇫🇷)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-primary">وصف الماركة وتاريخها</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="نبذة عن الماركة وفلسفتها في العناية بالبشرة..."
                className="w-full bg-white border border-outline-variant rounded-lg p-3 text-xs text-primary"
              />
            </div>
            <Button type="submit" variant="primary" className="w-full mt-4">
              حفظ الماركة
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};
