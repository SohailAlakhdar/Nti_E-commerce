import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints.constants';
import { ApiResponse } from '../models/api-response.model';
import { Address, AddressPayload } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private http = inject(HttpClient);

  getAddresses(): Observable<Address[]> {
    return this.http.get<ApiResponse<Address[]>>(API_ENDPOINTS.addresses).pipe(
      map(response => this.unwrap(response))
    );
  }

  createAddress(payload: AddressPayload): Observable<Address> {
    return this.http.post<ApiResponse<Address>>(API_ENDPOINTS.addresses, payload).pipe(
      map(response => this.unwrap(response))
    );
  }

  updateAddress(id: string, payload: AddressPayload): Observable<Address> {
    return this.http.patch<ApiResponse<Address>>(API_ENDPOINTS.address(id), payload).pipe(
      map(response => this.unwrap(response))
    );
  }

  deleteAddress(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(API_ENDPOINTS.address(id)).pipe(
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
