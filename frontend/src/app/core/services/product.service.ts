import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints.constants';
import { ApiResponse, Pagination, ProductQueryParams } from '../models/api-response.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  getProducts(query: ProductQueryParams): Observable<Pagination<Product>> {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<ApiResponse<Pagination<Product>>>(API_ENDPOINTS.products, { params }).pipe(
      map(response => this.unwrap(response))
    );
  }

  getProductBySlug(slug: string): Observable<Product> {
    return this.http.get<ApiResponse<Product>>(API_ENDPOINTS.productBySlug(slug)).pipe(
      map(response => this.unwrap(response))
    );
  }

  getNewArrivals(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(API_ENDPOINTS.home.newArrivals).pipe(
      map(response => this.unwrap(response))
    );
  }

  getTopSales(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(API_ENDPOINTS.home.topSales).pipe(
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
