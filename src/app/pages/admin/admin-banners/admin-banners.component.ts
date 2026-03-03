import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BannerService } from '../../../../public-api/api/banner.service';
import { FileService } from '../../../../public-api/api/file.service';
import { CommonTableComponent, TableColumn } from '../../../components/common-table/common-table.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { BannerDto } from '../../../../public-api';

interface Banner {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  targetUrl?: string;
  position: string;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  priority: number;
  createdAt: Date;
  updatedAt?: Date;
}

@Component({
  selector: 'app-admin-banners',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, CommonTableComponent, ConfirmDialogComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <div *ngIf="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  [(ngModel)]="bannerFormModel.title"
                  name="title"
                  required
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Banner title"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  [(ngModel)]="bannerFormModel.description"
                  name="description"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Banner description"
                  rows="2"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Banner Image *</label>
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
                <div *ngIf="filePreview" class="mt-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <img
                        [src]="filePreview"
                        alt="Banner Preview"
                        class="w-16 h-16 object-cover rounded-md border"
                        *ngIf="filePreview && selectedFile; else urlPreview"
                      >
                      <ng-template #urlPreview>
                        <img
                          [src]="filePreview"
                          alt="Current Banner"
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
                <label class="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                <input
                  type="text"
                  [(ngModel)]="bannerFormModel.linkUrl"
                  name="linkUrl"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Banner target URL"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Banner Type</label>
                <select
                  [(ngModel)]="bannerFormModel.bannerType"
                  name="bannerType"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="homepage-hero">Homepage Hero</option>
                  <option value="category-top">Category Top</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="footer">Footer</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  [(ngModel)]="bannerFormModel.displayOrder"
                  name="displayOrder"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Display order (lower number appears first)"
                >
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    [(ngModel)]="bannerFormModel.startDate"
                    name="startDate"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    [(ngModel)]="bannerFormModel.endDate"
                    name="endDate"
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
  bannerFormModel = {
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    displayOrder: 0,
    isActive: true,
    bannerType: 'homepage-hero',
    startDate: '',
    endDate: ''
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
      sortable: false, // Custom column, not sortable
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
      key: 'position',
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

  constructor(
    private bannerService: BannerService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.loadBanners();
  }

  loadBanners(): void {
    this.loading = true;
    this.error = null;

    // Call the real API to get banners
    this.bannerService.apiBannerGet().subscribe({
      next: (response: any) => {
        // Format response to match our Banner interface
        let allBanners = (response.data || []).map((banner: any) => ({
          id: banner.id || 0,
          title: banner.title || '',
          description: banner.description || '',
          imageUrl: banner.imageUrl || '',
          targetUrl: banner.linkUrl || '', // BannerDto uses linkUrl instead of targetUrl
          position: banner.bannerType || '', // BannerDto uses bannerType instead of position
          isActive: banner.isActive || false,
          startDate: banner.startDate ? new Date(banner.startDate) : undefined,
          endDate: banner.endDate ? new Date(banner.endDate) : undefined,
          priority: banner.displayOrder || 0, // BannerDto uses displayOrder instead of priority
          createdAt: banner.createdAt ? new Date(banner.createdAt) : new Date(),
          updatedAt: banner.updatedAt ? new Date(banner.updatedAt) : undefined
        }));

        // Apply client-side filtering
        let filteredBanners = allBanners.filter((banner: any) => {
          // Apply search filter
          const matchesSearch = !this.searchTerm ||
            banner.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            (banner.description && banner.description.toLowerCase().includes(this.searchTerm.toLowerCase()));

          // Apply position filter
          const matchesPosition = !this.positionFilter ||
            banner.position.toLowerCase().includes(this.positionFilter.toLowerCase());

          // Apply status filter
          const matchesStatus = !this.statusFilter ||
            (this.statusFilter === 'active' && banner.isActive) ||
            (this.statusFilter === 'inactive' && !banner.isActive) ||
            (this.statusFilter === 'expired' && banner.endDate && new Date(banner.endDate) < new Date());

          return matchesSearch && matchesPosition && matchesStatus;
        });

        // Calculate pagination values
        this.totalCount = filteredBanners.length;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);

        // Apply client-side pagination
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.banners = filteredBanners.slice(startIndex, endIndex);
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
      description: banner.description || '',
      imageUrl: banner.imageUrl || '',
      linkUrl: banner.targetUrl || '',
      displayOrder: banner.priority,
      isActive: banner.isActive,
      bannerType: banner.position || 'homepage-hero',
      startDate: banner.startDate ? (banner.startDate instanceof Date ? banner.startDate.toISOString().split('T')[0] : banner.startDate) : '',
      endDate: banner.endDate ? (banner.endDate instanceof Date ? banner.endDate.toISOString().split('T')[0] : banner.endDate) : ''
    };

    // Reset file upload properties but keep the existing image URL for display
    this.selectedFile = null;
    if (banner.imageUrl) {
      this.filePreview = banner.imageUrl; // Show existing image URL
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
      description: '',
      imageUrl: '',
      linkUrl: '',
      displayOrder: 0,
      isActive: true,
      bannerType: 'homepage-hero',
      startDate: '',
      endDate: ''
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
        alert('Please select a valid image file (JPEG, PNG, GIF)');
        return;
      }

      // Validate file size (e.g., 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('File size too large. Please select an image under 5MB.');
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
      return this.bannerFormModel.imageUrl; // Return existing URL if no new file
    }

    this.isUploading = true;
    try {
      // Upload the file using the file service
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

  // Create banner method
  async createBanner(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = null;

    // Upload the file if selected and get the URL
    let imageUrl: string | null = null;
    if (this.selectedFile) {
      imageUrl = await this.uploadFile();
      if (imageUrl === null) {
        this.loading = false;
        return; // Upload failed
      }
    } else {
      // Use existing imageUrl if no new file selected
      imageUrl = this.bannerFormModel.imageUrl;
    }

    // Prepare the request body according to BannerDto
    const createDto = {
      title: this.bannerFormModel.title,
      description: this.bannerFormModel.description || null,
      imageUrl: imageUrl,
      linkUrl: this.bannerFormModel.linkUrl || null,
      displayOrder: this.bannerFormModel.displayOrder,
      isActive: this.bannerFormModel.isActive,
      bannerType: this.bannerFormModel.bannerType,
      startDate: this.bannerFormModel.startDate || null,
      endDate: this.bannerFormModel.endDate || null
    };

    this.bannerService.apiBannerPost(createDto).subscribe({
      next: (response) => {
        console.log('Banner created successfully', response);
        this.loading = false;
        this.closeModal();
        this.loadBanners(); // Reload the list
      },
      error: (error) => {
        console.error('Error creating banner:', error);
        this.loading = false;
        this.error = 'Error creating banner. Please try again.';
        alert('Error creating banner: ' + (error?.error?.message || error?.message || 'Unknown error'));
      }
    });
  }

  // Update banner method
  async updateBanner(): Promise<void> {
    if (!this.editingBanner?.id || !this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = null;

    // Determine the image URL to use
    let imageUrl: string | null = null;

    if (this.selectedFile) {
      // If a new file was selected, upload it
      imageUrl = await this.uploadFile();
      if (imageUrl === null) {
        this.loading = false;
        return; // Upload failed
      }
    } else {
      // If no new file was selected, use the existing image URL from the banner being edited
      imageUrl = this.editingBanner.imageUrl || null;
    }

    // Prepare the request body according to BannerDto
    const updateDto: BannerDto = {
      title: this.bannerFormModel.title,
      description: this.bannerFormModel.description || null,
      imageUrl: imageUrl || '',
      linkUrl: this.bannerFormModel.linkUrl || null,
      displayOrder: this.bannerFormModel.displayOrder,
      isActive: this.bannerFormModel.isActive,
      bannerType: this.bannerFormModel.bannerType,
      startDate: this.bannerFormModel.startDate || null,
      endDate: this.bannerFormModel.endDate || null
    };

    this.bannerService.apiBannerIdPut(this.editingBanner.id, updateDto).subscribe({
      next: (response) => {
        console.log('Banner updated successfully', response);
        this.loading = false;
        this.closeModal();
        this.loadBanners(); // Reload the list
      },
      error: (error) => {
        console.error('Error updating banner:', error);
        this.loading = false;
        this.error = 'Error updating banner. Please try again.';
        alert('Error updating banner: ' + (error?.error?.message || error?.message || 'Unknown error'));
      }
    });
  }

  // Validate form method
  validateForm(): boolean {
    // Check if it's a new banner and no image is provided via file upload or existing URL
    if (!this.editingBanner && !this.selectedFile && !this.bannerFormModel.imageUrl.trim()) {
      alert('Title and Banner Image are required');
      return false;
    }

    // Check if editing and there's no existing image and no file selected
    if (this.editingBanner && !this.editingBanner.imageUrl && !this.selectedFile && !this.bannerFormModel.imageUrl.trim()) {
      alert('Title and Banner Image are required');
      return false;
    }

    if (!this.bannerFormModel.title.trim()) {
      alert('Title is required');
      return false;
    }

    return true;
  }

  // Improved delete method with confirm dialog
  deleteBanner(id: number): void {
    this.bannerToDelete = id;
    this.confirmDialogTitle = 'Delete Banner';
    this.confirmDialogMessage = 'Are you sure you want to delete this banner? This action cannot be undone.';
    this.confirmDialogConfirmText = 'Delete';
    this.confirmDialogCancelText = 'Cancel';
    this.showConfirmDialog = true;
  }

  // Handle confirm delete
  onConfirmDelete(): void {
    if (this.bannerToDelete !== null) {
      this.loading = true;

      this.bannerService.apiBannerIdDelete(this.bannerToDelete).subscribe({
        next: () => {
          console.log('Banner deleted successfully');
          this.loading = false;
          this.bannerToDelete = null;
          // Reload banners after deletion
          this.loadBanners();
          this.showConfirmDialog = false;
        },
        error: (error) => {
          console.error('Error deleting banner:', error);
          this.loading = false;
          this.bannerToDelete = null;
          this.showConfirmDialog = false;
          // Show user-friendly error message
          alert('Error deleting banner: ' + (error?.error?.message || error?.message || 'Please try again.'));
        }
      });
    }
  }

  // Handle cancel delete
  onCancelDelete(): void {
    this.showConfirmDialog = false;
    this.bannerToDelete = null;
  }

  // Common Table event handlers
  handleAction(actionName: string, item: any): void {
    switch (actionName) {
      case 'edit':
        this.openEditModal(item);
        break;
      case 'delete':
        this.deleteBanner(item.id);
        break;
    }
  }

  onPageChange(pageConfig: any): void {
    this.currentPage = pageConfig.currentPage;
    this.pageSize = pageConfig.pageSize;
    this.loadBanners();
  }

  onFilterChange(filterConfig: any): void {
    this.searchTerm = filterConfig.searchTerm;
    this.positionFilter = filterConfig.filters?.position || '';
    this.statusFilter = filterConfig.filters?.status || '';
    this.currentPage = 1; // Reset to first page when filters change
    this.loadBanners();
  }
}