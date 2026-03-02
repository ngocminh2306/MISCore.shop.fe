import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../../public-api/api/product.service';
import { CategoryService } from '../../../../public-api/api/category.service';
import { BrandService } from '../../../../public-api/api/brand.service';
import { FileService } from '../../../../public-api/api/file.service';
import { CreateProductDto } from '../../../../public-api/model/createProductDto';
import { UpdateProductDto } from '../../../../public-api/model/updateProductDto';
import { Observable, of } from 'rxjs';
import { MessageDialogService } from '../../../services/message-dialog.service';
import { QuillModule } from 'ngx-quill';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-admin-product-edit',
  standalone: true,
  imports: [ReactiveFormsModule, QuillModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ isEdit ? 'Edit Product' : 'Add New Product' }}
        </h1>
      </div>

      @if (errorMessage) {
        <div class="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Error</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{{ errorMessage }}</p>
              </div>
            </div>
          </div>
        </div>
      }

      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="bg-white shadow rounded-lg p-6">
        @if (loading && isEdit) {
          <div class="mb-4 text-center">
            <div class="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
            <p class="mt-2 text-sm text-gray-600">Loading product data...</p>
          </div>
        }
        <!-- Product Basic Info -->
        <div class="border-b border-gray-200 pb-6 mb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Product Information</h2>
          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div class="sm:col-span-4">
              <label for="name" class="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                id="name"
                formControlName="name"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
            </div>

            <div class="sm:col-span-4">
              <label for="slug" class="block text-sm font-medium text-gray-700">URL Slug</label>
              <input
                type="text"
                id="slug"
                formControlName="slug"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Auto-generated from name"
              >
              <p class="mt-1 text-xs text-gray-500">URL-friendly version of the product name</p>
            </div>

            <div class="sm:col-span-2">
              <label for="sku" class="block text-sm font-medium text-gray-700">SKU</label>
              <input
                type="text"
                id="sku"
                formControlName="sku"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
            </div>

            <div class="sm:col-span-3">
              <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                id="price"
                formControlName="price"
                step="0.01"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
            </div>

            <div class="sm:col-span-3">
              <label for="salePrice" class="block text-sm font-medium text-gray-700">Sale Price (optional)</label>
              <input
                type="number"
                id="salePrice"
                formControlName="salePrice"
                step="0.01"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
            </div>

            <div class="sm:col-span-3">
              <label for="categoryId" class="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="categoryId"
                formControlName="categoryId"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select a category</option>
                @for (category of categories; track category.id) {
                  <option [value]="category.id">{{ category.name }}</option>
                }
              </select>
            </div>

            <div class="sm:col-span-3">
              <label for="brandId" class="block text-sm font-medium text-gray-700">Brand</label>
              <select
                id="brandId"
                formControlName="brandId"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select a brand</option>
                @for (brand of brands; track brand.id) {
                  <option [value]="brand.id">{{ brand.name }}</option>
                }
              </select>
            </div>

            <div class="sm:col-span-3">
              <label for="stockQuantity" class="block text-sm font-medium text-gray-700">Stock Quantity</label>
              <input
                type="number"
                id="stockQuantity"
                formControlName="stockQuantity"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
            </div>

            <div class="sm:col-span-3">
              <label for="isActive" class="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="isActive"
                formControlName="isActive"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option [value]="true">Active</option>
                <option [value]="false">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Product Description -->
        <div class="border-b border-gray-200 pb-6 mb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Description</h2>
          <div class="grid grid-cols-1 gap-y-6">
            <div>
              <label for="shortDescription" class="block text-sm font-medium text-gray-700">Short Description</label>
              <textarea
                id="shortDescription"
                formControlName="shortDescription"
                rows="2"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              ></textarea>
            </div>
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Full Description</label>
              <quill-editor
                id="description"
                formControlName="description"
                [modules]="quillModules"
                [styles]="{height: '300px'}"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border">
              </quill-editor>
            </div>
          </div>
        </div>

        <!-- Images -->
        <div class="border-b border-gray-200 pb-6 mb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Product Images</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Image 1 -->
            @if (!imagePreviews[0]) {
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  (change)="onImageSelected($event, 1)"
                  class="hidden"
                  id="image-upload-1">
                <label for="image-upload-1" class="cursor-pointer">
                  <p class="mt-2 text-sm text-gray-600">
                    <span class="font-medium text-indigo-600 hover:text-indigo-500">Upload a file</span>
                    or drag and drop
                  </p>
                  <p class="mt-1 text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </label>
              </div>
            } @else {
              <div class="relative border border-gray-300 rounded-lg p-2">
                <img [src]="imagePreviews[0]" alt="Preview 1" class="w-full h-32 object-contain rounded">
                <button
                  type="button"
                  (click)="removeImage(1)"
                  class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            }

            <!-- Image 2 -->
            @if (!imagePreviews[1]) {
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  (change)="onImageSelected($event, 2)"
                  class="hidden"
                  id="image-upload-2">
                <label for="image-upload-2" class="cursor-pointer">
                  <p class="mt-2 text-sm text-gray-600">
                    <span class="font-medium text-indigo-600 hover:text-indigo-500">Upload additional image</span>
                  </p>
                </label>
              </div>
            } @else {
              <div class="relative border border-gray-300 rounded-lg p-2">
                <img [src]="imagePreviews[1]" alt="Preview 2" class="w-full h-32 object-contain rounded">
                <button
                  type="button"
                  (click)="removeImage(2)"
                  class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            }

            <!-- Image 3 -->
            @if (!imagePreviews[2]) {
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  (change)="onImageSelected($event, 3)"
                  class="hidden"
                  id="image-upload-3">
                <label for="image-upload-3" class="cursor-pointer">
                  <p class="mt-2 text-sm text-gray-600">
                    <span class="font-medium text-indigo-600 hover:text-indigo-500">Upload additional image</span>
                  </p>
                </label>
              </div>
            } @else {
              <div class="relative border border-gray-300 rounded-lg p-2">
                <img [src]="imagePreviews[2]" alt="Preview 3" class="w-full h-32 object-contain rounded">
                <button
                  type="button"
                  (click)="removeImage(3)"
                  class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            }
          </div>
        </div>

        <!-- Additional Info -->
        <div class="border-b border-gray-200 pb-6 mb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Additional Information</h2>
          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div class="sm:col-span-3">
              <label for="barcode" class="block text-sm font-medium text-gray-700">Barcode</label>
              <input
                type="text"
                id="barcode"
                formControlName="barcode"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
            </div>

            <div class="sm:col-span-3">
              <label for="isFeatured" class="block text-sm font-medium text-gray-700">Featured Product</label>
              <input
                type="checkbox"
                id="isFeatured"
                formControlName="isFeatured"
                class="mt-3 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              >
            </div>

            <div class="sm:col-span-3">
              <label for="isNew" class="block text-sm font-medium text-gray-700">New Product</label>
              <input
                type="checkbox"
                id="isNew"
                formControlName="isNew"
                class="mt-3 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              >
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            (click)="onCancel()"
            [disabled]="loading"
            class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            [disabled]="productForm.invalid || loading"
            class="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            @if (loading) {
              <span class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isEdit ? 'Updating...' : 'Adding...' }}
              </span>
            } @else {
              {{ isEdit ? 'Update Product' : 'Add Product' }}
            }
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
export class AdminProductEditComponent implements OnInit {
  productForm: FormGroup;
  isEdit = false;
  categories: any[] = [];
  brands: any[] = [];
  loading = false;
  errorMessage: string | null = null;
  selectedImages: (File | null)[] = [null, null, null]; // Track up to 3 selected images
  imagePreviews: (string | null)[] = [null, null, null]; // Track image previews
  productLoading = false; // Loading state for product data
  imagesLoading = false; // Loading state for images data

  // Quill Editor Configuration
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean'],                                         // remove formatting button

      ['link', 'image', 'video']                         // link and image, video
    ]
  };

  quillStyles = {
    height: '200px'
  };

  private platformId = inject(PLATFORM_ID);

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private fileService: FileService,
    private messageDialogService: MessageDialogService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.createForm();
    // Subscribe to name changes to auto-generate slug (only when user hasn't manually edited the slug)
    this.productForm.get('name')?.valueChanges.subscribe(value => {
      if (value && !this.userEditedSlug) {
        const generatedSlug = this.generateSlug(value);
        this.productForm.get('slug')?.setValue(generatedSlug, { emitEvent: false });
      }
    });

    // Track when user manually edits slug field
    this.productForm.get('slug')?.valueChanges.subscribe(value => {
      // Check if the current slug differs significantly from the generated one
      // If user has typed something different, mark that they've edited the slug
      const nameValue = this.productForm.get('name')?.value;
      if (nameValue) {
        const generatedFromName = this.generateSlug(nameValue);
        this.userEditedSlug = value !== generatedFromName;
      }
    });
  }

  private userEditedSlug = false;

  // Utility method to generate URL slug from product name
  private generateSlug(name: string): string {
    if (!name) return '';

    return name
      .toLowerCase()                      // Convert to lowercase
      .trim()                            // Remove leading/trailing whitespace
      .replace(/[^\w\s-]/g, '')         // Remove non-alphanumeric characters except spaces and hyphens
      .replace(/[\s_-]+/g, '-')         // Replace spaces, underscores, and multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, '');         // Remove leading and trailing hyphens
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadBrands();

    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.isEdit = true;
      this.loadProduct(Number(productId));
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      slug: ['', [Validators.required, Validators.minLength(2)]],
      sku: ['', [Validators.required, Validators.minLength(2)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      salePrice: [null],
      categoryId: [null],
      brandId: [null],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      isActive: [true, Validators.required],
      shortDescription: ['', Validators.required],
      description: ['', Validators.required],
      barcode: [''],
      isFeatured: [false],
      isNew: [false]
    });
  }

  private loadCategories(): void {
    this.categoryService.apiCategoryGet().subscribe({
      next: (response: any) => {
        this.categories = (response?.data || []).map((cat: any) => ({
          id: cat.id,
          name: cat.name
        }));
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Failed to load categories. Please try again later.';
      }
    });
  }

  private loadBrands(): void {
    this.brandService.apiBrandGet().subscribe({
      next: (response: any) => {
        this.brands = (response?.data || []).map((brand: any) => ({
          id: brand.id,
          name: brand.name
        }));
      },
      error: (error) => {
        console.error('Error loading brands:', error);
        this.errorMessage = 'Failed to load brands. Please try again later.';
      }
    });
  }

  private loadProduct(id: number): void {
    this.productLoading = true;
    this.loading = true; // Overall loading state

    // Using ProductService to load product by ID
    this.productService.apiProductIdGet(id).subscribe({
      next: (res: any) => {
        // Map the API response to form values
        let product = res?.data;
        this.productForm.patchValue({
          name: product.name,
          slug: product.slug || this.generateSlug(product.name),
          sku: product.sku,
          price: product.price,
          salePrice: product.salePrice || null,
          categoryId: product.categoryId || null, // Fixed - using categoryId instead of categoryName
          brandId: product.brandId || null,
          stockQuantity: product.stockQuantity,
          isActive: product.isActive,
          shortDescription: product.shortDescription,
          description: product.description,
          barcode: product.barcode || '',
          isFeatured: product.isFeatured,
          isNew: product.isNew
        });

        // Load existing product images
        this.loadProductImages(id);
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.productLoading = false;
        this.loading = false;
        this.errorMessage = 'Failed to load product. Please try again later.';
      }
    });
  }

  // Load existing product images
  private loadProductImages(productId: number): void {
    this.imagesLoading = true;

    // Get product gallery images
    this.fileService.apiFileProductGalleryImagesProductIdGet(productId).subscribe({
      next: (response: any) => {
        if (response && response.data && Array.isArray(response.data)) {
          // Process the images - we'll take up to 3 images to display in our preview slots
          const images = response.data;
          // Clear existing previews
          this.imagePreviews = [null, null, null];
          for (let i = 0; i < Math.min(images.length, 3); i++) {
            // Assuming the API returns image URLs that can be used directly
            // If the API returns relative paths, prepend the base URL
            let imageUrl = images[i].url || images[i].imageUrl || images[i];

            // Prepend base URL if it's a relative path
            if (imageUrl && !imageUrl.startsWith('http')) {
              const baseUrl = this.getBaseUrl();
              imageUrl = `${baseUrl}${imageUrl}`;
            }

            if (imageUrl) {
              this.imagePreviews[i] = imageUrl;
            }
          }
        }
        this.imagesLoading = false;
        // Only set overall loading to false if product loading is also done
          this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product images:', error);
        // Continue loading even if images fail to load
        this.imagesLoading = false;
        if (!this.productLoading) {
          this.loading = false;
        }
      }
    });
  }

  // Get base URL for image paths from the configuration
  private getBaseUrl(): string {
    // Use the base path from one of our services (they should be the same)
    return this.productService['basePath'] || 'https://localhost:7265'; // Fallback URL
  }

  // Handle image file selection
  onImageSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        this.errorMessage = 'Invalid file type. Please select an image (JPEG, PNG, GIF).';
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'File size too large. Please select an image smaller than 5MB.';
        return;
      }

      // Store the selected file
      this.selectedImages[index - 1] = file;

      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews[index - 1] = e.target.result;
      };
      reader.readAsDataURL(file);

      console.log(`Image ${index} selected:`, file);
    }
  }

  // Remove an image from the selection
  removeImage(index: number): void {
    this.selectedImages[index - 1] = null;
    this.imagePreviews[index - 1] = null;
    // Reset the file input only in browser environment
    if (isPlatformBrowser(this.platformId)) {
      const fileInput = document.getElementById(`image-upload-${index}`) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.loading = true;
      this.errorMessage = null; // Clear any previous error message
      const formData = this.productForm.value;

      if (this.isEdit) {
        // Update existing product
        const productId = Number(this.route.snapshot.paramMap.get('id'));
        const updateProductDto: UpdateProductDto = {
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          shortDescription: formData.shortDescription,
          price: Number(formData.price),
          salePrice: formData.salePrice ? Number(formData.salePrice) : null,
          sku: formData.sku,
          barcode: formData.barcode,
          stockQuantity: Number(formData.stockQuantity),
          isActive: formData.isActive,
          isFeatured: formData.isFeatured,
          isNew: formData.isNew,
          brandId: formData.brandId ? Number(formData.brandId) : undefined,
          categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
          metaTitle: '', // Will need to be handled if available in form
          metaDescription: '', // Will need to be handled if available in form
          metaKeywords: '', // Will need to be handled if available in form
          tagIds: [], // Will need to be handled if available in form
          specificationValues: {} // Will need to be handled if available in form
        };

        this.productService.apiProductIdPut(productId, updateProductDto).subscribe({
          next: (response) => {
            console.log('Product updated successfully:', response);
            // Upload images if any were selected
            if (this.selectedImages.some(img => img !== null)) {
              this.uploadProductImages(productId).subscribe({
                next: () => {
                  console.log('Product images uploaded successfully');
                  this.messageDialogService.success('Product updated successfully with images!', 'Success');
                  this.router.navigate(['/admin/products']);
                },
                error: (error) => {
                  console.error('Error uploading images:', error);
                  this.loading = false;
                  this.errorMessage = 'Product updated, but failed to upload images. Please try uploading images separately.';
                  // Still navigate to products page, but show error about images
                  setTimeout(() => {
                    this.router.navigate(['/admin/products']);
                  }, 3000);
                }
              });
            } else {
              // No images to upload
              this.messageDialogService.success('Product updated successfully!', 'Success');
              this.router.navigate(['/admin/products']);
            }
          },
          error: (error) => {
            console.error('Error updating product:', error);
            this.loading = false;
            this.errorMessage = 'Failed to update product. Please try again.';
          }
        });
      } else {
        // Create new product
        const createProductDto: CreateProductDto = {
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          shortDescription: formData.shortDescription,
          price: Number(formData.price),
          salePrice: formData.salePrice ? Number(formData.salePrice) : null,
          sku: formData.sku,
          barcode: formData.barcode,
          stockQuantity: Number(formData.stockQuantity),
          isActive: formData.isActive,
          isFeatured: formData.isFeatured,
          isNew: formData.isNew,
          brandId: formData.brandId ? Number(formData.brandId) : undefined,
          categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
          metaTitle: '', // Will need to be handled if available in form
          metaDescription: '', // Will need to be handled if available in form
          metaKeywords: '', // Will need to be handled if available in form
          tagIds: [], // Will need to be handled if available in form
          specificationValues: {} // Will need to be handled if available in form
        };

        this.productService.apiProductPost(createProductDto).subscribe({
          next: (response) => {
            console.log('Product created successfully:', response);
            // Assuming the response contains the new product id
            const newProductId = response.data?.id || response.data?.id;
            if (newProductId && this.selectedImages.some(img => img !== null)) {
              // Upload images for the newly created product
              this.uploadProductImages(newProductId).subscribe({
                next: () => {
                  console.log('Product images uploaded successfully');
                  this.messageDialogService.success('Product created successfully with images!', 'Success');
                  this.router.navigate(['/admin/products']);
                },
                error: (error) => {
                  console.error('Error uploading images:', error);
                  this.loading = false;
                  this.errorMessage = 'Product created, but failed to upload images. Please try uploading images separately.';
                  // Still navigate to products page, but show error about images
                  setTimeout(() => {
                    this.router.navigate(['/admin/products']);
                  }, 3000);
                }
              });
            } else {
              // No images to upload
              this.messageDialogService.success('Product created successfully!', 'Success');
              this.router.navigate(['/admin/products']);
            }
          },
          error: (error) => {
            console.error('Error creating product:', error);
            this.loading = false;
            this.errorMessage = 'Failed to create product. Please try again.';
          }
        });
      }
    }
  }

  // Upload selected images for a product
  private uploadProductImages(productId: number): import('rxjs').Observable<any> {
    // Collect all non-null images to upload
    const imageUploads = this.selectedImages
      .filter((img): img is File => img !== null)
      .map(img => this.fileService.apiFileUploadProductImageProductIdPost(productId, img));

    if (imageUploads.length === 0) {
      // Return a resolved observable if no images to upload
      return of(null);
    }

    // If there are multiple images, we'll need to handle them sequentially or in parallel
    // For simplicity, we'll upload them one by one
    return new Observable(observer => {
      let completed = 0;
      const total = imageUploads.length;

      if (total === 0) {
        observer.next({});
        observer.complete();
        return;
      }

      imageUploads.forEach((uploadObservable, index) => {
        uploadObservable.subscribe({
          next: (response) => {
            console.log(`Image ${index + 1} uploaded successfully:`, response);
            completed++;
            if (completed === total) {
              observer.next({});
              observer.complete();
            }
          },
          error: (error) => {
            console.error(`Error uploading image ${index + 1}:`, error);
            observer.error(error);
          }
        });
      });
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/products']);
  }
}