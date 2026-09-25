import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, Sparkles, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Logo } from '../../components/common/Logo';

export const AdminLoginPage: React.FC = () => {
  const { signIn, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/admin';

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setIsSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    setIsSubmitting(false);

    if (error) {
      setErrorMsg('فشل تسجيل الدخول. يرجى التأكد من صحة البريد الإلكتروني وكلمة المرور.');
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12 select-none" dir="rtl">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream border border-outline-variant/60 text-xs font-semibold text-primary">
              <ShieldCheck size={14} className="text-secondary" />
              <span>بوابة الإدارة المعتمدة — فرع الموسكي</span>
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary">تسجيل دخول لوحة التحكم</h1>
          <p className="text-xs text-on-surface-muted">
            أدخلي بيانات الاعتماد الخاصة بإدارة المتجر والطلبات
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-outline-variant p-8 shadow-soft-md space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="البريد الإلكتروني للإدارة"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@lovelyskincare.com"
              icon={<Mail size={16} />}
              dir="ltr"
              className="text-right"
            />

            <Input
              label="كلمة المرور"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock size={16} />}
              dir="ltr"
              className="text-right"
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
                icon={<Lock size={16} />}
              >
                {isSubmitting ? 'جاري التحقق...' : 'دخول لوحة الإدارة'}
              </Button>
            </div>
          </form>

          <div className="pt-4 border-t border-outline-variant/60 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-on-surface-muted hover:text-primary transition-colors font-medium"
            >
              <span>العودة للمتجر الإلكتروني</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        <div className="text-center text-[11px] text-on-surface-muted">
          جميع الحقوق محفوظة © {new Date().getFullYear()} Lovely SkinCare
        </div>
      </div>
    </div>
  );
};
