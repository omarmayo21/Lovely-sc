import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Plus,
  Eye,
  Trash2,
  Phone,
  MapPin,
  Calendar,
  Receipt,
  CheckCircle2,
  Clock,
  X,
  Upload,
  Image as ImageIcon,
  RotateCcw,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { uploadImageToStorage } from '../../services/storageService';

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder, addOrder, products } = useAdminData();
  const [searchParams] = useSearchParams();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Manual Order Form State
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [isCustomProduct, setIsCustomProduct] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [customItemName, setCustomItemName] = useState('');
  const [customItemBrand, setCustomItemBrand] = useState('Lovely SkinCare');
  const [customItemPrice, setCustomItemPrice] = useState<number>(500);
  const [manualQuantity, setManualQuantity] = useState(1);
  const [manualNotes, setManualNotes] = useState('');

  // Image Upload State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const statuses: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'جميع الطلبات', count: orders.length },
    { id: 'pending', label: 'قيد الانتظار (جديد)', count: orders.filter((o) => o.status === 'pending').length },
    { id: 'processing', label: 'جاري التجهيز', count: orders.filter((o) => o.status === 'processing').length },
    { id: 'shipped', label: 'تم الشحن', count: orders.filter((o) => o.status === 'shipped').length },
    { id: 'delivered', label: 'تم التوصيل / التسليم', count: orders.filter((o) => o.status === 'delivered').length },
    { id: 'cancelled', label: 'ملغي', count: orders.filter((o) => o.status === 'cancelled').length },
  ];

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = order.customerName.toLowerCase().includes(q);
      const matchPhone = order.customerPhone.includes(q);
      const matchNum = order.orderNumber.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchNum) return false;
    }
    return true;
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Allowed image types: JPG, JPEG, PNG, WEBP
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setImageError('يرجى اختيار ملف صورة صالح بصيغة JPG أو PNG أو WEBP.');
      return;
    }

    // Size limit check: 5MB
    if (file.size > 5 * 1024 * 1024) {
      setImageError('حجم الصورة كبير جداً (الحد الأقصى 5 ميجابايت).');
      return;
    }

    setIsUploadingImage(true);
    try {
      const { url, error } = await uploadImageToStorage(file, 'product-images');
      if (error || !url) {
        setImageError('فشل رفع الصورة إلى التخزين السحابي.');
      } else {
        setUploadedImage(url);
      }
    } catch (err) {
      console.error('Upload error in orders page:', err);
      setImageError('حدث خطأ أثناء رفع الصورة.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualPhone.trim() || !manualAddress.trim()) return;

    setIsSubmittingOrder(true);
    try {
      let itemName = '';
      let itemBrand = '';
      let itemPrice = 0;
      let itemImage = '';
      let productId = 'manual-prod';

      if (isCustomProduct) {
        itemName = customItemName.trim() || 'مستحضر مخصص (يدوي)';
        itemBrand = customItemBrand.trim() || 'Lovely SkinCare';
        itemPrice = Number(customItemPrice) || 0;
        itemImage =
          uploadedImage ||
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80';
        productId = `custom-${Date.now()}`;
      } else {
        const prod = products.find((p) => p.id === selectedProductId) || products[0];
        productId = prod.id;
        itemName = prod.name;
        itemBrand = prod.brand;
        itemPrice = prod.discountPrice ?? prod.price;
        itemImage = uploadedImage || prod.images[0];
      }

      await addOrder({
        customerName: manualName.trim(),
        customerPhone: manualPhone.trim(),
        customerAddress: manualAddress.trim(),
        items: [
          {
            productId,
            name: itemName,
            brand: itemBrand,
            price: itemPrice,
            quantity: manualQuantity,
            image: itemImage,
          },
        ],
        subtotal: itemPrice * manualQuantity,
        discount: 0,
        total: itemPrice * manualQuantity,
        status: 'pending',
        notes: manualNotes.trim() || 'طلب يدوي من إدارة الفرع',
      });

      // Reset Form
      setIsCreateModalOpen(false);
      setManualName('');
      setManualPhone('');
      setManualAddress('');
      setCustomItemName('');
      setCustomItemPrice(500);
      setManualQuantity(1);
      setManualNotes('');
      setUploadedImage(null);
      setIsCustomProduct(false);
    } catch (err) {
      console.error('Error adding manual order:', err);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header from Stitch (screen_10.html) */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-bold text-primary">إدارة الطلبات والمبيعات</h1>
          <p className="text-xs text-on-surface-muted mt-0.5">
            متابعة حالة شحن الطلبات وتحديث مسار التوصيل لعملاء المتجر والفرع
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          variant="primary"
          size="sm"
          icon={<Plus size={16} />}
        >
          إنشاء طلب جديد يدوي
        </Button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white rounded-2xl border border-outline-variant p-4 space-y-4 shadow-sm">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {statuses.map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                statusFilter === st.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-cream'
              }`}
            >
              <span>{st.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === st.id ? 'bg-white/20 text-white' : 'bg-white text-primary font-bold'
                }`}
              >
                {st.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحثي برقم الطلب، اسم العميل، أو رقم الهاتف..."
            className="w-full bg-surface-container-low text-xs text-primary px-4 py-2.5 pr-9 rounded-xl border border-outline-variant focus:outline-none focus:border-secondary"
          />
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-muted" />
        </div>
      </div>

      {/* Orders List: Desktop Table + Mobile Cards */}
      <div className="bg-white rounded-3xl border border-outline-variant overflow-hidden shadow-sm">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-cream flex items-center justify-center mx-auto text-secondary">
              <ShoppingBag size={24} />
            </div>
            <p className="text-sm font-semibold text-primary">لا توجد طلبات مطابقة للبحث أو الفلتر المحدد</p>
            <p className="text-xs text-on-surface-muted">
              جربي تغيير فلتر الحالة أو مسح نص البحث لعرض كافة الطلبات.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards (sm and down) */}
            <div className="md:hidden divide-y divide-outline-variant/60">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-primary bg-surface-container-low px-2.5 py-1 rounded-lg border border-outline-variant/60">
                      {order.orderNumber}
                    </span>
                    <span className="text-[11px] text-on-surface-muted">
                      {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-primary">{order.customerName}</h4>
                      <p className="text-xs text-on-surface-muted mt-0.5" dir="ltr">
                        {order.customerPhone}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary font-serif">
                      {order.total} ج.م
                    </span>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs text-on-surface-variant bg-cream/50 p-2.5 rounded-xl border border-outline-variant/40 space-y-1">
                    {order.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px]">
                        <span className="truncate max-w-[200px]">{i.name}</span>
                        <span className="font-bold text-primary mr-2">x{i.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Status Dropdown & Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-outline-variant/40">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className="bg-surface-container-low border border-outline-variant rounded-lg px-2.5 py-1.5 text-xs font-bold text-primary focus:outline-none focus:border-secondary flex-1"
                    >
                      <option value="pending">قيد الانتظار (جديد)</option>
                      <option value="processing">جاري التجهيز</option>
                      <option value="shipped">تم الشحن</option>
                      <option value="delivered">تم التوصيل</option>
                      <option value="cancelled">ملغي</option>
                    </select>

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-primary hover:bg-surface-container-low rounded-lg border border-outline-variant"
                      title="عرض التفاصيل"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`هل أنتِ متأكدة من حذف الطلب ${order.orderNumber}؟`)) {
                          deleteOrder(order.id);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                      title="حذف"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table (md and up) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-cream/50 border-b border-outline-variant/60 text-on-surface-muted font-bold">
                    <th className="py-3.5 px-4">رقم الطلب</th>
                    <th className="py-3.5 px-4">التاريخ</th>
                    <th className="py-3.5 px-4">اسم العميل</th>
                    <th className="py-3.5 px-4">رقم الهاتف</th>
                    <th className="py-3.5 px-4">المنتجات</th>
                    <th className="py-3.5 px-4">الإجمالي</th>
                    <th className="py-3.5 px-4">حالة الطلب</th>
                    <th className="py-3.5 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40 font-medium">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-primary">{order.orderNumber}</td>
                      <td className="py-4 px-4 text-on-surface-muted">
                        {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="py-4 px-4 font-bold text-primary">{order.customerName}</td>
                      <td className="py-4 px-4 font-mono" dir="ltr">
                        {order.customerPhone}
                      </td>
                      <td className="py-4 px-4 text-on-surface-muted truncate max-w-[200px]">
                        {order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                      </td>
                      <td className="py-4 px-4 font-bold text-primary">{order.total} ج.م</td>
                      <td className="py-4 px-4">
                        {/* Quick Status Select */}
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="bg-surface-container-low border border-outline-variant rounded-lg px-2.5 py-1 text-xs font-semibold text-primary focus:outline-none focus:border-secondary cursor-pointer"
                        >
                          <option value="pending">قيد الانتظار</option>
                          <option value="processing">جاري التجهيز</option>
                          <option value="shipped">تم الشحن</option>
                          <option value="delivered">تم التوصيل</option>
                          <option value="cancelled">ملغي</option>
                        </select>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 text-primary hover:bg-surface-container-low rounded-lg transition-colors"
                            title="عرض تفاصيل الطلب"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`هل أنتِ متأكدة من حذف الطلب ${order.orderNumber}؟`)) {
                                deleteOrder(order.id);
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`تفاصيل الطلب: ${selectedOrder.orderNumber}`}
          maxWidth="lg"
        >
          <div className="space-y-6 text-right text-xs">
            {/* Customer info */}
            <div className="bg-cream/60 p-4 rounded-2xl border border-outline-variant/60 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-on-surface-muted block text-[11px]">اسم العميل:</span>
                  <span className="font-bold text-primary">{selectedOrder.customerName}</span>
                </div>
                <div>
                  <span className="text-on-surface-muted block text-[11px]">رقم الهاتف:</span>
                  <span className="font-bold text-primary" dir="ltr">
                    {selectedOrder.customerPhone}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-outline-variant/40">
                <span className="text-on-surface-muted block text-[11px]">عنوان التوصيل:</span>
                <span className="font-semibold text-primary">{selectedOrder.customerAddress}</span>
              </div>
              {selectedOrder.notes && (
                <div className="pt-2 border-t border-outline-variant/40">
                  <span className="text-on-surface-muted block text-[11px]">ملاحظات:</span>
                  <span className="italic text-primary">{selectedOrder.notes}</span>
                </div>
              )}
            </div>

            {/* Status Update */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary">حالة الطلب الحالية:</span>
                <StatusBadge status={selectedOrder.status} />
              </div>
              <select
                value={selectedOrder.status}
                onChange={(e) => {
                  const newStatus = e.target.value as OrderStatus;
                  updateOrderStatus(selectedOrder.id, newStatus);
                  setSelectedOrder({ ...selectedOrder, status: newStatus });
                }}
                className="bg-white border border-outline-variant rounded-lg px-3 py-1.5 font-bold text-primary focus:outline-none focus:border-secondary cursor-pointer"
              >
                <option value="pending">قيد الانتظار</option>
                <option value="processing">جاري التجهيز</option>
                <option value="shipped">تم الشحن</option>
                <option value="delivered">تم التوصيل</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="font-bold text-primary">المنتجات المطلوبة:</h4>
              <div className="divide-y divide-outline-variant/50 border rounded-xl overflow-hidden bg-white">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={it.image}
                        alt=""
                        className="w-12 h-12 object-contain bg-oatmeal p-1 rounded-lg flex-shrink-0 border border-outline-variant/40"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] text-secondary font-semibold">{it.brand}</span>
                        <p className="font-semibold text-primary truncate max-w-sm">{it.name}</p>
                        <span className="text-on-surface-muted text-[11px]">
                          الكمية: {it.quantity} × {it.price} ج.م
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-primary text-sm flex-shrink-0">
                      {it.price * it.quantity} ج.م
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="pt-3 border-t border-outline-variant space-y-1 text-xs">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-bold">{selectedOrder.subtotal} ج.م</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-secondary">
                  <span>الخصم:</span>
                  <span>-{selectedOrder.discount} ج.م</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-primary pt-2 border-t">
                <span>الإجمالي:</span>
                <span className="text-base">{selectedOrder.total} ج.م</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Manual Order Modal with Direct Image Upload */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setUploadedImage(null);
            setImageError(null);
          }}
          title="إنشاء طلب جديد يدوي"
          maxWidth="md"
        >
          <form onSubmit={handleCreateManualOrder} className="space-y-4 text-right text-xs">
            <Input
              label="اسم العميل"
              required
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              placeholder="مثال: ياسمين أحمد"
            />
            <Input
              label="رقم الهاتف"
              required
              value={manualPhone}
              onChange={(e) => setManualPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              dir="ltr"
              className="text-right"
            />
            <Input
              label="عنوان التوصيل"
              required
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              placeholder="القاهرة، فرع الموسكي أو التوصيل للمنزل"
            />

            {/* Product Mode Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant">
              <span className="font-semibold text-primary">نوع المنتج المطلوب:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomProduct(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    !isCustomProduct
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-white text-on-surface-variant'
                  }`}
                >
                  من الكتالوج
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomProduct(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    isCustomProduct
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-white text-on-surface-variant'
                  }`}
                >
                  منتج مخصص / يدوي
                </button>
              </div>
            </div>

            {!isCustomProduct ? (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-primary">اختيار المنتج</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-white border border-outline-variant rounded-lg p-2.5 text-xs text-primary"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.discountPrice ?? p.price} ج.م) - {p.brand}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-3 p-3 bg-cream/40 rounded-xl border border-outline-variant/60">
                <Input
                  label="اسم المستحضر / المنتج المخصص"
                  required
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  placeholder="مثال: واقي شمس خاص أو باقة عناية مخصصة"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="الماركة"
                    value={customItemBrand}
                    onChange={(e) => setCustomItemBrand(e.target.value)}
                    placeholder="Lovely SkinCare"
                  />
                  <Input
                    label="السعر (ج.م)"
                    type="number"
                    min="1"
                    value={customItemPrice}
                    onChange={(e) => setCustomItemPrice(Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-primary">الكمية</label>
              <input
                type="number"
                min="1"
                max="50"
                value={manualQuantity}
                onChange={(e) => setManualQuantity(Number(e.target.value))}
                className="w-full bg-white border border-outline-variant rounded-lg p-2.5 text-xs text-primary"
              />
            </div>

            {/* REAL File Input for Image Upload with Preview */}
            <div className="space-y-2 pt-2 border-t border-outline-variant/60">
              <label className="block text-xs font-semibold text-primary">
                صورة المستحضر أو الفاتورة (رفع مباشر من جهازك)
              </label>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageFileChange}
                className="hidden"
                id="manual-order-image-input"
              />

              {uploadedImage ? (
                <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={uploadedImage}
                      alt="معاينة الصورة"
                      className="w-14 h-14 object-contain rounded-xl bg-white p-1 border border-outline-variant shadow-sm"
                    />
                    <div>
                      <span className="text-xs font-bold text-primary block">تم اختيار الصورة بنجاح</span>
                      <span className="text-[10px] text-tertiary-dark font-medium">جاهزة للحفظ مع الأوردر</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-primary hover:text-secondary underline font-semibold px-2 py-1"
                    >
                      استبدال
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="إزالة الصورة"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 border-2 border-dashed border-outline-variant hover:border-secondary rounded-2xl text-center cursor-pointer transition-colors bg-surface-container-low/50 hover:bg-cream/50 space-y-1.5"
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto text-secondary shadow-sm">
                    <Upload size={18} />
                  </div>
                  <p className="text-xs font-bold text-primary">اضغطي هنا لاختيار صورة من جهازكِ</p>
                  <p className="text-[10px] text-on-surface-muted">
                    يقبل JPG, JPEG, PNG, WEBP (حجم أقصى 5 ميجابايت)
                  </p>
                </div>
              )}

              {imageError && (
                <p className="text-xs text-red-600 font-medium">{imageError}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-primary">ملاحظات الطلب (اختياري)</label>
              <input
                type="text"
                value={manualNotes}
                onChange={(e) => setManualNotes(e.target.value)}
                placeholder="مثال: تم الاتفاق هاتفياً، الاستلام من فرع الموسكي"
                className="w-full bg-white border border-outline-variant rounded-lg p-2.5 text-xs text-primary"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full mt-4">
              حفظ وتأكيد الطلب اليدوي
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};
