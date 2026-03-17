import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrandDto } from '../../../../public-api/model/brandDto';
import { BrandService } from '../../../../public-api/api/brand.service';
import { FileService } from '../../../../public-api/api/file.service';
import { CommonTableComponent, TableColumn, PaginationConfig, FilterConfig } from '../../../components/common-table/common-table.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { LanguageService } from '../../../services/language.service';
import { MessageDialogService } from '../../../services/message-dialog.service';
import { lastValueFrom } from 'rxjs';

interface BrandTableItem extends Omit<BrandDto, 'createdAt'> {
  id: number;
  name: string;
  displayName: string;
  createdAt: Date;
}

@Component({
  selector: 'app-admin-brands',
  standalone: true,
  imports: [FormsModule, CommonTableComponent, ConfirmDialogComponent, TranslatePipe],
  template: `
    <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </div>

      <!-- Brands Table using Common Table Component -->
      <misc-common-table
        [data]="brands"
        [columns]="tableColumns"
        tableName="brands"
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

      <!-- Create/Edit Brand Modal -->
       @if(showModal) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] flex flex-col">
            <div class="flex justify-between items-center px-6 pt-6 pb-4">
              <h3 class="text-lg font-semibold">
                {{ editingBrand ? ('Edit Brand' | translate) : ('Create Brand' | translate) }}
              </h3>
              <button (click)="closeModal()" class="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form (ngSubmit)="editingBrand ? updateBrand() : createBrand()" #brandForm="ngForm" class="flex flex-col flex-grow overflow-hidden">
              <div class="overflow-y-auto flex-grow px-6 pb-4">
                <div class="space-y-4">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Name' | translate }} *</label>
                    <input
                      type="text"
                      [(ngModel)]="brandFormModel.name"
                      name="name"
                      id="name"
                      required
                      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      [placeholder]="'Brand name' | translate"
                    >
                  </div>

                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Description' | translate }}</label>
                    <textarea
                      [(ngModel)]="brandFormModel.description"
                      name="description"
                      id="description"
                      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      [placeholder]="'Brand description' | translate"
                      rows="3"
                    ></textarea>
                  </div>

                  <div>
                    <label for="logo-upload" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Brand Logo' | translate }}</label>
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
                              alt="Logo Preview"
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
                    <label for="websiteUrl" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Website URL' | translate }}</label>
                    <input
                      type="text"
                      [(ngModel)]="brandFormModel.websiteUrl"
                      name="websiteUrl"
                      id="websiteUrl"
                      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      [placeholder]="'Brand website URL' | translate"
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
                  [disabled]="!brandForm.form.valid"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ editingBrand ? ('Update Brand' | translate) : ('Create Brand' | translate) }}
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
export class AdminBrandsComponent implements OnInit {
  private languageService = inject(LanguageService);
  private messageDialogService = inject(MessageDialogService);
  private brandService = inject(BrandService);
  private fileService = inject(FileService);
  private cdr = inject(ChangeDetectorRef);

  brands: BrandTableItem[] = [];
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
      key: 'logoUrl',
      title: 'Logo',
      sortable: false,
      type: 'image',
      width: '15%'
    },
    {
      key: 'displayName',
      title: 'Brand',
      sortable: true,
      type: 'text',
      width: '35%'
    },
    {
      key: 'productCount',
      title: 'Products',
      sortable: true,
      type: 'number',
      width: '15%'
    },
    {
      key: 'isActive',
      title: 'Status',
      sortable: true,
      type: 'boolean',
      width: '15%'
    },
    {
      key: 'createdAt',
      title: 'Created',
      sortable: true,
      type: 'date',
      width: '20%'
    }
  ];

  // Brand form modal
  showModal = false;
  editingBrand: BrandTableItem | null = null;
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
  confirmDialogConfirmText = '';
  confirmDialogCancelText = '';
  brandToDelete: number | null = null;

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.loading = true;
    this.error = null;

    this.brandService.apiBrandGet().subscribe({
      next: (response) => {
        const allBrands = (response?.data || []).map((brand: BrandDto) => ({
          ...brand,
          id: brand.id || 0,
          name: brand.name || '',
          description: brand.description || '',
          logoUrl: brand.logoUrl || '',
          websiteUrl: brand.websiteUrl || '',
          isActive: brand.isActive ?? false,
          productCount: brand.productCount ?? 0,
          createdAt: brand.createdAt ? new Date(brand.createdAt) : new Date(),
          displayName: this.formatBrandDisplay(brand.name || '', brand.description || '')
        }));

        // Apply client-side filtering
        const filteredBrands = this.applyFilters(allBrands);

        // Update pagination
        this.paginationConfig.totalItems = filteredBrands.length;
        this.paginationConfig.totalPages = Math.ceil(filteredBrands.length / this.paginationConfig.pageSize);

        // Apply client-side pagination
        const startIndex = (this.paginationConfig.currentPage - 1) * this.paginationConfig.pageSize;
        const endIndex = startIndex + this.paginationConfig.pageSize;
        this.brands = filteredBrands.slice(startIndex, endIndex);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading brands:', error);
        this.brands = [];
        this.paginationConfig.totalItems = 0;
        this.paginationConfig.totalPages = 0;
        this.loading = false;
        this.error = this.languageService.getTranslation('Error loading brands. Please try again later.');
        this.cdr.detectChanges();
      }
    });
  }

  private applyFilters(brands: BrandTableItem[]): BrandTableItem[] {
    return brands.filter((brand) => {
      // Apply search filter
      const matchesSearch = !this.filterConfig.searchTerm ||
        brand.name?.toLowerCase().includes(this.filterConfig.searchTerm.toLowerCase()) ||
        brand.description?.toLowerCase().includes(this.filterConfig.searchTerm.toLowerCase());

      // Apply status filter
      const statusFilter = this.filterConfig.filters['status'];
      const matchesStatus = !statusFilter ||
        (statusFilter === 'active' && brand.isActive) ||
        (statusFilter === 'inactive' && !brand.isActive);

      return matchesSearch && matchesStatus;
    });
  }

  formatBrandDisplay(name: string, description: string): string {
    return `${name} ${description ? `(${description})` : ''}`;
  }

  handleAction(actionName: string, item: BrandTableItem): void {
    switch (actionName) {
      case 'edit':
        this.openEditModal(item);
        break;
      case 'delete':
        if (item.id) {
          this.deleteBrand(item.id);
        }
        break;
    }
  }

  onPageChange(pageConfig: PaginationConfig): void {
    this.paginationConfig = pageConfig;
    this.loadBrands();
  }

  onFilterChange(filterConfig: FilterConfig): void {
    this.filterConfig = filterConfig;
    this.paginationConfig.currentPage = 1;
    this.loadBrands();
  }

  // Delete methods
  deleteBrand(id: number): void {
    this.brandToDelete = id;
    this.confirmDialogTitle = this.languageService.getTranslation('Delete Brand');
    this.confirmDialogMessage = this.languageService.getTranslation('Are you sure you want to delete this brand? This action cannot be undone.');
    this.confirmDialogConfirmText = this.languageService.getTranslation('Delete');
    this.confirmDialogCancelText = this.languageService.getTranslation('Cancel');
    this.showConfirmDialog = true;
  }

  onConfirmDelete(): void {
    if (this.brandToDelete !== null) {
      this.brandService.apiBrandIdDelete(this.brandToDelete).subscribe({
        next: () => {
          this.messageDialogService.success(
            this.languageService.getTranslation('Brand deleted successfully!'),
            this.languageService.getTranslation('Success')
          );
          this.brandToDelete = null;
          this.showConfirmDialog = false;
          this.loadBrands();
        },
        error: (error) => {
          console.error('Error deleting brand:', error);
          this.brandToDelete = null;
          this.showConfirmDialog = false;
          this.messageDialogService.error(
            this.languageService.getTranslation('Error deleting brand. Please try again.'),
            this.languageService.getTranslation('Error')
          );
        }
      });
    }
  }

  onCancelDelete(): void {
    this.showConfirmDialog = false;
    this.brandToDelete = null;
  }

  // Modal methods
  openCreateModal(): void {
    this.editingBrand = null;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(brand: BrandTableItem): void {
    this.editingBrand = brand;
    this.brandFormModel = {
      name: brand.name || '',
      description: brand.description || '',
      logoUrl: brand.logoUrl || '',
      websiteUrl: brand.websiteUrl || '',
      isActive: brand.isActive ?? false
    };

    this.selectedFile = null;
    this.filePreview = brand.logoUrl || null;
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
      return this.brandFormModel.logoUrl;
    }

    this.isUploading = true;
    try {
      const response = await lastValueFrom(
        this.fileService.apiFileUploadImagePost('brands', this.selectedFile)
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

  async createBrand(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;

    let logoUrl: string | null = this.brandFormModel.logoUrl;
    if (this.selectedFile) {
      logoUrl = await this.uploadFile();
      if (logoUrl === null) {
        this.loading = false;
        return;
      }
    }

    const createDto = {
      name: this.brandFormModel.name,
      description: this.brandFormModel.description || null,
      logoUrl: logoUrl || null,
      websiteUrl: this.brandFormModel.websiteUrl || null,
      isActive: this.brandFormModel.isActive
    };

    this.brandService.apiBrandPost(createDto).subscribe({
      next: () => {
        this.messageDialogService.success(
          this.languageService.getTranslation('Brand created successfully!'),
          this.languageService.getTranslation('Success')
        );
        this.loading = false;
        this.closeModal();
        this.loadBrands();
      },
      error: (error) => {
        console.error('Error creating brand:', error);
        this.loading = false;
        this.messageDialogService.error(
          this.languageService.getTranslation('Error creating brand. Please try again.'),
          this.languageService.getTranslation('Error')
        );
      }
    });
  }

  async updateBrand(): Promise<void> {
    if (!this.editingBrand?.id || !this.validateForm()) {
      return;
    }

    this.loading = true;

    let logoUrl: string | null = this.brandFormModel.logoUrl;
    if (this.selectedFile) {
      logoUrl = await this.uploadFile();
      if (logoUrl === null) {
        this.loading = false;
        return;
      }
    } else {
      logoUrl = this.editingBrand.logoUrl || null;
    }

    const updateDto = {
      name: this.brandFormModel.name,
      description: this.brandFormModel.description || null,
      logoUrl: logoUrl,
      websiteUrl: this.brandFormModel.websiteUrl || null,
      isActive: this.brandFormModel.isActive
    };

    this.brandService.apiBrandIdPut(this.editingBrand.id, updateDto).subscribe({
      next: () => {
        this.messageDialogService.success(
          this.languageService.getTranslation('Brand updated successfully!'),
          this.languageService.getTranslation('Success')
        );
        this.loading = false;
        this.closeModal();
        this.loadBrands();
      },
      error: (error) => {
        console.error('Error updating brand:', error);
        this.loading = false;
        this.messageDialogService.error(
          this.languageService.getTranslation('Error updating brand. Please try again.'),
          this.languageService.getTranslation('Error')
        );
      }
    });
  }

  validateForm(): boolean {
    if (!this.brandFormModel.name.trim()) {
      this.messageDialogService.error(
        this.languageService.getTranslation('Brand name is required'),
        this.languageService.getTranslation('Validation Error')
      );
      return false;
    }
    return true;
  }
}
