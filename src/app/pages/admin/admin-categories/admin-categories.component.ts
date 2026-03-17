import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryDto } from '../../../../public-api/model/categoryDto';
import { CategoryService } from '../../../../public-api/api/category.service';
import { FileService } from '../../../../public-api/api/file.service';
import { CommonTableComponent, TableColumn, PaginationConfig, FilterConfig } from '../../../components/common-table/common-table.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { LanguageService } from '../../../services/language.service';
import { MessageDialogService } from '../../../services/message-dialog.service';
import { lastValueFrom } from 'rxjs';

interface CategoryTableItem extends CategoryDto {
  displayName: string;
}

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [FormsModule, CommonTableComponent, ConfirmDialogComponent, TranslatePipe],
  template: `
    <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">{{ 'Admin Categories' | translate }}</h1>
        <div class="mt-4 flex justify-between items-center">
          <p class="text-gray-600">{{ 'View and manage product categories' | translate }}</p>
          <button
            (click)="openCreateModal()"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            {{ 'Add New Category' | translate }}
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
          { name: 'edit', title: 'Edit' | translate, color: 'indigo' },
          { name: 'delete', title: 'Delete' | translate, color: 'red' }
        ]"
        (action)="handleAction($event.name, $event.item)"
        (pageChange)="onPageChange($event)"
        (filterChange)="onFilterChange($event)">
      </misc-common-table>

      <!-- Create/Edit Category Modal -->
       @if(showModal) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] flex flex-col">
            <div class="flex justify-between items-center px-6 pt-6 pb-4">
              <h3 class="text-lg font-semibold">
                {{ editingCategory ? ('Edit Category' | translate) : ('Create Category' | translate) }}
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
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Name' | translate }} *</label>
                  <input
                    type="text"
                    [(ngModel)]="categoryFormModel.name"
                    name="name"
                    id="name"
                    required
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    [placeholder]="'Category name' | translate"
                  >
                </div>

                <div>
                  <label for="description" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Description' | translate }}</label>
                  <textarea
                    [(ngModel)]="categoryFormModel.description"
                    name="description"
                    id="description"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    [placeholder]="'Category description' | translate"
                    rows="3"
                  ></textarea>
                </div>

                <div>
                  <label for="slug" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Slug' | translate }}</label>
                  <input
                    type="text"
                    [(ngModel)]="categoryFormModel.slug"
                    name="slug"
                    id="slug"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    [placeholder]="'Category slug' | translate"
                  >
                </div>

                <div>
                  <label for="file-upload" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Category Image' | translate }}</label>
                  <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
                    <div class="space-y-1 text-center">
                      <div class="flex text-sm text-gray-600 justify-center">
                        <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>{{ 'Upload a file' | translate }}</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/*"
                            class="sr-only"
                            (change)="onFileSelected($event)"
                          />
                        </label>
                        <p class="pl-1">{{ 'or drag and drop' | translate }}</p>
                      </div>
                      <p class="text-xs text-gray-500">{{ 'PNG, JPG, GIF up to 5MB' | translate }}</p>
                    </div>
                  </div>

                  <!-- File preview -->
                   @if(filePreview) {
                    <div class="mt-3">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center">
                          <img
                            [src]="filePreview"
                            alt="Preview"
                            class="w-16 h-16 object-cover rounded-md border"
                          >
                          @if(selectedFile) {
                            <span class="ml-3 text-sm text-gray-600 truncate max-w-xs">
                              {{ selectedFile.name }}
                            </span>
                          }
                        </div>
                        <button
                          type="button"
                          (click)="removeFile()"
                          class="ml-3 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                          </svg>
                        </button>
                      </div>

                      <!-- Show uploading status -->
                       @if(isUploading) {
                        <div class="mt-2">
                          <div class="flex items-center">
                            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                            <span class="ml-2 text-sm text-gray-600">{{ 'Uploading...' | translate }}</span>
                          </div>
                        </div>
                       }
                    </div>
                   }
                </div>

                <div>
                  <label for="sortOrder" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Sort Order' | translate }}</label>
                  <input
                    type="number"
                    [(ngModel)]="categoryFormModel.sortOrder"
                    name="sortOrder"
                    id="sortOrder"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    [placeholder]="'Sort order' | translate"
                  >
                </div>

                <div>
                  <label for="metaTitle" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Meta Title' | translate }}</label>
                  <input
                    type="text"
                    [(ngModel)]="categoryFormModel.metaTitle"
                    name="metaTitle"
                    id="metaTitle"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    [placeholder]="'Meta title' | translate"
                  >
                </div>

                <div>
                  <label for="metaDescription" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Meta Description' | translate }}</label>
                  <textarea
                    [(ngModel)]="categoryFormModel.metaDescription"
                    name="metaDescription"
                    id="metaDescription"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    [placeholder]="'Meta description' | translate"
                    rows="2"
                  ></textarea>
                </div>

                <div>
                  <label for="metaKeywords" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Meta Keywords' | translate }}</label>
                  <input
                    type="text"
                    [(ngModel)]="categoryFormModel.metaKeywords"
                    name="metaKeywords"
                    id="metaKeywords"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    [placeholder]="'Meta keywords' | translate"
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
                  <label for="isActive" class="ml-2 block text-sm text-gray-700">{{ 'Active' | translate }}</label>
                </div>
              </div>
              </div>

              <div class="mt-6 flex justify-end space-x-3 px-6 pb-6">
                <button
                  type="button"
                  (click)="closeModal()"
                  class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  {{ 'Cancel' | translate }}
                </button>
                <button
                  type="submit"
                  [disabled]="!categoryForm.form.valid"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ editingCategory ? ('Update Category' | translate) : ('Create Category' | translate) }}
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
export class AdminCategoriesComponent implements OnInit {
  private languageService = inject(LanguageService);
  private messageDialogService = inject(MessageDialogService);
  private categoryService = inject(CategoryService);
  private fileService = inject(FileService);
  private cdr = inject(ChangeDetectorRef);

  categories: CategoryTableItem[] = [];
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

  // Table configuration
  tableColumns: TableColumn[] = [
    {
      key: 'displayName',
      title: 'Category',
      sortable: true,
      width: '40%'
    },
    {
      key: 'imageUrl',
      title: 'Image',
      sortable: false,
      type: 'image',
      width: '20%'
    },
    {
      key: 'activeProductsCount',
      title: 'Active Products',
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

  // Category form modal
  showModal = false;
  editingCategory: CategoryTableItem | null = null;
  categoryFormModel = {
    name: '',
    description: '',
    slug: '',
    imageUrl: '',
    sortOrder: 0,
    isActive: true,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  };

  // File upload properties
  selectedFile: File | null = null;
  filePreview: string | null = null;
  isUploading = false;

  // Confirm dialog properties
  showConfirmDialog = false;
  confirmDialogTitle = '';
  confirmDialogMessage = '';
  confirmDialogConfirmText = '';
  confirmDialogCancelText = '';
  categoryToDelete: number | null = null;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;

    this.categoryService.apiCategoryGet().subscribe({
      next: (response) => {
        const allCategories = (response?.data || []).map((cat: CategoryDto) => ({
          ...cat,
          id: cat.id || 0,
          name: cat.name || '',
          description: cat.description || '',
          isActive: cat.isActive ?? false,
          activeProductsCount: cat.activeProductsCount ?? 0,
          slug: cat.slug || '',
          imageUrl: cat.imageUrl || '',
          sortOrder: cat.sortOrder ?? 0,
          metaTitle: cat.metaTitle || '',
          metaDescription: cat.metaDescription || '',
          metaKeywords: cat.metaKeywords || '',
          displayName: this.formatCategoryDisplay(cat.name || '', cat.description || '')
        }));

        // Apply client-side filtering
        const filteredCategories = this.applyFilters(allCategories);

        // Update pagination
        this.paginationConfig.totalItems = filteredCategories.length;
        this.paginationConfig.totalPages = Math.ceil(filteredCategories.length / this.paginationConfig.pageSize);

        // Apply client-side pagination
        const startIndex = (this.paginationConfig.currentPage - 1) * this.paginationConfig.pageSize;
        const endIndex = startIndex + this.paginationConfig.pageSize;
        this.categories = filteredCategories.slice(startIndex, endIndex);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categories = [];
        this.paginationConfig.totalItems = 0;
        this.paginationConfig.totalPages = 0;
        this.loading = false;
        this.error = this.languageService.getTranslation('Error loading categories. Please try again later.');
      }
    });
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

  formatCategoryDisplay(name: string, description: string): string {
    return `${name} ${description ? `(${description})` : ''}`;
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
    this.confirmDialogTitle = this.languageService.getTranslation('Delete Category');
    this.confirmDialogMessage = this.languageService.getTranslation('Are you sure you want to delete this category? This action cannot be undone.');
    this.confirmDialogConfirmText = this.languageService.getTranslation('Delete');
    this.confirmDialogCancelText = this.languageService.getTranslation('Cancel');
    this.showConfirmDialog = true;
  }

  onConfirmDelete(): void {
    if (this.categoryToDelete !== null) {
      this.categoryService.apiCategoryIdDelete(this.categoryToDelete).subscribe({
        next: () => {
          this.messageDialogService.success(
            this.languageService.getTranslation('Category deleted successfully!'),
            this.languageService.getTranslation('Success')
          );
          this.categoryToDelete = null;
          this.showConfirmDialog = false;
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.categoryToDelete = null;
          this.showConfirmDialog = false;
          this.messageDialogService.error(
            this.languageService.getTranslation('Error deleting category. Please try again.'),
            this.languageService.getTranslation('Error')
          );
        }
      });
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
      imageUrl: category.imageUrl || '',
      sortOrder: category.sortOrder ?? 0,
      isActive: category.isActive ?? false,
      metaTitle: category.metaTitle || '',
      metaDescription: category.metaDescription || '',
      metaKeywords: category.metaKeywords || ''
    };

    this.selectedFile = null;
    this.filePreview = category.imageUrl || null;
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
      imageUrl: '',
      sortOrder: 0,
      isActive: true,
      metaTitle: '',
      metaDescription: '',
      metaKeywords: ''
    };
    this.selectedFile = null;
    this.filePreview = null;
  }

  // File upload handling
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.messageDialogService.error(
          this.languageService.getTranslation('Please select a valid image file (JPEG, PNG, GIF)'),
          this.languageService.getTranslation('Invalid File Type')
        );
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.messageDialogService.error(
          this.languageService.getTranslation('File size too large. Please select an image under 5MB.'),
          this.languageService.getTranslation('File Too Large')
        );
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.filePreview = null;
  }

  async uploadFile(): Promise<string | null> {
    if (!this.selectedFile) {
      return this.categoryFormModel.imageUrl;
    }

    this.isUploading = true;
    try {
      const response = await lastValueFrom(
        this.fileService.apiFileUploadImagePost('category', this.selectedFile)
      );
      this.isUploading = false;
      return response?.data || null;
    } catch (error) {
      console.error('Error uploading file:', error);
      this.isUploading = false;
      this.messageDialogService.error(
        this.languageService.getTranslation('Error uploading image. Please try again.'),
        this.languageService.getTranslation('Upload Error')
      );
      return null;
    }
  }

  async createCategory(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;

    let imageUrl: string | null = this.categoryFormModel.imageUrl;
    if (this.selectedFile) {
      imageUrl = await this.uploadFile();
      if (imageUrl === null) {
        this.loading = false;
        return;
      }
    }

    const createDto = {
      name: this.categoryFormModel.name,
      description: this.categoryFormModel.description || null,
      slug: this.categoryFormModel.slug || null,
      imageUrl: imageUrl || null,
      sortOrder: this.categoryFormModel.sortOrder,
      isActive: this.categoryFormModel.isActive,
      metaTitle: this.categoryFormModel.metaTitle || null,
      metaDescription: this.categoryFormModel.metaDescription || null,
      metaKeywords: this.categoryFormModel.metaKeywords || null
    };

    this.categoryService.apiCategoryPost(createDto).subscribe({
      next: () => {
        this.messageDialogService.success(
          this.languageService.getTranslation('Category created successfully!'),
          this.languageService.getTranslation('Success')
        );
        this.loading = false;
        this.closeModal();
        this.loadCategories();
      },
      error: (error) => {
        console.error('Error creating category:', error);
        this.loading = false;
        this.messageDialogService.error(
          this.languageService.getTranslation('Error creating category. Please try again.'),
          this.languageService.getTranslation('Error')
        );
      }
    });
  }

  async updateCategory(): Promise<void> {
    if (!this.editingCategory?.id || !this.validateForm()) {
      return;
    }

    this.loading = true;

    let imageUrl: string | null = this.categoryFormModel.imageUrl;
    if (this.selectedFile) {
      imageUrl = await this.uploadFile();
      if (imageUrl === null) {
        this.loading = false;
        return;
      }
    } else {
      imageUrl = this.editingCategory.imageUrl || null;
    }

    const updateDto = {
      name: this.categoryFormModel.name,
      description: this.categoryFormModel.description || null,
      slug: this.categoryFormModel.slug || null,
      imageUrl: imageUrl,
      sortOrder: this.categoryFormModel.sortOrder,
      isActive: this.categoryFormModel.isActive,
      metaTitle: this.categoryFormModel.metaTitle || null,
      metaDescription: this.categoryFormModel.metaDescription || null,
      metaKeywords: this.categoryFormModel.metaKeywords || null
    };

    this.categoryService.apiCategoryIdPut(this.editingCategory.id, updateDto).subscribe({
      next: () => {
        this.messageDialogService.success(
          this.languageService.getTranslation('Category updated successfully!'),
          this.languageService.getTranslation('Success')
        );
        this.loading = false;
        this.closeModal();
        this.loadCategories();
      },
      error: (error) => {
        console.error('Error updating category:', error);
        this.loading = false;
        this.messageDialogService.error(
          this.languageService.getTranslation('Error updating category. Please try again.'),
          this.languageService.getTranslation('Error')
        );
      }
    });
  }

  validateForm(): boolean {
    if (!this.categoryFormModel.name.trim()) {
      this.messageDialogService.error(
        this.languageService.getTranslation('Category name is required'),
        this.languageService.getTranslation('Validation Error')
      );
      return false;
    }
    return true;
  }
}
