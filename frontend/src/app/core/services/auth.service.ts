import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints.constants';
import { ACCESS_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '../constants/app.constants';
import { ApiResponse } from '../models/api-response.model';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = signal<boolean>(!!this.getAccessToken());

  login(payload: LoginPayload): Observable<User> {
    return this.http.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.auth.login, payload).pipe(
      map(response => this.handleAuthSuccess(response))
    );
  }

  register(payload: RegisterPayload): Observable<User> {
    return this.http.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.auth.register, payload).pipe(
      map(response => this.handleAuthSuccess(response))
    );
  }

  refreshToken(): Observable<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return of(null);
    }
    return this.http.post<ApiResponse<{ accessToken: string }>>(API_ENDPOINTS.auth.refresh, { refreshToken }).pipe(
      map(response => {
        if (response.success) {
          localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, response.data.accessToken);
          return response.data.accessToken;
        }
        return null;
      }),
      catchError(() => {
        this.clearSession();
        return of(null);
      })
    );
  }

  loadCurrentUser(): Observable<User | null> {
    if (!this.getAccessToken()) {
      return of(null);
    }
    return this.http.get<ApiResponse<User>>(API_ENDPOINTS.auth.me).pipe(
      map(response => {
        if (response.success) {
          this.currentUser.set(response.data);
          this.isAuthenticated.set(true);
          return response.data;
        }
        return null;
      }),
      catchError(() => {
        this.clearSession();
        return of(null);
      })
    );
  }

  logout(): void {
    this.http.post(API_ENDPOINTS.auth.logout, {}).subscribe({
      complete: () => this.clearSession(),
      error: () => this.clearSession()
    });
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }

  private handleAuthSuccess(response: ApiResponse<AuthResponse>): User {
    if (!response.success) {
      throw new Error(response.message);
    }
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, response.data.tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, response.data.tokens.refreshToken);
    this.currentUser.set(response.data.user);
    this.isAuthenticated.set(true);
    return response.data.user;
  }

  private clearSession(): void {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }
}
