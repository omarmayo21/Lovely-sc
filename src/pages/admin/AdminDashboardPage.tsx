import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  DollarSign,
  Sparkles,
  AlertTriangle,
  ArrowLeft,
  Users,
  Eye,
  Plus,
  TrendingUp,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { StatCard } from '../../components/admin/StatCard';
import { SalesChart } from '../../components/admin/SalesChart';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { Button } from '../../components/common/Button';

export const AdminDashboardPage: React.FC = () => {
  const { products, orders, customers } = useAdminData();

  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.total : sum), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const lowStockProducts = products.filter((p) => p.stock <= 5 && p.isActive);
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8 text-right" dir="rtl">
      {/* Welcome Greeting from Stitch (screen_1.html) */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-serif font-bold text-primary">
            مرحباً بك، أ. سراج بدوي 👋
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-muted">
            إليك ملخص أداء المبيعات وحركة المخزون لفرع الموسكي والمتجر الإلكتروني اليوم
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/products/new">
            <Button variant="primary" size="sm" icon={<Plus size={16} />}>
              إضافة منتج جديد
            </Button>
          </Link>
          <Link to="/admin/orders">
            <Button variant="outline" size="sm">
              عرض كل الطلبات ({orders.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row from Stitch */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي المبيعات المحققة"
          value={`${totalRevenue.toLocaleString()} ج.م`}
          change="+18.4%"
          isPositive={true}
          icon={DollarSign}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-700"
        />

        <StatCard
          title="إجمالي الطلبات"
          value={`${orders.length} طلب`}
          change="+12.0%"
          isPositive={true}
          icon={ShoppingBag}
          iconBg="bg-blue-50"
          iconColor="text-blue-700"
          badge={pendingOrders.length > 0 ? `${pendingOrders.length} معلق` : undefined}
        />

        <StatCard
          title="المنتجات النشطة بالمتجر"
          value={`${products.filter((p) => p.isActive).length} مستحضر`}
          icon={Sparkles}
          iconBg="bg-blush"
          iconColor="text-secondary"
        />

        <StatCard
          title="تنبيهات المخزون الحرج"
          value={`${lowStockProducts.length} منتجات`}
          icon={AlertTriangle}
          iconBg="bg-amber-50"
          iconColor="text-amber-700"
          badge={lowStockProducts.length > 0 ? 'نواقص' : 'مكتمل'}
        />
      </div>

      {/* Sales Chart: Korean vs European from Stitch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <SalesChart />
        </div>

        {/* Category Distribution Card from Stitch */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-outline-variant p-6 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-primary">المبيعات حسب الفئات</h3>
          <p className="text-xs text-on-surface-muted">
            توزيع حجم الطلب خلال الشهر الحالي
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span>واقيات الشمس والحماية</span>
                <span>42%</span>
              </div>
              <div className="h-2 rounded-full bg-cream overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span>السيرومات والعلاجات</span>
                <span>28%</span>
              </div>
              <div className="h-2 rounded-full bg-cream overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span>التونرات وخلاصات التهدئة</span>
                <span>18%</span>
              </div>
              <div className="h-2 rounded-full bg-cream overflow-hidden">
                <div className="h-full bg-tertiary rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span>المرطبات والغسول</span>
                <span>12%</span>
              </div>
              <div className="h-2 rounded-full bg-cream overflow-hidden">
                <div className="h-full bg-outline-variant rounded-full" style={{ width: '12%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table & Mobile Cards from Stitch (screen_1.html) */}
      <div className="bg-white rounded-3xl border border-outline-variant p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
          <div>
            <h2 className="text-base font-serif font-bold text-primary">أحدث طلبات الزبائن</h2>
            <p className="text-xs text-on-surface-muted">الطلبات الواردة عبر المتجر وفرع الموسكي</p>
          </div>
          <Link to="/admin/orders" className="text-xs font-bold text-secondary hover:underline">
            عرض كل الطلبات ←
          </Link>
        </div>

        {/* Mobile Cards (md:hidden) */}
        <div className="md:hidden divide-y divide-outline-variant/50">
          {recentOrders.map((order) => (
            <div key={order.id} className="py-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-primary">{order.orderNumber}</span>
                <StatusBadge status={order.status} />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-primary">{order.customerName}</span>
                <span className="font-serif font-bold text-primary">{order.total} ج.م</span>
              </div>
              <p className="text-[11px] text-on-surface-muted truncate">
                {order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
              </p>
              <div className="pt-1 flex justify-end">
                <Link
                  to={`/admin/orders?q=${encodeURIComponent(order.orderNumber)}`}
                  className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
                >
                  <span>عرض التفاصيل</span>
                  <Eye size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table (hidden md:block) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-outline-variant/60 text-on-surface-muted font-semibold">
                <th className="py-3 px-4">رقم الطلب</th>
                <th className="py-3 px-4">اسم العميل</th>
                <th className="py-3 px-4">رقم الهاتف</th>
                <th className="py-3 px-4">المنتجات</th>
                <th className="py-3 px-4">الإجمالي</th>
                <th className="py-3 px-4">الحالة</th>
                <th className="py-3 px-4 text-center">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40 font-medium">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-primary">{order.orderNumber}</td>
                  <td className="py-3.5 px-4 font-semibold text-primary">{order.customerName}</td>
                  <td className="py-3.5 px-4 font-mono" dir="ltr">{order.customerPhone}</td>
                  <td className="py-3.5 px-4 text-on-surface-muted truncate max-w-[200px]">
                    {order.items.map((i) => `${i.name} (${i.quantity})`).join(', ')}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-primary">{order.total} ج.م</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Link
                      to={`/admin/orders?q=${encodeURIComponent(order.orderNumber)}`}
                      className="inline-flex items-center gap-1 p-1.5 rounded-lg text-primary hover:bg-surface-container-low"
                    >
                      <Eye size={14} />
                      <span>تفاصيل</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Critical Stock Alerts from Stitch */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 font-serif font-bold text-base">
              <AlertTriangle size={18} className="text-amber-600" />
              <h3>تنبيهات المخزون الحرج (نواقص وشيكة النفاذ)</h3>
            </div>
            <Link to="/admin/inventory" className="text-xs font-bold text-amber-800 hover:underline">
              إدارة المخزون والتوريد ←
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl p-4 border border-amber-200 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={p.images[0]} alt="" className="w-12 h-12 object-contain rounded-lg bg-oatmeal p-1 border border-outline-variant/40 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-secondary font-semibold block">{p.brand}</span>
                    <p className="text-xs font-bold text-primary truncate max-w-[150px]">{p.name}</p>
                    <span className="text-xs font-bold text-red-600">المتبقي: {p.stock} فقط</span>
                  </div>
                </div>
                <Link to="/admin/inventory">
                  <Button variant="outline" size="sm" className="text-xs py-1 px-2.5">
                    تعديل
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
