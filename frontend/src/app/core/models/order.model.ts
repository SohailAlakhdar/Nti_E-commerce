import { Address } from './address.model';
import { OrderStatus } from './enums';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingCost: number;
  total: number;
  address: Address;
  customerName: string;
  customerPhone: string;
  createdAt: string;
}

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  addressId?: string;
  address?: Omit<Address, 'id'>;
}
