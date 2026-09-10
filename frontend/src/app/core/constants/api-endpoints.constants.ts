import { environment } from '../../../environments/environment';

const base = environment.apiUrl;

export const API_ENDPOINTS = {
  auth: {
    register: `${base}/auth/register`,
    login: `${base}/auth/login`,
    refresh: `${base}/auth/refresh`,
    logout: `${base}/auth/logout`,
    me: `${base}/auth/me`
  },
  home: {
    newArrivals: `${base}/home/new-arrivals`,
    topSales: `${base}/home/top-sales`
  },
  products: `${base}/products`,
  productBySlug: (slug: string) => `${base}/products/${slug}`,
  cart: `${base}/cart`,
  cartItems: `${base}/cart/items`,
  cartItem: (itemId: string) => `${base}/cart/items/${itemId}`,
  orders: `${base}/orders`,
  order: (id: string) => `${base}/orders/${id}`,
  addresses: `${base}/addresses`,
  address: (id: string) => `${base}/addresses/${id}`,
  testimonials: `${base}/testimonials`,
  shipping: `${base}/shipping`,
  policies: `${base}/policies`,
  about: `${base}/about`,
  admin: {
    reportsOverview: `${base}/admin/reports/overview`,
    reportsSales: `${base}/admin/reports/sales`,
    reportsTopProducts: `${base}/admin/reports/top-products`,
    reportsCategories: `${base}/admin/reports/categories`,
    products: `${base}/admin/products`,
    product: (id: string) => `${base}/admin/products/${id}`,
    productImages: (id: string) => `${base}/admin/products/${id}/images`,
    orders: `${base}/admin/orders`,
    order: (id: string) => `${base}/admin/orders/${id}`,
    orderStatus: (id: string) => `${base}/admin/orders/${id}/status`,
    testimonials: `${base}/admin/testimonials`,
    testimonialApprove: (id: string) => `${base}/admin/testimonials/${id}/approve`,
    testimonial: (id: string) => `${base}/admin/testimonials/${id}`,
    shipping: `${base}/admin/shipping`,
    policies: `${base}/admin/policies`,
    about: `${base}/admin/about`,
    users: `${base}/admin/users`
  }
};
