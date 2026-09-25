import React from 'react';
import { Menu, Bell, User, ExternalLink, MapPin, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AdminHeaderProps {
  onToggleMobileSidebar: () => void;
  title?: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleMobileSidebar,
  title = 'لوحة تحكم Lovely SkinCare',
  subtitle = 'فرع الموسكي - القاهرة',
}) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const adminName = profile?.full_name || user?.email?.split('@')[0] || 'أ. سراج بدوي';
  const roleName = profile?.role === 'super_admin' ? 'المدير العام' : 'مدير المتجر والفرع';

  return (
    <header className="bg-white border-b border-outline-variant/80 sticky top-0 z-20 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile menu button and Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleMobileSidebar}
            className="p-2 text-primary lg:hidden rounded-lg hover:bg-surface-container-low"
            aria-label="القائمة"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-lg font-serif font-bold text-primary">{title}</h1>
            <p className="text-xs text-on-surface-muted flex items-center gap-1.5 mt-0.5">
              <MapPin size={11} className="text-secondary" />
              <span>{subtitle}</span>
            </p>
          </div>
        </div>

        {/* Actions & Profile */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-medium text-primary hover:bg-surface-container-low transition-colors"
          >
            <ExternalLink size={13} />
            <span>معاينة المتجر</span>
          </Link>

          {/* Admin User Info */}
          <div className="flex items-center gap-2.5 pr-2 border-r border-outline-variant/60">
            <div className="w-8 h-8 rounded-full bg-blush text-primary border border-secondary/30 flex items-center justify-center font-bold text-xs">
              {adminName.substring(0, 2).toUpperCase()}
            </div>
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold text-primary leading-none">{adminName}</p>
              <p className="text-[10px] text-tertiary-dark font-medium mt-0.5">{roleName}</p>
            </div>

            {user && (
              <button
                onClick={handleSignOut}
                title="تسجيل الخروج"
                className="p-1.5 text-on-surface-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mr-1"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
