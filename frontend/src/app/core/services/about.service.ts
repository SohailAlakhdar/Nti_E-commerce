import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints.constants';
import { ApiResponse } from '../models/api-response.model';
import { AboutContent } from '../models/content.model';

@Injectable({
  providedIn: 'root'
})
export class AboutService {
  private http = inject(HttpClient);

  getAbout(): Observable<AboutContent> {
    return this.http.get<ApiResponse<AboutContent>>(API_ENDPOINTS.about).pipe(
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
