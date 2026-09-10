export interface Testimonial {
  id: string;
  name: string;
  message: string;
  isApproved: boolean;
  createdAt: string;
}

export interface TestimonialPayload {
  name: string;
  message: string;
}

export interface ShippingPolicy {
  id: string;
  cost: number;
  estimatedDeliveryDays: string;
  information: string;
}

export interface Policy {
  returnPolicy: string;
  exchangePolicy: string;
  privacyPolicy: string;
  termsAndConditions: string;
}

export interface AboutContent {
  title: string;
  description: string;
  mission?: string;
  images?: string[];
}

export interface SalesByPeriod {
  label: string;
  total: number;
}

export interface TopProductReport {
  productId: string;
  name: string;
  unitsSold: number;
}

export interface CategoryReport {
  category: string;
  unitsSold: number;
}

export interface ReportOverview {
  totalSales: number;
  totalOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  pendingOrders: number;
  totalProductsSold: number;
}
