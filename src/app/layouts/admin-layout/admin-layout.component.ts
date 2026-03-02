import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, TranslatePipe],
  template: `
    <div class="min-h-screen bg-gray-100">
      <!-- Mobile sidebar toggle -->
      <div class="md:hidden">
        <div class="bg-gray-800 text-white p-4 flex items-center justify-between">
          <h1 class="text-xl font-bold">{{ 'Admin Panel' | translate }}</h1>
          <button
            (click)="toggleSidebar()"
            class="text-gray-300 hover:text-white focus:outline-none"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex">
        <!-- Sidebar Navigation -->
        <aside
          [class.transform]="!sidebarOpen"
          [class.-translate-x-full]="!sidebarOpen"
          [class.translate-x-0]="sidebarOpen"
          class="fixed inset-y-0 left-0 z-30 bg-gray-800 w-64 overflow-y-auto transition duration-300 ease-in-out md:translate-x-0 md:static md:z-auto min-h-screen"
        >
          <!-- Logo -->
          <div class="flex items-center justify-center h-16 px-4 bg-gray-900">
            <h1 class="text-xl font-bold text-white">{{ 'Admin Panel' | translate }}</h1>
          </div>

          <!-- Navigation Menu -->
          <nav class="mt-5 px-2">
            <div class="space-y-1">
              <a
                [routerLink]="['/admin/dashboard']"
                routerLinkActive="bg-gray-900 text-white"
                [routerLinkActiveOptions]="{exact: true}"
                class="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-base font-medium rounded-md"
              >
                <svg class="text-gray-400 group-hover:text-gray-300 mr-4 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {{ 'Dashboard' | translate }}
              </a>
            </div>

            <!-- User Management Section -->
            <div class="mt-8">
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">{{ 'User Management' | translate }}</h3>
              <div class="space-y-1 mt-1">
                <a
                  [routerLink]="['/admin/users']"
                  routerLinkActive="bg-gray-900 text-white"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-4 py-2 text-sm font-medium rounded-md"
                >
                  <svg class="text-gray-400 group-hover:text-gray-300 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {{ 'Users' | translate }}
                </a>

                <a
                  [routerLink]="['/admin/sellers']"
                  routerLinkActive="bg-gray-900 text-white"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-4 py-2 text-sm font-medium rounded-md"
                >
                  <svg class="text-gray-400 group-hover:text-gray-300 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {{ 'Sellers' | translate }}
                </a>
              </div>
            </div>

            <!-- Product Management Section -->
            <div class="mt-8">
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">{{ 'Product Management' | translate }}</h3>
              <div class="space-y-1 mt-1">
                <a
                  [routerLink]="['/admin/products']"
                  routerLinkActive="bg-gray-900 text-white"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-4 py-2 text-sm font-medium rounded-md"
                >
                  <svg class="text-gray-400 group-hover:text-gray-300 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  {{ 'Products' | translate }}
                </a>

                <a
                  [routerLink]="['/admin/categories']"
                  routerLinkActive="bg-gray-900 text-white"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-4 py-2 text-sm font-medium rounded-md"
                >
                  <svg class="text-gray-400 group-hover:text-gray-300 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  {{ 'Categories' | translate }}
                </a>

                <a
                  [routerLink]="['/admin/brands']"
                  routerLinkActive="bg-gray-900 text-white"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-4 py-2 text-sm font-medium rounded-md"
                >
                  <svg class="text-gray-400 group-hover:text-gray-300 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                  {{ 'Brands' | translate }}
                </a>
              </div>
            </div>

            <!-- Content Management Section -->
            <div class="mt-8">
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">{{ 'Content Management' | translate }}</h3>
              <div class="space-y-1 mt-1">
                <a
                  [routerLink]="['/admin/articles']"
                  routerLinkActive="bg-gray-900 text-white"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-4 py-2 text-sm font-medium rounded-md"
                >
                  <svg class="text-gray-400 group-hover:text-gray-300 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {{ 'Articles' | translate }}
                </a>

                <a
                  [routerLink]="['/admin/article-categories']"
                  routerLinkActive="bg-gray-900 text-white"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-4 py-2 text-sm font-medium rounded-md"
                >
                  <svg class="text-gray-400 group-hover:text-gray-300 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  {{ 'Article Categories' | translate }}
                </a>

                <a
                  [routerLink]="['/admin/article-authors']"
                  routerLinkActive="bg-gray-900 text-white"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-4 py-2 text-sm font-medium rounded-md"
                >
                  <svg class="text-gray-400 group-hover:text-gray-300 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {{ 'Article Authors' | translate }}
                </a>
              </div>
            </div>

            <!-- Commerce Management Section -->
            <div class="mt-8">
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">{{ 'Commerce Management' | translate }}</h3>
              <div class="space-y-1 mt-1">
                <a
                  [routerLink]="['/admin/orders']"
                  routerLinkActive="bg-gray-900 text-white"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-4 py-2 text-sm font-medium rounded-md"
                >
                  <svg class="text-gray-400 group-hover:text-gray-300 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {{ 'Orders' | translate }}
                </a>

                <a
                  [routerLink]="['/admin/banners']"
                  routerLinkActive="bg-gray-900 text-white"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-4 py-2 text-sm font-medium rounded-md"
                >
                  <svg class="text-gray-400 group-hover:text-gray-300 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {{ 'Banners' | translate }}
                </a>
              </div>
            </div>
          </nav>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col">
          <!-- Top Navigation Bar -->
          <header class="bg-white shadow-sm">
            <div class="flex items-center justify-between px-4 py-3 sm:px-6">
              <div class="flex items-center">
                <button
                  (click)="toggleSidebar()"
                  class="md:hidden text-gray-500 hover:text-gray-600 mr-2"
                >
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 class="text-lg font-semibold text-gray-900">
                  {{ getPageTitle() | translate }}
                </h1>
              </div>

              <!-- Language selector -->
              <div class="flex items-center space-x-4">
                <div class="flex items-center">
                  <label for="language-select" class="mr-2 text-sm text-gray-700">{{ 'Language' | translate }}:</label>
                  <select
                    id="language-select"
                    class="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    (change)="onLanguageChange($event)"
                    [value]="currentLanguage">
                    <option value="en">English</option>
                    <option value="vi">Tiếng Việt</option>
                  </select>
                </div>

                <!-- User Profile Dropdown -->
                <div class="ml-3 relative">
                  <div class="flex items-center space-x-3">

                    <a
                      [routerLink]="['/']"
                      class="text-sm font-medium text-gray-700 hover:text-gray-900 mr-4"
                    >
                      ← {{ 'Back to Shop' | translate }}
                    </a>

                    <div>
                      <p class="text-sm font-medium text-gray-700">{{ user?.firstName }} {{ user?.lastName }}</p>
                      <p class="text-xs text-gray-500">{{ 'Admin' | translate }}</p>
                    </div>
                    <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span class="text-sm font-medium text-indigo-800">{{ user?.firstName?.charAt(0) }}{{ user?.lastName?.charAt(0) }}</span>
                    </div>
                    <button
                      (click)="logout()"
                      class="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                    >
                      {{ 'Logout' | translate }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <!-- Page Content -->
          <main class="flex-1 pb-8 admin-layout-content">
            <router-outlet />
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    aside {
      height: calc(100vh - 64px);
    }

    .admin-layout-content {
      max-height: calc(100vh - 64px);
      overflow-y: auto;
    }

    @media (min-width: 768px) {
      aside {
        display: block !important;
      }
    }
  `]
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  sidebarOpen = false;
  user: User | null = null;
  languageService = inject(LanguageService);
  private languageSubscription?: Subscription;
  private platformId = inject(PLATFORM_ID);

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    // Subscribe to language changes to update UI when language changes
    this.languageSubscription = this.languageService.language$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.authService.logout();
  }

  get currentLanguage() {
    return this.languageService.getCurrentLanguage();
  }

  onLanguageChange(event: any): void {
    const selectedLanguage = event.target.value;
    this.languageService.switchLanguage(selectedLanguage);
  }

  getPageTitle(): string {
    if (isPlatformBrowser(this.platformId)) {
    const url = window.location.pathname;
      if (url.includes('/admin/dashboard')) return 'Dashboard';
      if (url.includes('/admin/products')) return 'Products';
      if (url.includes('/admin/categories')) return 'Categories';
      if (url.includes('/admin/brands')) return 'Brands';
      if (url.includes('/admin/banners')) return 'Banners';
      if (url.includes('/admin/orders')) return 'Orders';
      if (url.includes('/admin/users')) return 'Users';
      if (url.includes('/admin/sellers')) return 'Sellers';
      if (url.includes('/admin/roles')) return 'Roles';
      if (url.includes('/admin/articles')) return 'Articles';
      if (url.includes('/admin/article-categories')) return 'Article Categories';
      if (url.includes('/admin/article-authors')) return 'Article Authors';
      if (url.includes('/admin/products/new') || url.includes('/admin/products/edit')) return 'Product Details';
      if (url.includes('/admin/categories/new') || url.includes('/admin/categories/edit')) return 'Category Details';
      if (url.includes('/admin/brands/new') || url.includes('/admin/brands/edit')) return 'Brand Details';
    }
    return 'Admin Panel';
  }
}