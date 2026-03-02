import { Injectable } from '@angular/core';
import { MockImageService } from '../utils/mock-images';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  /**
   * Get a product image URL
   * @param width Image width
   * @param height Image height
   * @param productName Product name to display on the image
   * @returns Product image URL
   */
  getProductImage(width: number = 600, height: number = 600, productName: string = 'Product'): string {
    return MockImageService.getProductImage(width, height, productName);
  }

  /**
   * Get multiple product images
   * @param count Number of images to generate
   * @param width Image width
   * @param height Image height
   * @param productName Product name to display on the images
   * @returns Array of product image URLs
   */
  getProductImages(count: number = 4, width: number = 600, height: number = 600, productName: string = 'Product'): string[] {
    return MockImageService.getProductImages(count, width, height, productName);
  }

  /**
   * Get a category placeholder image
   * @param width Image width
   * @param height Image height
   * @param categoryName Category name to display on the image
   * @returns Category image URL
   */
  getCategoryImage(width: number = 300, height: number = 300, categoryName: string = 'Category'): string {
    return MockImageService.getCategoryImage(width, height, categoryName);
  }

  /**
   * Get a brand placeholder image
   * @param width Image width
   * @param height Image height
   * @param brandName Brand name to display on the image
   * @returns Brand image URL
   */
  getBrandImage(width: number = 200, height: number = 100, brandName: string = 'Brand'): string {
    return MockImageService.getBrandImage(width, height, brandName);
  }

  /**
   * Get a placeholder image for any purpose
   * @param width Image width
   * @param height Image height
   * @param text Text to display on the image
   * @param bgColor Background color (hex without #)
   * @param textColor Text color (hex without #)
   * @returns Placeholder image URL
   */
  getPlaceholderImage(
    width: number = 400, 
    height: number = 400, 
    text: string = '', 
    bgColor: string = 'dddddd', 
    textColor: string = '999999'
  ): string {
    return MockImageService.getPlaceholderImage(width, height, text, bgColor, textColor);
  }
}