import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const accessToken = authService.getAccessToken();
  const authorizedRequest = accessToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : req;

  return next(authorizedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && authService.getRefreshToken()) {
        return authService.refreshToken().pipe(
          switchMap(newToken => {
            if (!newToken) {
              router.navigate(['/auth/login']);
              return throwError(() => error);
            }
            const retriedRequest = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
            return next(retriedRequest);
          })
        );
      }
      if (error.status === 401) {
        notificationService.error('Session expired');
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};
