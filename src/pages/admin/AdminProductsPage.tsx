import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Sparkles,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const AdminProductsPage: React.FC = () => {
  const { products, deleteProduct, toggleProductStatus, categories } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchEng = p.englishName?.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      if (!matchName && !matchEng && !matchBrand && !matchSku) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header from Stitch (screen_7.html) */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-bold text-primary">إدارة المنتجات والكتالوج</h1>
          <p className="text-xs text-on-surface-muted mt-0.5">
            إضافة وتعديل مستحضرات العناية الكورية والفرنسية وتحديث الأسعار والمخزون
          </p>
        </div>

        <Link to="/admin/products/new">
          <Button variant="primary" size="sm" icon={<Plus size={16} />}>
            إضافة مستحضر جديد
          </Button>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-outline-variant p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحثي باسم المستحضر، الماركة، أو رمز SKU..."
            className="w-full bg-surface-container-low text-xs text-primary px-4 py-2.5 pr-9 rounded-xl border border-outline-variant focus:outline-none focus:border-secondary"
          />
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-muted" />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-on-surface-muted">القسم:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2 text-xs font-semibold text-primary focus:outline-none focus:border-secondary"
          >
            <option value="all">جميع الأقسام ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table & Mobile Cards */}
      <div className="bg-white rounded-3xl border border-outline-variant overflow-hidden shadow-sm">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-primary">لا توجد مستحضرات مطابقة للبحث أو القسم المحدد.</p>
            <p className="text-xs text-on-surface-muted">جربي مسح الفلتر أو إضافة مستحضر جديد.</p>
          </div>
        ) : (
          <>
            {/* Mobile Cards View (md:hidden) */}
            <div className="md:hidden divide-y divide-outline-variant/60">
              {filteredProducts.map((p) => (
                <div key={p.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={p.images[0]}
                        alt=""
                        className="w-14 h-14 object-contain rounded-xl bg-oatmeal p-1 border border-outline-variant/60 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] text-secondary font-bold block">{p.brand}</span>
                        <h4 className="font-bold text-xs text-primary line-clamp-2 leading-snug">{p.name}</h4>
                        <span className="text-[10px] text-on-surface-muted font-mono">{p.sku}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleProductStatus(p.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                        p.isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}
                    >
                      {p.isActive ? 'ظاهر' : 'مخفي'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-outline-variant/40">
                    <div>
                      <span className="text-on-surface-muted text-[11px] block">السعر:</span>
                      <span className="font-bold text-primary">{p.discountPrice ?? p.price} ج.م</span>
                    </div>

                    <div>
                      <span className="text-on-surface-muted text-[11px] block">المخزون:</span>
                      <span
                        className={`font-bold ${
                          p.stock <= 5 ? 'text-red-600' : 'text-emerald-700'
                        }`}
                      >
                        {p.stock} عبوة
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 pt-2">
                      <Link
                        to={`/admin/products/${p.id}/edit`}
                        className="p-2 text-primary hover:bg-surface-container-low rounded-lg border border-outline-variant"
                        title="تعديل"
                      >
                        <Edit size={15} />
                      </Link>
                      <button
                        onClick={() => {
                          if (window.confirm(`هل أنتِ متأكدة من حذف مستحضر "${p.name}"؟`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                        title="حذف"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (hidden md:block) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-cream/50 border-b border-outline-variant/60 text-on-surface-muted font-bold">
                    <th className="py-3.5 px-4">المستحضر</th>
                    <th className="py-3.5 px-4">الماركة</th>
                    <th className="py-3.5 px-4">القسم</th>
                    <th className="py-3.5 px-4">السعر</th>
                    <th className="py-3.5 px-4">المخزون</th>
                    <th className="py-3.5 px-4">رمز SKU</th>
                    <th className="py-3.5 px-4 text-center">الإتاحة بالمتجر</th>
                    <th className="py-3.5 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40 font-medium">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt=""
                            className="w-12 h-12 object-contain rounded-xl bg-oatmeal p-1 border border-outline-variant/50 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-primary block truncate max-w-[220px]">
                              {p.name}
                            </span>
                            {p.volume && (
                              <span className="text-[10px] text-on-surface-muted font-semibold">
                                {p.volume}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-secondary">{p.brand}</td>
                      <td className="py-4 px-4 text-on-surface-variant">{p.category}</td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-primary">
                          {p.discountPrice ?? p.price} ج.م
                        </div>
                        {p.discountPrice && (
                          <span className="text-[10px] text-on-surface-muted line-through">
                            {p.price} ج.م
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-bold ${
                            p.stock <= 5 ? 'text-red-600' : 'text-emerald-700'
                          }`}
                        >
                          {p.stock <= 5 && <AlertTriangle size={12} />}
                          <span>{p.stock} عبوة</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono text-on-surface-muted">{p.sku}</td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => toggleProductStatus(p.id)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                            p.isActive
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {p.isActive ? 'ظاهر بالمتجر' : 'مخفي'}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            to={`/admin/products/${p.id}/edit`}
                            className="p-1.5 text-primary hover:bg-surface-container-low rounded-lg transition-colors"
                            title="تعديل المنتج"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => {
                              if (window.confirm(`هل أنتِ متأكدة من حذف مستحضر "${p.name}"؟`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 text-on-surface-muted hover:text-red-600 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
