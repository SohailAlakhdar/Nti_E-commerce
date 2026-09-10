import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints.constants';
import { ApiResponse } from '../models/api-response.model';
import { ShippingPolicy } from '../models/content.model';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  private http = inject(HttpClient);

  getShippingPolicy(): Observable<ShippingPolicy> {
    return this.http.get<ApiResponse<ShippingPolicy>>(API_ENDPOINTS.shipping).pipe(
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
