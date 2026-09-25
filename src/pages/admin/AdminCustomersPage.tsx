import React, { useState } from 'react';
import { Users, Search, Phone, MapPin, ShoppingBag, DollarSign } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export const AdminCustomersPage: React.FC = () => {
  const { customers } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchPhone = c.phone.includes(q);
      const matchAddr = c.address.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchAddr) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-bold text-primary">دليل وبيانات العملاء</h1>
          <p className="text-xs text-on-surface-muted mt-0.5">
            سجل العملاء، سجل المشتريات، وأرقام هواتف التواصل
          </p>
        </div>
        <span className="text-xs font-bold text-secondary bg-blush px-3 py-1.5 rounded-full border border-secondary/30">
          إجمالي المسجلين: {customers.length} عميل
        </span>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-outline-variant p-4 shadow-sm">
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحثي باسم العميل، رقم الهاتف، أو العنوان..."
            className="w-full bg-surface-container-low text-xs text-primary px-4 py-2.5 pr-9 rounded-xl border border-outline-variant focus:outline-none focus:border-secondary"
          />
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-muted" />
        </div>
      </div>

      {/* Customers Table & Mobile Cards */}
      <div className="bg-white rounded-3xl border border-outline-variant overflow-hidden shadow-sm">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-primary">لا يوجد عملاء مطابقين للبحث.</p>
          </div>
        ) : (
          <>
            {/* Mobile Cards View (md:hidden) */}
            <div className="md:hidden divide-y divide-outline-variant/60">
              {filteredCustomers.map((c) => (
                <div key={c.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-primary">{c.name}</h4>
                      <a
                        href={`tel:${c.phone}`}
                        className="text-xs text-secondary hover:underline font-mono mt-0.5 block"
                        dir="ltr"
                      >
                        {c.phone}
                      </a>
                    </div>

                    <span className="inline-flex items-center gap-1 font-bold text-xs text-primary bg-cream px-2.5 py-1 rounded-full border border-outline-variant/60">
                      <ShoppingBag size={12} className="text-secondary" />
                      <span>{c.totalOrders} طلبات</span>
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant bg-surface-container-low/50 p-2 rounded-xl">
                    {c.address}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-outline-variant/40">
                    <span className="text-on-surface-muted">إجمالي المشتريات:</span>
                    <span className="font-bold text-primary">{c.totalSpent.toLocaleString()} ج.م</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (hidden md:block) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-cream/50 border-b border-outline-variant/60 text-on-surface-muted font-bold">
                    <th className="py-3.5 px-4">اسم العميل</th>
                    <th className="py-3.5 px-4">رقم الهاتف</th>
                    <th className="py-3.5 px-4">العنوان المسجل</th>
                    <th className="py-3.5 px-4">عدد الطلبات</th>
                    <th className="py-3.5 px-4">إجمالي الإنفاق</th>
                    <th className="py-3.5 px-4">آخر طلب</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40 font-medium">
                  {filteredCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="py-4 px-4 font-bold text-primary">{c.name}</td>
                      <td className="py-4 px-4 font-mono" dir="ltr">
                        {c.phone}
                      </td>
                      <td className="py-4 px-4 text-on-surface-variant max-w-[220px] truncate">
                        {c.address}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 font-bold text-primary bg-cream px-2.5 py-1 rounded-full border border-outline-variant/60">
                          <ShoppingBag size={12} className="text-secondary" />
                          <span>{c.totalOrders} طلبات</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-primary">
                        {c.totalSpent.toLocaleString()} ج.م
                      </td>
                      <td className="py-4 px-4 text-on-surface-muted">{c.lastOrderDate}</td>
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
