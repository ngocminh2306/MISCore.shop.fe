import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { CategoryService } from '../../../../public-api/api/category.service';

interface Category {
  id: number;
  name: string;
  description?: string;
  parentId?: number | null;
  children?: Category[];
  imageUrl?: string;
  productCount?: number;
}

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [RouterLink, NgIf],
  template: `
    <div
      *ngIf="isOpen"
      class="fixed inset-0 bg-white z-50 w-full h-full flex flex-col md:hidden overflow-y-auto animate-fadeIn">
      <div class="p-4 border-b flex justify-between items-center animate-slideInDown">
        <a routerLink="/" class="text-2xl font-bold text-indigo-600">ShopHub</a>
        <button (click)="closeMenu()" class="text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="flex-1 p-4">
        <div class="space-y-4">
          <a
            routerLink="/"
            (click)="onNavigate()"
            class="block py-2 text-gray-700 hover:text-indigo-600 transition-colors animate-fadeIn">Home</a>

          <!-- Categories in mobile -->
          <div class="animate-fadeIn">
            <button
              (click)="toggleCategoryMenu()"
              class="w-full py-2 text-left flex justify-between items-center text-gray-700 hover:text-indigo-600 transition-colors">
              <span>Categories</span>
              <svg
                class="h-4 w-4 ml-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>

            <!-- Categories submenu -->
            @if (showCategoryMenu) {
              <div class="ml-4 mt-2 space-y-2 border-l pl-2 animate-fadeIn">
                @for (category of categories; track category.id) {
                  <div class="animate-fadeIn">
                    <button
                      (click)="category.children && category.children.length > 0 ? selectCategory(category) : navigateToCategory(category)"
                      class="block w-full text-left py-1 text-sm text-gray-700 hover:text-indigo-600">
                      {{ category.name }}
                    </button>

                    <!-- Subcategories submenu -->
                    @if (selectedCategory && selectedCategory.id === category.id && category.children && category.children.length > 0) {
                      <div class="ml-4 mt-1 space-y-1 animate-fadeIn">
                        @for (subcategory of category.children; track subcategory.id) {
                          <a
                            [routerLink]="['/products']"
                            [queryParams]="{ category: subcategory.id }"
                            (click)="onNavigate()"
                            class="block py-1 text-xs text-gray-600 hover:text-indigo-600 pl-2 animate-fadeIn">
                            {{ subcategory.name }}
                          </a>
                        }
                      </div>
                    }
                  </div>
                }
                <a
                  [routerLink]="['/products']"
                  (click)="onNavigate()"
                  class="block py-1 text-sm text-gray-700 hover:text-indigo-600 animate-fadeIn">
                  View All Products
                </a>
              </div>
            }
          </div>

          <a
            routerLink="/about"
            (click)="onNavigate()"
            class="block py-2 text-gray-700 hover:text-indigo-600 transition-colors animate-fadeIn">About</a>
          <a
            routerLink="/contact"
            (click)="onNavigate()"
            class="block py-2 text-gray-700 hover:text-indigo-600 transition-colors animate-fadeIn">Contact</a>

          @if (isLoading()) {
            <!-- Skeleton loading state for user section -->
            <div class="pt-4 space-y-3 opacity-100 transition-opacity duration-300 animate-fadeIn">
              <div class="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div class="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div class="h-6 bg-gray-200 rounded animate-pulse w-2/3"></div>
              <div class="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
            </div>
          } @else {
            <!-- User menu in mobile -->
            @if (!isLoggedIn()) {
              <div class="pt-4 space-y-2 opacity-100 transition-opacity duration-300 animate-fadeIn">
                <a
                  routerLink="/login"
                  (click)="onNavigate()"
                  class="block py-2 px-4 bg-gray-100 text-gray-700 rounded-md transition-opacity duration-300 animate-fadeIn">Login</a>
                <a
                  routerLink="/register"
                  (click)="onNavigate()"
                  class="block py-2 px-4 bg-indigo-600 text-white rounded-md transition-opacity duration-300 animate-fadeIn">Register</a>
              </div>
            } @else {
              <div class="pt-4 space-y-2 border-t border-gray-200 opacity-100 transition-opacity duration-300 animate-fadeIn">
                <a
                  [routerLink]="['/user-info']"
                  (click)="onNavigate()"
                  class="block py-2 text-gray-700 hover:text-indigo-600 transition-colors animate-fadeIn">
                  Hi, {{ user()?.firstName || user()?.userName || 'User' }}!
                </a>
                <a
                  [routerLink]="['/user-info']"
                  (click)="onNavigate()"
                  class="block py-2 text-gray-700 hover:text-indigo-600 transition-colors pl-4 animate-fadeIn">
                  My Account
                </a>
                <a
                  [routerLink]="['/my-shop']"
                  (click)="onNavigate()"
                  class="block py-2 text-gray-700 hover:text-indigo-600 transition-colors pl-4 animate-fadeIn">
                  My Shop
                </a>
                <a
                  [routerLink]="['/order-history']"
                  (click)="onNavigate()"
                  class="block py-2 text-gray-700 hover:text-indigo-600 transition-colors pl-4 animate-fadeIn">
                  Order History
                </a>
                <button
                  (click)="logout(); onNavigate();"
                  class="w-full text-left py-2 text-gray-700 hover:text-indigo-600 transition-colors pl-4 animate-fadeIn">
                  Sign out
                </button>
              </div>
            }
          }
        </div>
      </nav>

      <div class="p-4 border-t flex items-center animate-slideInUp">
        <a routerLink="/cart" class="relative flex-1 text-gray-700 hover:text-indigo-600 transition-colors animate-fadeIn">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
            </svg>
            <span>Cart</span>
            @if (cartCount() > 0) {
              <span class="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                {{ cartCount() }}
              </span>
            }
          </div>
        </a>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .animate-fadeIn {
      animation: fadeIn 0.5s ease-in-out;
    }

    .animate-slideInDown {
      animation: slideInDown 0.4s ease-in-out;
    }

    .animate-slideInUp {
      animation: slideInUp 0.4s ease-in-out;
    }

    .animate-bounce {
      animation: bounce 0.6s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% {
        transform: translateZ(0);
      }
      40%, 43% {
        transform: translateY(-4px);
      }
      70% {
        transform: translateY(-2px);
      }
      90% {
        transform: translateY(-1px);
      }
    }
  `]
})
export class MobileMenuComponent implements OnInit {
  @Input() isOpen = false;
  @Output() menuClosed = new EventEmitter<void>();
  @Output() navigated = new EventEmitter<void>();

  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private categoryService = inject(CategoryService);

  cartCount = this.cartService.cartCount$;
  user = this.authService.currentUser$;
  isLoggedIn = this.authService.isLoggedIn$;
  isLoading = this.authService.isLoading$;

  // Properties for nested category menu
  categories: Category[] = [];
  showCategoryMenu = false;
  selectedCategory: Category | null = null;

  ngOnInit(): void {
    if (this.isOpen) {
      this.loadCategories();
    }
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      this.loadCategories();
    }
  }

  loadCategories(): void {
    this.categoryService.apiCategoryGet().subscribe({
      next: (response: any) => {
        // Process the API response to create nested category structure
        const rawCategories = response?.data || [];
        this.categories = this.buildCategoryTree(rawCategories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // On error, we could set some default categories or handle gracefully
        this.categories = [];
      }
    });
  }

  buildCategoryTree(categories: any[]): Category[] {
    // Create a map of all categories with their IDs as keys
    const categoryMap = new Map<number, Category>();

    // Initialize all categories
    categories.forEach(cat => {
      categoryMap.set(cat.id, {
        id: cat.id,
        name: cat.name,
        description: cat.description,
        parentId: cat.parentId || null,
        children: [],
        imageUrl: cat.imageUrl,
        productCount: cat.productCount
      });
    });

    // Build the tree structure
    const roots: Category[] = [];

    categories.forEach(cat => {
      const category = categoryMap.get(cat.id);
      if (!category) return;

      if (cat.parentId === null || cat.parentId === undefined) {
        // This is a root category
        roots.push(category);
      } else {
        // Find the parent category and add this as child
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(category);
        }
      }
    });

    return roots;
  }

  closeMenu(): void {
    this.menuClosed.emit();
  }

  onNavigate(): void {
    this.navigated.emit();
  }

  toggleCategoryMenu(): void {
    this.showCategoryMenu = !this.showCategoryMenu;
  }

  selectCategory(category: Category): void {
    this.selectedCategory = category;
  }

  navigateToCategory(category: Category): void {
    // Navigate to products page filtered by selected category
    this.onNavigate();
    console.log('Navigate to category:', category);
  }

  logout(): void {
    this.authService.logout();
  }
}