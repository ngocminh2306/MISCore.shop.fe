import { Component, inject, OnInit, ElementRef, Renderer2, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { DOCUMENT } from '@angular/common';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { UserDropdownComponent } from './user-dropdown/user-dropdown.component';
import { CategoriesDropdownComponent } from './categories-dropdown/categories-dropdown.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, MobileMenuComponent, UserDropdownComponent, CategoriesDropdownComponent],
  template: `
    <header class="bg-white shadow-sm sticky top-0 z-50 transition-opacity duration-300 animate-fadeIn">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2 animate-slideInLeft">
            <a routerLink="/" class="text-2xl font-bold text-orange-500">ShopHub</a>
          </div>

          <nav class="hidden md:flex space-x-6 animate-slideInDown">
            <a routerLink="/" class="text-gray-800 hover:text-orange-500 font-medium transition-colors">Home</a>

            <!-- Categories Dropdown -->
            <app-categories-dropdown />

            <a routerLink="/about" class="text-gray-800 hover:text-orange-500 font-medium transition-colors">About</a>
            <a routerLink="/contact" class="text-gray-800 hover:text-orange-500 font-medium transition-colors">Contact</a>
          </nav>

          @if (isLoading()) {
            <!-- Skeleton loading state -->
            <div class="flex items-center space-x-4 opacity-100 transition-opacity duration-300 animate-slideInRight">
              <!-- Cart skeleton -->
              <div class="relative">
                <div class="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <!-- User section skeleton -->
              <div class="flex items-center space-x-2">
                <div class="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <!-- Mobile menu button skeleton -->
              <div class="md:hidden">
                <div class="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          } @else {
            <div class="flex items-center space-x-4 opacity-100 transition-opacity duration-300 animate-slideInRight">
              <a routerLink="/cart" class="relative text-gray-800 hover:text-orange-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
                </svg>
                @if (cartCount() > 0) {
                  <span class="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-opacity duration-300 animate-bounceIn">
                    {{ cartCount() }}
                  </span>
                }
              </a>

              @if (!isLoggedIn()) {
                <div class="space-x-2 animate-fadeIn">
                  <a routerLink="/login" class="text-gray-800 hover:text-orange-500 font-medium transition-colors">Login</a>
                  <a routerLink="/register" class="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors font-medium">Register</a>
                </div>
              } @else {
                <!-- User dropdown -->
                <app-user-dropdown class="transition-opacity duration-300 animate-fadeIn" />
              }

              <!-- Mobile menu button -->
              <button
                (click)="toggleMobileMenu()"
                class="md:hidden text-gray-800 mobile-menu-toggle transition-opacity duration-300 animate-fadeIn">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  @if(showMobileMenu) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  }
                  @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                  }
                </svg>
              </button>

              <!-- Mobile menu -->
              <app-mobile-menu
                [isOpen]="showMobileMenu"
                (menuClosed)="closeAllMenus()"
                (navigated)="closeAllMenus()"
                class="transition-opacity duration-300" />
            </div>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }

    .animate-fadeIn {
      animation: fadeIn 0.5s ease-in-out;
    }

    .animate-slideInLeft {
      animation: slideInLeft 0.5s ease-in-out;
    }

    .animate-slideInRight {
      animation: slideInRight 0.5s ease-in-out;
    }

    .animate-slideInDown {
      animation: slideInDown 0.4s ease-in-out;
    }

    .animate-bounceIn {
      animation: bounceIn 0.6s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
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

    @keyframes bounceIn {
      0% {
        opacity: 0;
        transform: scale(0.3);
      }
      50% {
        opacity: 1;
        transform: scale(1.05);
      }
      70% {
        transform: scale(0.9);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    .animate-headerPulse {
      animation: headerPulse 0.5s ease-in-out;
    }

    @keyframes headerPulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.02);
      }
      100% {
        transform: scale(1);
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);
  private elRef = inject(ElementRef);

  cartCount = this.cartService.cartCount$;
  user = this.authService.currentUser$;
  isLoggedIn = this.authService.isLoggedIn$;
  isLoading = this.authService.isLoading$;
  showMenu = false;

  // Properties for mobile menu
  showMobileMenu = false;

  // Properties for user dropdown
  showUserDropdown = false;

  // Properties for category dropdown
  showCategoryMenu = false;

  constructor() {
    effect(() => {
      // Trigger animation when user logs in
      this.triggerReloadAnimation();
      if (this.user()) {
        // Trigger animation when user info is loaded
        this.triggerReloadAnimation();
      }
    });
  }

  ngOnInit(): void {
    // Add document click listener to close menus when clicking outside
    this.renderer.listen('document', 'click', (event: Event) => {
      const target = event.target as HTMLElement;

      // Close mobile menu if clicking outside (but not on the hamburger button)
      if (this.showMobileMenu &&
        !target.closest('.mobile-menu') &&
        !target.closest('.mobile-menu-toggle')) {
        this.showMobileMenu = false;
      }
    });
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  closeAllMenus(): void {
    this.showMobileMenu = false;
  }

  // Method to trigger header reload animations
  triggerReloadAnimation(): void {
    // For a more advanced implementation, you could add/remove animation classes
    // dynamically using Renderer2 to trigger specific animations
    const headerElement = this.elRef.nativeElement.querySelector('header');
    if (headerElement) {
      // Add animation class temporarily to trigger animation
      headerElement.classList.add('animate-headerPulse');

      // Remove the class after animation completes
      setTimeout(() => {
        headerElement.classList.remove('animate-headerPulse');
      }, 500);
    }
  }
}