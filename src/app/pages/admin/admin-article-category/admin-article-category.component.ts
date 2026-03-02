import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { CommonTableComponent, TableColumn } from '../../../components/common-table/common-table.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-article-category',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule, CommonTableComponent, ConfirmDialogComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Article Categories</h1>
        <div class="mt-4 flex justify-between items-center">
          <p class="text-gray-600">View and manage article categories</p>
          <button
            (click)="openCreateModal()"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Add New Category
          </button>
        </div>
      </div>

      <!-- Categories Table using Common Table Component -->
      <misc-common-table
        [data]="categories"
        [columns]="tableColumns"
        tableName="categories"
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

      <!-- Create/Edit Category Modal -->
      <div *ngIf="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">
              {{ editingCategory ? 'Edit Category' : 'Create Category' }}
            </h3>
            <button (click)="closeModal()" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form (ngSubmit)="editingCategory ? updateCategory() : createCategory()" #categoryForm="ngForm">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  [(ngModel)]="categoryFormModel.name"
                  name="name"
                  required
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Category name"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  [(ngModel)]="categoryFormModel.description"
                  name="description"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Category description"
                  rows="2"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  [(ngModel)]="categoryFormModel.slug"
                  name="slug"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Category slug"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                <select
                  [(ngModel)]="categoryFormModel.parentId"
                  name="parentId"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option [value]="null">None (Top level)</option>
                  <option *ngFor="let cat of allCategories" [value]="cat.id" [disabled]="editingCategory && cat.id === editingCategory.id">{{ cat.name }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  [(ngModel)]="categoryFormModel.imageUrl"
                  name="imageUrl"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Category image URL"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  [(ngModel)]="categoryFormModel.sortOrder"
                  name="sortOrder"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Sort order"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input
                  type="text"
                  [(ngModel)]="categoryFormModel.metaTitle"
                  name="metaTitle"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Meta title"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea
                  [(ngModel)]="categoryFormModel.metaDescription"
                  name="metaDescription"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Meta description"
                  rows="2"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
                <input
                  type="text"
                  [(ngModel)]="categoryFormModel.metaKeywords"
                  name="metaKeywords"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Meta keywords"
                >
              </div>

              <div class="flex items-center">
                <input
                  type="checkbox"
                  [(ngModel)]="categoryFormModel.isActive"
                  name="isActive"
                  id="isActive"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                >
                <label for="isActive" class="ml-2 block text-sm text-gray-700">Active</label>
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
                [disabled]="!categoryForm.form.valid"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ editingCategory ? 'Update Category' : 'Create Category' }}
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
export class AdminArticleCategoryComponent {
  categories: any[] = [];
  allCategories: any[] = []; // For parent category select
  searchTerm = '';
  statusFilter = '';
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;
  deletingId: number | null = null;
  loading = false;
  error: string | null = null;

  // Category form modal
  showModal = false;
  editingCategory: any = null;
  categoryFormModel = {
    name: '',
    description: '',
    slug: '',
    parentId: null,
    imageUrl: '',
    sortOrder: 0,
    isActive: true,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  };

  // Confirm dialog properties
  showConfirmDialog = false;
  confirmDialogTitle = '';
  confirmDialogMessage = '';
  confirmDialogConfirmText = 'Confirm';
  confirmDialogCancelText = 'Cancel';
  categoryToDelete: number | null = null;

  // Table configuration
  tableColumns: TableColumn[] = [
    {
      key: 'name',
      title: 'Category',
      sortable: true,
      width: '40%'
    },
    {
      key: 'parentName',
      title: 'Parent Category',
      sortable: true,
      width: '20%'
    },
    {
      key: 'articleCount',
      title: 'Articles',
      sortable: true,
      width: '20%'
    },
    {
      key: 'isActive',
      title: 'Status',
      sortable: true,
      type: 'boolean',
      width: '20%'
    }
  ];

  constructor(private titleService: Title, private metaService: Meta) {}

  ngOnInit(): void {
    this.titleService.setTitle('Article Categories | Admin Panel');
    this.metaService.updateTag({ name: 'description', content: 'Manage article categories in the admin panel. Organize your content with categories.' });
    this.metaService.updateTag({ name: 'keywords', content: 'admin, article categories, content organization, categories, blog' });
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;

    // Simulated API call - replace with actual service call
    setTimeout(() => {
      // Mock data for categories
      const mockCategories = [
        {
          id: 1,
          name: 'Technology',
          description: 'Articles about technology',
          parentId: null,
          parentName: 'None',
          articleCount: 12,
          isActive: true,
          createdAt: new Date('2023-01-15'),
          slug: 'technology',
          sortOrder: 1
        },
        {
          id: 2,
          name: 'Programming',
          description: 'Articles about programming',
          parentId: 1,
          parentName: 'Technology',
          articleCount: 8,
          isActive: true,
          createdAt: new Date('2023-01-20'),
          slug: 'programming',
          sortOrder: 2
        },
        {
          id: 3,
          name: 'Web Development',
          description: 'Articles about web development',
          parentId: 1,
          parentName: 'Technology',
          articleCount: 6,
          isActive: true,
          createdAt: new Date('2023-01-25'),
          slug: 'web-development',
          sortOrder: 3
        },
        {
          id: 4,
          name: 'Design',
          description: 'Articles about design',
          parentId: null,
          parentName: 'None',
          articleCount: 5,
          isActive: true,
          createdAt: new Date('2023-02-10'),
          slug: 'design',
          sortOrder: 4
        },
        {
          id: 5,
          name: 'Business',
          description: 'Articles about business',
          parentId: null,
          parentName: 'None',
          articleCount: 3,
          isActive: false,
          createdAt: new Date('2023-02-15'),
          slug: 'business',
          sortOrder: 5
        }
      ];

      // Apply client-side filtering
      let filteredCategories = mockCategories.filter((category: any) => {
        // Apply search filter
        const matchesSearch = !this.searchTerm ||
          category.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          category.description.toLowerCase().includes(this.searchTerm.toLowerCase());

        // Apply status filter
        const matchesStatus = !this.statusFilter ||
          (this.statusFilter === 'active' && category.isActive) ||
          (this.statusFilter === 'inactive' && !category.isActive);

        return matchesSearch && matchesStatus;
      });

      // Calculate pagination values
      this.totalCount = filteredCategories.length;
      this.totalPages = Math.ceil(this.totalCount / this.pageSize);

      // Apply client-side pagination
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.categories = filteredCategories.slice(startIndex, endIndex);
      this.allCategories = mockCategories; // Store all categories for parent selection
      this.loading = false;
    }, 500);
  }

  applyFilters(): void {
    // Reset to first page when applying filters
    this.currentPage = 1;
    this.loadCategories();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCategories();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadCategories();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadCategories();
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
  deleteCategory(id: number): void {
    this.categoryToDelete = id;
    this.confirmDialogTitle = 'Delete Category';
    this.confirmDialogMessage = 'Are you sure you want to delete this category? This action cannot be undone and will affect all articles in this category.';
    this.confirmDialogConfirmText = 'Delete';
    this.confirmDialogCancelText = 'Cancel';
    this.showConfirmDialog = true;
  }

  getCurrentPageEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalCount);
  }

  // Handle confirm delete
  onConfirmDelete(): void {
    if (this.categoryToDelete !== null) {
      this.deletingId = this.categoryToDelete; // Set loading state

      // Simulated API call - replace with actual service call
      setTimeout(() => {
        console.log('Category deleted successfully');
        // Reset deletingId
        this.deletingId = null;
        this.categoryToDelete = null;
        // Reload categories after deletion
        this.loadCategories();
        this.showConfirmDialog = false;
      }, 500);
    }
  }

  // Handle cancel delete
  onCancelDelete(): void {
    this.showConfirmDialog = false;
    this.categoryToDelete = null;
  }

  handleAction(actionName: string, item: any): void {
    switch(actionName) {
      case 'edit':
        this.openEditModal(item);
        break;
      case 'delete':
        this.deleteCategory(item.id);
        break;
    }
  }

  onPageChange(pageConfig: any): void {
    this.currentPage = pageConfig.currentPage;
    this.pageSize = pageConfig.pageSize;
    this.loadCategories();
  }

  onFilterChange(filterConfig: any): void {
    this.searchTerm = filterConfig.searchTerm;
    this.statusFilter = filterConfig.filters?.status || '';
    this.currentPage = 1; // Reset to first page when filters change
    this.loadCategories();
  }

  // Modal methods
  openCreateModal(): void {
    this.editingCategory = null;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(category: any): void {
    this.editingCategory = category;
    this.categoryFormModel = {
      name: category.name || '',
      description: category.description || '',
      slug: category.slug || '',
      parentId: category.parentId || null,
      imageUrl: category.imageUrl || '',
      sortOrder: category.sortOrder || 0,
      isActive: category.isActive || false,
      metaTitle: category.metaTitle || '',
      metaDescription: category.metaDescription || '',
      metaKeywords: category.metaKeywords || ''
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingCategory = null;
    this.resetForm();
  }

  resetForm(): void {
    this.categoryFormModel = {
      name: '',
      description: '',
      slug: '',
      parentId: null,
      imageUrl: '',
      sortOrder: 0,
      isActive: true,
      metaTitle: '',
      metaDescription: '',
      metaKeywords: ''
    };
  }

  // Create category method
  createCategory(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = null;

    // Prepare the request body
    const createDto = {
      name: this.categoryFormModel.name,
      description: this.categoryFormModel.description || null,
      slug: this.categoryFormModel.slug || null,
      parentId: this.categoryFormModel.parentId || null,
      imageUrl: this.categoryFormModel.imageUrl || null,
      sortOrder: this.categoryFormModel.sortOrder,
      isActive: this.categoryFormModel.isActive,
      metaTitle: this.categoryFormModel.metaTitle || null,
      metaDescription: this.categoryFormModel.metaDescription || null,
      metaKeywords: this.categoryFormModel.metaKeywords || null
    };

    // Simulated API call - replace with actual service call
    setTimeout(() => {
      console.log('Category created successfully', createDto);
      this.loading = false;
      this.closeModal();
      this.loadCategories(); // Reload the list
    }, 500);
  }

  // Update category method
  updateCategory(): void {
    if (!this.editingCategory?.id || !this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = null;
    
    // Prepare the request body
    const updateDto = {
      name: this.categoryFormModel.name,
      description: this.categoryFormModel.description || null,
      slug: this.categoryFormModel.slug || null,
      parentId: this.categoryFormModel.parentId || null,
      imageUrl: this.categoryFormModel.imageUrl || null,
      sortOrder: this.categoryFormModel.sortOrder,
      isActive: this.categoryFormModel.isActive,
      metaTitle: this.categoryFormModel.metaTitle || null,
      metaDescription: this.categoryFormModel.metaDescription || null,
      metaKeywords: this.categoryFormModel.metaKeywords || null
    };
    
    // Simulated API call - replace with actual service call
    setTimeout(() => {
      console.log('Category updated successfully', updateDto);
      this.loading = false;
      this.closeModal();
      this.loadCategories(); // Reload the list
    }, 500);
  }

  // Validate form method
  validateForm(): boolean {
    if (!this.categoryFormModel.name.trim()) {
      alert('Category name is required');
      return false;
    }
    return true;
  }
}