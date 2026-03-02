import { Injectable, signal, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguage = signal('en'); // default language
  private languages: any = {
    en: {},
    vi: {}
  };

  private languageSubject = new BehaviorSubject<string>('en');
  public language$ = this.languageSubject.asObservable();
  private platformId = inject(PLATFORM_ID);

  constructor() {
    // Load English translations
    this.loadLanguage('en', this.getEnglishTranslations());
    // Load Vietnamese translations
    this.loadLanguage('vi', this.getVietnameseTranslations());

    // Load previously selected language from localStorage, default to 'en' if in browser
    if (isPlatformBrowser(this.platformId)) {
      const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
      this.currentLanguage.set(savedLanguage);
      this.languageSubject.next(savedLanguage);
    } else {
      // Server side - default to 'en'
      this.currentLanguage.set('en');
      this.languageSubject.next('en');
    }
  }

  public switchLanguage(language: string): void {
    if (this.languages[language]) {
      this.currentLanguage.set(language);
      this.languageSubject.next(language);
      // Persist the language selection in localStorage if in browser
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('selectedLanguage', language);
      }
    }
  }

  public getCurrentLanguage(): string {
    return this.currentLanguage();
  }

  public getTranslation(key: string): string {
    const currentLang = this.currentLanguage();
    const translation = this.languages[currentLang][key];
    return translation || key; // return the key itself if translation not found
  }

  public getTranslationObject(): any {
    const currentLang = this.currentLanguage();
    return this.languages[currentLang];
  }

  private loadLanguage(language: string, translations: any): void {
    this.languages[language] = { ...this.languages[language], ...translations };
  }

  private getEnglishTranslations(): any {
    return {
      // Admin Dashboard
      'Admin Dashboard': 'Admin Dashboard',
      'Manage your store\'s products, categories, brands, and banners': 'Manage your store\'s products, categories, brands, and banners',
      'Products': 'Products',
      'Categories': 'Categories',
      'Brands': 'Brands',
      'Banners': 'Banners',
      'Orders': 'Orders',
      'Users': 'Users',
      'Manage': 'Manage',
      'Manage products &rarr;': 'Manage products &rarr;',
      'Manage categories &rarr;': 'Manage categories &rarr;',
      'Manage brands &rarr;': 'Manage brands &rarr;',
      'Manage banners &rarr;': 'Manage banners &rarr;',
      'Manage orders &rarr;': 'Manage orders &rarr;',
      'Manage users &rarr;': 'Manage users &rarr;',
      'Quick Stats': 'Quick Stats',
      'Total Products': 'Total Products',
      'Total Categories': 'Total Categories',
      'Total Brands': 'Total Brands',
      'Active Banners': 'Active Banners',

      // Admin products
      'Admin Products': 'Admin Products',
      'Add New Product': 'Add New Product',
      'Search': 'Search',
      'Name': 'Name',
      'Price': 'Price',
      'Stock': 'Stock',
      'Brand': 'Brand',
      'Category': 'Category',
      'Actions': 'Actions',
      'Edit': 'Edit',
      'Delete': 'Delete',
      'Yes': 'Yes',
      'No': 'No',
      'Are you sure?': 'Are you sure?',
      'This action cannot be undone.': 'This action cannot be undone.',

      // Admin categories
      'Admin Categories': 'Admin Categories',
      'Add New Category': 'Add New Category',
      'Description': 'Description',
      'Image': 'Image',

      // Admin brands
      'Admin Brands': 'Admin Brands',
      'Add New Brand': 'Add New Brand',

      // Admin banners
      'Admin Banners': 'Admin Banners',
      'Add New Banner': 'Add New Banner',
      'Title': 'Title',
      'Url': 'Url',
      'Banner Image': 'Banner Image',

      // Admin orders
      'Admin Orders': 'Admin Orders',
      'Order ID': 'Order ID',
      'Customer': 'Customer',
      'Total': 'Total',
      'Status': 'Status',
      'Date': 'Date',
      'View': 'View',
      'Pending': 'Pending',
      'Processing': 'Processing',
      'Shipped': 'Shipped',
      'Delivered': 'Delivered',
      'Cancelled': 'Cancelled',

      // Admin users
      'Admin Users': 'Admin Users',
      'Email': 'Email',
      'Role': 'Role',
      'Phone': 'Phone',
      'Address': 'Address',
      'Update Role': 'Update Role',
      'Admin': 'Admin',
      'User': 'User',

      // Admin roles
      'Admin Roles': 'Admin Roles',
      'Role Name': 'Role Name',
      'Permissions': 'Permissions',
      'Add New Role': 'Add New Role',
      'Edit Role': 'Edit Role',
      'Role Details': 'Role Details',
      'Save': 'Save',
      'Close': 'Close',

      // Seller registration
      'Register as Seller': 'Register as Seller',
      'Start selling on our platform': 'Start selling on our platform',
      'Shop Name': 'Shop Name',
      'Enter your shop name': 'Enter your shop name',
      'Shop name is required': 'Shop name is required',
      'Shop name must be at least 3 characters': 'Shop name must be at least 3 characters',
      'Shop Description': 'Shop Description',
      'Describe your business and what you sell': 'Describe your business and what you sell',
      'Business Information': 'Business Information',
      'Business License Number': 'Business License Number',
      'Enter license number': 'Enter license number',
      'Tax ID': 'Tax ID',
      'Enter tax ID': 'Enter tax ID',
      'Contact Information': 'Contact Information',
      'Contact Email': 'Contact Email',
      'Enter contact email': 'Enter contact email',
      'Contact Phone': 'Contact Phone',
      'Enter phone number': 'Enter phone number',
      'Address Information': 'Address Information',
      'Enter street address': 'Enter street address',
      'City': 'City',
      'Enter city': 'Enter city',
      'State/Province': 'State/Province',
      'Enter state or province': 'Enter state or province',
      'Postal Code': 'Postal Code',
      'Enter postal code': 'Enter postal code',
      'Country': 'Country',
      'Enter country': 'Enter country',
      'I agree to the': 'I agree to the',
      'Terms and Conditions': 'Terms and Conditions',
      'and': 'and',
      'Privacy Policy': 'Privacy Policy',
      'You must agree to the terms and conditions': 'You must agree to the terms and conditions',
      'Submitting request...': 'Submitting request...',
      'Submit Seller Request': 'Submit Seller Request',
      'Return to': 'Return to',
      'Your seller registration request has been submitted successfully. We will review and contact you soon.': 'Your seller registration request has been submitted successfully. We will review and contact you soon.',
      'Registration Request Submitted': 'Registration Request Submitted',
      'Registration Request Failed': 'Registration Request Failed',
      'An error occurred during submission. Please try again.': 'An error occurred during submission. Please try again.',

      // Common
      'Dashboard': 'Dashboard',
      'Logout': 'Logout',
      'Settings': 'Settings',
      'Profile': 'Profile',
      'About': 'About',
      'Contact': 'Contact',
      'Cart': 'Cart',
      'Checkout': 'Checkout',
      'Order History': 'Order History',
      'Help Center': 'Help Center',
      'Shipping Info': 'Shipping Info',
      'Returns': 'Returns',
      'All Products': 'All Products',
      'Special Offers': 'Special Offers',
      'New Arrivals': 'New Arrivals',
      'Best Sellers': 'Best Sellers',

      // Article Management
      'Article Management': 'Article Management',
      'Articles': 'Articles',
      'Article Categories': 'Article Categories',
      'Article Authors': 'Article Authors'
    };
  }

  private getVietnameseTranslations(): any {
    return {
      // Admin Dashboard
      'Admin Dashboard': 'Bảng điều khiển quản trị',
      'Manage your store\'s products, categories, brands, and banners': 'Quản lý sản phẩm, danh mục, thương hiệu và biểu ngữ của cửa hàng',
      'Products': 'Sản phẩm',
      'Categories': 'Danh mục',
      'Brands': 'Thương hiệu',
      'Banners': 'Biểu ngữ',
      'Orders': 'Đơn hàng',
      'Users': 'Người dùng',
      'Manage': 'Quản lý',
      'Manage products &rarr;': 'Quản lý sản phẩm &rarr;',
      'Manage categories &rarr;': 'Quản lý danh mục &rarr;',
      'Manage brands &rarr;': 'Quản lý thương hiệu &rarr;',
      'Manage banners &rarr;': 'Quản lý biểu ngữ &rarr;',
      'Manage orders &rarr;': 'Quản lý đơn hàng &rarr;',
      'Manage users &rarr;': 'Quản lý người dùng &rarr;',
      'Quick Stats': 'Thống kê nhanh',
      'Total Products': 'Tổng sản phẩm',
      'Total Categories': 'Tổng danh mục',
      'Total Brands': 'Tổng thương hiệu',
      'Active Banners': 'Biểu ngữ hoạt động',

      // Admin products
      'Admin Products': 'Quản trị sản phẩm',
      'Add New Product': 'Thêm sản phẩm mới',
      'Search': 'Tìm kiếm',
      'Name': 'Tên',
      'Price': 'Giá',
      'Stock': 'Kho',
      'Brand': 'Thương hiệu',
      'Category': 'Danh mục',
      'Actions': 'Hành động',
      'Edit': 'Sửa',
      'Delete': 'Xóa',
      'Yes': 'Có',
      'No': 'Không',
      'Are you sure?': 'Bạn có chắc chắn?',
      'This action cannot be undone.': 'Hành động này không thể hoàn tác.',

      // Admin categories
      'Admin Categories': 'Quản trị danh mục',
      'Add New Category': 'Thêm danh mục mới',
      'Description': 'Mô tả',
      'Image': 'Hình ảnh',

      // Admin brands
      'Admin Brands': 'Quản trị thương hiệu',
      'Add New Brand': 'Thêm thương hiệu mới',

      // Admin banners
      'Admin Banners': 'Quản trị biểu ngữ',
      'Add New Banner': 'Thêm biểu ngữ mới',
      'Title': 'Tiêu đề',
      'Url': 'Liên kết',
      'Banner Image': 'Hình ảnh biểu ngữ',

      // Admin orders
      'Admin Orders': 'Quản trị đơn hàng',
      'Order ID': 'Mã đơn hàng',
      'Customer': 'Khách hàng',
      'Total': 'Tổng cộng',
      'Status': 'Trạng thái',
      'Date': 'Ngày',
      'View': 'Xem',
      'Pending': 'Chờ xử lý',
      'Processing': 'Đang xử lý',
      'Shipped': 'Đã giao',
      'Delivered': 'Đã nhận',
      'Cancelled': 'Đã hủy',

      // Admin users
      'Admin Users': 'Quản trị người dùng',
      'Email': 'Email',
      'Role': 'Vai trò',
      'Phone': 'Điện thoại',
      'Address': 'Địa chỉ',
      'Update Role': 'Cập nhật vai trò',
      'Admin': 'Quản trị viên',
      'User': 'Người dùng',

      // Admin roles
      'Admin Roles': 'Quản trị vai trò',
      'Role Name': 'Tên vai trò',
      'Permissions': 'Quyền',
      'Add New Role': 'Thêm vai trò mới',
      'Edit Role': 'Sửa vai trò',
      'Role Details': 'Chi tiết vai trò',
      'Save': 'Lưu',
      'Close': 'Đóng',

      // Seller registration
      'Register as Seller': 'Đăng ký làm người bán',
      'Start selling on our platform': 'Bắt đầu bán hàng trên nền tảng của chúng tôi',
      'Shop Name': 'Tên cửa hàng',
      'Enter your shop name': 'Nhập tên cửa hàng của bạn',
      'Shop name is required': 'Tên cửa hàng là bắt buộc',
      'Shop name must be at least 3 characters': 'Tên cửa hàng phải có ít nhất 3 ký tự',
      'Shop Description': 'Mô tả cửa hàng',
      'Describe your business and what you sell': 'Mô tả doanh nghiệp và sản phẩm bạn bán',
      'Business Information': 'Thông tin doanh nghiệp',
      'Business License Number': 'Số giấy phép kinh doanh',
      'Enter license number': 'Nhập số giấy phép',
      'Tax ID': 'Mã số thuế',
      'Enter tax ID': 'Nhập mã số thuế',
      'Contact Information': 'Thông tin liên hệ',
      'Contact Email': 'Email liên hệ',
      'Enter contact email': 'Nhập email liên hệ',
      'Contact Phone': 'Số điện thoại liên hệ',
      'Enter phone number': 'Nhập số điện thoại',
      'Address Information': 'Thông tin địa chỉ',
      'Enter street address': 'Nhập địa chỉ đường phố',
      'City': 'Thành phố',
      'Enter city': 'Nhập thành phố',
      'State/Province': 'Tỉnh/Thành phố',
      'Enter state or province': 'Nhập tỉnh hoặc thành phố',
      'Postal Code': 'Mã bưu điện',
      'Enter postal code': 'Nhập mã bưu điện',
      'Country': 'Quốc gia',
      'Enter country': 'Nhập quốc gia',
      'I agree to the': 'Tôi đồng ý với',
      'Terms and Conditions': 'Điều khoản và điều kiện',
      'and': 'và',
      'You must agree to the terms and conditions': 'Bạn phải đồng ý với các điều khoản và điều kiện',
      'Submitting request...': 'Đang gửi yêu cầu...',
      'Submit Seller Request': 'Gửi yêu cầu người bán',
      'Return to': 'Trở lại',
      'Your seller registration request has been submitted successfully. We will review and contact you soon.': 'Yêu cầu đăng ký người bán của bạn đã được gửi thành công. Chúng tôi sẽ xem xét và liên hệ với bạn sớm.',
      'Registration Request Submitted': 'Yêu cầu đăng ký đã được gửi',
      'Registration Request Failed': 'Yêu cầu đăng ký thất bại',
      'An error occurred during submission. Please try again.': 'Đã xảy ra lỗi khi gửi. Vui lòng thử lại.',

      // Common
      'Dashboard': 'Bảng điều khiển',
      'Logout': 'Đăng xuất',
      'Settings': 'Cài đặt',
      'Profile': 'Hồ sơ',
      'About': 'Giới thiệu',
      'Contact': 'Liên hệ',
      'Cart': 'Giỏ hàng',
      'Checkout': 'Thanh toán',
      'Order History': 'Lịch sử đơn hàng',
      'Help Center': 'Trung tâm hỗ trợ',
      'Privacy Policy': 'Chính sách bảo mật',
      'Shipping Info': 'Thông tin vận chuyển',
      'Returns': 'Trả hàng',
      'All Products': 'Tất cả sản phẩm',
      'Special Offers': 'Ưu đãi đặc biệt',
      'New Arrivals': 'Hàng mới về',
      'Best Sellers': 'Bán chạy nhất',

      // Article Management
      'Article Management': 'Quản lý bài viết',
      'Articles': 'Bài viết',
      'Article Categories': 'Danh mục bài viết',
      'Article Authors': 'Tác giả bài viết'
    };
  }
}