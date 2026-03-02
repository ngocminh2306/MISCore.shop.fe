import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService as PublicProductService } from '../../../public-api/api/product.service';
import { CategoryService } from '../../../public-api/api/category.service';
import { BannerSliderComponent } from '../../components/banner-slider/banner-slider.component';
import { Banner } from '../../components/banner-slider/banner-slider.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CategoryGridComponent } from '../../components/category-grid/category-grid.component';
import { ArticlesSectionComponent } from '../../components/articles-section/articles-section.component';
import { ProductDto } from '../../../public-api';

interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl: string;
  productCount: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, BannerSliderComponent, ProductCardComponent, CategoryGridComponent, ArticlesSectionComponent],
  template: `
    <!-- Banner Slider -->
    <misc-banner-slider [autoPlay]="true" [interval]="5000"></misc-banner-slider>

    <!-- Featured Products -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800">Featured Products</h2>
          <a
            routerLink="/products"
            class="text-orange-500 hover:text-orange-600 font-medium flex items-center group"
          >
            Xem tất cả
            <span class="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        <!-- Product Grid: 2 columns on mobile, 2 on tablet, 4 on desktop -->
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6 gap-8">
          @for (product of featuredProducts; track product.id) {
            <misc-product-card [product]="product" (addToCart)="onAddToCart($event)" />
          }
        </div>
      </div>
    </section>

    <!-- New Products -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800">New Products</h2>
          <a
            routerLink="/products"
            class="text-orange-500 hover:text-orange-600 font-medium flex items-center group"
          >
            Xem tất cả
            <span class="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        <!-- Product Grid: 2 columns on mobile, 2 on tablet, 4 on desktop -->
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6 gap-8">
          @for (product of newProducts; track product.id) {
            <misc-product-card [product]="product" (addToCart)="onAddToCart($event)" />
          }
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <misc-category-grid
      [categories]="categories"
      (categorySelected)="onCategorySelected($event)">
    </misc-category-grid>

    <!-- Articles Section -->
    <misc-articles-section></misc-articles-section>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HomeComponent implements OnInit {
  private cartService = inject(CartService);
  private productService = inject(PublicProductService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  featuredProducts: ProductDto[] = [];
  newProducts: ProductDto[] = [];
  categories: any[] = []; // Array to hold category objects with name, image, and product count

  ngOnInit(): void {
    // Load featured products using the real service
    this.productService.apiProductFeaturedGet(8).subscribe({
      next: (response) => {
        this.featuredProducts = response?.data || [];
        // Update categories after loading products
        this.updateCategories();
      },
      error: (error) => {
        console.error('Error loading featured products', error);
        // Handle error appropriately, maybe show a message to the user
      }
    });

    // Load new products using the real service
    this.productService.apiProductNewGet(8).subscribe({
      next: (response) => {
        this.newProducts = response?.data || [];
      },
      error: (error) => {
        console.error('Error loading new products', error);
        // Handle error appropriately
      }
    });

    // Load real categories from the API
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService.apiCategoryGet().subscribe({
      next: (response: any) => {
        // Transform API response to match our requirements
        this.categories = (response?.data || []).map((category: any) => ({
          id: category.id,
          name: category.name,
          description: category.description,
          imageUrl: category.imageUrl || 'https://placehold.co/300x300/4f46e5/ffffff?text=' + encodeURIComponent(category.name),
          productCount: category.productCount || 0
        }));
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // For fallback, we can use categories extracted from products
        this.updateCategories();
      }
    });
  }

  private updateCategories(): void {
    // Fallback method to extract categories from products if API call fails
    // This creates a temporary category list based on products
    const productCategories = [...new Set(this.featuredProducts.map(p => p.categoryName).filter((name): name is string => name !== undefined && name !== null && name !== ''))];

    // Create temporary category objects if no real categories were loaded from API
    if (this.categories.length === 0 && productCategories.length > 0) {
      this.categories = productCategories.map((name: string) => ({
        id: 0, // Placeholder ID since we don't have real category IDs
        name: name || 'Uncategorized',
        description: `Products in ${name}`,
        imageUrl: `https://placehold.co/300x300/4f46e5/ffffff?text=${encodeURIComponent(name || 'Category')}`,
        productCount: this.getProductsByCategory(name).length
      }));
    }
  }

  getProductsByCategory(category: string): ProductDto[] {
    // Combine featured and new products for category filtering
    const allProducts = [...this.featuredProducts, ...this.newProducts];
    return allProducts.filter(p => p.categoryName === category);
  }

  navigateToCategory(categoryId: number): void {
    // Navigate to the products page filtered by category
    this.router.navigate(['/products'], { queryParams: { category: categoryId } });
  }

  addToCart(product: ProductDto): void {
    this.cartService.addToCart(product);
  }

  onAddToCart(product: ProductDto): void {
    this.cartService.addToCart(product);
  }

  onImageError(event: any): void {
    // Set a fallback image if the primary image fails to load
    event.target.src = 'https://placehold.co/600x400/e5e7eb/6b7280?text=No+Image';
  }

  onCategorySelected(category: Category): void {
    // Navigate to the products page filtered by category
    this.router.navigate(['/products'], { queryParams: { category: category.id } });
  }
}