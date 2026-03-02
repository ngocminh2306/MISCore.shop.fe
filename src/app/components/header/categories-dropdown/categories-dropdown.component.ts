import { Component, inject, Output, EventEmitter, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { CategoryService } from '../../../../public-api/api/category.service';
import { AuthService } from '../../../services/auth.service';

export interface Category {
  id: number;
  name: string;
  description?: string;
  parentId?: number | null;
  children?: Category[];
  imageUrl?: string;
  productCount?: number;
}

@Component({
  selector: 'misc-categories-dropdown',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor],
  template: `
    <div class="relative category-menu-container" #categoryDropdown>
      <button
        (click)="toggleMenu()"
        class="text-gray-800 hover:text-orange-500 font-medium transition-colors flex items-center category-dropdown-button"
        aria-haspopup="true"
        aria-expanded="false">
        Categories
        <svg
          class="ml-1 h-4 w-4 animate-fadeIn"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Nested Menu -->
      @if (showMenu) {
        <div
          class="absolute left-0 mt-2 w-64 rounded-lg shadow-xl bg-white ring-1 ring-gray-200 z-50 category-menu-container"
          #menuRef>

          <div class="py-1 transition-opacity duration-300 animate-fadeIn">
            @if (isLoading()) {
              <!-- Skeleton loading state for categories -->
              <div class="space-y-2 opacity-100 animate-fadeIn">
                <div class="px-4 py-2 text-sm text-gray-700">
                  <div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
                <div class="px-4 py-2 text-sm text-gray-700">
                  <div class="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
                <div class="px-4 py-2 text-sm text-gray-700">
                  <div class="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
                <div class="px-4 py-2 text-sm text-gray-700">
                  <div class="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                </div>
              </div>
            } @else {
              @for (category of categories; track category.id) {
                <div class="relative opacity-100 transition-opacity duration-300 animate-fadeIn">
                  <button
                    (click)="category.children && category.children.length > 0 ? selectCategory(category) : navigateToCategory(category)"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-orange-50 hover:text-orange-500 flex justify-between items-center rounded-md transition-colors">
                    {{ category.name }}
                    @if (category.children && category.children.length > 0) {
                      <svg
                        class="ml-1 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      </svg>
                    }
                  </button>

                  <!-- Submenu -->
                  @if (selectedCategory && selectedCategory.id === category.id && category.children && category.children.length > 0) {
                    <div class="absolute left-full top-0 mt-0 w-56 rounded-lg shadow-xl bg-white ring-1 ring-gray-200 z-50 opacity-100 transition-opacity duration-300 animate-fadeIn">
                      <div class="py-1">
                        @for (subcategory of category.children; track subcategory.id) {
                          <a
                            [routerLink]="['/products']"
                            [queryParams]="{ category: subcategory.id }"
                            (click)="onClose()"
                            class="block px-4 py-2 text-sm text-gray-800 hover:bg-orange-50 hover:text-orange-500 rounded-md transition-opacity duration-300 animate-fadeIn">
                            {{ subcategory.name }}
                          </a>
                        }
                      </div>
                    </div>
                  }
                </div>
              }

              <a
                [routerLink]="['/products']"
                (click)="onClose()"
                class="block px-4 py-2 text-sm text-gray-800 hover:bg-orange-50 hover:text-orange-500 rounded-md transition-opacity duration-300 animate-fadeIn">
                View All Products
              </a>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .animate-fadeIn {
      animation: fadeIn 0.5s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class CategoriesDropdownComponent implements OnInit {
  @Output() menuToggled = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();
  @Output() categorySelected = new EventEmitter<string>();

  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);

  categories: Category[] = [];
  showMenu = false;
  selectedCategory: Category | null = null;
  isLoading = this.authService.isLoading$;

  ngOnInit(): void {
    this.loadCategories();
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

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
    this.menuToggled.emit(this.showMenu);
  }

  onClose(): void {
    this.showMenu = false;
    this.selectedCategory = null;
    this.menuToggled.emit(false);
    this.closed.emit();
  }

  selectCategory(category: Category): void {
    this.selectedCategory = category;
  }

  navigateToCategory(category: Category): void {
    // Navigate to products page filtered by selected category
    this.onClose();
    console.log('Navigate to category:', category);
    this.categorySelected.emit(category.id.toString());
  }
}