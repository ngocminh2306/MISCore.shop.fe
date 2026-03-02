export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productSku?: string;
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
  tax: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  createdAt: Date;
  updatedAt?: Date;
}