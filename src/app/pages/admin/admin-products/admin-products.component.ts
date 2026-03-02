import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../../public-api/api/category.service';
import { BrandService } from '../../../../public-api/api/brand.service';
import { CommonTableComponent, TableColumn, PaginationConfig, SortConfig, FilterConfig } from '../../../components/common-table/common-table.component';
import { MessageDialogService } from '../../../services/message-dialog.service';
import { ProductService } from '../../../../public-api/api/product.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { LanguageService } from '../../../services/language.service';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { ProductDto } from '../../../../public-api';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonTableComponent, TranslatePipe, ConfirmDialogComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">{{ 'Admin Products' | translate }}</h1>
        <div class="mt-4 flex justify-between items-center">
          <p class="text-gray-600">{{ 'View and manage all products in your store' | translate }}</p>
          <a
            [routerLink]="['/admin/products/new']"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            {{ 'Add New Product' | translate }}
          </a>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white shadow rounded-lg p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Search' | translate }}</label>
            <input
              type="text"
              id="search"
              [(ngModel)]="filterConfig.searchTerm"
              (keyup.enter)="applyFilters()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="{{ 'Search products...' | translate }}"
            >
          </div>
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Category' | translate }}</label>
            <select
              id="category"
              [(ngModel)]="filterConfig.filters['categoryId']"
              (change)="applyFilters()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">{{ 'All Categories' | translate }}</option>
              @for (category of categories; track category.id) {
                <option [value]="category.id">{{ category.name }}</option>
              }
            </select>
          </div>
          <div>
            <label for="brand" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Brand' | translate }}</label>
            <select
              id="brand"
              [(ngModel)]="filterConfig.filters['brandId']"
              (change)="applyFilters()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">{{ 'All Brands' | translate }}</option>
              @for (brand of brands; track brand.id) {
                <option [value]="brand.id">{{ brand.name }}</option>
              }
            </select>
          </div>
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Status' | translate }}</label>
            <select
              id="status"
              [(ngModel)]="filterConfig.filters['status']"
              (change)="applyFilters()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">{{ 'All Statuses' | translate }}</option>
              <option value="active">{{ 'Active' | translate }}</option>
              <option value="inactive">{{ 'Inactive' | translate }}</option>
            </select>
          </div>
          <div>
            <label for="maxPrice" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Max Price' | translate }}</label>
            <input
              type="number"
              id="maxPrice"
              [(ngModel)]="filterConfig.filters['maxPrice']"
              (keyup.enter)="applyFilters()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="{{ 'Max Price' | translate }}"
            >
          </div>
          <div class="flex items-end">
            <button (click)="applyFilters()" class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              {{ 'Apply Filters' | translate }}
            </button>
          </div>
        </div>

        <!-- Additional filter row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label for="minPrice" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Min Price' | translate }}</label>
            <input
              type="number"
              id="minPrice"
              [(ngModel)]="filterConfig.filters['minPrice']"
              (keyup.enter)="applyFilters()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="{{ 'Min Price' | translate }}"
            >
          </div>
        </div>
      </div>

      <!-- Products Table using CommonTable component -->
      <misc-common-table
        [data]="products"
        [columns]="tableColumns"
        tableName="products"
        [loading]="loading"
        [error]="error"
        [paginationConfig]="paginationConfig"
        [sortConfig]="sortConfig"
        [filterConfig]="filterConfig"
        [showActions]="true"
        [rowActions]="[
          { name: 'edit', title: 'Edit', color: 'indigo' },
          { name: 'toggleActive', title: 'Toggle Active', color: 'blue' },
        ]"
        (sortChange)="onSortChange($event)"
        (filterChange)="onFilterChange($event)"
        (pageChange)="onPageChange($event)"
        (action)="onAction($event)">
      </misc-common-table>

      <!-- Confirm Dialog -->
      <misc-confirm-dialog
        [isOpen]="showConfirmDialog"
        [title]="confirmDialogTitle"
        [message]="confirmDialogMessage"
        [confirmButtonText]="confirmDialogConfirmText"
        [cancelButtonText]="confirmDialogCancelText"
        (confirmed)="onConfirmAction()"
        (cancelled)="onCancelAction()">
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
export class AdminProductsComponent implements OnInit {
  languageService = inject(LanguageService);
  products: ProductDto[] = [];
  loading = false;
  error: string | null = null;

  tableColumns: TableColumn[] = [];

  // Table configuration objects
  paginationConfig: PaginationConfig = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  };

  sortConfig: SortConfig = {
    sortBy: 'name',
    sortOrder: 'asc'
  };

  filterConfig: FilterConfig = {
    searchTerm: '',
    filters: {}
  };

  // Filter properties for UI
  categories: any[] = [];
  brands: any[] = [];

  // Confirm dialog properties
  showConfirmDialog = false;
  confirmDialogTitle = '';
  confirmDialogMessage = '';
  confirmDialogConfirmText = 'Confirm';
  confirmDialogCancelText = 'Cancel';
  productToDelete: number | null = null;
  productToToggle: { id: number; name: string; currentStatus: boolean } | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private messageDialogService: MessageDialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize table columns with translations
    this.tableColumns = [
      { key: 'name', title: this.languageService.getTranslation('Name'), sortable: true, type: 'text', width: '30%' },
      { key: 'price', title: this.languageService.getTranslation('Price'), sortable: true, type: 'number' },
      { key: 'categoryName', title: this.languageService.getTranslation('Category'), sortable: true, type: 'text' },
      { key: 'stockQuantity', title: this.languageService.getTranslation('Stock'), sortable: true, type: 'number' },
      { key: 'isActive', title: this.languageService.getTranslation('Status'), sortable: true, type: 'boolean' },
    ];

    // Load categories and brands for filtering
    this.loadCategories();
    this.loadBrands();

    // Load products with current filters and pagination
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading = true;
    this.error = null;

    // Extract filter values
    const searchTerm = this.filterConfig.searchTerm || undefined;
    const categoryId = this.filterConfig.filters['categoryId'] ? Number(this.filterConfig.filters['categoryId']) : undefined;
    const brandId = this.filterConfig.filters['brandId'] ? Number(this.filterConfig.filters['brandId']) : undefined;
    const status = this.filterConfig.filters['status'] || undefined;
    const minPrice = this.filterConfig.filters['minPrice'] ? Number(this.filterConfig.filters['minPrice']) : undefined;
    const maxPrice = this.filterConfig.filters['maxPrice'] ? Number(this.filterConfig.filters['maxPrice']) : undefined;

    // Use the ProductService to get paginated and filtered products
    this.productService.apiProductGet(
      this.paginationConfig.currentPage,
      this.paginationConfig.pageSize,
      searchTerm,
      categoryId,
      undefined,
      brandId,
      undefined,
      minPrice,
      maxPrice,
      undefined,
      status === 'active' ? true : status === 'inactive' ? false : undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      this.sortConfig.sortBy,
      this.sortConfig.sortOrder
    ).subscribe({
      next: (result) => {
        this.products = result.data?.items ?? [];
        this.paginationConfig.totalItems = result.data?.totalCount ?? 0;
        this.paginationConfig.totalPages = result.data?.totalPages || Math.ceil(result.data?.totalCount ?? 0 / this.paginationConfig.pageSize);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = this.languageService.getTranslation('Failed to load products. Please try again.');
        this.loading = false;
      }
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
      }
    });
  }

  private getStatusFilter(): boolean {
    const statusFilter = this.filterConfig.filters['status'];
    if (statusFilter === 'active') {
      return true;
    } else if (statusFilter === 'inactive') {
      return false;
    }
    return true; // All statuses
  }

  // Event handlers for CommonTable
  onSortChange(sortConfig: SortConfig): void {
    this.sortConfig = sortConfig;
    this.loadProducts();
  }

  applyFilters(): void {
    this.paginationConfig.currentPage = 1; // Reset to first page when filtering
    this.loadProducts();
  }

  onFilterChange(filterConfig: FilterConfig): void {
    // We're handling filters in the UI directly, so this is just for compatibility
    // with the CommonTable component
    this.filterConfig = filterConfig;
    this.loadProducts();
  }

  onPageChange(paginationConfig: PaginationConfig): void {
    this.paginationConfig = paginationConfig;
    this.loadProducts();
  }

  onAction(event: { name: string; item: any; index: number }): void {
    if (event.name === 'edit') {
      // Navigate to edit page for the selected product
      this.router.navigate(['/admin/products/edit', event.item.id]);
    } else if (event.name === 'toggleActive') {
      // Use confirm dialog for toggle active action
      this.openToggleConfirmDialog(event.item);
    } else if (event.name === 'delete') {
      // Use confirm dialog for delete action
      this.openDeleteConfirmDialog(event.item);
    }
  }

  private toggleProductActive(productId: number, isActive: boolean, productName: string): void {
    this.loading = true;

    // First, get the current product to update
    this.productService.apiProductIdGet(productId).subscribe({
      next: (response: any) => {
        const product = response?.data;

        // Prepare the update DTO with the new active status
        const updateDto = {
          name: product.name,
          description: product.description,
          shortDescription: product.shortDescription,
          price: product.price,
          salePrice: product.salePrice || undefined,
          sku: product.sku,
          barcode: product.barcode || '',
          stockQuantity: product.stockQuantity,
          isActive: isActive, // Toggle the active status
          isFeatured: product.isFeatured,
          isNew: product.isNew,
          brandId: product.brandId ? Number(product.brandId) : undefined,
          categoryId: product.categoryId ? Number(product.categoryId) : undefined,
          metaTitle: product.metaTitle || '',
          metaDescription: product.metaDescription || '',
          metaKeywords: product.metaKeywords || '',
          tagIds: product.tagIds || [],
          specificationValues: product.specificationValues || {}
        };

        // Update the product with the new active status
        this.productService.apiProductIdPut(productId, updateDto).subscribe({
          next: () => {
            const action = isActive ? this.languageService.getTranslation('activated') : this.languageService.getTranslation('deactivated');
            this.messageDialogService.success(`${this.languageService.getTranslation('Product')}"${productName}" ${this.languageService.getTranslation('has been')} ${action} ${this.languageService.getTranslation('successfully')}!`, this.languageService.getTranslation('Success'));
            // Reload products after toggling active status
            this.loadProducts();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error toggling product active status:', error);
            this.messageDialogService.error(this.languageService.getTranslation('Failed to update product status. Please try again.'), this.languageService.getTranslation('Error'));
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error fetching product for update:', error);
        this.messageDialogService.error(this.languageService.getTranslation('Failed to fetch product details. Please try again.'), this.languageService.getTranslation('Error'));
        this.loading = false;
      }
    });
  }

  private deleteProduct(productId: number): void {
    this.loading = true;
    this.productService.apiProductIdDelete(productId).subscribe({
      next: () => {
        this.messageDialogService.success(this.languageService.getTranslation('Product deleted successfully!'), this.languageService.getTranslation('Success'));
        // Reload products after deletion
        this.loadProducts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        this.messageDialogService.error(this.languageService.getTranslation('Failed to delete product. Please try again.'), this.languageService.getTranslation('Error'));
        this.loading = false;
      }
    });
  }

  // Methods to handle confirm dialog
  private openDeleteConfirmDialog(product: ProductDto): void {
    this.productToDelete = product.id || 0;
    this.confirmDialogTitle = this.languageService.getTranslation('Delete Product');
    this.confirmDialogMessage = `${this.languageService.getTranslation('Are you sure you want to delete the product')} "${product.name}"? ${this.languageService.getTranslation('This action cannot be undone.')}`;
    this.confirmDialogConfirmText = this.languageService.getTranslation('Delete');
    this.confirmDialogCancelText = this.languageService.getTranslation('Cancel');
    this.showConfirmDialog = true;
  }

  private openToggleConfirmDialog(product: ProductDto): void {
    const action = product.isActive ? this.languageService.getTranslation('deactivate') : this.languageService.getTranslation('activate');
    const status = product.isActive ? this.languageService.getTranslation('active') : this.languageService.getTranslation('inactive');
    const newStatus = product.isActive ? this.languageService.getTranslation('inactive') : this.languageService.getTranslation('active');

    this.productToToggle = {
      id: product.id  || 0,
      name: product.name,
      currentStatus: product.isActive  || false
    };

    this.confirmDialogTitle = this.languageService.getTranslation('Toggle Product Status');
    this.confirmDialogMessage = `${this.languageService.getTranslation('Are you sure you want to')} ${action} ${this.languageService.getTranslation('the product')} "${product.name}"? ${this.languageService.getTranslation('This will change its status from')} ${status} ${this.languageService.getTranslation('to')} ${newStatus}.`;
    this.confirmDialogConfirmText = action.charAt(0).toUpperCase() + action.slice(1);
    this.confirmDialogCancelText = this.languageService.getTranslation('Cancel');
    this.showConfirmDialog = true;
  }

  onConfirmAction(): void {
    if (this.productToDelete !== null) {
      this.deleteProduct(this.productToDelete);
      this.productToDelete = null;
    } else if (this.productToToggle !== null) {
      this.toggleProductActive(
        this.productToToggle.id,
        !this.productToToggle.currentStatus,
        this.productToToggle.name
      );
      this.productToToggle = null;
    }

    this.showConfirmDialog = false;
    this.resetConfirmDialog();
  }

  onCancelAction(): void {
    this.showConfirmDialog = false;
    this.resetConfirmDialog();
  }

  private resetConfirmDialog(): void {
    this.confirmDialogTitle = '';
    this.confirmDialogMessage = '';
    this.confirmDialogConfirmText = 'Confirm';
    this.confirmDialogCancelText = 'Cancel';
    this.productToDelete = null;
    this.productToToggle = null;
  }
}