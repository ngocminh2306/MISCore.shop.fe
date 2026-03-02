import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { User } from '../../../models/user';
import { AccountManagementService } from '../../../../public-api';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { LanguageService } from '../../../services/language.service';
import { RegisterDto } from '../../../../public-api/model/registerDto';
import { UpdateUserDto } from '../../../../public-api/model/updateUserDto';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, TranslatePipe],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">{{ 'Admin Users' | translate }}</h1>
        <div class="mt-4 flex justify-between items-center">
          <p class="text-gray-600">{{ 'View and manage user accounts' | translate }}</p>
          <button
            (click)="openCreateModal()"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            {{ 'Add New User' | translate }}
          </button>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white shadow rounded-lg p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-7 gap-4">
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Search' | translate }}</label>
            <input
              type="text"
              id="search"
              [(ngModel)]="searchTerm"
              (keyup.enter)="loadUsers()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="{{ 'Search users...' | translate }}"
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
              <option value="customer">{{ 'Customer' | translate }}</option>
              <option value="moderator">{{ 'Moderator' | translate }}</option>
            </select>
          </div>
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Status' | translate }}</label>
            <select
              id="status"
              [(ngModel)]="statusFilter"
              (change)="loadUsers()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">{{ 'All Statuses' | translate }}</option>
              <option value="active">{{ 'Active' | translate }}</option>
              <option value="inactive">{{ 'Inactive' | translate }}</option>
            </select>
          </div>
          <div>
            <label for="createdAfter" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Created After' | translate }}</label>
            <input
              type="date"
              id="createdAfter"
              [(ngModel)]="createdAfter"
              (change)="loadUsers()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
          <div>
            <label for="createdBefore" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Created Before' | translate }}</label>
            <input
              type="date"
              id="createdBefore"
              [(ngModel)]="createdBefore"
              (change)="loadUsers()"
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

      <!-- Users Table -->
      <div class="bg-white shadow overflow-hidden rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'User' | translate }}</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Email' | translate }}</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Roles' | translate }}</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Status' | translate }}</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Last Login' | translate }}</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Actions' | translate }}</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            @for (user of users(); track user.id) {
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      @if (user.profilePictureUrl) {
                        <img [src]="user.profilePictureUrl" [alt]="user.userName" class="h-10 w-10 rounded-full object-cover">
                      } @else {
                        <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span class="text-sm font-medium text-indigo-800">{{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}</span>
                        </div>
                      }
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
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ user.lastLoginAt ? (user.lastLoginAt | date:'short') : ('Never' | translate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button (click)="openEditModal(user)" class="text-indigo-600 hover:text-indigo-900 mr-3">{{ 'Edit' | translate }}</button>
                  <button (click)="openRoleModal(user)" class="text-purple-600 hover:text-purple-900 mr-3">{{ 'Manage Roles' | translate }}</button>
                  <a href="#" (click)="toggleUserStatus(user.id, !user.isActive); $event.preventDefault();" class="mr-3"
                    [class]="user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'">
                    {{ user.isActive ? ('Deactivate' | translate) : ('Activate' | translate) }}
                  </a>
                  <button (click)="deleteUser(user.id); $event.preventDefault();" class="text-red-600 hover:text-red-900">{{ 'Delete' | translate }}</button>
                </td>
              </tr>
            }
            @empty {
              <tr>
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                  {{ 'No users found' | translate }}
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

      <!-- Create/Edit User Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" style="z-index: 1000;">
          <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3">
              <div class="flex justify-between items-center pb-3 border-b">
                <h3 class="text-lg font-medium text-gray-900">
                  {{ editingUser() ? ('Edit User' | translate) : ('Create User' | translate) }}
                </h3>
                <button
                  (click)="closeModal()"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <form (ngSubmit)="editingUser() ? updateUser() : createUser()" #userForm="ngForm">
                <div class="space-y-4">
                  <div>
                    <label for="firstName" class="block text-sm font-medium text-gray-700">{{ 'First Name' | translate }}</label>
                    <input
                      type="text"
                      id="firstName"
                      [(ngModel)]="currentUserData().firstName"
                      name="firstName"
                      required
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                  </div>

                  <div>
                    <label for="lastName" class="block text-sm font-medium text-gray-700">{{ 'Last Name' | translate }}</label>
                    <input
                      type="text"
                      id="lastName"
                      [(ngModel)]="currentUserData().lastName"
                      name="lastName"
                      required
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                  </div>

                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">{{ 'Email' | translate }}</label>
                    <input
                      type="email"
                      id="email"
                      [(ngModel)]="currentUserData().email"
                      name="email"
                      required
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                  </div>

                  @if (!editingUser()) {
                    <div>
                      <label for="password" class="block text-sm font-medium text-gray-700">{{ 'Password' | translate }}</label>
                      <input
                        type="password"
                        id="password"
                        [(ngModel)]="currentUserData().password"
                        name="password"
                        [required]="!editingUser()"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                    </div>
                  }

                  <div>
                    <label for="isActive" class="block text-sm font-medium text-gray-700">{{ 'Active' | translate }}</label>
                    <input
                      type="checkbox"
                      id="isActive"
                      [(ngModel)]="currentUserData().isActive"
                      name="isActive"
                      class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    >
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    (click)="closeModal()"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    {{ 'Cancel' | translate }}
                  </button>
                  <button
                    type="submit"
                    [disabled]="!userForm.form.valid"
                    class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {{ editingUser() ? ('Update User' | translate) : ('Create User' | translate) }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      }

      <!-- Role Management Modal -->
      @if (showRoleModal()) {
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" style="z-index: 1000;">
          <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3">
              <div class="flex justify-between items-center pb-3 border-b">
                <h3 class="text-lg font-medium text-gray-900">
                  {{ 'Manage Roles for ' + (selectedUserForRole()?.firstName || '') + ' ' + (selectedUserForRole()?.lastName || '') | translate }}
                </h3>
                <button
                  (click)="closeRoleModal()"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div class="py-4">
                <div class="mb-4">
                  <h4 class="text-md font-medium text-gray-900 mb-2">{{ 'Current Roles' | translate }}</h4>
                  <div class="flex flex-wrap gap-2">
                    @for (role of selectedUserForRole()?.roles; track role) {
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                        {{ role }}
                        <button
                          (click)="removeRole(selectedUserForRole()?.id || '', role)"
                          class="ml-2 text-indigo-600 hover:text-indigo-800"
                        >
                          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    }
                    @empty {
                      <p class="text-gray-500">{{ 'No roles assigned' | translate }}</p>
                    }
                  </div>
                </div>

                <div class="mb-4">
                  <h4 class="text-md font-medium text-gray-900 mb-2">{{ 'Assign New Role' | translate }}</h4>
                  <div class="flex space-x-2">
                    <select
                      [(ngModel)]="selectedRole"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">{{ 'Select a role' | translate }}</option>
                      @for (role of availableRoles(); track role) {
                        <option [value]="role">{{ role }}</option>
                      }
                    </select>
                    <button
                      (click)="assignRole()"
                      [disabled]="!selectedRole()"
                      class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {{ 'Assign' | translate }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="mt-4 flex justify-end">
                <button
                  (click)="closeRoleModal()"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  {{ 'Close' | translate }}
                </button>
              </div>
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
export class AdminUsersComponent implements OnInit {
  languageService = inject(LanguageService);
  users = signal<User[]>([]);
  searchTerm = '';
  roleFilter = '';
  statusFilter = '';
  createdAfter = '';
  createdBefore = '';

  currentPage = signal(1);
  pageSize = signal(10);
  totalCount = signal(0);
  totalPages = signal(0);

  // Modal and form related properties
  showModal = signal(false);
  editingUser = signal<User | null>(null);
  currentUserData = signal({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    isActive: true,
    roles: [] as string[]
  });

  constructor(private accountManagementService: AccountManagementService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    // Use the real API to fetch user data
    this.accountManagementService.apiAdminAccountManagementGet(
      this.currentPage(),
      this.pageSize(),
      this.searchTerm || undefined,
      this.statusFilter || undefined,
      this.roleFilter || undefined,
      this.createdAfter ? new Date(this.createdAfter).toISOString() : undefined,
      this.createdBefore ? new Date(this.createdBefore).toISOString() : undefined,
      'createdAt',
      'desc'
    ).subscribe({
      next: (response: any) => {
        // Process the API response to match our User interface
        const userData = response.data?.items || [];
        const users: User[] = userData.map((apiUser: any) => ({
          id: apiUser.id || '',
          email: apiUser.email || apiUser.userEmail || '',
          firstName: apiUser.firstName || '',
          lastName: apiUser.lastName || '',
          userName: apiUser.userName || `${apiUser.firstName} ${apiUser.lastName}`,
          profilePictureUrl: apiUser.profilePictureUrl || undefined,
          dateOfBirth: apiUser.dateOfBirth ? new Date(apiUser.dateOfBirth) : undefined,
          gender: apiUser.gender || undefined,
          isActive: apiUser.isActive || apiUser.active || false,
          lastLoginAt: apiUser.lastLoginAt ? new Date(apiUser.lastLoginAt) : null,
          createdAt: apiUser.createdAt ? new Date(apiUser.createdAt) : new Date(),
          updatedAt: apiUser.updatedAt ? new Date(apiUser.updatedAt) : undefined,
          roles: Array.isArray(apiUser.roles) ? apiUser.roles : [apiUser.role || 'customer']
        }));

        this.users.set(users);
        this.totalCount.set(response.totalCount || userData.length);
        this.totalPages.set(Math.ceil((response.totalCount || userData.length) / this.pageSize()));
      },
      error: (error) => {
        console.error('Error loading users:', error);
        // Handle error appropriately (show message to user)
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

  toggleUserStatus(userId: string, isActive: boolean): void {
    this.accountManagementService.apiAdminAccountManagementUserIdStatusPut(userId, isActive).subscribe({
      next: (response: any) => {
        // Update the user list locally
        const updatedUsers = this.users().map(user =>
          user.id === userId ? { ...user, isActive: isActive } : user
        );
        this.users.set(updatedUsers);

        // Show success message to user
        console.log(`User ${this.languageService.getTranslation(isActive ? 'activated' : 'deactivated')} successfully`);
      },
      error: (error) => {
        console.error('Error toggling user status:', error);
        // Handle error appropriately
      }
    });
  }

  deleteUser(userId: string): void {
    if (confirm(`${this.languageService.getTranslation('Are you sure?')} ${this.languageService.getTranslation('This action cannot be undone.')}`)) {
      this.accountManagementService.apiAdminAccountManagementUserIdDelete(userId).subscribe({
        next: () => {
          // Remove the user from the list
          const updatedUsers = this.users().filter(user => user.id !== userId);
          this.users.set(updatedUsers);
          this.totalCount.update(prev => prev - 1);
          this.totalPages.set(Math.ceil(this.totalCount() / this.pageSize()));

          console.log(this.languageService.getTranslation('User deleted successfully'));
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          // Handle error appropriately
        }
      });
    }
  }

  // Modal functions
  openCreateModal(): void {
    this.editingUser.set(null);
    this.currentUserData.set({
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      isActive: true,
      roles: []
    });
    this.showModal.set(true);
  }

  openEditModal(user: User): void {
    this.editingUser.set(user);
    this.currentUserData.set({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '',
      isActive: user.isActive,
      roles: user.roles || []
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingUser.set(null);
  }

  createUser(): void {
    const registerDto: RegisterDto = {
      firstName: this.currentUserData().firstName,
      lastName: this.currentUserData().lastName,
      email: this.currentUserData().email,
      password: this.currentUserData().password
    };

    this.accountManagementService.apiAdminAccountManagementPost(registerDto).subscribe({
      next: (response) => {
        console.log(this.languageService.getTranslation('User created successfully'));
        this.closeModal();
        this.loadUsers(); // Refresh the user list
      },
      error: (error) => {
        console.error('Error creating user:', error);
        // Handle error appropriately (show user-friendly message)
      }
    });
  }

  updateUser(): void {
    if (!this.editingUser()) return;

    const updateUserDto: UpdateUserDto = {
      firstName: this.currentUserData().firstName,
      lastName: this.currentUserData().lastName,
      email: this.currentUserData().email,
      isActive: this.currentUserData().isActive
    };

    // If a new password is provided, include it
    if (this.currentUserData().password) {
      // UpdateUserDto doesn't have password field, but we can still send it if needed
      // For now, we'll only send fields that UpdateUserDto supports
    }

    this.accountManagementService.apiAdminAccountManagementUserIdPut(
      this.editingUser()!.id,
      updateUserDto
    ).subscribe({
      next: (response) => {
        console.log(this.languageService.getTranslation('User updated successfully'));
        this.closeModal();
        this.loadUsers(); // Refresh the user list
      },
      error: (error) => {
        console.error('Error updating user:', error);
        // Handle error appropriately (show user-friendly message)
      }
    });
  }

  // Role management functionality
  showRoleModal = signal(false);
  selectedUserForRole = signal<User | null>(null);
  availableRoles = signal<string[]>(['admin', 'moderator', 'customer', 'seller']);
  selectedRole = signal('');

  openRoleModal(user: User): void {
    this.selectedUserForRole.set(user);
    this.selectedRole.set('');
    this.showRoleModal.set(true);
  }

  closeRoleModal(): void {
    this.showRoleModal.set(false);
    this.selectedUserForRole.set(null);
    this.selectedRole.set('');
  }

  assignRole(): void {
    if (!this.selectedUserForRole() || !this.selectedRole()) return;

    const userRoleUpdateDto = {
      role: this.selectedRole(),
      addRole: true
    };

    this.accountManagementService.apiAdminAccountManagementUserIdRolesPost(
      this.selectedUserForRole()!.id,
      userRoleUpdateDto
    ).subscribe({
      next: (response) => {
        console.log(this.languageService.getTranslation('Role assigned successfully'));
        this.closeRoleModal();
        this.loadUsers(); // Refresh the user list to show updated roles
      },
      error: (error) => {
        console.error('Error assigning role:', error);
        // Handle error appropriately
      }
    });
  }

  removeRole(userId: string, roleName: string): void {
    // To remove a role, we would typically call a different API, but the API might use the same endpoint
    // with addRole: false, or there might be a different endpoint to remove a role
    const userRoleUpdateDto = {
      role: roleName,
      addRole: false
    };

    this.accountManagementService.apiAdminAccountManagementUserIdRolesPost(
      userId,
      userRoleUpdateDto
    ).subscribe({
      next: (response) => {
        console.log(this.languageService.getTranslation('Role removed successfully'));
        this.loadUsers(); // Refresh the user list to show updated roles
      },
      error: (error) => {
        console.error('Error removing role:', error);
        // Handle error appropriately
      }
    });
  }

  getCurrentPageEnd(): number {
    return Math.min(this.currentPage() * this.pageSize(), this.totalCount());
  }
}