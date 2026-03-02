import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BrandService } from '../../../../public-api/api/brand.service';
import { BrandDto } from '../../../../public-api/model/brandDto';

@Component({
  selector: 'app-admin-brand-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ isEdit ? 'Edit Brand' : 'Add New Brand' }}
        </h1>
      </div>

      <form [formGroup]="brandForm" (ngSubmit)="onSubmit()" class="bg-white shadow rounded-lg p-6">
        <!-- Brand Information -->
        <div class="border-b border-gray-200 pb-6 mb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Brand Information</h2>
          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div class="sm:col-span-6">
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                formControlName="name"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Brand name"
              >
              @if (brandForm.get('name')?.invalid && brandForm.get('name')?.touched) {
                <p class="mt-2 text-sm text-red-600">Brand name is required and must be at least 2 characters.</p>
              }
            </div>

            <div class="sm:col-span-6">
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                formControlName="description"
                rows="4"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Brand description"
              ></textarea>
            </div>

            <div class="sm:col-span-6">
              <label for="websiteUrl" class="block text-sm font-medium text-gray-700">Website URL</label>
              <input
                type="url"
                id="websiteUrl"
                formControlName="websiteUrl"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="https://example.com"
              >
            </div>

            <div class="sm:col-span-6">
              <label class="block text-sm font-medium text-gray-700">Logo</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div class="space-y-1 text-center">
                  <div class="flex text-sm text-gray-600">
                    <label for="logo" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <span>Upload a file</span>
                      <input 
                        id="logo" 
                        name="logo" 
                        type="file" 
                        class="sr-only"
                        (change)="onFileSelected($event)"
                      >
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
              @if (logoPreview) {
                <div class="mt-4 flex justify-center">
                  <img [src]="logoPreview" alt="Logo preview" class="h-24 w-24 object-contain rounded-md border border-gray-300">
                </div>
              }
            </div>

            <div class="sm:col-span-6">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="isActive"
                    formControlName="isActive"
                    type="checkbox"
                    class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  >
                </div>
                <div class="ml-3 text-sm">
                  <label for="isActive" class="font-medium text-gray-700">Active</label>
                  <p class="text-gray-500">Check this box to make the brand active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            (click)="cancel()"
            class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            [disabled]="brandForm.invalid || isSubmitting"
            class="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Brand' : 'Add Brand') }}
          </button>
        </div>
      </form>
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
export class AdminBrandEditComponent implements OnInit {
  brandForm: FormGroup;
  isEdit = false;
  isSubmitting = false;
  logoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.brandForm = this.createForm();
  }

  ngOnInit(): void {
    const brandId = this.route.snapshot.paramMap.get('id');
    if (brandId) {
      this.isEdit = true;
      this.loadBrand(Number(brandId));
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      websiteUrl: ['', [Validators.pattern(/^https?:\/\/.+/)]], // Optional but if provided, must be a valid URL
      isActive: [true]
    });
  }

  private loadBrand(id: number): void {
    this.brandService.apiBrandIdGet(id).subscribe({
      next: (response) => {
        this.brandForm.patchValue({
          name: response.data?.name || '',
          description: response.data?.description || '',
          websiteUrl: response.data?.websiteUrl || '',
          isActive: response.data?.isActive || false
        });

        // If there's a logo URL, set it as preview
        if (response.data?.logoUrl) {
          this.logoPreview = response.data?.logoUrl;
        }
      },
      error: (error) => {
        console.error('Error loading brand:', error);
        // Handle error appropriately (show message to user, redirect, etc.)
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Create a preview URL
      this.logoPreview = URL.createObjectURL(file);
    }
  }

  onSubmit(): void {
    if (this.brandForm.valid) {
      this.isSubmitting = true;

      const formData = this.brandForm.value;

      if (this.isEdit) {
        // Update existing brand
        const brandId = Number(this.route.snapshot.paramMap.get('id'));
        // Create a partial update DTO with the actual type
        const brandUpdateObj: any = {
          name: formData.name,
          description: formData.description,
          logoUrl: this.logoPreview || undefined,
          websiteUrl: formData.websiteUrl || undefined,
          isActive: formData.isActive
        };

        this.brandService.apiBrandIdPut(brandId, brandUpdateObj).subscribe({
          next: (response) => {
            console.log('Brand updated successfully:', response);
            this.router.navigate(['/admin/brands']);
          },
          error: (error) => {
            console.error('Error updating brand:', error);
            // Handle error appropriately (show message to user)
            this.isSubmitting = false;
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
      } else {
        // Create new brand
        const brandCreateObj: any = {
          name: formData.name,
          description: formData.description,
          logoUrl: this.logoPreview || undefined,
          websiteUrl: formData.websiteUrl || undefined,
          isActive: formData.isActive
        };

        this.brandService.apiBrandPost(brandCreateObj).subscribe({
          next: (response) => {
            console.log('Brand created successfully:', response);
            this.router.navigate(['/admin/brands']);
          },
          error: (error) => {
            console.error('Error creating brand:', error);
            // Handle error appropriately (show message to user)
            this.isSubmitting = false;
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
      }
    } else {
      // Mark all fields as touched to show validation errors
      this.brandForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/brands']);
  }
}