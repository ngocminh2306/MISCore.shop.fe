import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountManagementService as PublicAccountService } from '../../../../public-api/api/accountManagement.service';
import { MessageDialogService } from '../../../services/message-dialog.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { LanguageService } from '../../../services/language.service';

interface UserWithRoles {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  roles: string[];
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
}

@Component({
  selector: 'app-admin-roles',
  standalone: true,
  imports: [RouterLink, FormsModule, TranslatePipe],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">{{ 'Admin Roles' | translate }}</h1>
        <div class="mt-4 flex justify-between items-center">
          <p class="text-gray-600">{{ 'Assign and manage roles for users' | translate }}</p>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="bg-white shadow rounded-lg p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Search' | translate }}</label>
            <input
              type="text"
              id="search"
              [(ngModel)]="searchTerm"
              (keyup.enter)="loadUsers()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              [placeholder]="'Search users...' | translate"
            >
          </div>
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Role' | translate }}</label>
            <select
              id="role"
              [(ngModel)]="roleFilter"
              (change)="loadUsers()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">{{ 'All Roles' | translate }}</option>
              <option value="admin">{{ 'Admin' | translate }}</option>
              <option value="moderator">{{ 'Moderator' | translate }}</option>
              <option value="customer">{{ 'Customer' | translate }}</option>
            </select>
          </div>
          <div class="flex items-end">
            <button (click)="applyFilters()" class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              {{ 'Apply Filters' | translate }}
            </button>
          </div>
        </div>
      </div>

      <!-- User Roles Table -->
      <div class="bg-white shadow overflow-hidden rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'User' | translate }}</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Email' | translate }}</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Current Roles' | translate }}</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Status' | translate }}</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Actions' | translate }}</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            @for (user of users(); track user.id) {
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span class="text-sm font-medium text-indigo-800">{{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</div>
                      <div class="text-sm text-gray-500">{{ user.userName }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  <div class="flex flex-wrap gap-1">
                    @for (role of user.roles; track role) {
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {{ role }}
                      </span>
                    }
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="'px-2 inline-flex text-xs leading-5 font-semibold rounded-full ' +
                    (user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')">
                    {{ user.isActive ? ('Active' | translate) : ('Inactive' | translate) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    (click)="assignRoles(user.id)"
                    class="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    {{ 'Assign Roles' | translate }}
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                  {{ 'No users found.' | translate }}
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
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
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
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
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
export class AdminRolesComponent implements OnInit {
  users = signal<UserWithRoles[]>([]);
  searchTerm = '';
  roleFilter = '';
  
  currentPage = signal(1);
  pageSize = signal(10);
  private languageService = inject(LanguageService);
  totalCount = signal(0);
  totalPages = signal(0);

  constructor(
    private publicAccountService: PublicAccountService,
    private messageDialogService: MessageDialogService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    // Use the API to get users with their role information
    this.publicAccountService.apiAdminAccountManagementGet(
      this.currentPage(),
      this.pageSize(),
      this.searchTerm || undefined,
      undefined, // status filter
      this.roleFilter || undefined, // role filter
      undefined, // createdAfter
      undefined, // createdBefore
      'createdAt', // sortBy
      'desc' // sortOrder
    ).subscribe({
      next: (response: any) => {
        // Process the response to match our UserWithRoles interface
        const userData = response.items || response.users || response || [];
        const users: UserWithRoles[] = userData.map((apiUser: any) => ({
          id: apiUser.id || apiUser.userId || '0',
          email: apiUser.email || apiUser.userEmail || '',
          firstName: apiUser.firstName || '',
          lastName: apiUser.lastName || '',
          userName: apiUser.userName || apiUser.displayName || `${apiUser.firstName || ''} ${apiUser.lastName || ''}`.trim(),
          roles: apiUser.roles || [],
          isActive: apiUser.isActive || apiUser.active || false,
          lastLoginAt: apiUser.lastLoginAt ? new Date(apiUser.lastLoginAt) : undefined,
          createdAt: apiUser.createdAt ? new Date(apiUser.createdAt) : new Date()
        }));
        
        this.users.set(users);
        this.totalCount.set(response.totalCount || userData.length);
        this.totalPages.set(Math.ceil((response.totalCount || userData.length) / this.pageSize()));
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.users.set([]);
        this.totalCount.set(0);
        this.totalPages.set(0);
      }
    });
  }

  applyFilters(): void {
    this.currentPage.set(1);
    this.loadUsers();
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(prev => prev - 1);
      this.loadUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(prev => prev + 1);
      this.loadUsers();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.currentPage.set(page);
      this.loadUsers();
    }
  }

  getPageNumbers(): number[] {
    const totalVisiblePages = 5;
    const pages: number[] = [];

    let startPage = Math.max(1, this.currentPage() - Math.floor(totalVisiblePages / 2));
    let endPage = Math.min(this.totalPages(), startPage + totalVisiblePages - 1);

    // Adjust start page if needed to ensure enough pages are shown
    if (endPage - startPage + 1 < totalVisiblePages) {
      startPage = Math.max(1, endPage - totalVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  getCurrentPageEnd(): number {
    return Math.min(this.currentPage() * this.pageSize(), this.totalCount());
  }

  assignRoles(userId: string): void {
    // This would open a modal to assign roles to the user
    // For now, just showing an alert
    this.messageDialogService.info(`Assign roles functionality for user ${userId} would open a modal here`, 'Role Assignment');
    console.log(`Opening role assignment modal for user with ID: ${userId}`);
  }
}