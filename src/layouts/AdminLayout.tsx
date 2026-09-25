import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';

export const AdminLayout: React.FC = () => {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Show loading spinner while checking auth session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-on-surface-muted font-medium">جاري التحقق من صلاحيات الإدارة...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or not an admin profile, redirect to login
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex" dir="rtl">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-primary/40 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative z-10">
            <AdminSidebar onCloseMobile={() => setIsMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
