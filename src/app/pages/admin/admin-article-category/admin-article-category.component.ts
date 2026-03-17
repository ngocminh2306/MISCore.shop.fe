import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArticleCategoryDto } from '../../../../public-api/model/articleCategoryDto';
import { CommonTableComponent, TableColumn, PaginationConfig, FilterConfig } from '../../../components/common-table/common-table.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { Title, Meta } from '@angular/platform-browser';

interface CategoryTableItem extends Omit<ArticleCategoryDto, 'createdAt'> {
  id: number;
  name: string;
  parentName?: string;
  articleCount?: number;
  createdAt: Date;
  imageUrl?: string;
  displayOrder?: number;
}

@Component({
  selector: 'app-admin-article-category',
  standalone: true,
  imports: [FormsModule, CommonTableComponent, ConfirmDialogComponent],
  template: `
    <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        [paginationConfig]="paginationConfig"
        [filterConfig]="filterConfig"
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
      @if (showModal) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] flex flex-col">
            <div class="flex justify-between items-center px-6 pt-6 pb-4">
              <h3 class="text-lg font-semibold">
                {{ editingCategory ? 'Edit Category' : 'Create Category' }}
              </h3>
              <button (click)="closeModal()" class="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form (ngSubmit)="editingCategory ? updateCategory() : createCategory()" #categoryForm="ngForm" class="flex flex-col flex-grow overflow-hidden">
              <div class="overflow-y-auto flex-grow px-6 pb-4">
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
                      @for (cat of allCategories; track cat.id) {
                        <option 
                          [value]="cat.id" 
                          [disabled]="editingCategory && cat.id === editingCategory.id">
                          {{ cat.name }}
                        </option>
                      }
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
              </div>

              <div class="mt-6 flex justify-end space-x-3 px-6 pb-6">
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
      }

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
export class AdminArticleCategoryComponent implements OnInit {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private cdr = inject(ChangeDetectorRef);

  categories: CategoryTableItem[] = [];
  allCategories: CategoryTableItem[] = []; // For parent category select
  loading = false;
  error: string | null = null;

  // Pagination configuration
  paginationConfig: PaginationConfig = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  };

  // Filter configuration
  filterConfig: FilterConfig = {
    searchTerm: '',
    filters: {
      status: ''
    }
  };

  // Category form modal
  showModal = false;
  editingCategory: CategoryTableItem | null = null;
  categoryFormModel: CategoryFormModel = {
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
      width: '35%'
    },
    {
      key: 'parentName',
      title: 'Parent Category',
      sortable: true,
      type: 'text',
      width: '25%'
    },
    {
      key: 'articleCount',
      title: 'Articles',
      sortable: true,
      type: 'number',
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
      const mockCategories: CategoryTableItem[] = [
        {
          id: 1,
          name: 'Technology',
          description: 'Articles about technology',
          parentCategoryId: null,
          parentName: 'None',
          articleCount: 12,
          isActive: true,
          createdAt: new Date('2023-01-15'),
          slug: 'technology',
          displayOrder: 1
        },
        {
          id: 2,
          name: 'Programming',
          description: 'Articles about programming',
          parentCategoryId: 1,
          parentName: 'Technology',
          articleCount: 8,
          isActive: true,
          createdAt: new Date('2023-01-20'),
          slug: 'programming',
          displayOrder: 2
        },
        {
          id: 3,
          name: 'Web Development',
          description: 'Articles about web development',
          parentCategoryId: 1,
          parentName: 'Technology',
          articleCount: 6,
          isActive: true,
          createdAt: new Date('2023-01-25'),
          slug: 'web-development',
          displayOrder: 3
        },
        {
          id: 4,
          name: 'Design',
          description: 'Articles about design',
          parentCategoryId: null,
          parentName: 'None',
          articleCount: 5,
          isActive: true,
          createdAt: new Date('2023-02-10'),
          slug: 'design',
          displayOrder: 4
        },
        {
          id: 5,
          name: 'Business',
          description: 'Articles about business',
          parentCategoryId: null,
          parentName: 'None',
          articleCount: 3,
          isActive: false,
          createdAt: new Date('2023-02-15'),
          slug: 'business',
          displayOrder: 5
        }
      ];

      // Apply client-side filtering
      const filteredCategories = this.applyFilters(mockCategories);

      // Update pagination
      this.paginationConfig.totalItems = filteredCategories.length;
      this.paginationConfig.totalPages = Math.ceil(filteredCategories.length / this.paginationConfig.pageSize);

      // Apply client-side pagination
      const startIndex = (this.paginationConfig.currentPage - 1) * this.paginationConfig.pageSize;
      const endIndex = startIndex + this.paginationConfig.pageSize;
      this.categories = filteredCategories.slice(startIndex, endIndex);
      this.allCategories = mockCategories; // Store all categories for parent selection
      this.loading = false;
      this.cdr.detectChanges();
    }, 500);
  }

  private applyFilters(categories: CategoryTableItem[]): CategoryTableItem[] {
    return categories.filter((category) => {
      // Apply search filter
      const matchesSearch = !this.filterConfig.searchTerm ||
        category.name?.toLowerCase().includes(this.filterConfig.searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(this.filterConfig.searchTerm.toLowerCase());

      // Apply status filter
      const statusFilter = this.filterConfig.filters['status'];
      const matchesStatus = !statusFilter ||
        (statusFilter === 'active' && category.isActive) ||
        (statusFilter === 'inactive' && !category.isActive);

      return matchesSearch && matchesStatus;
    });
  }

  handleAction(actionName: string, item: CategoryTableItem): void {
    switch (actionName) {
      case 'edit':
        this.openEditModal(item);
        break;
      case 'delete':
        if (item.id) {
          this.deleteCategory(item.id);
        }
        break;
    }
  }

  onPageChange(pageConfig: PaginationConfig): void {
    this.paginationConfig = pageConfig;
    this.loadCategories();
  }

  onFilterChange(filterConfig: FilterConfig): void {
    this.filterConfig = filterConfig;
    this.paginationConfig.currentPage = 1;
    this.loadCategories();
  }

  // Delete methods
  deleteCategory(id: number): void {
    this.categoryToDelete = id;
    this.confirmDialogTitle = 'Delete Category';
    this.confirmDialogMessage = 'Are you sure you want to delete this category? This action cannot be undone and will affect all articles in this category.';
    this.confirmDialogConfirmText = 'Delete';
    this.confirmDialogCancelText = 'Cancel';
    this.showConfirmDialog = true;
  }

  onConfirmDelete(): void {
    if (this.categoryToDelete !== null) {
      // Simulated API call - replace with actual service call
      setTimeout(() => {
        console.log('Category deleted successfully');
        this.categoryToDelete = null;
        this.showConfirmDialog = false;
        this.loadCategories();
        this.cdr.detectChanges();
      }, 500);
    }
  }

  onCancelDelete(): void {
    this.showConfirmDialog = false;
    this.categoryToDelete = null;
  }

  // Modal methods
  openCreateModal(): void {
    this.editingCategory = null;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(category: CategoryTableItem): void {
    this.editingCategory = category;
    this.categoryFormModel = {
      name: category.name || '',
      description: category.description || '',
      slug: category.slug || '',
      parentId: category.parentCategoryId ?? null,
      imageUrl: category.imageUrl || '',
      sortOrder: category.displayOrder ?? 0,
      isActive: category.isActive ?? false,
      metaTitle: '',
      metaDescription: '',
      metaKeywords: ''
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
      this.loadCategories();
      this.cdr.detectChanges();
    }, 500);
  }

  // Update category method
  updateCategory(): void {
    if (!this.editingCategory?.id || !this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = null;

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
      this.loadCategories();
      this.cdr.detectChanges();
    }, 500);
  }

  validateForm(): boolean {
    if (!this.categoryFormModel.name.trim()) {
      alert('Category name is required');
      return false;
    }
    return true;
  }
}

interface CategoryFormModel {
  name: string;
  description: string;
  slug: string;
  parentId: number | null;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}
