import { Component, OnInit, Input, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BannerService as AppBannerService } from '../../services/banner.service';

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  link?: string;
  buttonText?: string;
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

@Component({
  selector: 'misc-banner-slider',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div
      class="relative container mx-auto overflow-hidden shadow-lg"
      (mouseenter)="pauseSlider()"
      (mouseleave)="resumeSlider()">

      <!-- Loading state -->
      @if (loading) {
        <div class="relative h-96 md:h-[500px] flex items-center justify-center bg-gray-100">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      } @else if (error) {
        <div class="relative h-96 md:h-[500px] flex items-center justify-center bg-red-50 border border-red-200">
          <p class="text-red-600">Error loading banners: {{ error }}</p>
        </div>
      } @else if (banners.length > 0) {
        <!-- Slides Container -->
        <div class="relative h-96 md:h-[500px] overflow-hidden">
          @for (banner of banners; track banner.id; let i = $index) {
            <div
              class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              [class.opacity-0]="currentIndex !== i"
              [class.opacity-100]="currentIndex === i">

              <div class="relative h-full">
                <img
                  [src]="banner.imageUrl"
                  [alt]="banner.title"
                  class="w-full h-full object-cover"
                  (error)="onImageError($event, banner)">

                <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>

                <div class="absolute inset-0 flex items-center">
                  <div class="max-w-2xl px-8">
                    <h2
                      class="text-2xl md:text-4xl font-bold text-white mb-2 animate-fadeIn"
                      [style.animationDelay]="(currentIndex === i) ? '0.2s' : '0s'">
                      {{ banner.title }}
                    </h2>

                    <p
                      class="text-base md:text-lg text-white mb-4 max-w-xl animate-fadeIn"
                      [style.animationDelay]="(currentIndex === i) ? '0.4s' : '0s'">
                      {{ banner.subtitle }}
                    </p>

                    @if (banner.buttonText && banner.link) {
                      <a
                        [routerLink]="banner.link"
                        class="inline-block bg-orange-500 text-white px-6 py-2 rounded-md text-base font-semibold hover:bg-orange-600 transition-colors animate-fadeIn"
                        [style.animationDelay]="(currentIndex === i) ? '0.6s' : '0s'">
                        {{ banner.buttonText }}
                      </a>
                    }
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Navigation Dots -->
        <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1.5 z-10">
          @for (banner of banners; track banner.id; let i = $index) {
            <button
              (click)="goToSlide(i)"
              [class.bg-orange-500]="currentIndex === i"
              class="w-2 h-2 rounded-full transition-all duration-300 focus:outline-none bg-white/60"
              [attr.aria-label]="'Go to slide ' + (i + 1)">
            </button>
          }
        </div>

        <!-- Navigation Arrows -->
        <button
          (click)="prevSlide()"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-800 p-1.5 rounded-full hover:bg-white transition-all z-10 shadow-md"
          aria-label="Previous slide">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          (click)="nextSlide()"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-800 p-1.5 rounded-full hover:bg-white transition-all z-10 shadow-md"
          aria-label="Next slide">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      } @else {
        <!-- Empty state when no banners are available -->
        <div class="relative h-96 md:h-[500px] flex items-center justify-center bg-gray-100 rounded-xl">
          <p class="text-gray-600">No banners available</p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .animate-fadeIn {
      opacity: 0;
      animation: fadeIn 0.8s forwards;
    }
  `]
})
export class BannerSliderComponent implements OnInit, OnDestroy {
  @Input() banners: Banner[] = [];
  @Input() autoPlay: boolean = true;
  @Input() interval: number = 5000; // 5 seconds

  currentIndex = 0;
  loading = false;
  error: string | null = null;
  private intervalId: any;
  private platformId = inject(PLATFORM_ID);
  private bannerService = inject(AppBannerService);

  ngOnInit(): void {
    // Load banners from API if no banners are provided via input
    if (this.banners.length === 0) {
      this.loadBanners();
    } else {
      // If banners were provided via input, start the slider
      this.startSliderIfNeeded();
    }
  }

  ngOnDestroy(): void {
    this.stopSlider();
  }

  loadBanners(): void {
    this.loading = true;
    this.error = null;

    this.bannerService.getActiveBanners().subscribe({
      next: (banners) => {
        this.banners = banners;
        this.loading = false;
        this.startSliderIfNeeded();
      },
      error: (err) => {
        console.error('Error loading banners:', err);
        this.error = 'Failed to load banners';
        this.loading = false;
      }
    });
  }

  startSliderIfNeeded(): void {
    if (this.autoPlay && this.banners.length > 1) {
      this.startSlider();
    }
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.banners.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.banners.length) % this.banners.length;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }

  startSlider(): void {
    if(isPlatformBrowser(this.platformId) && !this.intervalId) {
      this.intervalId = setInterval(() => {
        this.nextSlide();
      }, this.interval);
    }
  }

  stopSlider(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  pauseSlider(): void {
    if (this.autoPlay) {
      this.stopSlider();
    }
  }

  resumeSlider(): void {
    if (this.autoPlay && this.banners.length > 1) {
      this.startSlider();
    }
  }

  onImageError(event: any, banner: Banner): void {
    // Set a fallback image if the banner image fails to load
    event.target.src = `https://placehold.co/1200x500/4f46e5/ffffff?text=${encodeURIComponent(banner.title || 'Banner')}`;
  }
}