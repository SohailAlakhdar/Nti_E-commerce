import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints.constants';
import { GUEST_CART_STORAGE_KEY } from '../constants/app.constants';
import { ApiResponse } from '../models/api-response.model';
import { AddCartItemPayload, Cart, UpdateCartItemPayload } from '../models/cart.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  readonly cart = signal<Cart | null>(null);
  readonly itemCount = computed(() => this.cart()?.itemCount ?? 0);

  loadCart(): Observable<Cart> {
    return this.http.get<ApiResponse<Cart>>(API_ENDPOINTS.cart, { headers: this.buildHeaders() }).pipe(
      map(response => this.unwrap(response)),
      tap(cart => this.applyCart(cart))
    );
  }

  addItem(payload: AddCartItemPayload): Observable<Cart> {
    return this.http.post<ApiResponse<Cart>>(API_ENDPOINTS.cartItems, payload, { headers: this.buildHeaders() }).pipe(
      map(response => this.unwrap(response)),
      tap(cart => this.applyCart(cart))
    );
  }

  updateItem(itemId: string, payload: UpdateCartItemPayload): Observable<Cart> {
    return this.http.patch<ApiResponse<Cart>>(API_ENDPOINTS.cartItem(itemId), payload, { headers: this.buildHeaders() }).pipe(
      map(response => this.unwrap(response)),
      tap(cart => this.cart.set(cart))
    );
  }

  removeItem(itemId: string): Observable<Cart> {
    return this.http.delete<ApiResponse<Cart>>(API_ENDPOINTS.cartItem(itemId), { headers: this.buildHeaders() }).pipe(
      map(response => this.unwrap(response)),
      tap(cart => this.cart.set(cart))
    );
  }

  clearCart(): Observable<Cart> {
    return this.http.delete<ApiResponse<Cart>>(API_ENDPOINTS.cart, { headers: this.buildHeaders() }).pipe(
      map(response => this.unwrap(response)),
      tap(cart => this.cart.set(cart))
    );
  }

  storeGuestCartId(id: string): void {
    localStorage.setItem(GUEST_CART_STORAGE_KEY, id);
  }

  private applyCart(cart: Cart): void {
    this.cart.set(cart);
    if (!this.authService.isAuthenticated() && cart.id) {
      this.storeGuestCartId(cart.id);
    }
  }

  private buildHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (!this.authService.isAuthenticated()) {
      const guestCartId = localStorage.getItem(GUEST_CART_STORAGE_KEY);
      if (guestCartId) {
        headers = headers.set('X-Guest-Cart-Id', guestCartId);
      }
    }
    return headers;
  }

  private unwrap<T>(response: ApiResponse<T>): T {
    if (!response.success) {
      throw new Error(response.message);
    }
    return response.data;
  }
}
