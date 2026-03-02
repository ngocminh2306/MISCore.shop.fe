import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart, CartItem } from '../models/cart';
import { CartService as PublicCartService } from '../../public-api/api/cart.service';
import { AddToCartDto } from '../../public-api/model/addToCartDto';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';
import { ProductDto } from '../../public-api';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  private cart = signal<Cart>({
    id: 0,
    userId: '',
    items: [],
    itemCount: 0,
    subtotal: 0,
    tax: 0,
    shippingCost: 0,
    discountAmount: 0,
    total: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  cartItems$ = signal<CartItem[]>([]);
  cartCount$ = signal(0);
  cartTotal$ = signal(0);

  constructor(private publicCartService: PublicCartService, private router: Router) {
    // Load initial cart data
    this.loadCart();

    // Subscribe to authentication changes to reload cart when auth status changes
    if(this.authService.isLoggedIn$()) {
      this.loadCart();
    };
  }

  private updateCartStats(): void {
    const items = this.cartItems$();
    const count = items.reduce((total, item) => total + item.quantity, 0);
    const total = items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);

    // Update cart stats signals
    this.cartCount$.set(count);
    this.cartTotal$.set(total);

    // Update cart object with calculated values
    const currentCart = this.cart();
    this.cart.set({
      ...currentCart,
      itemCount: count,
      total: total,
      items: items
    });
  }

  private loadCart(): void {
    // Load cart data from the API
    this.getCartFromApi();
  }

  private getCartFromApi(): void {
    // Only make API call if user is authenticated
    if (this.authService.isAuthenticated()) {
      this.publicCartService.apiCartGet().subscribe({
        next: (response: any) => {
          // We need to map the API response to our Cart model
          // The API response structure might be different
          const cartData: Cart = response?.data as Cart;
          if (cartData) {
            this.cart.set(cartData);
            this.cartItems$.set(cartData.items || []);
            this.updateCartStats();
          }
        },
        error: (error) => {
          console.error('Error loading authenticated cart', error);
          // If authenticated user has an error loading their cart,
          // fallback to checking if they have a guest cart in local storage
          this.loadGuestCart();
        }
      });
    } else {
      // For unauthenticated users, check localStorage for guest cart
      this.loadGuestCart();
    }
  }

  private loadGuestCart(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    // Check if there's a guest cart in localStorage
    const guestCartData = localStorage.getItem('guestCart');
    if (guestCartData) {
      try {
        const guestCart = JSON.parse(guestCartData);
        this.cart.set(guestCart);
        this.cartItems$.set(guestCart.items || []);
        this.updateCartStats();
        console.log('Guest cart loaded from localStorage', guestCart);
      } catch (e) {
        console.error('Error parsing guest cart from localStorage', e);
        this.initializeEmptyCart();
      }
    } else {
      this.initializeEmptyCart();
    }
  }

  private initializeEmptyCart(): void {
    this.cart.set({
      id: 0,
      userId: '',
      items: [],
      itemCount: 0,
      subtotal: 0,
      tax: 0,
      shippingCost: 0,
      discountAmount: 0,
      total: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    this.cartItems$.set([]);
    this.updateCartStats();
  }

  private saveGuestCart(): void {
    // Only save to localStorage if user is not authenticated
    if (!this.authService.isAuthenticated()) {
      const currentCart = this.cart();
      localStorage.setItem('guestCart', JSON.stringify(currentCart));
    }
  }

  getCart(): Cart {
    return this.cart();
  }

  getCartItemCount(): number {
    return this.cartCount$();
  }

  addToCart(product: ProductDto, quantity: number = 1): Observable<any> {
    if (this.authService.isAuthenticated()) {
      // For authenticated users, use API
      const addToCartDto: AddToCartDto = {
        productId: product.id || 0,
        quantity: quantity
      };

      return new Observable(observer => {
        this.publicCartService.apiCartPost(addToCartDto).subscribe({
          next: (response) => {
            this.refreshCart(); // Refresh cart after successful addition
            observer.next(response);
            observer.complete();
          },
          error: (error: any) => {
            observer.error(error);
            if(error?.status == 401) {
              this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
            }
          }
        });
      });
    } else {
      // For guest users, update localStorage cart
      return new Observable(observer => {
        try {
          const currentItems = this.cartItems$();
          const existingItem = currentItems.find(item => item.productId === product.id);

          if (existingItem) {
            existingItem.quantity += quantity;
          } else {
            // Create new cart item
            const newItem: CartItem = {
              id: Date.now(), // Temporary ID for guest cart
              productId: product.id || 0,
              productName: product.name,
              productSku: product.sku || '',
              productImageUrl: product.mainImageUrl || '',
              unitPrice: product.price,
              quantity: quantity,
              totalPrice: product.price * quantity,
              createdAt: undefined!,
            };
            currentItems.push(newItem);
          }
          // Update cart with new items
          const updatedCart = { ...this.cart(), items: currentItems };
          this.cart.set(updatedCart);
          this.cartItems$.set(currentItems);
          this.updateCartStats();
          this.saveGuestCart();

          observer.next({ success: true });
          observer.complete();
        } catch (error) {
          observer.error(error);
        }
      });
    }
  }

  updateQuantity(cartItemId: number, quantity: number): Observable<any> {
    if (this.authService.isAuthenticated()) {
      // For authenticated users, use API
      if (quantity <= 0) {
        return this.removeFromCartById(cartItemId);
      }

      return new Observable(observer => {
        this.publicCartService.apiCartCartItemIdPut(cartItemId, quantity).subscribe({
          next: (response) => {
            this.refreshCart(); // Refresh cart after successful quantity update
            observer.next(response);
            observer.complete();
          },
          error: (error) => {
            observer.error(error);
          }
        });
      });
    } else {
      // For guest users, update localStorage cart
      return new Observable(observer => {
        try {
          const currentItems = this.cartItems$();
          const itemIndex = currentItems.findIndex(item => item.id === cartItemId);

          if (itemIndex !== -1) {
            if (quantity <= 0) {
              // Remove item if quantity <= 0
              currentItems.splice(itemIndex, 1);
            } else {
              // Update quantity
              currentItems[itemIndex].quantity = quantity;
              currentItems[itemIndex].totalPrice = currentItems[itemIndex].unitPrice * quantity;
            }

            // Update cart with new items
            const updatedCart = { ...this.cart(), items: currentItems };
            this.cart.set(updatedCart);
            this.cartItems$.set(currentItems);
            this.updateCartStats();
            this.saveGuestCart();

            observer.next({ success: true });
            observer.complete();
          } else {
            observer.error(new Error('Cart item not found'));
          }
        } catch (error) {
          observer.error(error);
        }
      });
    }
  }

  removeFromCart(productId: number): void {
    if (this.authService.isAuthenticated()) {
      // For authenticated users, use API
      this.publicCartService.apiCartProductProductIdDelete(productId).subscribe({
        next: () => {
          // Refresh cart after removal
          this.refreshCart();
        },
        error: (error) => {
          console.error('Error removing item from cart', error);
        }
      });
    } else {
      // For guest users, update localStorage cart
      const currentItems = this.cartItems$();
      const updatedItems = currentItems.filter(item => item.productId !== productId);

      const updatedCart = { ...this.cart(), items: updatedItems };
      this.cart.set(updatedCart);
      this.cartItems$.set(updatedItems);
      this.updateCartStats();
      this.saveGuestCart();
    }
  }

  removeFromCartById(cartItemId: number): Observable<any> {
    if (this.authService.isAuthenticated()) {
      // For authenticated users, use API
      return new Observable(observer => {
        this.publicCartService.apiCartCartItemIdDelete(cartItemId).subscribe({
          next: (response) => {
            this.refreshCart(); // Refresh cart after successful removal
            observer.next(response);
            observer.complete();
          },
          error: (error) => {
            observer.error(error);
          }
        });
      });
    } else {
      // For guest users, update localStorage cart
      return new Observable(observer => {
        try {
          const currentItems = this.cartItems$();
          const updatedItems = currentItems.filter(item => item.id !== cartItemId);

          const updatedCart = { ...this.cart(), items: updatedItems };
          this.cart.set(updatedCart);
          this.cartItems$.set(updatedItems);
          this.updateCartStats();
          this.saveGuestCart();

          observer.next({ success: true });
          observer.complete();
        } catch (error) {
          observer.error(error);
        }
      });
    }
  }

  clearCart(): void {
    if (this.authService.isAuthenticated()) {
      // For authenticated users, use API
      this.publicCartService.apiCartDelete().subscribe({
        next: () => {
          // Refresh cart after clearing
          this.refreshCart();
        },
        error: (error) => {
          console.error('Error clearing cart', error);
        }
      });
    } else {
      // For guest users, clear localStorage cart
      this.cartItems$.set([]);
      this.initializeEmptyCart();
      localStorage.removeItem('guestCart');
    }
  }

  refreshCart(): void {
    this.loadCart();
  }
}