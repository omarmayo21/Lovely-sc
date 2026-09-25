import React, { useState } from 'react';
import { Boxes, AlertTriangle, Plus, Minus, Search, Check, Save } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { Button } from '../../components/common/Button';

export const AdminInventoryPage: React.FC = () => {
  const { products, updateStock } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingStock, setEditingStock] = useState<{ [id: string]: number }>({});

  const filteredProducts = products.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchBrand) return false;
    }
    return true;
  });

  const handleStockChange = (id: string, delta: number, currentStock: number) => {
    const current = editingStock[id] !== undefined ? editingStock[id] : currentStock;
    const newStock = Math.max(0, current + delta);
    setEditingStock((prev) => ({ ...prev, [id]: newStock }));
    updateStock(id, newStock);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-bold text-primary">إدارة المخزون والتوريدات</h1>
          <p className="text-xs text-on-surface-muted mt-0.5">
            متابعة الكميات المتبقية وتحديث مخزون فرع الموسكي والمستودع فوراً
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <AlertTriangle size={14} />
            <span>نواقص حرجة: {products.filter((p) => p.stock <= 5).length} منتجات</span>
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-outline-variant p-4 shadow-sm">
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحثي باسم المستحضر، الماركة، أو رمز SKU..."
            className="w-full bg-surface-container-low text-xs text-primary px-4 py-2.5 pr-9 rounded-xl border border-outline-variant focus:outline-none focus:border-secondary"
          />
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-muted" />
        </div>
      </div>

      {/* Inventory Table & Mobile Cards */}
      <div className="bg-white rounded-3xl border border-outline-variant overflow-hidden shadow-sm">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-primary">لا توجد مستحضرات مطابقة للبحث.</p>
          </div>
        ) : (
          <>
            {/* Mobile Cards (md:hidden) */}
            <div className="md:hidden divide-y divide-outline-variant/60">
              {filteredProducts.map((p) => {
                const currentVal = editingStock[p.id] !== undefined ? editingStock[p.id] : p.stock;
                const isLow = currentVal <= 5;
                return (
                  <div key={p.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-12 h-12 object-contain rounded-xl bg-oatmeal p-1 border border-outline-variant/50 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] text-secondary font-bold block">{p.brand}</span>
                          <h4 className="font-bold text-xs text-primary line-clamp-2 leading-snug">{p.name}</h4>
                          <span className="text-[10px] text-on-surface-muted font-mono">{p.sku}</span>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                          isLow
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {isLow ? <AlertTriangle size={11} /> : <Check size={11} />}
                        <span>{isLow ? 'منخفض' : 'متوفر'}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-outline-variant/40">
                      <div>
                        <span className="text-[11px] text-on-surface-muted block">الرصيد الحالي:</span>
                        <span className="font-bold text-sm text-primary">{currentVal} عبوة</span>
                      </div>

                      {/* Stock Stepper */}
                      <div className="inline-flex items-center gap-1.5 border border-outline-variant rounded-xl bg-surface-container-low p-1">
                        <button
                          onClick={() => handleStockChange(p.id, -1, p.stock)}
                          className="p-1.5 hover:text-secondary text-primary transition-colors"
                          title="إنقاص"
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={currentVal}
                          onChange={(e) => {
                            const val = Math.max(0, Number(e.target.value));
                            setEditingStock((prev) => ({ ...prev, [p.id]: val }));
                            updateStock(p.id, val);
                          }}
                          className="w-12 text-center bg-white border border-outline-variant rounded-lg font-bold text-xs py-1 focus:outline-none"
                        />
                        <button
                          onClick={() => handleStockChange(p.id, +1, p.stock)}
                          className="p-1.5 hover:text-secondary text-primary transition-colors"
                          title="زيادة"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table (hidden md:block) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-cream/50 border-b border-outline-variant/60 text-on-surface-muted font-bold">
                    <th className="py-3.5 px-4">المستحضر</th>
                    <th className="py-3.5 px-4">رمز SKU</th>
                    <th className="py-3.5 px-4">الماركة</th>
                    <th className="py-3.5 px-4">حالة المخزون</th>
                    <th className="py-3.5 px-4">الكمية الحالية</th>
                    <th className="py-3.5 px-4 text-center">تعديل سريع للرصيد</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40 font-medium">
                  {filteredProducts.map((p) => {
                    const currentVal = editingStock[p.id] !== undefined ? editingStock[p.id] : p.stock;
                    const isLow = currentVal <= 5;
                    return (
                      <tr key={p.id} className="hover:bg-surface-container-low/40 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0]}
                              alt=""
                              className="w-10 h-10 object-contain rounded-lg bg-oatmeal p-1 border border-outline-variant/50"
                            />
                            <span className="font-bold text-primary truncate max-w-[200px]">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-mono text-on-surface-muted">{p.sku}</td>
                        <td className="py-4 px-4 font-semibold text-secondary">{p.brand}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isLow
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {isLow ? <AlertTriangle size={12} /> : <Check size={12} />}
                            <span>{isLow ? 'مخزون منخفض' : 'متوفر ومستقر'}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4 font-bold text-sm text-primary">
                          {currentVal} عبوة
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center gap-2 border border-outline-variant rounded-xl bg-surface-container-low p-1">
                            <button
                              onClick={() => handleStockChange(p.id, -1, p.stock)}
                              className="p-1.5 hover:text-secondary text-primary transition-colors"
                              title="إنقاص"
                            >
                              <Minus size={14} />
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={currentVal}
                              onChange={(e) => {
                                const val = Math.max(0, Number(e.target.value));
                                setEditingStock((prev) => ({ ...prev, [p.id]: val }));
                                updateStock(p.id, val);
                              }}
                              className="w-14 text-center bg-white border border-outline-variant rounded-lg font-bold text-xs py-1 focus:outline-none"
                            />
                            <button
                              onClick={() => handleStockChange(p.id, +1, p.stock)}
                              className="p-1.5 hover:text-secondary text-primary transition-colors"
                              title="زيادة"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
