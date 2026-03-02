import { Injectable, signal, inject } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { User } from '../models/user';
import { AccountService } from '../../public-api/api/account.service';
import { LoginDto } from '../../public-api/model/loginDto';
import { RegisterDto } from '../../public-api/model/registerDto';
import { UserInfoDto } from '../../public-api/model/userInfoDto';
import { RefreshTokenRequestDto } from '../../public-api/model/refreshTokenRequestDto';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  private isLoggedInSignal = signal(false);
  private isLoadingSignal = signal(true); // Initially loading state is true
  private platformId = inject(PLATFORM_ID);

  currentUser$ = this.currentUserSignal.asReadonly();
  isLoggedIn$ = this.isLoggedInSignal.asReadonly();
  isLoading$ = this.isLoadingSignal.asReadonly();

  constructor(
    private accountService: AccountService
  ) {
    // Initialize from localStorage if available and if in browser
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      const storedToken = localStorage.getItem('authToken');

      if (storedUser && storedToken) {
        try {
          const user = JSON.parse(storedUser) as User;
          this.currentUserSignal.set(user);
          this.isLoggedInSignal.set(true);
        } catch (e) {
          console.error('Error parsing stored user from localStorage', e);
        }
      } else if(storedToken) {
          this.isLoggedInSignal.set(true);
      }
    }

    // Set loading to false after initialization
    setTimeout(() => {
      this.isLoadingSignal.set(false);
    }, 0);
  }

  /**
   * Get the authentication token
   */
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  /**
   * Store the authentication token
   */
  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('authToken', token);
    }
  }

  /**
   * Remove the authentication token
   */
  private removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
    }
  }

  /**
   * Remove all authentication data
   */
  public clearAuthData(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
    }
    this.currentUserSignal.set(null);
    this.isLoggedInSignal.set(false);
  }

  login(credentials: LoginRequest): Observable<{ message: string; userId: string; email: string; userName: string }> {
    const loginDto: LoginDto = {
      email: credentials.email,
      password: credentials.password,
      rememberMe: credentials.rememberMe
    };

    return this.accountService.apiAccountLoginPost(loginDto).pipe(
      tap(() => this.isLoadingSignal.set(true)),
      catchError(error => {
        console.error('Login API error', error);
        return throwError(() => error);
      }),
      switchMap((response: any) => {
        if (response && response.token) {
          // Store the authentication token
          this.setToken(response.token);
          // Store the refresh token if provided
          if (response.refreshToken) {
            this.setRefreshToken(response.refreshToken);
          }
        }

        // After successful login, get user info
        return this.loadCurrentUser();
      }),
      tap(() => this.isLoadingSignal.set(false))
    );
  }
  loadCurrentUser(): Observable<{ message: string; userId: string; email: string; userName: string }> {
    return this.accountService.apiAccountMeGet().pipe(
      tap(() => this.isLoadingSignal.set(true)),
      map((userInfo: UserInfoDto) => {
        const user: User = {
          id: userInfo.id || '0',
          email: userInfo.email || '',
          firstName: userInfo.firstName || '',
          lastName: userInfo.lastName || '',
          userName: userInfo.userName || '',
          profilePictureUrl: userInfo.profilePictureUrl || undefined,
          dateOfBirth: userInfo.dateOfBirth ? new Date(userInfo.dateOfBirth) : undefined,
          gender: userInfo.gender || undefined,
          isActive: userInfo.isActive || false,
          lastLoginAt: userInfo.lastLoginAt ? new Date(userInfo.lastLoginAt) : null,
          createdAt: userInfo.createdAt ? new Date(userInfo.createdAt) : new Date(),
          roles: userInfo.roles || []
        };

        this.currentUserSignal.set(user);
        this.isLoggedInSignal.set(true);

        // Store user info in localStorage if in browser
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }

        return {
          message: 'Login successful',
          userId: user.id,
          email: user.email,
          userName: `${user.firstName} ${user.lastName}`
        };
      }),
      tap(() => this.isLoadingSignal.set(false)),
      catchError(error => {
        console.error('Error getting user info after login', error);
        this.isLoadingSignal.set(false);
        return throwError(() => error);
      }));
  }
  register(userData: RegisterRequest): Observable<{ message: string; userId: string }> {
    const registerDto: RegisterDto = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.password // Assuming password confirmation is the same
    };

    return this.accountService.apiAccountRegisterPost(registerDto).pipe(
      map((response: any) => {
        // If registration response includes tokens (which might happen in some implementations)
        if (response && response.token) {
          this.setToken(response.token);
          if (response.refreshToken) {
            this.setRefreshToken(response.refreshToken);
          }
        }
        return {
          message: 'Registration successful',
          userId: 'registered' // The API should return the actual userId
        };
      }),
      catchError(error => {
        console.error('Registration error', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.isLoadingSignal.set(true);
    // Prepare request to revoke refresh token
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      const revokeTokenDto = {
        token: refreshToken // Using the refresh token to revoke it
      };

      // Call the revoke token API before clearing local data
      this.accountService.apiAccountRevokeTokenPost(revokeTokenDto).subscribe({
        error: (error) => {
          console.error('Revoke token API error', error);
          // Even if the revoke API fails, clear local data
          this.clearAuthData();
          this.isLoadingSignal.set(false);
        },
        complete: () => {
          // Clean up user data after successfully revoking tokens
          this.clearAuthData();
          this.isLoadingSignal.set(false);
        }
      });
    } else {
      // If no refresh token, just call logout API and clear data
      this.accountService.apiAccountLogoutPost().subscribe({
        error: (error) => {
          console.error('Logout API error', error);
          // Even if logout API fails, clear local data
          this.clearAuthData();
          this.isLoadingSignal.set(false);
        },
        complete: () => {
          // Clean up user data regardless of API success
          this.clearAuthData();
          this.isLoadingSignal.set(false);
        }
      });
    }
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSignal();
  }

  getUser(): User | null {
    return this.currentUserSignal();
  }


  /**
   * Get the refresh token
   */
  getRefreshToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }

  /**
   * Store the refresh token
   */
  private setRefreshToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('refreshToken', token);
    }
  }

  /**
   * Refresh the authentication token using the refresh token
   */
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      // Return observable that completes with no emission when no refresh token is available
      return of(null);
    }

    const refreshTokenDto: RefreshTokenRequestDto = {
      refreshToken: refreshToken,
      token: this.getToken() || 'token-not-available'
    };
    return this.accountService.apiAccountRefreshTokenPost(refreshTokenDto).pipe(
      tap(() => this.isLoadingSignal.set(true)),
      tap((response: any) => {
        if (response && response.token) {
          // Store the new tokens
          this.setToken(response.token);
          if (response.refreshToken) {
            this.setRefreshToken(response.refreshToken);
          }
        }
      }),
      tap(() => this.isLoadingSignal.set(false)),
      catchError(error => {
        console.error('Token refresh failed', error);
        this.isLoadingSignal.set(false);
        // If refresh fails, clear auth data
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  /**
   * Check if the token is expired
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Check if user is authenticated and token is still valid
   */
  isAuthenticatedAndValid(): boolean {
    return this.isAuthenticated() && !this.isTokenExpired();
  }
}