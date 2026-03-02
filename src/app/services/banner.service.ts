import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BannerService as PublicBannerService } from '../../public-api/api/banner.service';

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

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private publicBannerService = inject(PublicBannerService);

  getActiveBanners(): Observable<Banner[]> {
    return this.publicBannerService.apiBannerActiveGet().pipe(
      map(response => {
        // Extract data from response (could be in response.data or response directly)
        const bannersData = response?.data || response;

        if (Array.isArray(bannersData)) {
          return bannersData.map(banner => ({
            id: banner.id || 0,
            title: banner.title || 'Untitled Banner',
            subtitle: banner.description || '',
            imageUrl: banner.imageUrl || 'https://placehold.co/1200x500/4f46e5/ffffff?text=Banner+Image',
            link: banner.linkUrl,
            buttonText: 'Learn More',
            priority: 0,
            isActive: banner.isActive ?? true,
            createdAt: banner.createdAt ? new Date(banner.createdAt) : new Date(),
            updatedAt: banner.updatedAt ? new Date(banner.updatedAt) : undefined
          })).sort((a, b) => a.priority - b.priority); // Sort by priority
        }
        return [] as any;
      }),
      catchError(error => {
        console.error('Error loading banners:', error);
        // Return empty array on error to prevent breaking the UI
        return of([]);
      })
    );
  }
}