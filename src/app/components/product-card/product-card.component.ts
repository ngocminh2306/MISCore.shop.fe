import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ProductDto } from '../../../public-api';

@Component({
  selector: 'misc-product-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div class="bg-white rounded border border-gray-200 overflow-hidden flex flex-col h-full group max-w-xs w-full">
      <!-- Product Image -->
      <a [routerLink]="['/product', product.id]" class="block relative">
        <div class="relative aspect-square overflow-hidden bg-gray-100">
          <img
            [src]="product.mainImageUrl || 'https://placehold.co/300x300'"
            [alt]="product.name"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          >
          <!-- Badge for discount -->
          @if (product.salePrice && product.salePrice > 0) {
            <div class="absolute top-1 left-1 bg-red-500 text-white text-[0.6rem] font-bold px-1 py-0.5 rounded">
              SALE
            </div>
          }
        </div>
      </a>

      <!-- Product Info -->
      <div class="p-2 flex-grow flex flex-col">
        <!-- Product Name -->
        <a [routerLink]="['/product', product.id]">
          <h3 class="text-[0.7rem] font-semibold text-gray-800 mb-0.5 line-clamp-2 leading-tight">{{ product.name }}</h3>
        </a>

        <!-- Rating (placeholder) -->
        <div class="flex items-center mb-0.5">
          <div class="flex text-yellow-400">
            <span class="text-[0.6rem]">★</span>
            <span class="text-[0.6rem]">★</span>
            <span class="text-[0.6rem]">★</span>
            <span class="text-[0.6rem]">★</span>
            <span class="text-[0.6rem]">☆</span>
          </div>
          <span class="text-[0.6rem] text-gray-500 ml-0.5">(128)</span>
        </div>

        <!-- Price Section -->
        <div class="flex items-baseline gap-x-0.5 flex-wrap mt-auto">
          @if (product.salePrice && product.salePrice > 0) {
            <span class="text-[0.7rem] font-bold text-red-500">{{ product.salePrice | currency }}</span>
            <span class="text-[0.6rem] text-gray-500 line-through">{{ product.price | currency }}</span>
            <span class="text-[0.6rem] text-red-500 font-semibold ml-0.5">
              {{ calculateDiscountPercentage(product.price, product.salePrice) }}% OFF
            </span>
          } @else {
            <span class="text-[0.7rem] font-bold text-red-500">{{ product.price | currency }}</span>
          }
        </div>

        <!-- Sales Info -->
        <div class="text-[0.6rem] text-gray-500 mt-0.5">Sold 256</div>
      </div>

      <!-- Add to Cart Button (hidden by default, appears on hover) -->
      <div class="px-2 pb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          (click)="onAddToCart(); $event.stopPropagation()"
          class="w-full bg-orange-500 hover:bg-orange-600 text-white py-1.5 rounded text-[0.65rem] font-medium transition-colors duration-200 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Cart
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Mobile-specific adjustments for smaller card */
    @media (max-width: 640px) {
      :host {
        margin: 0.125rem;
      }

      h3 {
        font-size: 0.6rem !important;
      }

      div.flex.text-yellow-400 span {
        font-size: 0.5rem !important;
      }

      div.text-\[0\.6rem\] {
        font-size: 0.5rem !important;
      }

      button {
        font-size: 0.6rem !important;
        padding-top: 0.25rem !important;
        padding-bottom: 0.25rem !important;
      }
    }

    @media (min-width: 641px) and (max-width: 768px) {
      h3 {
        font-size: 0.65rem !important;
      }

      button {
        font-size: 0.6rem !important;
      }
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: ProductDto;
  @Output() addToCart = new EventEmitter<ProductDto>();

  private cartService = inject(CartService);

  // Utility function for calculating discount percentage
  calculateDiscountPercentage(price: number, salePrice: number): number {
    if (price <= 0) return 0;
    return Math.round(((price - salePrice) / price) * 100);
  }

  onAddToCart(): void {
    this.cartService.addToCart(this.product).subscribe();
    this.addToCart.emit(this.product);
  }

}