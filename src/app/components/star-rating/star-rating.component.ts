import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'misc-star-rating',
  standalone: true,
  template: `
    <div class="flex">
      @for (star of stars; track star.key) {
        <span class="mr-1 text-yellow-400">
          @if (star.icon === 'star') {
            <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          } @else if (star.icon === 'star_half') {
            <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
            </svg>
          } @else {
            <svg class="w-5 h-5 fill-current text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1v9.3z"/>
            </svg>
          }
        </span>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class StarRatingComponent implements OnChanges {
  @Input() rating: number = 0;
  stars: { key: string; icon: string }[] = [];

  ngOnChanges(): void {
    this.stars = this.getStars(this.rating);
  }

  private getStars(rating: number): { key: string; icon: string }[] {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < fullStars; i++) {
      stars.push({ key: `star-${i}`, icon: 'star' });
    }

    if (rating % 1 >= 0.5) {
      stars.push({ key: `half-star-${fullStars}`, icon: 'star_half' });
    }

    // Add border stars to complete 5 stars
    let borderStarsCount = 5 - stars.length;
    for (let i = 0; i < borderStarsCount; i++) {
      stars.push({ key: `border-star-${fullStars + (rating % 1 >= 0.5 ? 1 : 0) + i}`, icon: 'star_border' });
    }

    return stars;
  }
}