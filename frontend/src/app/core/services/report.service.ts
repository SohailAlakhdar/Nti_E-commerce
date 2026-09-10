import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints.constants';
import { ApiResponse } from '../models/api-response.model';
import { CategoryReport, ReportOverview, SalesByPeriod, TopProductReport } from '../models/content.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);

  getOverview(): Observable<ReportOverview> {
    return this.http.get<ApiResponse<ReportOverview>>(API_ENDPOINTS.admin.reportsOverview).pipe(
      map(response => this.unwrap(response))
    );
  }

  getSales(): Observable<SalesByPeriod[]> {
    return this.http.get<ApiResponse<SalesByPeriod[]>>(API_ENDPOINTS.admin.reportsSales).pipe(
      map(response => this.unwrap(response))
    );
  }

  getTopProducts(): Observable<TopProductReport[]> {
    return this.http.get<ApiResponse<TopProductReport[]>>(API_ENDPOINTS.admin.reportsTopProducts).pipe(
      map(response => this.unwrap(response))
    );
  }

  getCategoryBreakdown(): Observable<CategoryReport[]> {
    return this.http.get<ApiResponse<CategoryReport[]>>(API_ENDPOINTS.admin.reportsCategories).pipe(
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
