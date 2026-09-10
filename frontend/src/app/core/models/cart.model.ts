export interface CartItemProductSnapshot {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  stock: number;
  isActive: boolean;
}

export interface CartItem {
  itemId: string;
  product: CartItemProductSnapshot;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  itemCount: number;
  total: number;
}

export interface AddCartItemPayload {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}
