import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints.constants';
import { ApiResponse } from '../models/api-response.model';
import { Testimonial, TestimonialPayload } from '../models/content.model';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  private http = inject(HttpClient);

  getApprovedTestimonials(): Observable<Testimonial[]> {
    return this.http.get<ApiResponse<Testimonial[]>>(API_ENDPOINTS.testimonials).pipe(
      map(response => this.unwrap(response))
    );
  }

  submitTestimonial(payload: TestimonialPayload): Observable<Testimonial> {
    return this.http.post<ApiResponse<Testimonial>>(API_ENDPOINTS.testimonials, payload).pipe(
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
