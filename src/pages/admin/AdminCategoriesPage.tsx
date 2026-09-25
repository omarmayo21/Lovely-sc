import React, { useState } from 'react';
import { Plus, Trash2, Edit, FolderTree, Sparkles } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Category } from '../../types';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdminData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [description, setDescription] = useState('');

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setEnglishName('');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setEnglishName(cat.englishName || '');
    setDescription(cat.description || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = (englishName || name).trim().toLowerCase().replace(/[\s\W]+/g, '-');

    if (editingCategory) {
      await updateCategory(editingCategory.id, {
        name: name.trim(),
        englishName: englishName.trim() || undefined,
        description: description.trim() || undefined,
      });
    } else {
      await addCategory({
        name: name.trim(),
        englishName: englishName.trim() || undefined,
        slug,
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
          <h1 className="text-2xl font-serif font-bold text-primary">أقسام وتصنيفات المتجر</h1>
          <p className="text-xs text-on-surface-muted mt-0.5">
            إدارة مجموعات العناية (واقيات شمس، سيرومات، تونرات، مرطبات)
          </p>
        </div>

        <Button onClick={openAddModal} variant="primary" size="sm" icon={<Plus size={16} />}>
          إضافة قسم جديد
        </Button>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl border border-outline-variant p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blush text-secondary flex items-center justify-center">
                  <FolderTree size={18} />
                </div>
                <span className="text-xs font-bold text-primary bg-cream px-2.5 py-1 rounded-full border border-outline-variant/60">
                  {cat.productCount} مستحضرات
                </span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-base text-primary">{cat.name}</h3>
                {cat.englishName && (
                  <p className="text-[11px] text-on-surface-muted font-mono" dir="ltr">
                    {cat.englishName}
                  </p>
                )}
              </div>

              <p className="text-xs text-on-surface-variant line-clamp-2">
                {cat.description || 'قسم منتجات العناية بالبشرة المختارة بعناية.'}
              </p>
            </div>

            <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-between">
              <span className="text-[11px] text-on-surface-muted font-mono">
                slug: /{cat.slug}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-1.5 text-primary hover:bg-surface-container-low rounded-lg transition-colors"
                  title="تعديل"
                >
                  <Edit size={15} />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`هل أنتِ متأكدة من حذف قسم "${cat.name}"؟`)) {
                      deleteCategory(cat.id);
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
          title={editingCategory ? 'تعديل بيانات القسم' : 'إضافة قسم جديد للمتجر'}
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-4 text-right text-xs">
            <Input
              label="اسم القسم (بالعربية)"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: غسول ومنظفات"
            />
            <Input
              label="الاسم بالإنجليزية (اختياري)"
              value={englishName}
              onChange={(e) => setEnglishName(e.target.value)}
              placeholder="Cleansers & Facewash"
              dir="ltr"
              className="text-right"
            />
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-primary">الوصف</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="وصف مختصر لمحتوى هذا القسم..."
                className="w-full bg-white border border-outline-variant rounded-lg p-3 text-xs text-primary"
              />
            </div>
            <Button type="submit" variant="primary" className="w-full mt-4">
              حفظ القسم
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};
