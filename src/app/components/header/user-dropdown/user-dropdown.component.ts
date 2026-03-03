import { Component, inject, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  description?: string;
  badge?: number;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="relative user-menu-container">
      <button
        (click)="toggleDropdown()"
        class="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors user-dropdown-button py-2 px-3 rounded-lg hover:bg-gray-50"
        aria-haspopup="true"
        aria-expanded="false">
        @if (isLoading()) {
          <div class="flex items-center space-x-1 opacity-100 transition-opacity duration-300 animate-fadeIn">
            <div class="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div class="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        } @else {
          <!-- User Avatar -->
          <div class="h-8 w-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
            {{ getInitials() }}
          </div>
          <div class="flex flex-col items-start">
            <span class="text-sm font-medium text-gray-900 opacity-100 transition-opacity duration-300 animate-fadeIn">
              {{ user()?.firstName || user()?.userName || 'User' }}
            </span>
            <span class="text-xs text-gray-500 opacity-100 transition-opacity duration-300 animate-fadeIn">
              View Profile
            </span>
          </div>
          <svg
            class="h-4 w-4 text-gray-400 opacity-100 transition-opacity duration-300 animate-fadeIn"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        }
      </button>

      @if (showDropdown && !isLoading()) {
        <div class="absolute right-0 mt-2 w-80 rounded-xl shadow-2xl bg-white ring-1 ring-gray-200 z-50 transition-all duration-300 animate-fadeIn overflow-hidden">
          <!-- User Info Header -->
          <div class="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
            <div class="flex items-center space-x-3">
              <div class="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white/30">
                {{ getInitials() }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-white truncate">{{ user()?.firstName || user()?.userName || 'User' }}</p>
                <p class="text-sm text-white/80 truncate">{{ user()?.email }}</p>
              </div>
            </div>
            <a
              [routerLink]="['/user-info']"
              (click)="onClose()"
              class="mt-3 inline-flex items-center text-sm text-white/90 hover:text-white transition-colors">
              <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              View Profile
            </a>
          </div>

          <!-- Menu Sections -->
          <div class="py-3 max-h-96 overflow-y-auto">
            @for (section of menuSections; track section.title) {
              <div class="px-3 py-2">
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                  {{ section.title }}
                </h3>
                <div class="space-y-1">
                  @for (item of section.items; track item.route) {
                    <a
                      [routerLink]="[item.route]"
                      (click)="onClose()"
                      class="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all duration-200 group">
                      <!-- Icon -->
                      <span class="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-100 group-hover:bg-orange-100 transition-colors mr-3">
                        @switch (item.icon) {
                          @case ('user') {
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                          }
                          @case ('shopping-bag') {
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                            </svg>
                          }
                          @case ('package') {
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                            </svg>
                          }
                          @case ('clock') {
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                          }
                          @case ('heart') {
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                            </svg>
                          }
                          @case ('star') {
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l3.976-2.888c.784-.57.38-1.81-.588-1.81h-4.914a1 1 0 00-.951-.69l-1.519-4.674z"/>
                            </svg>
                          }
                          @case ('cog') {
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                          }
                          @case ('shield') {
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                            </svg>
                          }
                          @case ('chat') {
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                            </svg>
                          }
                          @case ('logout') {
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                            </svg>
                          }
                        }
                      </span>
                      <div class="flex-1 min-w-0">
                        <p class="font-medium truncate">{{ item.label }}</p>
                        @if (item.description) {
                          <p class="text-xs text-gray-500 truncate">{{ item.description }}</p>
                        }
                      </div>
                      @if (item.badge) {
                        <span class="ml-2 bg-orange-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                          {{ item.badge }}
                        </span>
                      }
                      <!-- Arrow icon -->
                      <svg class="h-4 w-4 text-gray-400 group-hover:text-orange-500 ml-2 opacity-0 group-hover:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </a>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Logout Button -->
          <div class="border-t border-gray-100 px-3 py-3 bg-gray-50">
            <button
              (click)="logout(); onClose();"
              class="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors group">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              Sign Out
            </button>
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
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class UserDropdownComponent {
  @Output() dropdownToggled = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  private authService = inject(AuthService);

  user = this.authService.currentUser$;
  isLoggedIn = this.authService.isLoggedIn$;
  isLoading = this.authService.isLoading$;
  showDropdown = false;

  menuSections: MenuSection[] = [
    {
      title: 'Account',
      items: [
        { label: 'My Account', route: '/user-info', icon: 'user', description: 'Manage your profile' },
        { label: 'My Shop', route: '/my-shop', icon: 'shopping-bag', description: 'Manage your store' }
      ]
    },
    {
      title: 'Orders & Shopping',
      items: [
        { label: 'Order History', route: '/order-history', icon: 'package', description: 'Track and view orders' },
        { label: 'Pending Orders', route: '/pending-orders', icon: 'clock', description: 'View pending orders' },
        { label: 'Wishlist', route: '/wishlist', icon: 'heart', description: 'Your saved items', badge: 3 },
        { label: 'Reviews', route: '/reviews', icon: 'star', description: 'Your product reviews' }
      ]
    },
    {
      title: 'Settings & Support',
      items: [
        { label: 'Settings', route: '/settings', icon: 'cog', description: 'Account preferences' },
        { label: 'Privacy', route: '/privacy', icon: 'shield', description: 'Privacy settings' },
        { label: 'Help Center', route: '/help', icon: 'chat', description: 'Get help and support' }
      ]
    }
  ];

  toggleDropdown(): void {
    if (this.isLoading()) return;
    this.showDropdown = !this.showDropdown;
    this.dropdownToggled.emit(this.showDropdown);
  }

  onClose(): void {
    this.showDropdown = false;
    this.closed.emit();
  }

  logout(): void {
    this.authService.logout();
  }

  getInitials(): string {
    const user = this.user();
    if (!user) return 'U';

    const firstName = user.firstName || user.userName || 'User';
    const lastName = user.lastName || '';

    if (lastName) {
      return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    }
    return firstName.charAt(0).toUpperCase();
  }
}