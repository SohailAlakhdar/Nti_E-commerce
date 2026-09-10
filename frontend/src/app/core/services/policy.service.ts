import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints.constants';
import { ApiResponse } from '../models/api-response.model';
import { Policy } from '../models/content.model';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private http = inject(HttpClient);

  getPolicies(): Observable<Policy> {
    return this.http.get<ApiResponse<Policy>>(API_ENDPOINTS.policies).pipe(
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
