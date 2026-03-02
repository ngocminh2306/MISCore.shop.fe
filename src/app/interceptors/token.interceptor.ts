import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, filter, take, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if this is an internal auth request to avoid adding tokens and infinite loops
    const isInternalAuthRequest = this.isInternalAuthRequest(req);

    // Add token header if not an internal auth request and if token exists
    let authReq = req;
    if (!isInternalAuthRequest) {
      const token = this.authService.getToken();
      if (token && this.requiresAuthentication(req)) {
        authReq = this.addTokenHeader(req, token);
      }
    }

    return next.handle(authReq).pipe(
      catchError(error => {
        // Handle 401 Unauthorized errors only for non-internal auth requests
        if (!isInternalAuthRequest && error instanceof HttpErrorResponse && error.status === 401) {
          // Don't try to refresh the token if this is already a refresh request
          if (req.url.includes('/Account/refresh')) {
            this.authService.logout();
            return throwError(() => error);
          }

          // Check if token has expired
          if (this.isTokenExpired()) {
            return this.handle401Error(req, next);
          } else {
            // Token might be invalid but not expired
            this.authService.logout();
            return throwError(() => error);
          }
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private isInternalAuthRequest(req: HttpRequest<any>): boolean {
    // URLs that are used internally by the auth service that shouldn't add authentication headers
    const internalAuthUrls = [
      '/api/Account/login',
      '/api/Account/register',
      '/api/Account/refresh-token',
      '/api/Account/refresh', // Alternative refresh endpoint
      '/api/Account/revoke-token',
      '/api/Account/logout',
      // '/api/Account/me' // User info endpoint might also be called internally
    ];

    return internalAuthUrls.some(url => req.url.includes(url));
  }

  private requiresAuthentication(req: HttpRequest<any>): boolean {
    // Define paths that don't require authentication
    const publicPaths = [
      '/api/Account/login',
      '/api/Account/register',
      '/api/Account/refresh-token',
      '/api/Account/refresh',
      '/api/Account/revoke-token',
      '/api/Account/logout',
      '/api/public/',
      '/assets/',
      '/favicon.ico'
    ];

    return !publicPaths.some(path => req.url.includes(path));
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private isTokenExpired(): boolean {
    const token = this.authService.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((refreshResult) => {
          this.isRefreshing = false;

          // If refreshResult is null, it means no refresh token was available
          if (refreshResult === null) {
            // No refresh token available, treat as unauthenticated and return original request
            this.authService.clearAuthData(); // Clear any stored auth data if invalid
            return next.handle(request);  // Continue with original request
          }

          const newToken = this.authService.getToken();
          if (newToken) {
            this.refreshTokenSubject.next(newToken);
            return next.handle(this.addTokenHeader(request, newToken));
          } else {
            // If no new token is retrieved after refresh, log out
            this.authService.logout();
            return throwError(() => new Error('Token refresh failed'));
          }
        }),
        catchError(error => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => error);
        })
      );
    } else {
      // Wait for the refresh to complete
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(() => {
          const token = this.authService.getToken();
          if (token) {
            return next.handle(this.addTokenHeader(request, token));
          } else {
            // If no token is available, return the original error
            return throwError(() => new Error('Token not available after refresh'));
          }
        })
      );
    }
  }
}