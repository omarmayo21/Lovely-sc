import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  PlusCircle,
  FolderTree,
  Award,
  Users,
  Boxes,
  Percent,
  Settings,
  ExternalLink,
  MapPin,
  TrendingUp,
  Tag,
  BarChart3,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAdminData } from '../../context/AdminDataContext';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMobile }) => {
  const { orders, products, offers } = useAdminData();
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const activeOffersCount = offers.filter((o) => o.isActive).length;

  const navItems = [
    { label: 'لوحة الإدارة الرئيسية', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'تحليل الأداء والمبيعات', path: '/admin/analytics', icon: TrendingUp },
    { label: 'إدارة الطلبات', path: '/admin/orders', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined, badgeColor: 'bg-secondary' },
    { label: 'كتالوج المنتجات', path: '/admin/products', icon: Sparkles },
    { label: 'إضافة منتج جديد', path: '/admin/products/new', icon: PlusCircle },
    { label: 'العروض والبوب أب', path: '/admin/offers', icon: Tag, badge: activeOffersCount > 0 ? `${activeOffersCount} نشط` : undefined, badgeColor: 'bg-emerald-600' },
    { label: 'أقسام وتصنيفات المتجر', path: '/admin/categories', icon: FolderTree },
    { label: 'الشركات والماركات', path: '/admin/brands', icon: Award },
    { label: 'دليل العملاء', path: '/admin/customers', icon: Users },
    { label: 'إدارة المخزون والنواقص', path: '/admin/inventory', icon: Boxes, badge: lowStockCount > 0 ? `${lowStockCount} نواقص` : undefined, badgeColor: 'bg-amber-600' },
    { label: 'الكوبونات وقسائم الخصم', path: '/admin/coupons', icon: Percent },
    { label: 'التحليلات والتسويق (SEO)', path: '/admin/marketing', icon: BarChart3 },
    { label: 'الإعدادات العامة للفرع', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-l border-outline-variant/80 flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Sidebar Brand Header */}
      <div className="p-5 border-b border-outline-variant/60 space-y-3">
        <Link to="/" className="block">
          <Logo size="md" />
        </Link>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-[11px] text-on-surface-variant border border-outline-variant/50">
          <MapPin size={12} className="text-secondary flex-shrink-0" />
          <span className="truncate">الفرع النشط: <strong>فرع الموسكي - القاهرة</strong></span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon size={16} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-secondary'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Store Link & Logout */}
      <div className="p-4 border-t border-outline-variant/60 bg-cream/30 space-y-2">
        <Link
          to="/"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-tertiary-dark bg-tertiary-container hover:bg-tertiary/20 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ExternalLink size={14} />
            <span>عرض المتجر الإلكتروني</span>
          </div>
          <span className="text-[10px] bg-white px-1.5 py-0.5 rounded">Store</span>
        </Link>
      </div>
    </aside>
  );
};
