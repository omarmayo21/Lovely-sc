import React, { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  Boxes,
  Calendar,
  Sparkles,
  ArrowUpDown,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  BarChart2,
  PieChart,
  ArrowUpRight,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { fetchSearchEvents } from '../../services/apiService';
import { SearchEvent, OrderStatus } from '../../types';

type DateRangeFilter = 'today' | '7days' | '30days' | 'this_month' | 'all';

export const AdminAnalyticsPage: React.FC = () => {
  const { products, orders, categories, brands, customers } = useAdminData();
  const [dateRange, setDateRange] = useState<DateRangeFilter>('30days');
  const [productSortBy, setProductSortBy] = useState<'revenue' | 'units' | 'stock' | 'orders'>('revenue');
  const [searchEvents, setSearchEvents] = useState<SearchEvent[]>([]);
  const [isLoadingSearchEvents, setIsLoadingSearchEvents] = useState(false);

  // Load Search Analytics Events
  useEffect(() => {
    async function loadEvents() {
      setIsLoadingSearchEvents(true);
      const events = await fetchSearchEvents();
      setSearchEvents(events);
      setIsLoadingSearchEvents(false);
    }
    loadEvents();
  }, []);

  // Filter Orders based on selected date range
  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      if (dateRange === 'today') {
        return orderDate.toDateString() === now.toDateString();
      }
      if (dateRange === '7days') {
        const past7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= past7;
      }
      if (dateRange === '30days') {
        const past30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return orderDate >= past30;
      }
      if (dateRange === 'this_month') {
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }
      return true; // 'all'
    });
  }, [orders, dateRange]);

  // A) Store & Sales Overview Metrics
  const metrics = useMemo(() => {
    const totalOrdersCount = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const aov = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

    const totalProductsCount = products.length;
    const activeProductsCount = products.filter((p) => p.isActive).length;
    const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
    const outOfStockCount = products.filter((p) => p.stock === 0).length;

    const totalInventoryValue = products.reduce((sum, p) => {
      const pPrice = p.discountPrice || p.price;
      return sum + pPrice * p.stock;
    }, 0);
    const totalUnitsInStock = products.reduce((sum, p) => sum + p.stock, 0);

    const totalCustomersCount = customers.length;
    const repeatCustomersCount = customers.filter((c) => c.totalOrders > 1).length;
    const repeatRate = totalCustomersCount > 0 ? Math.round((repeatCustomersCount / totalCustomersCount) * 100) : 0;

    return {
      totalOrdersCount,
      totalRevenue,
      aov,
      totalProductsCount,
      activeProductsCount,
      lowStockCount,
      outOfStockCount,
      totalInventoryValue,
      totalUnitsInStock,
      totalCustomersCount,
      repeatCustomersCount,
      repeatRate,
    };
  }, [filteredOrders, products, customers]);

  // C) Product Performance Calculation
  const productPerformance = useMemo(() => {
    const map: Record<
      string,
      {
        id: string;
        name: string;
        brand: string;
        category: string;
        currentStock: number;
        price: number;
        unitsSold: number;
        revenueGenerated: number;
        orderCount: number;
      }
    > = {};

    // Initialize with all products
    products.forEach((p) => {
      map[p.id] = {
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        currentStock: p.stock,
        price: p.discountPrice || p.price,
        unitsSold: 0,
        revenueGenerated: 0,
        orderCount: 0,
      };
    });

    // Aggregate from filtered orders
    filteredOrders.forEach((o) => {
      (o.items || []).forEach((item) => {
        if (map[item.productId]) {
          map[item.productId].unitsSold += item.quantity;
          map[item.productId].revenueGenerated += item.price * item.quantity;
          map[item.productId].orderCount += 1;
        }
      });
    });

    const list = Object.values(map);

    // Sort
    return list.sort((a, b) => {
      if (productSortBy === 'revenue') return b.revenueGenerated - a.revenueGenerated;
      if (productSortBy === 'units') return b.unitsSold - a.unitsSold;
      if (productSortBy === 'stock') return a.currentStock - b.currentStock;
      if (productSortBy === 'orders') return b.orderCount - a.orderCount;
      return 0;
    });
  }, [products, filteredOrders, productSortBy]);

  // D) Category Performance Calculation
  const categoryPerformance = useMemo(() => {
    const map: Record<
      string,
      { name: string; slug: string; productCount: number; unitsSold: number; revenue: number; orderCount: number }
    > = {};

    categories.forEach((cat) => {
      map[cat.slug] = {
        name: cat.name,
        slug: cat.slug,
        productCount: products.filter((p) => p.categorySlug === cat.slug).length,
        unitsSold: 0,
        revenue: 0,
        orderCount: 0,
      };
    });

    filteredOrders.forEach((o) => {
      (o.items || []).forEach((item) => {
        const prod = products.find((p) => p.id === item.productId);
        if (prod && map[prod.categorySlug]) {
          map[prod.categorySlug].unitsSold += item.quantity;
          map[prod.categorySlug].revenue += item.price * item.quantity;
          map[prod.categorySlug].orderCount += 1;
        }
      });
    });

    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [categories, products, filteredOrders]);

  // E) Brand Performance Calculation
  const brandPerformance = useMemo(() => {
    const map: Record<
      string,
      { name: string; slug: string; origin: string; unitsSold: number; revenue: number; orderCount: number }
    > = {};

    brands.forEach((brand) => {
      map[brand.slug] = {
        name: brand.name,
        slug: brand.slug,
        origin: brand.origin === 'korean' ? 'كوري 🇰🇷' : 'أوروبي 🇫🇷',
        unitsSold: 0,
        revenue: 0,
        orderCount: 0,
      };
    });

    filteredOrders.forEach((o) => {
      (o.items || []).forEach((item) => {
        const prod = products.find((p) => p.id === item.productId);
        if (prod && map[prod.brandSlug]) {
          map[prod.brandSlug].unitsSold += item.quantity;
          map[prod.brandSlug].revenue += item.price * item.quantity;
          map[prod.brandSlug].orderCount += 1;
        }
      });
    });

    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [brands, products, filteredOrders]);

  // F) Order Status Distribution
  const orderStatusStats = useMemo(() => {
    const counts: Record<OrderStatus, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    filteredOrders.forEach((o) => {
      if (counts[o.status] !== undefined) {
        counts[o.status]++;
      }
    });

    return counts;
  }, [filteredOrders]);

  // I) Search Analytics Aggregation
  const searchAnalytics = useMemo(() => {
    const termsCount: Record<string, { count: number; zeroResults: boolean }> = {};
    let zeroResultsCount = 0;

    searchEvents.forEach((ev) => {
      const q = ev.query.trim().toLowerCase();
      if (!q) return;
      if (!termsCount[q]) {
        termsCount[q] = { count: 0, zeroResults: ev.resultsCount === 0 };
      }
      termsCount[q].count++;
      if (ev.resultsCount === 0) zeroResultsCount++;
    });

    const topTerms = Object.entries(termsCount)
      .map(([query, data]) => ({ query, count: data.count, zeroResults: data.zeroResults }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalSearches: searchEvents.length,
      zeroResultsCount,
      topTerms,
    };
  }, [searchEvents]);

  const dateRangeLabels: Record<DateRangeFilter, string> = {
    today: 'اليوم',
    '7days': 'آخر 7 أيام',
    '30days': 'آخر 30 يوم',
    this_month: 'هذا الشهر',
    all: 'كل الأوقات',
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header & Date Range Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-outline-variant/60 shadow-soft-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-secondary" size={24} />
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-primary">
              لوحة تحليل الأداء الإحصائي
            </h1>
          </div>
          <p className="text-xs text-on-surface-muted">
            إحصائيات وتحليلات واقعية ودقيقة مستخرجة مباشرة من قاعدة بيانات المتجر
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1.5 p-1.5 bg-surface-container-low rounded-2xl border border-outline-variant/50 overflow-x-auto">
          {(['today', '7days', '30days', 'this_month', 'all'] as DateRangeFilter[]).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                dateRange === range
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/60'
              }`}
            >
              {dateRangeLabels[range]}
            </button>
          ))}
        </div>
      </div>

      {/* A) Store Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Sales */}
        <div className="bg-white p-6 rounded-3xl border border-outline-variant/60 shadow-soft-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-muted">إجمالي المبيعات</span>
            <div className="w-10 h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold font-mono text-primary">
              {metrics.totalRevenue.toLocaleString('en-US')} <span className="text-xs font-sans text-on-surface-muted">ج.م</span>
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <ArrowUpRight size={13} />
              <span>متوسط الطلب (AOV): {metrics.aov} ج.م</span>
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-outline-variant/60 shadow-soft-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-muted">عدد الطلبات</span>
            <div className="w-10 h-10 rounded-2xl bg-tertiary/10 text-tertiary-dark flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold font-mono text-primary">
              {metrics.totalOrdersCount} <span className="text-xs font-sans text-on-surface-muted">طلب</span>
            </h3>
            <p className="text-[11px] text-on-surface-muted">
              خلال الفترة: {dateRangeLabels[dateRange]}
            </p>
          </div>
        </div>

        {/* Inventory Value */}
        <div className="bg-white p-6 rounded-3xl border border-outline-variant/60 shadow-soft-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-muted">قيمة المخزون الحالي</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Boxes size={20} />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold font-mono text-primary">
              {metrics.totalInventoryValue.toLocaleString('en-US')} <span className="text-xs font-sans text-on-surface-muted">ج.م</span>
            </h3>
            <p className="text-[11px] text-on-surface-muted">
              إجمالي {metrics.totalUnitsInStock} قطعة مخزنة
            </p>
          </div>
        </div>

        {/* Customers & Repeat Rate */}
        <div className="bg-white p-6 rounded-3xl border border-outline-variant/60 shadow-soft-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-muted">العملاء ونسبة التكرار</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold font-mono text-primary">
              {metrics.totalCustomersCount} <span className="text-xs font-sans text-on-surface-muted">عميل</span>
            </h3>
            <p className="text-[11px] text-amber-700 font-semibold">
              نسبة تكرار الشراء: {metrics.repeatRate}% ({metrics.repeatCustomersCount} عميل متكرر)
            </p>
          </div>
        </div>
      </div>

      {/* F) Order Status Distribution & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Order Status Distribution */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/60 shadow-soft-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-secondary" />
              <h2 className="text-base font-serif font-bold text-primary">
                توزيع حالات الطلبات ({filteredOrders.length})
              </h2>
            </div>
            <span className="text-xs text-on-surface-muted">حسب الفترة المحددة</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
              <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                <Clock size={12} />
                <span>جديد (قيد المراجعة)</span>
              </span>
              <p className="text-xl font-bold font-mono text-amber-900">{orderStatusStats.pending}</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
              <span className="text-[11px] font-bold text-blue-800 flex items-center gap-1">
                <Boxes size={12} />
                <span>جاري التجهيز</span>
              </span>
              <p className="text-xl font-bold font-mono text-blue-900">{orderStatusStats.processing}</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1">
              <span className="text-[11px] font-bold text-purple-800 flex items-center gap-1">
                <Truck size={12} />
                <span>تم الشحن</span>
              </span>
              <p className="text-xl font-bold font-mono text-purple-900">{orderStatusStats.shipped}</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>تم التسليم بنجاح</span>
              </span>
              <p className="text-xl font-bold font-mono text-emerald-900">{orderStatusStats.delivered}</p>
            </div>
          </div>
        </div>

        {/* Inventory Stock Alerts */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/60 shadow-soft-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/40">
            <AlertTriangle size={18} className="text-amber-600" />
            <h2 className="text-base font-serif font-bold text-primary">حالة نواقص المخزون</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-rose-900">منتجات نفدت بالكامل</p>
                <p className="text-[10px] text-rose-700">المخزون = 0 قطعة</p>
              </div>
              <span className="text-lg font-bold font-mono text-rose-900">{metrics.outOfStockCount}</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-amber-900">منتجات أوشكت على النفاد</p>
                <p className="text-[10px] text-amber-700">المخزون متبقي منه 5 قطع أو أقل</p>
              </div>
              <span className="text-lg font-bold font-mono text-amber-900">{metrics.lowStockCount}</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/40">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-primary">المنتجات النشطة والمعروضة</p>
                <p className="text-[10px] text-on-surface-muted">جاهزة للشراء الفوري</p>
              </div>
              <span className="text-lg font-bold font-mono text-primary">{metrics.activeProductsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* C) Product Performance Table */}
      <div className="bg-white rounded-3xl border border-outline-variant/60 shadow-soft-sm overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Package size={18} className="text-secondary" />
              <h2 className="text-base font-serif font-bold text-primary">
                أداء المنتجات والمبيعات ({productPerformance.length})
              </h2>
            </div>
            <p className="text-xs text-on-surface-muted">
              بيانات واقعية محسوبة من الطلبات الفعلية في قاعدة البيانات
            </p>
          </div>

          {/* Sort controls */}
          <div className="flex items-center gap-2 text-xs">
            <ArrowUpDown size={14} className="text-on-surface-muted" />
            <span className="text-on-surface-muted">ترتيب حسب:</span>
            <select
              value={productSortBy}
              onChange={(e) => setProductSortBy(e.target.value as any)}
              className="bg-surface-container-low border border-outline-variant rounded-xl px-3 py-1.5 text-xs text-primary focus:outline-none focus:border-secondary cursor-pointer"
            >
              <option value="revenue">الأعلى تحقيقاً للإيرادات</option>
              <option value="units">الأكثر مبيعاً بالقطع</option>
              <option value="orders">الأكثر طلباً</option>
              <option value="stock">الأقل مخزوناً</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-surface-container-low text-on-surface-variant font-bold border-b border-outline-variant/60">
              <tr>
                <th className="py-3.5 px-6">المنتج</th>
                <th className="py-3.5 px-4">الماركة / القسم</th>
                <th className="py-3.5 px-4">السعر</th>
                <th className="py-3.5 px-4">القطع المباعة</th>
                <th className="py-3.5 px-4">إجمالي الإيرادات</th>
                <th className="py-3.5 px-4">عدد الطلبات</th>
                <th className="py-3.5 px-6">المخزون الحالي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {productPerformance.map((prod) => (
                <tr key={prod.id} className="hover:bg-cream/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-primary max-w-xs truncate">
                    {prod.name}
                  </td>
                  <td className="py-4 px-4 text-on-surface-muted">
                    {prod.brand} • {prod.category}
                  </td>
                  <td className="py-4 px-4 font-mono font-semibold text-primary">
                    {prod.price} ج.م
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-secondary">
                    {prod.unitsSold} قطعة
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-emerald-700">
                    {prod.revenueGenerated.toLocaleString('en-US')} ج.م
                  </td>
                  <td className="py-4 px-4 text-on-surface-muted font-mono">
                    {prod.orderCount}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold font-mono ${
                        prod.currentStock === 0
                          ? 'bg-rose-100 text-rose-800'
                          : prod.currentStock <= 5
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {prod.currentStock} قطعة
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* D & E) Category & Brand Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/60 shadow-soft-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/40">
            <BarChart2 size={18} className="text-secondary" />
            <h2 className="text-base font-serif font-bold text-primary">
              أداء الأقسام والتصنيفات
            </h2>
          </div>

          <div className="divide-y divide-outline-variant/30">
            {categoryPerformance.map((cat) => (
              <div key={cat.slug} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="font-bold text-primary">{cat.name}</p>
                  <p className="text-[10px] text-on-surface-muted">
                    {cat.productCount} منتجات • {cat.orderCount} طلبات
                  </p>
                </div>
                <div className="text-left space-y-0.5">
                  <p className="font-bold text-secondary font-mono">{cat.revenue.toLocaleString('en-US')} ج.م</p>
                  <p className="text-[10px] text-on-surface-muted">{cat.unitsSold} قطعة مباعة</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Performance */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/60 shadow-soft-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/40">
            <PieChart size={18} className="text-secondary" />
            <h2 className="text-base font-serif font-bold text-primary">
              أداء الماركات والشركات
            </h2>
          </div>

          <div className="divide-y divide-outline-variant/30">
            {brandPerformance.map((b) => (
              <div key={b.slug} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="font-bold text-primary">{b.name}</p>
                  <p className="text-[10px] text-on-surface-muted">{b.origin} • {b.orderCount} طلبات</p>
                </div>
                <div className="text-left space-y-0.5">
                  <p className="font-bold text-secondary font-mono">{b.revenue.toLocaleString('en-US')} ج.م</p>
                  <p className="text-[10px] text-on-surface-muted">{b.unitsSold} قطعة مباعة</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* I) Search Performance Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/60 shadow-soft-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
          <div className="flex items-center gap-2">
            <Search size={18} className="text-secondary" />
            <h2 className="text-base font-serif font-bold text-primary">
              تحليل عمليات البحث الفوري بالمتجر
            </h2>
          </div>
          <span className="text-xs text-on-surface-muted">
            إجمالي عمليات البحث: <strong>{searchAnalytics.totalSearches}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-primary">أكثر الكلمات بحثاً من الزوار</h3>
            {searchAnalytics.topTerms.length > 0 ? (
              <div className="divide-y divide-outline-variant/30">
                {searchAnalytics.topTerms.map((term, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-primary">&quot;{term.query}&quot;</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container-low text-secondary font-mono font-bold text-[11px]">
                      {term.count} مرة
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-on-surface-muted">لا توجد عمليات بحث مسجلة حتى الآن.</p>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-low/60 border border-outline-variant/40 space-y-3 text-xs">
            <h3 className="font-bold text-primary">ملاحظات تحسين تجربة البحث</h3>
            <ul className="space-y-2 text-on-surface-variant">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" />
                <span>تحديث محرك البحث الفوري ليعمل تلقائياً عند كتابة أول حرف.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" />
                <span>البحث يشمل اسم المنتج، الاسم الإنجليزي، الماركة، ورمز SKU.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" />
                <span>عمليات البحث المسجلة بدون نتائج: <strong>{searchAnalytics.zeroResultsCount}</strong></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
