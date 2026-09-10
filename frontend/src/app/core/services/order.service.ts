import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints.constants';
import { ApiResponse } from '../models/api-response.model';
import { CreateOrderPayload, Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);

  createOrder(payload: CreateOrderPayload): Observable<Order> {
    return this.http.post<ApiResponse<Order>>(API_ENDPOINTS.orders, payload).pipe(
      map(response => this.unwrap(response))
    );
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<ApiResponse<Order[]>>(API_ENDPOINTS.orders).pipe(
      map(response => this.unwrap(response))
    );
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<ApiResponse<Order>>(API_ENDPOINTS.order(id)).pipe(
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
