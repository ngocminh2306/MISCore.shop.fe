import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ProductService as PublicProductService } from '../../../public-api/api/product.service';
import { MessageDialogService } from '../../services/message-dialog.service';
import { StarRatingComponent } from '../../components/star-rating/star-rating.component';
import { ProductDto } from '../../../public-api';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, DecimalPipe, CurrencyPipe, StarRatingComponent],
  template: `
    <div class="container mx-auto px-4 py-6">
      <!-- Loading State -->
      @if (loading) {
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      }

      <!-- Error State -->
      @if (error) {
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Error</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{{ error }}</p>
              </div>
              <div class="mt-4">
                <a routerLink="/products" class="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200">
                  Go to Products
                </a>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Product Detail -->
      @if (!loading && !error && product) {
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="md:flex">
            <!-- Product Images -->
            <div class="md:w-1/2 p-6">
              <div class="flex justify-center">
                <img
                  [src]="product.mainImageUrl || 'https://placehold.co/600x600'"
                  [alt]="product.name"
                  class="w-full max-h-96 object-contain rounded-lg border"
                >
              </div>

              <!-- Thumbnails -->
              <div class="flex mt-4 space-x-2 overflow-x-auto py-2">
                @for (thumb of (product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : (product.imageUrls ? [product.mainImageUrl] : [])); track thumb) {
                  <img
                    [src]="thumb"
                    [alt]="product.name"
                    class="w-16 h-16 object-cover border rounded cursor-pointer flex-shrink-0"
                    [class.border-orange-500]="product.mainImageUrl === thumb"
                    (click)="setImage(thumb || '')"
                  >
                }
              </div>
            </div>

            <!-- Product Info -->
            <div class="md:w-1/2 p-6">
              <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ product.name }}</h1>

              <div class="flex items-center space-x-3 mb-3">
                <misc-star-rating [rating]="product.averageRating || 0" />
                <span class="text-gray-600 text-sm">({{ product.ratingCount }} đánh giá)</span>
                <span class="text-gray-600 text-sm">|</span>
                <span class="text-gray-600 text-sm">Đã bán {{ product.viewCount }}</span>
              </div>

              <div class="text-2xl font-bold text-orange-500 mb-4">
                @if (product.salePrice) {
                  <div class="flex items-baseline space-x-2">
                    <span>{{ product.salePrice | currency }}</span>
                    <span class="text-sm text-gray-500 line-through">{{ product.price | currency }}</span>
                    <span class="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded ml-2">
                      GIẢM {{ ((product.price - product.salePrice) / product.price * 100) | number:'1.0-0' }}%
                    </span>
                  </div>
                } @else {
                  <span>{{ product.price | currency }}</span>
                }
              </div>

              <!-- Product Info Card -->
              <div class="bg-gray-50 rounded-lg p-4 mb-4">
                <div class="flex items-center justify-between text-sm mb-2">
                  <span class="text-gray-600">Tình trạng:</span>
                  <span [class]="product.isInStock ? 'text-green-600 font-medium' : 'text-red-600 font-medium'">
                    {{ product.isInStock ? 'Còn hàng' : 'Hết hàng' }}
                  </span>
                </div>
                <div class="flex items-center justify-between text-sm mb-2">
                  <span class="text-gray-600">SKU:</span>
                  <span class="text-gray-900">{{ product.sku || 'N/A' }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Danh mục:</span>
                  <span class="text-gray-900">{{ product.categoryName || 'N/A' }}</span>
                </div>
              </div>

              <!-- Chọn số lượng -->
              <div class="mb-4">
                <div class="flex items-center justify-between mb-2">
                  <label class="font-medium text-gray-900">Số lượng:</label>
                  <span class="text-sm text-gray-600">Còn {{ product.stockQuantity }} sản phẩm</span>
                </div>
                <div class="flex items-center border border-gray-300 rounded-lg">
                  <button
                    (click)="decreaseQuantity()"
                    class="px-4 py-2 text-gray-600 hover:bg-gray-100 font-bold"
                    [disabled]="quantity <= 1"
                  >
                    -
                  </button>
                  <span class="px-4 py-2 text-gray-900 font-medium">{{ quantity }}</span>
                  <button
                    (click)="increaseQuantity()"
                    class="px-4 py-2 text-gray-600 hover:bg-gray-100 font-bold"
                    [disabled]="quantity >= (product.stockQuantity || 0)"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- Nút hành động -->
              <div class="flex flex-col space-y-3">
                <button
                  (click)="addToCart()"
                  [disabled]="!product.isInStock"
                  class="bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:bg-gray-400"
                >
                  Thêm vào giỏ hàng
                </button>

                <button
                  (click)="buyNow()"
                  [disabled]="!product.isInStock"
                  class="bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:bg-gray-400"
                >
                  Mua ngay
                </button>
              </div>

              <!-- Thông tin chi tiết -->
              <div class="mt-6 pt-6 border-t border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Chi tiết sản phẩm</h3>
                <div class="prose max-w-none text-gray-700" [innerHTML]="product.description"></div>
              </div>
            </div>
          </div>
        </div>
      } @else if (!loading && !error && !product) {
        <div class="text-center py-12">
          <h2 class="text-xl font-semibold text-gray-900">Không tìm thấy sản phẩm</h2>
          <a routerLink="/products" class="text-orange-500 hover:underline mt-4 inline-block font-medium">Quay lại sản phẩm</a>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);
  private productService = inject(PublicProductService);
  private messageDialogService = inject(MessageDialogService);
  private router = inject(Router);

  product: ProductDto | null = null;
  quantity = 1;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct(id);
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.error = null;

    this.productService.apiProductIdGet(id).subscribe({
      next: (response) => {
        // The API response structure might vary, adjust based on actual response
        const productData: ProductDto = response?.data || {} as any;

        // Ensure the product data matches our Product interface
        // Create a properly typed product object from API response
        this.product = {
          id: productData.id || 0,
          name: productData.name || 'Unknown Product',
          description: productData.description || '',
          shortDescription: productData.shortDescription || '',
          price: productData.price || 0,
          salePrice: productData.salePrice || undefined,
          sku: productData.sku || '',
          barcode: productData.barcode || '',
          stockQuantity: productData.stockQuantity || 0,
          isInStock: productData.isInStock || false,
          isActive: productData.isActive || false,
          isFeatured: productData.isFeatured || false,
          isNew: productData.isNew || false,
          averageRating: productData.averageRating || 0,
          ratingCount: productData.ratingCount || 0,
          viewCount: productData.viewCount || 0,
          brandId: productData.brandId,
          brandName: productData.brandName || '',
          categoryId: productData.categoryId,
          categoryName: productData.categoryName || '',
          mainImageUrl: productData.mainImageUrl || 'https://placehold.co/600x600',
          imageUrls: productData.imageUrls || [],
          tags: productData.tags || [],
          specifications: productData.specifications || [],
          createdAt: productData.createdAt,
          updatedAt: productData.updatedAt
        };

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error = 'Failed to load product details. Please try again.';
        this.loading = false;
      }
    });
  }


  setImage(imageUrl: string | undefined): void {
    if (this.product && imageUrl) {
      this.product.mainImageUrl = imageUrl;
    }
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < (this.product?.stockQuantity || 0)) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product) {
      if (!this.product.isInStock) {
        this.messageDialogService.error('Sản phẩm này hiện đang hết hàng', 'Hết hàng');
        return;
      }

      if (this.quantity > (this.product?.stockQuantity || 0)) {
        this.messageDialogService.error(`Chỉ còn ${this.product.stockQuantity} sản phẩm trong kho`, 'Số lượng giới hạn');
        return;
      }

      this.cartService.addToCart(this.product, this.quantity).subscribe({
        next: () => {
          this.messageDialogService.success('Đã thêm sản phẩm vào giỏ hàng', 'Thành công');
        }
      });

    } else {
      this.messageDialogService.error('Sản phẩm không được tải', 'Lỗi');
    }
  }

  buyNow(): void {
    if (this.product) {
      if (!this.product.isInStock) {
        this.messageDialogService.error('Sản phẩm này hiện đang hết hàng', 'Hết hàng');
        return;
      }

      if (this.quantity > (this.product?.stockQuantity || 0)) {
        this.messageDialogService.error(`Chỉ còn ${this.product.stockQuantity} sản phẩm trong kho`, 'Số lượng giới hạn');
        return;
      }

      // Thêm sản phẩm vào giỏ hàng trước
      this.cartService.addToCart(this.product, this.quantity);

      // Sau đó điều hướng đến trang thanh toán
      this.router.navigate(['/checkout']);
    } else {
      this.messageDialogService.error('Sản phẩm không được tải', 'Lỗi');
    }
  }
}