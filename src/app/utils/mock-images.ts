/**
 * Mock image utility functions for the Shop application
 * Provides placeholder images when real images are not available
 */

export class MockImageService {
  /**
   * Generate a placeholder image URL with specified dimensions and text
   * @param width Image width in pixels
   * @param height Image height in pixels
   * @param text Optional text to display on the image
   * @param bgColor Background color (default: light gray)
   * @param textColor Text color (default: dark gray)
   * @returns Placeholder image URL
   */
  static getPlaceholderImage(
    width: number = 400,
    height: number = 400,
    text: string = '',
    bgColor: string = 'dddddd',
    textColor: string = '999999'
  ): string {
    if (!text) {
      text = `${width}x${height}`;
    }
    return `https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`;
  }

  /**
   * Generate multiple placeholder images for a product
   * @param count Number of images to generate
   * @param width Image width in pixels
   * @param height Image height in pixels
   * @param baseText Base text to use for the image
   * @returns Array of placeholder image URLs
   */
  static getProductImages(
    count: number = 4,
    width: number = 600,
    height: number = 600,
    baseText: string = 'Product'
  ): string[] {
    const images: string[] = [];
    for (let i = 1; i <= count; i++) {
      images.push(this.getPlaceholderImage(width, height, `${baseText} ${i}`, 'e2e8f0', '64748b'));
    }
    return images;
  }

  /**
   * Generate a single product placeholder image
   * @param width Image width in pixels
   * @param height Image height in pixels
   * @param text Optional text for the image
   * @returns Placeholder image URL
   */
  static getProductImage(
    width: number = 600,
    height: number = 600,
    text: string = 'Product Image'
  ): string {
    return this.getPlaceholderImage(width, height, text, 'e2e8f0', '64748b');
  }

  /**
   * Generate a category placeholder image
   * @param width Image width in pixels
   * @param height Image height in pixels
   * @param categoryName Name of the category
   * @returns Placeholder image URL
   */
  static getCategoryImage(
    width: number = 300,
    height: number = 300,
    categoryName: string = 'Category'
  ): string {
    return this.getPlaceholderImage(width, height, categoryName, 'cbd5e1', '475569');
  }

  /**
   * Generate a brand/brand placeholder image
   * @param width Image width in pixels
   * @param height Image height in pixels
   * @param brandName Name of the brand
   * @returns Placeholder image URL
   */
  static getBrandImage(
    width: number = 200,
    height: number = 100,
    brandName: string = 'Brand'
  ): string {
    return this.getPlaceholderImage(width, height, brandName, 'f1f5f9', '334155');
  }
}