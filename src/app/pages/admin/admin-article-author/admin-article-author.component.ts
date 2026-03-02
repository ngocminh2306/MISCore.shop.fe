import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { CommonTableComponent, TableColumn } from '../../../components/common-table/common-table.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-article-author',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule, CommonTableComponent, ConfirmDialogComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Article Authors</h1>
        <div class="mt-4 flex justify-between items-center">
          <p class="text-gray-600">View and manage article authors</p>
          <button
            (click)="openCreateModal()"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Add New Author
          </button>
        </div>
      </div>

      <!-- Authors Table using Common Table Component -->
      <misc-common-table
        [data]="authors"
        [columns]="tableColumns"
        tableName="authors"
        [loading]="loading"
        [error]="error"
        [paginationConfig]="{
          currentPage: currentPage,
          pageSize: pageSize,
          totalItems: totalCount,
          totalPages: totalPages
        }"
        [filterConfig]="{
          searchTerm: searchTerm,
          filters: { status: statusFilter }
        }"
        [showActions]="true"
        [rowActions]="[
          { name: 'edit', title: 'Edit', color: 'indigo' },
          { name: 'delete', title: 'Delete', color: 'red' }
        ]"
        (action)="handleAction($event.name, $event.item)"
        (pageChange)="onPageChange($event)"
        (filterChange)="onFilterChange($event)">
      </misc-common-table>

      <!-- Create/Edit Author Modal -->
      <div *ngIf="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">
              {{ editingAuthor ? 'Edit Author' : 'Create Author' }}
            </h3>
            <button (click)="closeModal()" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form (ngSubmit)="editingAuthor ? updateAuthor() : createAuthor()" #authorForm="ngForm">
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    [(ngModel)]="authorFormModel.firstName"
                    name="firstName"
                    required
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="First name"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    [(ngModel)]="authorFormModel.lastName"
                    name="lastName"
                    required
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Last name"
                  >
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Display Name *</label>
                <input
                  type="text"
                  [(ngModel)]="authorFormModel.displayName"
                  name="displayName"
                  required
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Display name"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  [(ngModel)]="authorFormModel.email"
                  name="email"
                  required
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Email address"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  [(ngModel)]="authorFormModel.bio"
                  name="bio"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Author bio"
                  rows="3"
                ></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                <input
                  type="text"
                  [(ngModel)]="authorFormModel.avatarUrl"
                  name="avatarUrl"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Author avatar URL"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Social Media Links</label>
                <div class="space-y-2">
                  <div>
                    <label class="block text-xs text-gray-500">Twitter</label>
                    <input
                      type="text"
                      [(ngModel)]="authorFormModel.twitterUrl"
                      name="twitterUrl"
                      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Twitter profile URL"
                    >
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500">LinkedIn</label>
                    <input
                      type="text"
                      [(ngModel)]="authorFormModel.linkedinUrl"
                      name="linkedinUrl"
                      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="LinkedIn profile URL"
                    >
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500">Website</label>
                    <input
                      type="text"
                      [(ngModel)]="authorFormModel.websiteUrl"
                      name="websiteUrl"
                      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Personal website URL"
                    >
                  </div>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  [(ngModel)]="authorFormModel.status"
                  name="status"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <div class="flex items-center">
                <input
                  type="checkbox"
                  [(ngModel)]="authorFormModel.isActive"
                  name="isActive"
                  id="isActive"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                >
                <label for="isActive" class="ml-2 block text-sm text-gray-700">Active Author</label>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                (click)="closeModal()"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="!authorForm.form.valid"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ editingAuthor ? 'Update Author' : 'Create Author' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Confirm Dialog -->
      <misc-confirm-dialog
        [isOpen]="showConfirmDialog"
        [title]="confirmDialogTitle"
        [message]="confirmDialogMessage"
        [confirmButtonText]="confirmDialogConfirmText"
        [cancelButtonText]="confirmDialogCancelText"
        (confirmed)="onConfirmDelete()"
        (cancelled)="onCancelDelete()">
      </misc-confirm-dialog>
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
export class AdminArticleAuthorComponent {
  authors: any[] = [];
  searchTerm = '';
  statusFilter = '';
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;
  deletingId: number | null = null;
  loading = false;
  error: string | null = null;

  // Author form modal
  showModal = false;
  editingAuthor: any = null;
  authorFormModel = {
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    bio: '',
    avatarUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    websiteUrl: '',
    status: 'active',
    isActive: true
  };

  // Confirm dialog properties
  showConfirmDialog = false;
  confirmDialogTitle = '';
  confirmDialogMessage = '';
  confirmDialogConfirmText = 'Confirm';
  confirmDialogCancelText = 'Cancel';
  authorToDelete: number | null = null;

  // Table configuration
  tableColumns: TableColumn[] = [
    {
      key: 'name',
      title: 'Author',
      sortable: true,
      width: '30%'
    },
    {
      key: 'email',
      title: 'Email',
      sortable: true,
      width: '30%'
    },
    {
      key: 'articlesCount',
      title: 'Articles',
      sortable: true,
      width: '20%'
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      type: 'text',
      width: '20%',
      // badgeConfig: {
      //   active: { class: 'bg-green-200 text-green-800', text: 'Active' },
      //   inactive: { class: 'bg-gray-200 text-gray-800', text: 'Inactive' },
      //   pending: { class: 'bg-yellow-200 text-yellow-800', text: 'Pending' }
      // }
    }
  ];

  constructor(private titleService: Title, private metaService: Meta) { }

  ngOnInit(): void {
    this.titleService.setTitle('Article Authors | Admin Panel');
    this.metaService.updateTag({ name: 'description', content: 'Manage article authors in the admin panel. Add and edit author information and profiles.' });
    this.metaService.updateTag({ name: 'keywords', content: 'admin, article authors, author management, content creators, profiles' });
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.loading = true;
    this.error = null;

    // Simulated API call - replace with actual service call
    setTimeout(() => {
      // Mock data for authors
      const mockAuthors = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          displayName: 'John Doe',
          email: 'john.doe@example.com',
          bio: 'Senior software engineer with 10+ years of experience in web development.',
          avatarUrl: 'https://via.placeholder.com/40x40',
          articlesCount: 12,
          status: 'active',
          isActive: true,
          createdAt: new Date('2023-01-15')
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          displayName: 'Jane Smith',
          email: 'jane.smith@example.com',
          bio: 'Technical writer and content creator specializing in frontend technologies.',
          avatarUrl: 'https://via.placeholder.com/40x40',
          articlesCount: 8,
          status: 'active',
          isActive: true,
          createdAt: new Date('2023-02-10')
        },
        {
          id: 3,
          firstName: 'Bob',
          lastName: 'Johnson',
          displayName: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          bio: 'Product manager with expertise in e-commerce solutions.',
          avatarUrl: 'https://via.placeholder.com/40x40',
          articlesCount: 5,
          status: 'inactive',
          isActive: false,
          createdAt: new Date('2023-03-05')
        },
        {
          id: 4,
          firstName: 'Alice',
          lastName: 'Williams',
          displayName: 'Alice Williams',
          email: 'alice.williams@example.com',
          bio: 'UI/UX designer passionate about creating beautiful interfaces.',
          avatarUrl: 'https://via.placeholder.com/40x40',
          articlesCount: 3,
          status: 'pending',
          isActive: true,
          createdAt: new Date('2023-03-15')
        }
      ];

      // Apply client-side filtering
      let filteredAuthors = mockAuthors.filter((author: any) => {
        // Apply search filter
        const matchesSearch = !this.searchTerm ||
          author.displayName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          author.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          (author.bio && author.bio.toLowerCase().includes(this.searchTerm.toLowerCase()));

        // Apply status filter
        const matchesStatus = !this.statusFilter ||
          author.status === this.statusFilter;

        return matchesSearch && matchesStatus;
      });

      // Calculate pagination values
      this.totalCount = filteredAuthors.length;
      this.totalPages = Math.ceil(this.totalCount / this.pageSize);

      // Apply client-side pagination
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.authors = filteredAuthors.slice(startIndex, endIndex);
      this.loading = false;
    }, 500);
  }

  applyFilters(): void {
    // Reset to first page when applying filters
    this.currentPage = 1;
    this.loadAuthors();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadAuthors();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadAuthors();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadAuthors();
    }
  }

  getPageNumbers(): number[] {
    const totalVisiblePages = 5;
    const pages: number[] = [];

    let startPage = Math.max(1, this.currentPage - Math.floor(totalVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + totalVisiblePages - 1);

    // Adjust start page if needed to ensure enough pages are shown
    if (endPage - startPage + 1 < totalVisiblePages) {
      startPage = Math.max(1, endPage - totalVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Improved delete method using confirm dialog
  deleteAuthor(id: number): void {
    this.authorToDelete = id;
    this.confirmDialogTitle = 'Delete Author';
    this.confirmDialogMessage = 'Are you sure you want to delete this author? This action cannot be undone and will affect all articles associated with this author.';
    this.confirmDialogConfirmText = 'Delete';
    this.confirmDialogCancelText = 'Cancel';
    this.showConfirmDialog = true;
  }

  getCurrentPageEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalCount);
  }

  // Handle confirm delete
  onConfirmDelete(): void {
    if (this.authorToDelete !== null) {
      this.deletingId = this.authorToDelete; // Set loading state

      // Simulated API call - replace with actual service call
      setTimeout(() => {
        console.log('Author deleted successfully');
        // Reset deletingId
        this.deletingId = null;
        this.authorToDelete = null;
        // Reload authors after deletion
        this.loadAuthors();
        this.showConfirmDialog = false;
      }, 500);
    }
  }

  // Handle cancel delete
  onCancelDelete(): void {
    this.showConfirmDialog = false;
    this.authorToDelete = null;
  }

  handleAction(actionName: string, item: any): void {
    switch (actionName) {
      case 'edit':
        this.openEditModal(item);
        break;
      case 'delete':
        this.deleteAuthor(item.id);
        break;
    }
  }

  onPageChange(pageConfig: any): void {
    this.currentPage = pageConfig.currentPage;
    this.pageSize = pageConfig.pageSize;
    this.loadAuthors();
  }

  onFilterChange(filterConfig: any): void {
    this.searchTerm = filterConfig.searchTerm;
    this.statusFilter = filterConfig.filters?.status || '';
    this.currentPage = 1; // Reset to first page when filters change
    this.loadAuthors();
  }

  // Modal methods
  openCreateModal(): void {
    this.editingAuthor = null;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(author: any): void {
    this.editingAuthor = author;
    this.authorFormModel = {
      firstName: author.firstName || '',
      lastName: author.lastName || '',
      displayName: author.displayName || '',
      email: author.email || '',
      bio: author.bio || '',
      avatarUrl: author.avatarUrl || '',
      twitterUrl: author.twitterUrl || '',
      linkedinUrl: author.linkedinUrl || '',
      websiteUrl: author.websiteUrl || '',
      status: author.status || 'active',
      isActive: author.isActive || false
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingAuthor = null;
    this.resetForm();
  }

  resetForm(): void {
    this.authorFormModel = {
      firstName: '',
      lastName: '',
      displayName: '',
      email: '',
      bio: '',
      avatarUrl: '',
      twitterUrl: '',
      linkedinUrl: '',
      websiteUrl: '',
      status: 'active',
      isActive: true
    };
  }

  // Create author method
  createAuthor(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = null;

    // Prepare the request body
    const createDto = {
      firstName: this.authorFormModel.firstName,
      lastName: this.authorFormModel.lastName,
      displayName: this.authorFormModel.displayName,
      email: this.authorFormModel.email,
      bio: this.authorFormModel.bio || null,
      avatarUrl: this.authorFormModel.avatarUrl || null,
      twitterUrl: this.authorFormModel.twitterUrl || null,
      linkedinUrl: this.authorFormModel.linkedinUrl || null,
      websiteUrl: this.authorFormModel.websiteUrl || null,
      status: this.authorFormModel.status,
      isActive: this.authorFormModel.isActive
    };

    // Simulated API call - replace with actual service call
    setTimeout(() => {
      console.log('Author created successfully', createDto);
      this.loading = false;
      this.closeModal();
      this.loadAuthors(); // Reload the list
    }, 500);
  }

  // Update author method
  updateAuthor(): void {
    if (!this.editingAuthor?.id || !this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = null;

    // Prepare the request body
    const updateDto = {
      firstName: this.authorFormModel.firstName,
      lastName: this.authorFormModel.lastName,
      displayName: this.authorFormModel.displayName,
      email: this.authorFormModel.email,
      bio: this.authorFormModel.bio || null,
      avatarUrl: this.authorFormModel.avatarUrl || null,
      twitterUrl: this.authorFormModel.twitterUrl || null,
      linkedinUrl: this.authorFormModel.linkedinUrl || null,
      websiteUrl: this.authorFormModel.websiteUrl || null,
      status: this.authorFormModel.status,
      isActive: this.authorFormModel.isActive
    };

    // Simulated API call - replace with actual service call
    setTimeout(() => {
      console.log('Author updated successfully', updateDto);
      this.loading = false;
      this.closeModal();
      this.loadAuthors(); // Reload the list
    }, 500);
  }

  // Validate form method
  validateForm(): boolean {
    if (!this.authorFormModel.firstName.trim()) {
      alert('First name is required');
      return false;
    }
    if (!this.authorFormModel.lastName.trim()) {
      alert('Last name is required');
      return false;
    }
    if (!this.authorFormModel.displayName.trim()) {
      alert('Display name is required');
      return false;
    }
    if (!this.authorFormModel.email.trim()) {
      alert('Email is required');
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.authorFormModel.email)) {
      alert('Please enter a valid email address');
      return false;
    }
    return true;
  }
}