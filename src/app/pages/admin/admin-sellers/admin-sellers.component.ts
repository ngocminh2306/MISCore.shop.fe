import { Component, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SellerService } from '../../../../public-api/api/seller.service';
import { ProductService } from '../../../../public-api/api/product.service';
import { AccountManagementService } from '../../../../public-api/api/accountManagement.service';
import { SellerDto } from '../../../../public-api/model/sellerDto';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-admin-sellers',
  standalone: true,
  imports: [FormsModule, DatePipe, TranslatePipe],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">{{ 'Admin Sellers' | translate }}</h1>
        <div class="mt-4 flex justify-between items-center">
          <p class="text-gray-600">{{ 'View and manage seller accounts' | translate }}</p>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white shadow rounded-lg p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Search' | translate }}</label>
            <input
              type="text"
              id="search"
              [(ngModel)]="searchTerm"
              (keyup.enter)="loadSellers()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="{{ 'Search sellers...' | translate }}"
            >
          </div>
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Status' | translate }}</label>
            <select
              id="status"
              [(ngModel)]="statusFilter"
              (change)="loadSellers()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">{{ 'All Statuses' | translate }}</option>
              <option value="active">{{ 'Active' | translate }}</option>
              <option value="inactive">{{ 'Inactive' | translate }}</option>
              <option value="pending">{{ 'Pending' | translate }}</option>
              <option value="verified">{{ 'Verified' | translate }}</option>
            </select>
          </div>
          <div>
            <label for="createdAfter" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Created After' | translate }}</label>
            <input
              type="date"
              id="createdAfter"
              [(ngModel)]="createdAfter"
              (change)="loadSellers()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
          <div>
            <label for="createdBefore" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Created Before' | translate }}</label>
            <input
              type="date"
              id="createdBefore"
              [(ngModel)]="createdBefore"
              (change)="loadSellers()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
          <div class="flex items-end">
            <button (click)="applyFilters()" class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              {{ 'Apply Filters' | translate }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading indicator -->
      @if (loading()) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      }

      <!-- Sellers Table -->
      <div class="bg-white shadow overflow-hidden rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Seller' | translate }}</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Email' | translate }}</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Shop Name' | translate }}</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Status' | translate }}</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Verification' | translate }}</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Created Date' | translate }}</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Actions' | translate }}</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            @for (seller of sellers(); track seller.id) {
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      @if (seller.shopLogoUrl) {
                        <img [src]="seller.shopLogoUrl" [alt]="seller.shopName" class="h-10 w-10 rounded-full object-cover">
                      } @else {
                        <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span class="text-sm font-medium text-indigo-800">{{ seller.shopName?.charAt(0) }}{{ seller.shopName?.charAt(0) }}</span>
                        </div>
                      }
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ seller.shopName }}</div>
                      <div class="text-sm text-gray-500">{{ seller.shopName }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ seller.contactEmail }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ seller.shopName }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="'px-2 inline-flex text-xs leading-5 font-semibold rounded-full ' +
                    (seller.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')">
                    {{ seller.isActive ? ('Active' | translate) : ('Inactive' | translate) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="'px-2 inline-flex text-xs leading-5 font-semibold rounded-full ' +
                    (seller.isVerified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800')">
                    {{ seller.isVerified ? ('Verified' | translate) : ('Pending' | translate) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ seller.createdAt ? (seller.createdAt | date:'short') : ('N/A' | translate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button (click)="toggleSellerStatus(seller.id || 0, !seller.isActive)" class="mr-3"
                    [class]="seller.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'">
                    {{ seller.isActive ? ('Deactivate' | translate) : ('Activate' | translate) }}
                  </button>
                  @if (!seller.isVerified) {
                    <button (click)="verifySeller(seller.id || 0)" class="text-blue-600 hover:text-blue-900 mr-3">{{ 'Verify' | translate }}</button>
                  }
                  <button (click)="viewSellerDetails(seller.id || 0)" class="text-indigo-600 hover:text-indigo-900">{{ 'View' | translate }}</button>
                </td>
              </tr>
            }
            @empty {
              <tr>
                <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">
                  {{ 'No sellers found' | translate }}
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-b-lg">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            (click)="previousPage()"
            [disabled]="currentPage() === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            {{ 'Previous' | translate }}
          </button>
          <button
            (click)="nextPage()"
            [disabled]="currentPage() === totalPages()"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            {{ 'Next' | translate }}
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              {{ 'Showing' | translate }} <span class="font-medium">{{ (currentPage() - 1) * pageSize() + 1 }}</span>
              {{ 'to' | translate }} <span class="font-medium">{{ getCurrentPageEnd() }}</span>
              {{ 'of' | translate }} <span class="font-medium">{{ totalCount() }}</span> {{ 'results' | translate }}
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                (click)="previousPage()"
                [disabled]="currentPage() === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span class="sr-only">{{ 'Previous' | translate }}</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>

              @for (page of getPageNumbers(); track page) {
                <button
                  (click)="goToPage(page)"
                  [class]="'relative inline-flex items-center px-4 py-2 border text-sm font-medium ' +
                    (page === currentPage()
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50')"
                >
                  {{ page }}
                </button>
              }

              <button
                (click)="nextPage()"
                [disabled]="currentPage() === totalPages()"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span class="sr-only">{{ 'Next' | translate }}</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      <!-- Seller Details Modal -->
      @if (showDetailsModal()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div class="flex justify-between items-center p-6 border-b">
              <h3 class="text-lg font-semibold">Seller Details</h3>
              <button (click)="closeDetailsModal()" class="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="overflow-y-auto flex-grow p-6">
              @if (loadingDetails()) {
                <div class="flex justify-center items-center h-32">
                  <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              } @else {
                <!-- Seller Information -->
                @if (selectedSeller()) {
                  <div class="mb-6">
                    <div class="flex items-center mb-4">
                      <div class="flex-shrink-0 mr-4">
                        @if (selectedSeller()?.shopLogoUrl) {
                          <img [src]="selectedSeller()?.shopLogoUrl" [alt]="selectedSeller()?.shopName" class="h-16 w-16 rounded-full object-cover">
                        } @else {
                          <div class="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span class="text-lg font-medium text-indigo-800">{{ selectedSeller()?.shopName?.charAt(0) }}</span>
                          </div>
                        }
                      </div>
                      <div>
                        <h4 class="text-xl font-bold text-gray-900">{{ selectedSeller()?.shopName }}</h4>
                        <p class="text-gray-600">{{ selectedSeller()?.shopDescription }}</p>
                        <div class="mt-1 flex items-center text-sm text-gray-500">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Contact: {{ selectedSeller()?.contactEmail }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p class="text-sm font-medium text-gray-900">Shop Address</p>
                        <p class="text-sm text-gray-500">{{ selectedSeller()?.address || 'N/A' }}</p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">Phone</p>
                        <p class="text-sm text-gray-500">{{ selectedSeller()?.contactPhone || 'N/A' }}</p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">Status</p>
                        <p [class]="'text-sm ' + (selectedSeller()?.isActive ? 'text-green-600' : 'text-red-600')">
                          {{ selectedSeller()?.isActive ? 'Active' : 'Inactive' }}
                        </p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">Verification</p>
                        <p [class]="'text-sm ' + (selectedSeller()?.isVerified ? 'text-blue-600' : 'text-yellow-600')">
                          {{ selectedSeller()?.isVerified ? 'Verified' : 'Pending' }}
                        </p>
                      </div>
                    </div>
                  </div>
                }

                <!-- Tabs -->
                <div class="border-b">
                  <nav class="-mb-px flex space-x-8 px-6">
                    <button
                      (click)="switchTab('products')"
                      [class]="'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ' +
                              (showProductsTab() ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')"
                    >
                      Products
                    </button>
                    <button
                      (click)="switchTab('users')"
                      [class]="'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ' +
                              (!showProductsTab() ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')"
                    >
                      Users
                    </button>
                  </nav>
                </div>

                <!-- Tab Content -->
                @if (showProductsTab()) {
                  <!-- Products List -->
                  <div>
                    <h4 class="text-lg font-semibold mb-4">Products</h4>
                    <div class="overflow-x-auto">
                      <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                          <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                          @for (product of sellerProducts(); track product.id) {
                            <tr class="hover:bg-gray-50">
                              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {{ product.name }}
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ product.price }}
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ product.stock }}
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap">
                                <span [class]="'px-2 inline-flex text-xs leading-5 font-semibold rounded-full ' +
                                  (product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')">
                                  {{ product.isActive ? 'Enabled' : 'Disabled' }}
                                </span>
                              </td>
                            </tr>
                          }
                          @empty {
                            <tr>
                              <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                                No products found for this seller
                              </td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                } @else {
                  <!-- Users List -->
                  <div>
                    <h4 class="text-lg font-semibold mb-4">Associated Users</h4>
                    <div class="overflow-x-auto">
                      <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                          <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                          @for (user of sellerUsers(); track user.id) {
                            <tr class="hover:bg-gray-50">
                              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {{ user.firstName || '' }} {{ user.lastName || '' }}
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ user.email }}
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ user.roleNames?.join(', ') || 'No roles' }}
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap">
                                <span [class]="'px-2 inline-flex text-xs leading-5 font-semibold rounded-full ' +
                                  (user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')">
                                  {{ user.isActive ? 'Active' : 'Inactive' }}
                                </span>
                              </td>
                            </tr>
                          }
                          @empty {
                            <tr>
                              <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                                No users found for this seller
                              </td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                }
              }
            </div>

            <div class="border-t px-6 py-4 bg-gray-50 flex justify-end rounded-b-lg">
              <button
                (click)="closeDetailsModal()"
                class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      }
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
export class AdminSellersComponent implements OnInit {
  languageService = inject(LanguageService);
  sellerService = inject(SellerService);
  productService = inject(ProductService);
  accountManagementService = inject(AccountManagementService);

  sellers = signal<SellerDto[]>([]);
  loading = signal(false);
  loadingDetails = signal(false);

  searchTerm = '';
  statusFilter = '';
  createdAfter = '';
  createdBefore = '';

  currentPage = signal(1);
  pageSize = signal(10);
  totalCount = signal(0);
  totalPages = signal(0);

  // Properties for viewing seller details
  showDetailsModal = signal(false);
  selectedSeller = signal<SellerDto | null>(null);
  sellerProducts = signal<any[]>([]);
  sellerUsers = signal<any[]>([]);
  showProductsTab = signal(true); // To switch between tabs

  constructor() { }

  ngOnInit(): void {
    this.loadSellers();
  }

  loadSellers(): void {
    this.loading.set(true);

    // Using SellerService to get all sellers
    this.sellerService.apiSellerSellersGet(
      this.currentPage(),
      this.pageSize(),
    ).subscribe({
      next: (response: any) => {
        // Process the API response to match our SellerDto interface
        const sellerData = response.data?.items || [];
        const sellers: SellerDto[] = sellerData.map((apiSeller: any) => ({
          id: apiSeller.id || 0,
          userId: apiSeller.userId || '',
          userFullName: apiSeller.userFullName || `${apiSeller.userFirstName || ''} ${apiSeller.userLastName || ''}`,
          userFirstName: apiSeller.userFirstName || '',
          userLastName: apiSeller.userLastName || '',
          userEmail: apiSeller.userEmail || '',
          userName: apiSeller.userName || '',
          shopName: apiSeller.shopName || '',
          shopDescription: apiSeller.shopDescription || '',
          shopAddress: apiSeller.shopAddress || '',
          shopPhone: apiSeller.shopPhone || '',
          shopEmail: apiSeller.shopEmail || '',
          isActive: apiSeller.isActive || false,
          isVerified: apiSeller.isVerified || false,
          profilePictureUrl: apiSeller.profilePictureUrl || '',
          shopLogoUrl: apiSeller.shopLogoUrl || '',
          registrationDate: apiSeller.registrationDate ? new Date(apiSeller.registrationDate) : undefined,
          createdAt: apiSeller.createdAt ? new Date(apiSeller.createdAt) : new Date(),
          updatedAt: apiSeller.updatedAt ? new Date(apiSeller.updatedAt) : undefined
        }));

        this.sellers.set(sellers);
        this.totalCount.set(response?.data?.totalCount || sellerData.length);
        this.totalPages.set(Math.ceil((response?.data?.totalCount || sellerData.length) / this.pageSize()));
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading sellers:', error);
        this.loading.set(false);
      }
    });
  }

  applyFilters(): void {
    this.currentPage.set(1);
    this.loadSellers();
  }

  toggleSellerStatus(sellerId: number, newStatus: boolean): void {
    this.loading.set(true);

    if (newStatus) {
      this.sellerService.apiSellerActivateSellerIdPost(sellerId).subscribe({
        next: () => {
          this.loadSellers();
        },
        error: (error) => {
          console.error('Error activating seller:', error);
          this.loading.set(false);
        }
      });
    } else {
      this.sellerService.apiSellerDeactivateSellerIdPost(sellerId).subscribe({
        next: () => {
          this.loadSellers();
        },
        error: (error) => {
          console.error('Error deactivating seller:', error);
          this.loading.set(false);
        }
      });
    }
  }

  verifySeller(sellerId: number): void {
    this.loading.set(true);

    this.sellerService.apiSellerVerifySellerIdPost(sellerId).subscribe({
      next: () => {
        this.loadSellers();
      },
      error: (error) => {
        console.error('Error verifying seller:', error);
        this.loading.set(false);
      }
    });
  }

  viewSellerDetails(sellerId: number): void {
    this.loadingDetails.set(true);

    // Get the detailed seller information from the API
    this.sellerService.apiSellerSellerIdGet(sellerId).subscribe({
      next: (response) => {
        this.selectedSeller.set(response.data || null);
        this.loadSellerProducts(sellerId);
        this.loadSellerUsers(sellerId);
        this.showDetailsModal.set(true);
        this.loadingDetails.set(false);
      },
      error: (error) => {
        console.error('Error loading seller details:', error);
        this.loadingDetails.set(false);
      }
    });
  }

  loadSellerProducts(sellerId: number): void {
    // Load products for the seller using the supplierId parameter
    this.productService.apiProductGet(
      1, // page
      100, // pageSize
      undefined, // searchTerm
      undefined, // categoryId
      undefined, // categoryIds
      undefined, // brandId
      sellerId, //  sellerId
      undefined, // minPrice
      undefined, // maxPrice
      undefined, // minRating
      undefined, // isActive
      undefined, // isFeatured
      undefined, // isNew
      undefined, // includeOutOfStock
      undefined, // tags
      undefined, // sortBy
      undefined, // sortOrder
      undefined, // supplierId
      undefined, // sku
      undefined // getMyProducts
    ).subscribe({
      next: (response: any) => {
        const products = response?.data?.items || [];
        this.sellerProducts.set(products);
      },
      error: (error) => {
        console.error('Error loading seller products:', error);
        this.sellerProducts.set([]);
      }
    });
  }

  loadSellerUsers(sellerId: number): void {
    // Load users associated with the seller
    // We'll need to search for users by some criteria related to seller
    // Since the API doesn't seem to have a direct method to get users by sellerId,
    // we'll get all users and then filter on the frontend
    // This is a workaround since we don't have a specific endpoint for this

    // NOTE: This is a temporary solution until there's a dedicated API endpoint
    // to get users by seller ID
    this.accountManagementService.apiAdminAccountManagementGet(
      1, // page
      100, // pageSize
      undefined, // searchTerm
      undefined, // status
      undefined, // role
      undefined, // createdAfter
      undefined, // createdBefore
      undefined, // sortBy
      undefined // sortOrder
    ).subscribe({
      next: (response: any) => {
        const users = response?.data?.items || [];
        // For now, we'll show all users since there's no direct association with sellerId
        this.sellerUsers.set(users);
      },
      error: (error) => {
        console.error('Error loading seller users:', error);
        this.sellerUsers.set([]);
      }
    });
  }

  closeDetailsModal(): void {
    this.showDetailsModal.set(false);
    this.selectedSeller.set(null);
    this.sellerProducts.set([]);
    this.sellerUsers.set([]);
  }

  switchTab(tab: 'products' | 'users'): void {
    this.showProductsTab.set(tab === 'products');
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadSellers();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadSellers();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadSellers();
    }
  }

  getCurrentPageEnd(): number {
    const end = this.currentPage() * this.pageSize();
    return Math.min(end, this.totalCount());
  }

  getPageNumbers(): number[] {
    const pageNumbers: number[] = [];
    const currentPage = this.currentPage();
    const totalPages = this.totalPages();

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first and last page
      if (currentPage > 3) {
        pageNumbers.push(1);
        if (currentPage > 4) pageNumbers.push(-1); // ellipsis
      }

      // Show up to 5 pages centered around current page
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 2) {
        if (currentPage < totalPages - 3) pageNumbers.push(-1); // ellipsis
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  }
}