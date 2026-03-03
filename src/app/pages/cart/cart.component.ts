import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Giỏ hàng của bạn</h1>

      @if (cartItems().length > 0) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Cart Items -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              @for (item of cartItems(); track item.id) {
                <div class="flex items-center p-4 border-b">
                  <div class="w-24 h-24 flex-shrink-0 mr-4">
                    <img
                      [src]="item.productImageUrl || 'https://placehold.co/100x100'"
                      [alt]="item.productName"
                      class="w-full h-full object-contain rounded border"
                    >
                  </div>

                  <div class="flex-grow">
                    <h3 class="font-semibold text-gray-800">{{ item.productName }}</h3>

                    <div class="flex items-center mt-2">
                      <button
                        (click)="updateQuantity(item.id, item.quantity - 1)"
                        class="bg-gray-200 text-gray-700 w-8 h-8 rounded-l"
                        [disabled]="item.quantity <= 1"
                      >
                        -
                      </button>

                      <span class="border-t border-b w-12 text-center py-1">{{ item.quantity }}</span>

                      <button
                        (click)="updateQuantity(item.id, item.quantity + 1)"
                        class="bg-gray-200 text-gray-700 w-8 h-8 rounded-r"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div class="ml-4">
                    <span class="font-bold text-lg">{{ (item.unitPrice * item.quantity) | currency }}</span>
                  </div>

                  <button
                    (click)="removeFromCart(item.productId)"
                    class="ml-4 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              }
            </div>
          </div>

          <!-- Order Summary -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Đơn hàng</h2>

            <div class="space-y-2 mb-6">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span>{{ cartSubtotal() | currency }}</span>
              </div>
              <div class="flex justify-between">
                <span>Tax</span>
                <span>{{ cartTax() | currency }}</span>
              </div>
              <div class="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>Tổng</span>
                <span>{{ cartTotal() | currency }}</span>
              </div>
            </div>

            <div class="space-y-4">
              <a
                routerLink="/products"
                class="block text-center bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Tiếp tục mua sắm
              </a>

              <a
                routerLink="/checkout"
                class="block text-center bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Tiền hành thanh toán
              </a>
            </div>
          </div>
        </div>
      } @else {
        <div class="bg-white rounded-lg shadow-md p-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
          </svg>
          <h3 class="text-xl font-semibold mt-4">Your cart is empty</h3>
          <p class="text-gray-600 mt-2">Looks like you haven't added anything to your cart yet</p>
          <a
            routerLink="/products"
            class="inline-block mt-4 bg-indigo-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Browse Products
          </a>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .mat-mdc-card {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class CartComponent {
  private cartService = inject(CartService);

  // Reactive signals that automatically update when the cart service state changes
  cartItems = this.cartService.cartItems$;
  cartTotal = this.cartService.cartTotal$;

  // Create computed signals for derived values
  cartSubtotal = computed(() => {
    const items = this.cartItems();
    return items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  });

  cartTax = computed(() => {
    const subtotal = this.cartSubtotal();
    const taxRate = 0.1; // 10% tax rate - adjust as needed
    return subtotal * taxRate;
  });

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.cartService.updateQuantity(productId, quantity).subscribe({
      error: (error) => {
        console.error('Error updating quantity:', error);
        // Optionally show an error message to the user
      }
    });
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}