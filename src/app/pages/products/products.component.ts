import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ProductService as PublicProductService } from '../../../public-api/api/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductDto } from '../../../public-api';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, ProductCardComponent, CurrencyPipe],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Sản phẩm</h1>

      <div class="flex flex-col md:flex-row gap-8">
        <!-- Filter Sidebar -->
        <aside class="md:w-1/4">
          <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-lg font-semibold mb-4 text-gray-700">Bộ lọc</h2>

            <div class="mb-6">
              <h3 class="font-medium mb-2 text-gray-600">Category</h3>
              <div class="space-y-2">
                @for (category of categories; track category.id) {
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      class="rounded text-indigo-600 mr-2"
                      [checked]="selectedCategoryIds.has(category.id)"
                      (change)="toggleCategory(category.name, $any($event.target).checked)"
                    >
                    <span class="text-gray-700">{{ category.name }} ({{ getCategoryCount(category.name) }})</span>
                  </label>
                }
              </div>
            </div>

            <div class="mb-6">
              <h3 class="font-medium mb-2 text-gray-600">Khoảng giá</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm mb-1">Tối thiểu: {{ minPrice | currency }}</label>
                  <input
                    type="number"
                    min="0"
                    [max]="originalMaxPrice"
                    [value]="minPrice"
                    (input)="onMinPriceChange($any($event.target).value)"
                    class="w-full border rounded px-3 py-2">
                </div>
                <div>
                  <label class="block text-sm mb-1">Tối đa: {{ maxPrice | currency }}</label>
                  <input
                    type="number"
                    min="0"
                    [max]="originalMaxPrice"
                    [value]="maxPrice"
                    (input)="onMaxPriceChange($any($event.target).value)"
                    class="w-full border rounded px-3 py-2">
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Product Grid -->
        <main class="md:w-3/4">
          <!-- Loading State -->
          @if (loading) {
            <div class="flex justify-center items-center h-64">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          }

          <!-- Error State -->
          @if (error) {
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
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

          <!-- Sort Controls -->
          @if (!loading && !error) {
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p class="text-gray-600">Kết quả có <b>{{ filteredProducts.length }}</b> sản phẩm</p>

              <select
                class="border rounded px-4 py-2"
                [(ngModel)]="sortOption"
                (change)="loadFilteredProducts()"
              >
                <option value="name">Tên sản phẩm: A-Z</option>
                <option value="priceLowHigh">Giá: Từ thấp đến cao</option>
                <option value="priceHighLow">Giá: Từ cao đến thấp</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <!-- Products Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6 gap-6">
              @for (product of filteredProducts; track product.id) {
                <misc-product-card [product]="product" (addToCart)="onAddToCart($event)" />
              }
            </div>
          }
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProductsComponent implements OnInit {
  categoryIdFromQuery: number | null = null;

  ngOnInit(): void {
    // Get category parameter from query params to apply as initial filter
    this.route.queryParams.subscribe(params => {
      const categoryParam = params['category'];
      if (categoryParam) {
        const categoryId = Number(categoryParam);
        if (!isNaN(categoryId)) {
          this.categoryIdFromQuery = categoryId;
        }
      }
      // Load products with potential initial category filter
      this.loadProducts();
    });
  }

  private cartService = inject(CartService);
  private productService = inject(PublicProductService);
  private route = inject(ActivatedRoute);

  allProducts: ProductDto[] = [];
  filteredProducts: ProductDto[] = [];
  loading = false;
  error: string | null = null;

  categories: { id: number; name: string }[] = [];
  selectedCategoryIds = new Set<number>(); // All selected by default

  minPrice = 0;
  maxPrice = 0; // Will be set dynamically based on the loaded products
  originalMinPrice = 0;
  originalMaxPrice = 0; // Will be set dynamically based on the loaded products
  sortOption: 'name' | 'priceLowHigh' | 'priceHighLow' | 'rating' = 'name';

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    // Load products from the API
    this.productService.apiProductGet(1, 50, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 'name', 'asc', undefined, undefined, undefined).subscribe({
      next: (response) => {
        // Extract products from the response (structure depends on API)
        const productsData = response?.data?.items || [];
        this.allProducts = productsData;
        this.filteredProducts = [...this.allProducts];

        // Extract unique categories with IDs
        const uniqueCategories = new Map<number, string>();
        this.allProducts.forEach(p => {
          if (p.categoryId && p.categoryName) {
            uniqueCategories.set(p.categoryId, p.categoryName);
          }
        });

        this.categories = Array.from(uniqueCategories, ([id, name]) => ({ id, name }));

        // Initialize selected categories
        if (this.categoryIdFromQuery && this.categoryIdFromQuery !== null) {
          // If there's a category from query params, select only that category
          this.selectedCategoryIds = new Set<number>([this.categoryIdFromQuery]);
        } else {
          // Otherwise, select all categories by default
          this.selectedCategoryIds = new Set<number>(this.categories.map(cat => cat.id));
        }

        // Initialize price bounds if this is the initial load (all products) and bounds are not set
        if (this.allProducts.length > 0 && this.originalMaxPrice === 0) {
          const min = Math.min(...this.allProducts.map(p => p.price));
          const max = Math.max(...this.allProducts.map(p => p.price));
          this.originalMinPrice = min;
          this.originalMaxPrice = max;
          // Set current min/max to the original values
          if (this.maxPrice === 0) {
            this.minPrice = min;
            this.maxPrice = max;
          }
        }

        // Now that categories are loaded, apply initial filter if needed
        if (this.categoryIdFromQuery && this.categoryIdFromQuery !== null) {
          this.loadFilteredProducts();
        } else {
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
      }
    });
  }
  toggleCategory(categoryName: string, checked: boolean): void {
    // Find the category ID by name
    const category = this.categories.find(cat => cat.name === categoryName);
    if (category) {
      if (checked) {
        this.selectedCategoryIds.add(category.id);
      } else {
        this.selectedCategoryIds.delete(category.id);
      }
    }

    this.loadFilteredProducts();
  }

  loadFilteredProducts(): void {
    this.loading = true;
    this.error = null;

    const minPrice = this.minPrice;
    const maxPrice = this.maxPrice;
    const sortOption = this.sortOption;
    const selectedCategoryIds = Array.from(this.selectedCategoryIds);

    // Determine sort parameters for API
    let sortBy: string | undefined = 'name';
    let sortOrder: string | undefined = 'asc';

    switch (sortOption) {
      case 'priceLowHigh':
        sortBy = 'price';
        sortOrder = 'asc';
        break;
      case 'priceHighLow':
        sortBy = 'price';
        sortOrder = 'desc';
        break;
      case 'rating':
        sortBy = 'averageRating';
        sortOrder = 'desc';
        break;
      case 'name':
        sortBy = 'name';
        sortOrder = 'asc';
        break;
    }

    // Load products from the API with all filters
    this.productService.apiProductGet(
      1, // page
      50, // pageSize
      undefined, // searchTerm
      undefined, // categoryId
      selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined, // categoryIds (array of numbers, not comma-separated string)
      undefined, // brandId
      minPrice, // minPrice
      maxPrice, // maxPrice
      undefined, // minRating
      undefined, // isActive
      undefined, // isFeatured
      undefined, // isNew
      undefined, // includeOutOfStock
      undefined, // tags
      sortBy, // sortBy
      sortOrder, // sortOrder
      undefined, // supplierId
      undefined, // sku
      undefined // getMyProducts
    ).subscribe({
      next: (response) => {
        // Extract products from the response (structure depends on API)
        const productsData = response?.data?.items || [];
        this.allProducts = productsData;
        this.filteredProducts = [...this.allProducts];

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading filtered products:', error);
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
      }
    });
  }

  getCategoryCount(categoryName: string): number {
    const category = this.categories.find(cat => cat.name === categoryName);
    if (!category) return 0;
    return this.allProducts.filter(p => p.categoryId === category.id).length;
  }

  onMinPriceChange(value: string): void {
    const newMinPrice = Number(value);
    // Ensure minPrice doesn't exceed maxPrice
    if (newMinPrice <= this.maxPrice) {
      this.minPrice = newMinPrice;
    } else {
      this.minPrice = this.maxPrice; // Adjust if user tries to set min > max
    }
    this.loadFilteredProducts();
  }

  onMaxPriceChange(value: string): void {
    const newMaxPrice = Number(value);
    // Ensure maxPrice isn't less than minPrice
    if (newMaxPrice >= this.minPrice) {
      this.maxPrice = newMaxPrice;
    } else {
      this.maxPrice = this.minPrice; // Adjust if user tries to set max < min
    }
    this.loadFilteredProducts();
  }

  onAddToCart(product: ProductDto): void {
    // You can add any additional logic here if needed
    console.log('Product added to cart:', product.name);
  }
}