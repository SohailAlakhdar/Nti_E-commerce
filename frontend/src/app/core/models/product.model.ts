import { Gender, SubCategory } from './enums';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  gender: Gender;
  subCategory: SubCategory;
  isActive: boolean;
  createdAt: string;
}

export type ProductPayload = Omit<Product, 'id' | 'createdAt'>;

export function isProductPurchasable(product: Product): boolean {
  return product.isActive && product.stock > 0;
}
