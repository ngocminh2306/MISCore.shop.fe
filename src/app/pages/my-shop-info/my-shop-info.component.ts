import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SellerService } from '../../../public-api/api/seller.service';
import { SellerDto } from '../../../public-api/model/sellerDto';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { LanguageService } from '../../services/language.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-shop-info',
  standalone: true,
  imports: [RouterLink, TranslatePipe, DatePipe],
  templateUrl: './my-shop-info.component.html',
  styleUrls: ['./my-shop-info.component.css']
})
export class MyShopInfoComponent implements OnInit {
  private sellerService = inject(SellerService);
  languageService = inject(LanguageService);

  shopInfo: SellerDto | null = null;
  loading = true;
  error: string | null = null;

  constructor() {}

  ngOnInit(): void {
    this.loadShopInfo();
  }

  loadShopInfo(): void {
    this.loading = true;
    this.error = null;

    this.sellerService.apiSellerProfileGet().subscribe({
      next: (response: any) => {
        const apiSeller = response.data;
        if (apiSeller) {
          this.shopInfo = {
            id: apiSeller.id || 0,
            userId: apiSeller.userId || '',
            shopName: apiSeller.shopName || '',
            shopDescription: apiSeller.shopDescription || '',
            contactPhone: apiSeller.shopPhone || '',
            contactEmail: apiSeller.shopEmail || '',
            isActive: apiSeller.isActive || false,
            isVerified: apiSeller.isVerified || false,
            shopLogoUrl: apiSeller.shopLogoUrl || '',
            createdAt: apiSeller.createdAt,
            updatedAt: apiSeller.updatedAt
          };
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading shop info:', error);
        this.error = error?.error?.message || 'Failed to load shop information';
        this.loading = false;
      }
    });
  }

  onImageError(event: any): void {
    event.target.src = 'https://placehold.co/200x200/f97316/ffffff?text=Shop';
  }
}