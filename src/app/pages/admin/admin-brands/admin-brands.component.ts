import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrandService } from '../../../../public-api/api/brand.service';
import { FileService } from '../../../../public-api/api/file.service';
import { BrandDto } from '../../../../public-api/model/brandDto';
import { CommonTableComponent, TableColumn } from '../../../components/common-table/common-table.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { lastValueFrom } from 'rxjs';

interface Brand {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
  isActive: boolean;
  productCount: number;
  createdAt: Date;
  updatedAt?: Date;
}

@Component({
  selector: 'app-admin-brands',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, CommonTableComponent, ConfirmDialogComponent, TranslatePipe],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">{{ 'Admin Brands' | translate }}</h1>
        <div class="mt-4 flex justify-between items-center">
          <p class="text-gray-600">{{ 'View and manage product brands' | translate }}</p>
          <button
            (click)="openCreateModal()"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            {{ 'Add New Brand' | translate }}
          </button>
        </div>

        <!-- Error Message -->
        @if (error) {
          <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Error</h3>
                <div class="mt-2 text-sm text-red-700">
                  <p>{{ error }}</p>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Brands Table using CommonTable Component -->
      <misc-common-table
        [data]="brands"
        [columns]="tableColumns"
        tableName="brands"
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
          { name: 'edit', title: 'Edit' | translate, color: 'indigo' },
          { name: 'delete', title: 'Delete' | translate, color: 'red' }
        ]"
        (action)="handleAction($event.name, $event.item)"
        (pageChange)="onPageChange($event)"
        (filterChange)="onFilterChange($event)">
      </misc-common-table>

      <!-- Create/Edit Brand Modal -->
      <div *ngIf="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">
              {{ editingBrand ? ('Edit Brand' | translate) : ('Create Brand' | translate) }}
            </h3>
            <button (click)="closeModal()" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form (ngSubmit)="editingBrand ? updateBrand() : createBrand()" #brandForm="ngForm">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'Name' | translate }} *</label>
                <input
                  type="text"
                  [(ngModel)]="brandFormModel.name"
                  name="name"
                  required
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  [placeholder]="'Brand name' | translate"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'Description' | translate }}</label>
                <textarea
                  [(ngModel)]="brandFormModel.description"
                  name="description"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  [placeholder]="'Brand description' | translate"
                  rows="3"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'Brand Logo' | translate }}</label>
                <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
                  <div class="space-y-1 text-center">
                    <div class="flex text-sm text-gray-600 justify-center">
                      <label for="logo-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>{{ 'Upload a file' | translate }}</span>
                        <input
                          id="logo-upload"
                          name="logo-upload"
                          type="file"
                          accept="image/*"
                          class="sr-only"
                          (change)="onFileSelected($event)"
                        />
                      </label>
                      <p class="pl-1">or drag and drop</p>
                    </div>
                    <p class="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </div>

                <!-- File preview -->
                <div *ngIf="filePreview" class="mt-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <img
                        [src]="filePreview"
                        alt="Logo Preview"
                        class="w-16 h-16 object-cover rounded-md border"
                        *ngIf="filePreview && selectedFile; else urlPreview"
                      >
                      <ng-template #urlPreview>
                        <img
                          [src]="filePreview"
                          alt="Current Logo"
                          class="w-16 h-16 object-cover rounded-md border"
                        >
                      </ng-template>
                      <span class="ml-3 text-sm text-gray-600 truncate max-w-xs" *ngIf="selectedFile">
                        {{ selectedFile.name }}
                      </span>
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
                  <div *ngIf="isUploading" class="mt-2">
                    <div class="flex items-center">
                      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                      <span class="ml-2 text-sm text-gray-600">Uploading...</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                <input
                  type="text"
                  [(ngModel)]="brandFormModel.websiteUrl"
                  name="websiteUrl"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Brand website URL"
                >
              </div>

              <div class="flex items-center">
                <input
                  type="checkbox"
                  [(ngModel)]="brandFormModel.isActive"
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
                [disabled]="!brandForm.form.valid"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ editingBrand ? 'Update Brand' : 'Create Brand' }}
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
export class AdminBrandsComponent implements OnInit {
  brands: Brand[] = [];
  searchTerm = '';
  statusFilter = '';
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;
  loading = false;
  error: string | null = null;

  // Brand form modal
  showModal = false;
  editingBrand: Brand | null = null;
  brandFormModel = {
    name: '',
    description: '',
    logoUrl: '',
    websiteUrl: '',
    isActive: true
  };

  // File upload properties
  selectedFile: File | null = null;
  filePreview: string | null = null;
  isUploading = false;

  // Confirm dialog properties
  showConfirmDialog = false;
  confirmDialogTitle = '';
  confirmDialogMessage = '';
  confirmDialogConfirmText = 'Confirm';
  confirmDialogCancelText = 'Cancel';
  brandToDelete: number | null = null;

  // Table configuration
  tableColumns: TableColumn[] = [
    {
      key: 'logoUrl',
      title: 'Logo',
      sortable: false,
      type: 'image'
    },
    {
      key: 'name',
      title: 'Brand',
      sortable: true,
      type: 'custom',
      width: '30%'
    },
    {
      key: 'productCount',
      title: 'Products',
      sortable: true,
      type: 'text',
      width: '20%'
    },
    {
      key: 'isActive',
      title: 'Status',
      sortable: true,
      type: 'boolean',
      width: '20%'
    },
    {
      key: 'createdAt',
      title: 'Created',
      sortable: true,
      type: 'date',
      width: '20%'
    }
  ];

  constructor(
    private brandService: BrandService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.loading = true;
    this.error = null;

    // Call the real API to get brands
    this.brandService.apiBrandGet().subscribe({
      next: (response: any) => {
        // Format response to match our Brand interface
        let allBrands = (response.data || []).map((brand: BrandDto) => ({
          id: brand.id || 0,
          name: brand.name || '',
          description: brand.description || '',
          logoUrl: brand.logoUrl || '',
          isActive: brand.isActive || false,
          productCount: brand.productCount || 0,
          createdAt: brand.createdAt ? new Date(brand.createdAt) : new Date(),
          updatedAt: undefined // BrandDto doesn't have an updatedAt property
        }));

        // Apply client-side filtering
        let filteredBrands = allBrands.filter((brand: any) => {
          // Apply search filter
          const matchesSearch = !this.searchTerm ||
            brand.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            (brand.description && brand.description.toLowerCase().includes(this.searchTerm.toLowerCase()));

          // Apply status filter
          const matchesStatus = !this.statusFilter ||
            (this.statusFilter === 'active' && brand.isActive) ||
            (this.statusFilter === 'inactive' && !brand.isActive);

          return matchesSearch && matchesStatus;
        });

        // Calculate pagination values
        this.totalCount = filteredBrands.length;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);

        // Apply client-side pagination
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.brands = filteredBrands.slice(startIndex, endIndex);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading brands:', error);
        this.brands = []; // Set to empty array on error
        this.totalCount = 0;
        this.totalPages = 0;
        this.loading = false;
        this.error = 'Error loading brands. Please try again later.';
      }
    });
  }

  // Modal methods
  openCreateModal(): void {
    this.editingBrand = null;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(brand: Brand): void {
    this.editingBrand = brand;
    this.brandFormModel = {
      name: brand.name,
      description: brand.description || '',
      logoUrl: brand.logoUrl || '',
      websiteUrl: '', // BrandDto doesn't have websiteUrl, so we initialize with empty string
      isActive: brand.isActive
    };

    // Reset file upload properties but keep the existing logo URL for display
    this.selectedFile = null;
    if (brand.logoUrl) {
      this.filePreview = brand.logoUrl; // Show existing logo URL
    } else {
      this.filePreview = null;
    }

    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingBrand = null;
    this.resetForm();
  }

  resetForm(): void {
    this.brandFormModel = {
      name: '',
      description: '',
      logoUrl: '',
      websiteUrl: '',
      isActive: true
    };
    // Reset file upload properties
    this.selectedFile = null;
    this.filePreview = null;
  }

  // File upload handling
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.showError('Please select a valid image file (JPEG, PNG, GIF)');
        return;
      }

      // Validate file size (e.g., 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.showError('File size too large. Please select an image under 5MB.');
        return;
      }

      this.selectedFile = file;

      // Create preview
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
      return this.brandFormModel.logoUrl; // Return existing URL if no new file
    }

    this.isUploading = true;
    try {
      // Upload the file using the file service
      const response = await lastValueFrom(this.fileService.apiFileUploadImagePost('brands', this.selectedFile));
      this.isUploading = false;
      return response?.data || null;
    } catch (error) {
      console.error('Error uploading file:', error);
      this.isUploading = false;
      this.showError('Error uploading image. Please try again.');
      return null;
    }
  }

  // Create brand method
  async createBrand(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = null;

    // Upload the file if selected and get the URL
    let logoUrl: string | null = null;
    if (this.selectedFile) {
      logoUrl = await this.uploadFile();
      if (logoUrl === null) {
        this.loading = false;
        return; // Upload failed
      }
    }

    // Prepare the request body according to BrandDto
    const createDto = {
      name: this.brandFormModel.name,
      description: this.brandFormModel.description || null,
      logoUrl: logoUrl || null, // Use uploaded image URL or null
      websiteUrl: this.brandFormModel.websiteUrl || null,
      isActive: this.brandFormModel.isActive
    };

    this.brandService.apiBrandPost(createDto).subscribe({
      next: (response) => {
        console.log('Brand created successfully', response);
        this.loading = false;
        this.closeModal();
        this.loadBrands(); // Reload the list
      },
      error: (error) => {
        console.error('Error creating brand:', error);
        this.loading = false;
        this.error = 'Error creating brand. Please try again.';
        this.showError('Error creating brand: ' + (error?.error?.message || error?.message || 'Unknown error'));
      }
    });
  }

  // Update brand method
  async updateBrand(): Promise<void> {
    if (!this.editingBrand?.id || !this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = null;

    // Determine the logo URL to use
    let logoUrl: string | null = null;

    if (this.selectedFile) {
      // If a new file was selected, upload it
      logoUrl = await this.uploadFile();
      if (logoUrl === null) {
        this.loading = false;
        return; // Upload failed
      }
    } else {
      // If no new file was selected, use the existing logo URL from the brand being edited
      logoUrl = this.editingBrand.logoUrl || null;
    }

    // Prepare the request body according to BrandDto
    const updateDto = {
      name: this.brandFormModel.name,
      description: this.brandFormModel.description || null,
      logoUrl: logoUrl,
      websiteUrl: this.brandFormModel.websiteUrl || null,
      isActive: this.brandFormModel.isActive
    };

    this.brandService.apiBrandIdPut(this.editingBrand.id, updateDto).subscribe({
      next: (response) => {
        console.log('Brand updated successfully', response);
        this.loading = false;
        this.closeModal();
        this.loadBrands(); // Reload the list
      },
      error: (error) => {
        console.error('Error updating brand:', error);
        this.loading = false;
        this.error = 'Error updating brand. Please try again.';
        this.showError('Error updating brand: ' + (error?.error?.message || error?.message || 'Unknown error'));
      }
    });
  }

  // Validate form method
  validateForm(): boolean {
    if (!this.brandFormModel.name.trim()) {
      this.showError('Brand name is required');
      return false;
    }
    return true;
  }

  // Error handling method
  showError(message: string): void {
    // Set error message for display in the UI
    this.error = message;

    // Optionally log to console for debugging
    console.error(message);

    // Hide error message after some time (e.g., 5 seconds)
    setTimeout(() => {
      if (this.error === message) {
        this.error = null;
      }
    }, 5000);
  }

  // Improved delete method with confirm dialog
  deleteBrand(id: number): void {
    this.brandToDelete = id;
    this.confirmDialogTitle = 'Delete Brand';
    this.confirmDialogMessage = 'Are you sure you want to delete this brand? This action cannot be undone.';
    this.confirmDialogConfirmText = 'Delete';
    this.confirmDialogCancelText = 'Cancel';
    this.showConfirmDialog = true;
  }

  // Handle confirm delete
  onConfirmDelete(): void {
    if (this.brandToDelete !== null) {
      this.loading = true;

      this.brandService.apiBrandIdDelete(this.brandToDelete).subscribe({
        next: () => {
          console.log('Brand deleted successfully');
          this.loading = false;
          this.brandToDelete = null;
          // Reload brands after deletion
          this.loadBrands();
          this.showConfirmDialog = false;
        },
        error: (error) => {
          console.error('Error deleting brand:', error);
          this.loading = false;
          this.brandToDelete = null;
          this.showConfirmDialog = false;
          // Show user-friendly error message
          this.showError('Error deleting brand: ' + (error?.error?.message || error?.message || 'Please try again.'));
        }
      });
    }
  }

  // Handle cancel delete
  onCancelDelete(): void {
    this.showConfirmDialog = false;
    this.brandToDelete = null;
  }

  // Common Table event handlers
  handleAction(actionName: string, item: any): void {
    switch (actionName) {
      case 'edit':
        this.openEditModal(item);
        break;
      case 'delete':
        this.deleteBrand(item.id);
        break;
    }
  }

  onPageChange(pageConfig: any): void {
    this.currentPage = pageConfig.currentPage;
    this.pageSize = pageConfig.pageSize;
    this.loadBrands();
  }

  onFilterChange(filterConfig: any): void {
    this.searchTerm = filterConfig.searchTerm;
    this.statusFilter = filterConfig.filters?.status || '';
    this.currentPage = 1; // Reset to first page when filters change
    this.loadBrands();
  }
}