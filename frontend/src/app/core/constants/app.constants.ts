import { Gender, OrderStatus, SubCategory } from '../models/enums';

export const GENDER_OPTIONS: { value: Gender; label: { en: string; ar: string } }[] = [
  { value: Gender.Men, label: { en: 'Men', ar: 'رجالي' } },
  { value: Gender.Women, label: { en: 'Women', ar: 'حريمي' } }
];

export const SUBCATEGORY_OPTIONS: { value: SubCategory; label: { en: string; ar: string } }[] = [
  { value: SubCategory.TShirt, label: { en: 'T-Shirt', ar: 'تي شيرت' } },
  { value: SubCategory.Pants, label: { en: 'Pants', ar: 'بنطلون' } },
  { value: SubCategory.Shirt, label: { en: 'Shirt', ar: 'قميص' } },
  { value: SubCategory.Jeans, label: { en: 'Jeans', ar: 'جينز' } },
  { value: SubCategory.Hoodie, label: { en: 'Hoodie', ar: 'هودي' } },
  { value: SubCategory.Jacket, label: { en: 'Jacket', ar: 'جاكيت' } },
  { value: SubCategory.Dress, label: { en: 'Dress', ar: 'فستان' } },
  { value: SubCategory.Skirt, label: { en: 'Skirt', ar: 'جيبة' } }
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, { en: string; ar: string; variant: string }> = {
  [OrderStatus.Pending]: { en: 'Pending', ar: 'قيد الانتظار', variant: 'warning' },
  [OrderStatus.Confirmed]: { en: 'Confirmed', ar: 'تم التأكيد', variant: 'info' },
  [OrderStatus.Shipped]: { en: 'Shipped', ar: 'تم الشحن', variant: 'primary' },
  [OrderStatus.Delivered]: { en: 'Delivered', ar: 'تم التوصيل', variant: 'success' },
  [OrderStatus.Cancelled]: { en: 'Cancelled', ar: 'ملغي', variant: 'secondary' },
  [OrderStatus.Failed]: { en: 'Failed', ar: 'فشل', variant: 'danger' }
};

export const LANGUAGE_STORAGE_KEY = 'fs_language';
export const GUEST_CART_STORAGE_KEY = 'fs_guest_cart_id';
export const ACCESS_TOKEN_STORAGE_KEY = 'fs_access_token';
export const REFRESH_TOKEN_STORAGE_KEY = 'fs_refresh_token';
