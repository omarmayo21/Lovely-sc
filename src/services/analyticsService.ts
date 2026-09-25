import { Product, Order, StoreSettings } from '../types';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    clarity?: (...args: any[]) => void;
  }
}

// Internal flags to prevent duplicate initializations
let gaInitialized = false;
let metaInitialized = false;
let clarityInitialized = false;

/**
 * Dynamically initializes third-party analytics (GA4, Meta Pixel, Microsoft Clarity)
 * using the IDs stored in Supabase store_settings.
 */
export function initAnalytics(settings: Partial<StoreSettings>) {
  if (typeof window === 'undefined') return;

  // 1. Google Analytics 4
  const gaId = settings.googleAnalyticsId?.trim();
  if (gaId && !gaInitialized) {
    try {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer?.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', gaId, {
        send_page_view: false, // Handled manually on route change
      });
      gaInitialized = true;
    } catch (err) {
      console.warn('Could not initialize Google Analytics:', err);
    }
  }

  // 2. Meta Pixel
  const pixelId = settings.metaPixelId?.trim();
  if (pixelId && !metaInitialized) {
    try {
      /* eslint-disable */
      (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */

      window.fbq?.('init', pixelId);
      metaInitialized = true;
    } catch (err) {
      console.warn('Could not initialize Meta Pixel:', err);
    }
  }

  // 3. Microsoft Clarity
  const clarityId = settings.clarityProjectId?.trim();
  if (clarityId && !clarityInitialized) {
    try {
      /* eslint-disable */
      (function (c: any, l: any, a: any, r: any, i: any, t?: any, y?: any) {
        c[a] =
          c[a] ||
          function () {
            (c[a].q = c[a].q || []).push(arguments);
          };
        t = l.createElement(r);
        t.async = 1;
        t.src = 'https://www.clarity.ms/tag/' + i;
        y = l.getElementsByTagName(r)[0];
        y.parentNode.insertBefore(t, y);
      })(window, document, 'clarity', 'script', clarityId);
      /* eslint-enable */
      clarityInitialized = true;
    } catch (err) {
      console.warn('Could not initialize Microsoft Clarity:', err);
    }
  }
}

/**
 * Track Page View
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
  if (typeof window === 'undefined') return;

  // GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    });
  }

  // Meta Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
}

/**
 * Track View Item (Product Details View)
 */
export function trackViewItem(product: Product) {
  if (typeof window === 'undefined') return;

  const itemData = {
    item_id: product.id,
    item_name: product.name,
    item_brand: product.brand,
    item_category: product.category,
    price: product.discountPrice || product.price,
    currency: 'EGP',
  };

  // GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'view_item', {
      currency: 'EGP',
      value: product.discountPrice || product.price,
      items: [itemData],
    });
  }

  // Meta Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'ViewContent', {
      content_ids: [product.id],
      content_name: product.name,
      content_category: product.category,
      content_type: 'product',
      value: product.discountPrice || product.price,
      currency: 'EGP',
    });
  }
}

/**
 * Track Search
 */
export function trackSearch(searchTerm: string, resultsCount: number = 0) {
  if (typeof window === 'undefined' || !searchTerm.trim()) return;

  // GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'search', {
      search_term: searchTerm.trim(),
      results_count: resultsCount,
    });
  }

  // Meta Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Search', {
      search_string: searchTerm.trim(),
      content_category: 'Products',
    });
  }
}

/**
 * Track Add to Cart
 */
export function trackAddToCart(product: Product, quantity: number = 1) {
  if (typeof window === 'undefined') return;

  const price = product.discountPrice || product.price;

  // GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'add_to_cart', {
      currency: 'EGP',
      value: price * quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_brand: product.brand,
          item_category: product.category,
          price: price,
          quantity: quantity,
        },
      ],
    });
  }

  // Meta Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'AddToCart', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: price * quantity,
      currency: 'EGP',
    });
  }
}

/**
 * Track Remove from Cart
 */
export function trackRemoveFromCart(product: Product, quantity: number = 1) {
  if (typeof window === 'undefined') return;

  const price = product.discountPrice || product.price;

  // GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'remove_from_cart', {
      currency: 'EGP',
      value: price * quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_brand: product.brand,
          item_category: product.category,
          price: price,
          quantity: quantity,
        },
      ],
    });
  }
}

/**
 * Track Begin Checkout
 */
export function trackBeginCheckout(items: { product: Product; quantity: number }[], total: number) {
  if (typeof window === 'undefined') return;

  const formattedItems = items.map((i) => ({
    item_id: i.product.id,
    item_name: i.product.name,
    item_brand: i.product.brand,
    item_category: i.product.category,
    price: i.product.discountPrice || i.product.price,
    quantity: i.quantity,
  }));

  // GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'begin_checkout', {
      currency: 'EGP',
      value: total,
      items: formattedItems,
    });
  }

  // Meta Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'InitiateCheckout', {
      content_ids: items.map((i) => i.product.id),
      num_items: items.reduce((acc, curr) => acc + curr.quantity, 0),
      value: total,
      currency: 'EGP',
    });
  }
}

/**
 * Track Purchase
 * STRICT RULES:
 * 1. Must only fire upon reaching /order-success with authoritative order data.
 * 2. Deduplicated per order id using sessionStorage so page refreshes do NOT trigger duplicate events.
 * 3. Never sends customer phone, address, or sensitive personal data.
 */
export function trackPurchase(order: Order) {
  if (typeof window === 'undefined' || !order || !order.id) return;

  const dedupeKey = `lovely_purchase_tracked_${order.id}`;
  if (sessionStorage.getItem(dedupeKey)) {
    // Already tracked for this session, ignore duplicate
    return;
  }

  const items = (order.items || []).map((item) => ({
    item_id: item.productId,
    item_name: item.name,
    item_brand: item.brand,
    price: item.price,
    quantity: item.quantity,
  }));

  // GA4 Purchase
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'purchase', {
      transaction_id: order.orderNumber || order.id,
      value: order.total,
      currency: 'EGP',
      tax: 0,
      shipping: 0,
      items,
    });
  }

  // Meta Pixel Purchase
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Purchase', {
      content_ids: items.map((i) => i.item_id),
      content_type: 'product',
      value: order.total,
      currency: 'EGP',
      num_items: items.reduce((sum, item) => sum + item.quantity, 0),
    });
  }

  // Mark order as tracked in sessionStorage
  try {
    sessionStorage.setItem(dedupeKey, 'true');
  } catch {
    // Ignore storage quota limits
  }
}
