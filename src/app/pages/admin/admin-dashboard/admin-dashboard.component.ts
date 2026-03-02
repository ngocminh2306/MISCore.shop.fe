import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe, AsyncPipe } from '@angular/common';
import { DashboardService } from '../../../../public-api/api/dashboard.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, DecimalPipe, TranslatePipe],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">{{ 'Admin Dashboard' | translate }}</h1>
        <p class="mt-2 text-gray-600">{{ 'Manage your store\'s products, categories, brands, and banners' | translate }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Products Card -->
        <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">{{ 'Products' | translate }}</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ 'Manage' | translate }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <a [routerLink]="['/admin/products']" class="font-medium text-indigo-600 hover:text-indigo-900"> {{ 'Manage products &rarr;' | translate }}</a>
            </div>
          </div>
        </div>

        <!-- Categories Card -->
        <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">{{ 'Categories' | translate }}</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ 'Manage' | translate }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <a [routerLink]="['/admin/categories']" class="font-medium text-indigo-600 hover:text-indigo-900"> {{ 'Manage categories &rarr;' | translate }}</a>
            </div>
          </div>
        </div>

        <!-- Brands Card -->
        <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">{{ 'Brands' | translate }}</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ 'Manage' | translate }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <a [routerLink]="['/admin/brands']" class="font-medium text-indigo-600 hover:text-indigo-900"> {{ 'Manage brands &rarr;' | translate }}</a>
            </div>
          </div>
        </div>

        <!-- Banners Card -->
        <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">{{ 'Banners' | translate }}</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ 'Manage' | translate }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <a [routerLink]="['/admin/banners']" class="font-medium text-indigo-600 hover:text-indigo-900"> {{ 'Manage banners &rarr;' | translate }}</a>
            </div>
          </div>
        </div>

        <!-- Orders Card -->
        <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">{{ 'Orders' | translate }}</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ 'Manage' | translate }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <a [routerLink]="['/admin/orders']" class="font-medium text-indigo-600 hover:text-indigo-900"> {{ 'Manage orders &rarr;' | translate }}</a>
            </div>
          </div>
        </div>

        <!-- Users Card -->
        <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-red-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">{{ 'Users' | translate }}</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ 'Manage' | translate }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <a [routerLink]="['/admin/users']" class="font-medium text-indigo-600 hover:text-indigo-900"> {{ 'Manage users &rarr;' | translate }}</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats using real API data -->
      <div class="mt-8 bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">{{ 'Quick Stats' | translate }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="border border-gray-200 rounded-lg p-4 text-center">
            <p class="text-3xl font-bold text-indigo-600">{{ stats().totalProducts | number }}</p>
            <p class="text-gray-600">{{ 'Total Products' | translate }}</p>
          </div>
          <div class="border border-gray-200 rounded-lg p-4 text-center">
            <p class="text-3xl font-bold text-green-600">{{ stats().totalCategories | number }}</p>
            <p class="text-gray-600">{{ 'Categories' | translate }}</p>
          </div>
          <div class="border border-gray-200 rounded-lg p-4 text-center">
            <p class="text-3xl font-bold text-blue-600">{{ stats().totalBrands | number }}</p>
            <p class="text-gray-600">{{ 'Brands' | translate }}</p>
          </div>
          <div class="border border-gray-200 rounded-lg p-4 text-center">
            <p class="text-3xl font-bold text-yellow-600">{{ stats().activeBanners | number }}</p>
            <p class="text-gray-600">{{ 'Active Banners' | translate }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #f9fafb;
      min-height: calc(100vh - 200px);
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  languageService = inject(LanguageService);

  stats = signal<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalBrands: 0,
    activeBanners: 0
  });

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  private loadDashboardStats(): void {
    // Using the real API from public-api to get dashboard statistics
    this.dashboardService.apiDashboardGet().subscribe({
      next: (response: any) => {
        // Process the response and update stats
        this.stats.update(prev => ({
          ...prev,
          totalProducts: response?.data.totalProducts || 0,
          totalCategories: response?.data.categoryCount || 0,
          totalBrands: response?.data.totalBrands || 0,
          activeBanners: response?.data.bannerCount || 0
        }));
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        // Handle error gracefully - show user-friendly message or defaults
        this.stats.update(prev => ({
          ...prev,
          totalProducts: 0,
          totalCategories: 0,
          totalBrands: 0,
          activeBanners: 0
        }));
      }
    });
  }
}

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalBrands: number;
  activeBanners: number;
}

interface DashboardData {
  productCount: number;
  categoryCount: number;
  brandCount: number;
  bannerCount: number;
}