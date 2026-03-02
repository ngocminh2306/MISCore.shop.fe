import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  currentUser$: Observable<User | null>;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = toObservable(this.authService.currentUser$);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user: User | null) => {
        // Check if user is authenticated and has admin role
        if (user && user.roles.includes('Admin')) {
          return true;
        } else {
          // Redirect to home if not admin
          this.router.navigate(['/']);
          return false;
        }
      }),
      catchError(() => {
        // If there's an error, redirect to home
        this.router.navigate(['/']);
        return of(false);
      })
    );
  }
}