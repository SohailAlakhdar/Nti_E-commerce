import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints.constants';
import { ApiResponse, Pagination, ProductQueryParams } from '../models/api-response.model';
import { OrderStatus } from '../models/enums';
import { Order } from '../models/order.model';
import { Product, ProductPayload } from '../models/product.model';
import { Testimonial } from '../models/content.model';
import { ShippingPolicy, Policy, AboutContent } from '../models/content.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);

  getProducts(query: ProductQueryParams): Observable<Pagination<Product>> {
    return this.http.get<ApiResponse<Pagination<Product>>>(API_ENDPOINTS.admin.products, { params: query as any }).pipe(
      map(response => this.unwrap(response))
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<ApiResponse<Product>>(API_ENDPOINTS.admin.product(id)).pipe(
      map(response => this.unwrap(response))
    );
  }

  createProduct(payload: ProductPayload): Observable<Product> {
    return this.http.post<ApiResponse<Product>>(API_ENDPOINTS.admin.products, payload).pipe(
      map(response => this.unwrap(response))
    );
  }

  updateProduct(id: string, payload: Partial<ProductPayload>): Observable<Product> {
    return this.http.patch<ApiResponse<Product>>(API_ENDPOINTS.admin.product(id), payload).pipe(
      map(response => this.unwrap(response))
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(API_ENDPOINTS.admin.product(id)).pipe(
      map(response => this.unwrap(response))
    );
  }

  uploadProductImages(id: string, files: File[]): Observable<Product> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return this.http.post<ApiResponse<Product>>(API_ENDPOINTS.admin.productImages(id), formData).pipe(
      map(response => this.unwrap(response))
    );
  }

  deleteProductImage(id: string, imageUrl: string): Observable<Product> {
    return this.http.delete<ApiResponse<Product>>(API_ENDPOINTS.admin.productImages(id), { body: { imageUrl } }).pipe(
      map(response => this.unwrap(response))
    );
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<ApiResponse<Order[]>>(API_ENDPOINTS.admin.orders).pipe(
      map(response => this.unwrap(response))
    );
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<ApiResponse<Order>>(API_ENDPOINTS.admin.order(id)).pipe(
      map(response => this.unwrap(response))
    );
  }

  updateOrderStatus(id: string, status: OrderStatus): Observable<Order> {
    return this.http.patch<ApiResponse<Order>>(API_ENDPOINTS.admin.orderStatus(id), { status }).pipe(
      map(response => this.unwrap(response))
    );
  }

  getTestimonials(): Observable<Testimonial[]> {
    return this.http.get<ApiResponse<Testimonial[]>>(API_ENDPOINTS.admin.testimonials).pipe(
      map(response => this.unwrap(response))
    );
  }

  approveTestimonial(id: string): Observable<Testimonial> {
    return this.http.patch<ApiResponse<Testimonial>>(API_ENDPOINTS.admin.testimonialApprove(id), {}).pipe(
      map(response => this.unwrap(response))
    );
  }

  deleteTestimonial(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(API_ENDPOINTS.admin.testimonial(id)).pipe(
      map(response => this.unwrap(response))
    );
  }

  updateShippingPolicy(payload: Partial<ShippingPolicy>): Observable<ShippingPolicy> {
    return this.http.patch<ApiResponse<ShippingPolicy>>(API_ENDPOINTS.admin.shipping, payload).pipe(
      map(response => this.unwrap(response))
    );
  }

  updatePolicies(payload: Partial<Policy>): Observable<Policy> {
    return this.http.patch<ApiResponse<Policy>>(API_ENDPOINTS.admin.policies, payload).pipe(
      map(response => this.unwrap(response))
    );
  }

  updateAbout(payload: Partial<AboutContent>): Observable<AboutContent> {
    return this.http.patch<ApiResponse<AboutContent>>(API_ENDPOINTS.admin.about, payload).pipe(
      map(response => this.unwrap(response))
    );
  }

  private unwrap<T>(response: ApiResponse<T>): T {
    if (!response.success) {
      throw new Error(response.message);
    }
    return response.data;
  }
}
