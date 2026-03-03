import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

export interface Category {
  id: number;
  name: string;
  imageUrl: string;
  productCount: number;
}

@Component({
  selector: 'app-category-grid',
  standalone: true,
  imports: [],
  template: `
    <section class="py-8 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-xl font-bold text-center mb-6 text-gray-900">DANH MỤC NỔI BẬT</h2>

        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          @for (category of topCategories; track category.id) {
            <div
              class="flex flex-col items-center p-3 rounded-lg cursor-pointer group hover:bg-orange-50 transition-colors"
              (click)="onCategoryClick(category)">
              <div class="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mb-2 group-hover:bg-orange-200 transition-colors">
                <img
                  [src]="category.imageUrl"
                  [alt]="category.name"
                  class="w-10 h-10 object-contain group-hover:scale-110 transition-transform"
                  (error)="onImageError($event, category.name)">
              </div>
              <h3 class="text-xs font-medium text-gray-900 text-center group-hover:text-orange-500 transition-colors">{{ category.name }}</h3>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CategoryGridComponent implements OnChanges {
  @Input() categories: Category[] = [];
  @Output() categorySelected = new EventEmitter<Category>();

  topCategories: Category[] = [];

  ngOnChanges(): void {
    this.updateTopCategories();
  }

  private updateTopCategories(): void {
    // Sort categories by product count in descending order and take the top 6
    this.topCategories = [...this.categories]
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, 6);
  }

  onCategoryClick(category: Category): void {
    this.categorySelected.emit(category);
  }

  onImageError(event: any, categoryName: string): void {
    // Set a fallback image with category name if the primary image fails to load
    event.target.src = `https://placehold.co/64x64/4f46e5/ffffff?text=${encodeURIComponent(categoryName.charAt(0))}`;
  }
}