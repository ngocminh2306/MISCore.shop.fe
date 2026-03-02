import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'misc-back-to-top',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      *ngIf="showButton" 
      (click)="scrollToTop()" 
      class="fixed bottom-1 right-7 bg-indigo-600 text-white rounded-full p-3 shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 z-50"
      aria-label="Back to top"
      title="Back to top"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class BackToTopComponent implements OnInit, OnDestroy {
  showButton = false;
  private scrollListener: (() => void) | null = null;
  private platformId = inject(PLATFORM_ID);
  ngOnInit(): void {
    this.scrollListener = this.handleScroll.bind(this);
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('scroll', this.scrollListener);
      // Check scroll position on initial load only in browser
      this.handleScroll();
    }
  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      if (isPlatformBrowser(this.platformId)) {
        window.removeEventListener('scroll', this.scrollListener);
      }
      this.scrollListener = null;
    }
  }

  private handleScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.showButton = window.scrollY > 300;
    }
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
}