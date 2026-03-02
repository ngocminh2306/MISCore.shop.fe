// product.model.ts
export interface Product {
  id: number;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  sku?: string;
  stockQuantity: number;
  isInStock: boolean;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  averageRating: number;
  ratingCount: number;
  viewCount: number;
  brandName: string;
  categoryName?: string;
  mainImageUrl?: string;
  imageUrls?: string[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface ProductQueryParams {
  page: number;
  pageSize: number;
  searchTerm?: string;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: string;
  isActive?: boolean;
  includeOutOfStock?: boolean;
}

// cart.model.ts
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  productImageUrl?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Cart {
  id: number;
  userId: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

// order.model.ts
export interface Order {
  id: number;
  userId: string;
  orderNumber: string;
  orderStatus: string;
  paymentMethod?: string;
  shippingMethod?: string;
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  billingAddress: Address;
  shippingAddress: Address;
  notes?: string;
  trackingNumber?: string;
  orderDate: Date;
  shippedDate?: Date;
  deliveredDate?: Date;
  orderItems: OrderItem[];
  payments: Payment[];
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productSku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Address {
  id?: number;
  firstName?: string;
  lastName?: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
  email?: string;
}

export interface Payment {
  id: number;
  transactionId: string;
  paymentStatus: string;
  amount: number;
  paymentDate: Date;
  gatewayResponse?: string;
  notes?: string;
}

// category.model.ts
export interface Category {
  id: number;
  name: string;
  description?: string;
  slug?: string;
  imageUrl?: string;
  parentId?: number;
  children?: Category[];
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
}

// user.model.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

// auth.model.ts
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}