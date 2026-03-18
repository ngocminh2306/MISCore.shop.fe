import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BannerService } from '../../../../public-api/api/banner.service';
import { FileService } from '../../../../public-api/api/file.service';
import { CommonTableComponent, TableColumn } from '../../../components/common-table/common-table.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { BannerDto } from '../../../../public-api';

interface Banner {
  id: number;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  linkUrl?: string | null;
  bannerType: string;
  isActive: boolean;
  startDate?: string | null;
  endDate?: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt?: string | null;
}

@Component({
  selector: 'app-admin-banners',
  standalone: true,
  imports: [FormsModule, CommonModule, CommonTableComponent, ConfirmDialogComponent],
  template: `
    <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Manage Banners</h1>
        <div class="mt-4 flex justify-between items-center">
          <p class="text-gray-600">View and manage promotional banners</p>
          <button
            (click)="openCreateModal()"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Add New Banner
          </button>
        </div>
      </div>

      <!-- Banners Table using CommonTable Component -->
      <misc-common-table
        [data]="banners"
        [columns]="tableColumns"
        tableName="banners"
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
          filters: { position: positionFilter, status: statusFilter }
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

      <!-- Create/Edit Banner Modal -->
      @if (showModal) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">
                {{ editingBanner ? 'Edit Banner' : 'Create Banner' }}
              </h3>
              <button (click)="closeModal()" class="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form (ngSubmit)="editingBanner ? updateBanner() : createBanner()" #bannerForm="ngForm">
              <div class="space-y-4">
                <div>
                  <label for="banner-title" class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    [(ngModel)]="bannerFormModel.title"
                    name="title"
                    id="banner-title"
                    required
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Banner title"
                  >
                </div>

                <div>
                  <label for="banner-description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    [(ngModel)]="bannerFormModel.description"
                    name="description"
                    id="banner-description"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Banner description"
                    rows="2"
                  ></textarea>
                </div>

                <div>
                  <label for="banner-image-upload" class="block text-sm font-medium text-gray-700 mb-1">Banner Image *</label>
                  <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
                    <div class="space-y-1 text-center">
                      <div class="flex text-sm text-gray-600 justify-center">
                        <label for="banner-image-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Upload a file</span>
                          <input
                            id="banner-image-upload"
                            name="banner-image-upload"
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
                  @if (filePreview) {
                    <div class="mt-3">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center">
                          @if (filePreview && selectedFile) {
                            <img
                              [src]="filePreview"
                              alt="Banner Preview"
                              class="w-16 h-16 object-cover rounded-md border"
                            >
                          } @else {
                            <img
                              [src]="filePreview"
                              alt="Current Banner"
                              class="w-16 h-16 object-cover rounded-md border"
                            >
                          }
                          @if (selectedFile) {
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
                      @if (isUploading) {
                        <div class="mt-2">
                          <div class="flex items-center">
                            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                            <span class="ml-2 text-sm text-gray-600">Uploading...</span>
                          </div>
                        </div>
                      }
                    </div>
                  }
                </div>

                <div>
                  <label for="banner-link-url" class="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                  <input
                    type="text"
                    [(ngModel)]="bannerFormModel.linkUrl"
                    name="linkUrl"
                    id="banner-link-url"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Banner target URL"
                  >
                </div>

                <div>
                  <label for="banner-type" class="block text-sm font-medium text-gray-700 mb-1">Banner Type</label>
                  <select
                    [(ngModel)]="bannerFormModel.bannerType"
                    name="bannerType"
                    id="banner-type"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="homepage-hero">Homepage Hero</option>
                    <option value="category-top">Category Top</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="footer">Footer</option>
                  </select>
                </div>

                <div>
                  <label for="banner-display-order" class="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    [(ngModel)]="bannerFormModel.displayOrder"
                    name="displayOrder"
                    id="banner-display-order"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Display order (lower number appears first)"
                  >
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="banner-start-date" class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      [(ngModel)]="bannerFormModel.startDate"
                      name="startDate"
                      id="banner-start-date"
                      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                  </div>
                  <div>
                    <label for="banner-end-date" class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      [(ngModel)]="bannerFormModel.endDate"
                      name="endDate"
                      id="banner-end-date"
                      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                  </div>
                </div>

                <div class="flex items-center">
                  <input
                    type="checkbox"
                    [(ngModel)]="bannerFormModel.isActive"
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
                  [disabled]="!bannerForm.form.valid"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ editingBanner ? 'Update Banner' : 'Create Banner' }}
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
export class AdminBannersComponent implements OnInit {
  private readonly bannerService = inject(BannerService);
  private readonly fileService = inject(FileService);
  private readonly cdr = inject(ChangeDetectorRef);

  banners: Banner[] = [];
  searchTerm = '';
  positionFilter = '';
  statusFilter = '';
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;
  loading = false;
  error: string | null = null;

  // Banner form modal
  showModal = false;
  editingBanner: Banner | null = null;
  bannerFormModel: {
    title: string;
    description: string | null;
    imageUrl: string | null;
    linkUrl: string | null;
    displayOrder: number;
    isActive: boolean;
    bannerType: string;
    startDate: string | null;
    endDate: string | null;
  } = {
      title: '',
      description: null,
      imageUrl: null,
      linkUrl: null,
      displayOrder: 0,
      isActive: true,
      bannerType: 'homepage-hero',
      startDate: null,
      endDate: null
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
  bannerToDelete: number | null = null;

  // Table configuration
  tableColumns: TableColumn[] = [
    {
      key: 'title',
      title: 'Banner',
      sortable: false,
      type: 'custom',
      width: '30%'
    },
    {
      key: 'imageUrl',
      title: 'Banner Image',
      sortable: true,
      type: 'image',
      width: '20%'
    },
    {
      key: 'bannerType',
      title: 'Position',
      sortable: true,
      type: 'text',
      width: '20%'
    },
    {
      key: 'isActive',
      title: 'Active',
      sortable: true,
      type: 'boolean',
      width: '15%'
    },
    {
      key: 'startDate',
      title: 'Start Date',
      sortable: true,
      type: 'date',
      width: '20%'
    },
    {
      key: 'endDate',
      title: 'End Date',
      sortable: true,
      type: 'date',
      width: '20%'
    }
  ];

  ngOnInit(): void {
    this.loadBanners();
  }

  loadBanners(): void {
    this.loading = true;
    this.error = null;

    this.bannerService.apiBannerGet().subscribe({
      next: (response) => {
        const bannerDtos = response.data || [];
        const allBanners: Banner[] = bannerDtos.map((banner: BannerDto) => ({
          id: banner.id || 0,
          title: banner.title || '',
          description: banner.description || null,
          imageUrl: banner.imageUrl || null,
          linkUrl: banner.linkUrl || null,
          bannerType: banner.bannerType || '',
          isActive: banner.isActive || false,
          startDate: banner.startDate || null,
          endDate: banner.endDate || null,
          displayOrder: banner.displayOrder || 0,
          createdAt: banner.createdAt || new Date().toISOString(),
          updatedAt: banner.updatedAt || null
        }));

        const filteredBanners = allBanners.filter((banner) => {
          const matchesSearch = !this.searchTerm ||
            banner.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            (banner.description && banner.description.toLowerCase().includes(this.searchTerm.toLowerCase()));

          const matchesPosition = !this.positionFilter ||
            banner.bannerType.toLowerCase().includes(this.positionFilter.toLowerCase());

          const matchesStatus = !this.statusFilter ||
            (this.statusFilter === 'active' && banner.isActive) ||
            (this.statusFilter === 'inactive' && !banner.isActive) ||
            (this.statusFilter === 'expired' && banner.endDate && new Date(banner.endDate) < new Date());

          return matchesSearch && matchesPosition && matchesStatus;
        });

        this.totalCount = filteredBanners.length;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);

        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.banners = filteredBanners.slice(startIndex, endIndex);
        this.cdr.markForCheck();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading banners:', error);
        this.banners = [];
        this.totalCount = 0;
        this.totalPages = 0;
        this.loading = false;
        this.error = 'Error loading banners. Please try again later.';
      }
    });
  }

  // Modal methods
  openCreateModal(): void {
    this.editingBanner = null;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(banner: Banner): void {
    this.editingBanner = banner;
    this.bannerFormModel = {
      title: banner.title,
      description: banner.description || null,
      imageUrl: banner.imageUrl || null,
      linkUrl: banner.linkUrl || null,
      displayOrder: banner.displayOrder,
      isActive: banner.isActive,
      bannerType: banner.bannerType || 'homepage-hero',
      startDate: banner.startDate || null,
      endDate: banner.endDate || null
    };

    this.selectedFile = null;
    if (banner.imageUrl) {
      this.filePreview = banner.imageUrl;
    } else {
      this.filePreview = null;
    }

    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingBanner = null;
    this.resetForm();
  }

  resetForm(): void {
    this.bannerFormModel = {
      title: '',
      description: null,
      imageUrl: null,
      linkUrl: null,
      displayOrder: 0,
      isActive: true,
      bannerType: 'homepage-hero',
      startDate: null,
      endDate: null
    };
    this.selectedFile = null;
    this.filePreview = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF)');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size too large. Please select an image under 5MB.');
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.filePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeFile(): void {
    this.selectedFile = null;
    this.filePreview = null;
  }

  async uploadFile(): Promise<string | null> {
    if (!this.selectedFile) {
      return this.bannerFormModel.imageUrl;
    }

    this.isUploading = true;
    try {
      const response = await this.fileService.apiFileUploadImagePost('banners', this.selectedFile).toPromise();
      this.isUploading = false;
      return response?.data || null;
    } catch (error) {
      console.error('Error uploading file:', error);
      this.isUploading = false;
      alert('Error uploading image. Please try again.');
      return null;
    }
  }

  async createBanner(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = null;

    let imageUrl: string | null = null;
    if (this.selectedFile) {
      imageUrl = await this.uploadFile();
      if (imageUrl === null) {
        this.loading = false;
        return;
      }
    } else {
      imageUrl = this.bannerFormModel.imageUrl;
    }

    const createDto: BannerDto = {
      title: this.bannerFormModel.title,
      description: this.bannerFormModel.description,
      imageUrl: imageUrl || '',
      linkUrl: this.bannerFormModel.linkUrl,
      displayOrder: this.bannerFormModel.displayOrder,
      isActive: this.bannerFormModel.isActive,
      bannerType: this.bannerFormModel.bannerType,
      startDate: this.bannerFormModel.startDate,
      endDate: this.bannerFormModel.endDate
    };

    this.bannerService.apiBannerPost(createDto).subscribe({
      next: () => {
        this.loading = false;
        this.closeModal();
        this.loadBanners();
      },
      error: (error) => {
        console.error('Error creating banner:', error);
        this.loading = false;
        this.error = 'Error creating banner. Please try again.';
        alert('Error creating banner: ' + (error?.error?.message || error?.message || 'Unknown error'));
      }
    });
  }

  async updateBanner(): Promise<void> {
    if (!this.editingBanner?.id || !this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = null;

    let imageUrl: string | null | undefined = null;

    if (this.selectedFile) {
      imageUrl = await this.uploadFile();
      if (imageUrl === null) {
        this.loading = false;
        return;
      }
    } else {
      imageUrl = this.editingBanner.imageUrl;
    }

    const updateDto: BannerDto = {
      title: this.bannerFormModel.title,
      description: this.bannerFormModel.description,
      imageUrl: imageUrl || '',
      linkUrl: this.bannerFormModel.linkUrl,
      displayOrder: this.bannerFormModel.displayOrder,
      isActive: this.bannerFormModel.isActive,
      bannerType: this.bannerFormModel.bannerType,
      startDate: this.bannerFormModel.startDate,
      endDate: this.bannerFormModel.endDate
    };

    this.bannerService.apiBannerIdPut(this.editingBanner.id, updateDto).subscribe({
      next: () => {
        this.loading = false;
        this.closeModal();
        this.loadBanners();
      },
      error: (error) => {
        console.error('Error updating banner:', error);
        this.loading = false;
        this.error = 'Error updating banner. Please try again.';
        alert('Error updating banner: ' + (error?.error?.message || error?.message || 'Unknown error'));
      }
    });
  }

  validateForm(): boolean {
    if (!this.editingBanner && !this.selectedFile && !this.bannerFormModel.imageUrl) {
      alert('Title and Banner Image are required');
      return false;
    }

    if (this.editingBanner && !this.editingBanner.imageUrl && !this.selectedFile && !this.bannerFormModel.imageUrl) {
      alert('Title and Banner Image are required');
      return false;
    }

    if (!this.bannerFormModel.title.trim()) {
      alert('Title is required');
      return false;
    }

    return true;
  }

  deleteBanner(id: number): void {
    this.bannerToDelete = id;
    this.confirmDialogTitle = 'Delete Banner';
    this.confirmDialogMessage = 'Are you sure you want to delete this banner? This action cannot be undone.';
    this.confirmDialogConfirmText = 'Delete';
    this.confirmDialogCancelText = 'Cancel';
    this.showConfirmDialog = true;
  }

  onConfirmDelete(): void {
    if (this.bannerToDelete !== null) {
      this.loading = true;

      this.bannerService.apiBannerIdDelete(this.bannerToDelete).subscribe({
        next: () => {
          this.loading = false;
          this.bannerToDelete = null;
          this.showConfirmDialog = false;
          this.loadBanners();
        },
        error: (error) => {
          console.error('Error deleting banner:', error);
          this.loading = false;
          this.bannerToDelete = null;
          this.showConfirmDialog = false;
          alert('Error deleting banner: ' + (error?.error?.message || error?.message || 'Please try again.'));
        }
      });
    }
  }

  onCancelDelete(): void {
    this.showConfirmDialog = false;
    this.bannerToDelete = null;
  }

  handleAction(actionName: string, item: Banner): void {
    switch (actionName) {
      case 'edit':
        this.openEditModal(item);
        break;
      case 'delete':
        this.deleteBanner(item.id);
        break;
    }
  }

  onPageChange(pageConfig: { currentPage: number; pageSize: number }): void {
    this.currentPage = pageConfig.currentPage;
    this.pageSize = pageConfig.pageSize;
    this.loadBanners();
  }

  onFilterChange(filterConfig: { searchTerm: string; filters: { position?: string; status?: string } }): void {
    this.searchTerm = filterConfig.searchTerm;
    this.positionFilter = filterConfig.filters?.position || '';
    this.statusFilter = filterConfig.filters?.status || '';
    this.currentPage = 1;
    this.loadBanners();
  }
}