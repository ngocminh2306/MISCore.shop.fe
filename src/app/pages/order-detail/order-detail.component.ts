import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderDto, OrderService } from '../../../public-api';
import { MessageDialogService } from '../../services/message-dialog.service';
import { NgClass, NgIf, DatePipe, CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIf, NgClass, DatePipe, CurrencyPipe],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="mb-6">
        <a [routerLink]="['/order-history']" class="text-indigo-600 hover:text-indigo-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Back to Order History
        </a>
        <h1 class="text-3xl font-bold text-gray-900 mt-4">Order Details</h1>
        <p class="text-gray-600">Order #{{ orderNumber }}</p>
      </div>

      <div *ngIf="loading" class="text-center py-8">
        <p class="text-gray-600">Loading order details...</p>
      </div>

      <div *ngIf="!loading && error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <span class="block sm:inline">{{ error }}</span>
      </div>

      <div *ngIf="!loading && order" class="space-y-6">
        <!-- Order Status and Info -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 class="text-xl font-semibold text-gray-800">Order Status</h2>
              <div class="mt-2 flex items-center">
                <span [ngClass]="getStatusClass(order.orderStatus)" class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ order.orderStatus ? (typeof order.orderStatus === 'object' ? order.orderStatus : order.orderStatus) : 'N/A' }}
                </span>
                <span class="ml-4 text-sm text-gray-600">Placed: {{ order.orderDate | date:'short' }}</span>
              </div>
            </div>
            <div class="mt-4 md:mt-0">
              <span class="text-lg font-bold text-gray-900">Total: {{ order.totalAmount | currency }}</span>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Order Items</h2>
          <div class="space-y-4">
            @if (order.orderItems && order.orderItems.length > 0) {
              @for (item of order.orderItems; track item.id) {
                <div class="flex items-center border-b pb-4 last:border-0 last:pb-0">
                  <div class="flex-shrink-0 w-16 h-16">
                    <!-- @if (item.product?.thumbnailUrl) {
                      <img [src]="item.product.thumbnailUrl" [alt]="item.product?.name || 'Product'" class="w-full h-full object-cover rounded-md">
                    } @else {
                      <div class="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                        <span class="text-gray-500 text-xs">No image</span>
                      </div>
                    } -->
                  </div>
                  <div class="ml-4 flex-1">
                    <h3 class="font-medium text-gray-900">{{ item.productName || 'Product' }}</h3>
                    <p class="text-sm text-gray-500">Quantity: {{ item.quantity || 1 }}</p>
                    <p class="text-sm text-gray-500">Price: {{ item.unitPrice | currency }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-medium text-gray-900">{{ (item.unitPrice || 0) * (item.quantity || 1) | currency }}</p>
                  </div>
                </div>
              }
            } @else {
              <p class="text-gray-500">No items found for this order.</p>
            }
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Shipping Address -->
            <div>
              <h3 class="font-medium text-gray-900 mb-2">Shipping Address</h3>
              @if (order.shippingAddress) {
                <div>
                  <p class="text-gray-700">{{ order.shippingAddress.firstName || '' }} {{ order.shippingAddress.lastName || '' }}</p>
                  <p class="text-gray-700">{{ order.shippingAddress.addressLine1 || '' }}</p>
                  @if (order.shippingAddress.addressLine2) {
                    <p class="text-gray-700">{{ order.shippingAddress.addressLine2 }}</p>
                  }
                  <p class="text-gray-700">{{ order.shippingAddress.city || '' }}, {{ order.shippingAddress.state || '' }} {{ order.shippingAddress.postalCode || '' }}</p>
                  <p class="text-gray-700">{{ order.shippingAddress.country || '' }}</p>
                  <p class="text-gray-700 mt-1">{{ order.shippingAddress.phoneNumber || '' }}</p>
                  <p class="text-gray-700">{{ order.shippingAddress.email || '' }}</p>
                </div>
              } @else {
                <p class="text-gray-500">No shipping address available</p>
              }
            </div>

            <!-- Billing Address -->
            <div>
              <h3 class="font-medium text-gray-900 mb-2">Billing Address</h3>
              @if (order.billingAddress) {
                <div>
                  <p class="text-gray-700">{{ order.billingAddress.firstName || '' }} {{ order.billingAddress.lastName || '' }}</p>
                  <p class="text-gray-700">{{ order.billingAddress.addressLine1 || '' }}</p>
                  @if (order.billingAddress.addressLine2) {
                    <p class="text-gray-700">{{ order.billingAddress.addressLine2 }}</p>
                  }
                  <p class="text-gray-700">{{ order.billingAddress.city || '' }}, {{ order.billingAddress.state || '' }} {{ order.billingAddress.postalCode || '' }}</p>
                  <p class="text-gray-700">{{ order.billingAddress.country || '' }}</p>
                  <p class="text-gray-700 mt-1">{{ order.billingAddress.phoneNumber || '' }}</p>
                  <p class="text-gray-700">{{ order.billingAddress.email || '' }}</p>
                </div>
              } @else {
                <p class="text-gray-500">No billing address available</p>
              }
            </div>
          </div>

          <!-- Payment and Shipping Info -->
          <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Payment Info -->
            <div>
              <h3 class="font-medium text-gray-900 mb-2">Payment Information</h3>
              <div>
                <p class="text-gray-700">Payment Method: {{ order.paymentMethodId ? getPaymentMethod(order.paymentMethodId) : 'N/A' }}</p>
                <p class="text-gray-700" *ngIf="order.payments">Payment Status: {{ order.payments[0].paymentStatus || 'N/A' }}</p>
              </div>
            </div>

            <!-- Shipping Info -->
            <div>
              <h3 class="font-medium text-gray-900 mb-2">Shipping Information</h3>
              <div>
                <p class="text-gray-700">Shipping Method: {{ order.shippingMethodId ? getShippingMethod(order.shippingMethodId) : 'N/A' }}</p>
                <p class="text-gray-700">Tracking Number: {{ order.trackingNumber || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Order Total -->
          <div class="mt-8 border-t border-gray-200 pt-6">
            <div class="flex justify-between text-lg font-medium text-gray-900">
              <p>Subtotal</p>
              <p>{{ order.subtotal | currency }}</p>
            </div>
            <div class="flex justify-between text-sm text-gray-600 mt-1">
              <p>Shipping</p>
              <p>{{ order.shippingCost | currency }}</p>
            </div>
            <div class="flex justify-between text-sm text-gray-600 mt-1">
              <p>Tax</p>
              <p>{{ order.taxAmount | currency }}</p>
            </div>
            <div class="flex justify-between text-sm text-gray-600 mt-1">
              <p>Discount</p>
              <p>-{{ order.discountAmount | currency }}</p>
            </div>
            <div class="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-200">
              <p>Total</p>
              <p>{{ order.totalAmount | currency }}</p>
            </div>
          </div>
        </div>

        <!-- Order Actions -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex flex-wrap gap-4">
            @if (canCancelOrder()) {
              <button
                (click)="cancelOrder()"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                Cancel Order
              </button>
            }
            <a
              [routerLink]="['/order-history']"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
              Back to Orders
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #f9fafb;
      min-height: calc(100vh - 100px);
      padding-top: 2rem;
    }
  `]
})
export class OrderDetailComponent implements OnInit {
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  private messageDialogService = inject(MessageDialogService);
  private router = inject(Router);

  order: OrderDto | null = null;
  orderNumber: string = 'N/A';
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrderDetails(Number(orderId));
    } else {
      this.error = 'Order ID is missing';
    }
  }

  loadOrderDetails(orderId: number): void {
    this.loading = true;
    this.error = null;

    this.orderService.apiOrderIdGet(orderId).subscribe({
      next: (response: any) => {
        // Handle different response formats that could be returned by the API
        if (response?.data) {
          this.order = response.data;
        } else if (response?.id) {
          // If response is the order object itself
          this.order = response;
        } else {
          // If response structure is different
          this.order = response;
        }

        this.orderNumber = this.order?.orderNumber || orderId.toString();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order details:', error);
        this.error = 'Failed to load order details. Please try again.';
        this.loading = false;
      }
    });
  }

  getStatusClass(status: any): string {
    if (!status) {
      return 'bg-gray-100 text-gray-800';
    }
    const statusName = typeof status === 'object' ? status.name?.toLowerCase() : status.toLowerCase();
    switch (statusName) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPaymentMethod(methodId: number | undefined): string {
    if (methodId === undefined) {
      return 'N/A';
    }
    const methods: { [key: number]: string } = {
      1: 'Credit Card',
      2: 'PayPal',
      3: 'Bank Transfer',
      4: 'VNPay'
    };
    return methods[methodId] || 'Other';
  }

  getShippingMethod(methodId: number | undefined): string {
    if (methodId === undefined) {
      return 'N/A';
    }
    const methods: { [key: number]: string } = {
      1: 'Standard Shipping',
      2: 'Express Shipping',
      3: 'Free Shipping'
    };
    return methods[methodId] || 'Other';
  }

  canCancelOrder(): boolean {
    // Only allow cancellation if order status is pending or processing
    if (!this.order?.orderStatus) return false;
    const statusName = this.order.orderStatus;
    return statusName === 'pending' || statusName === 'processing';
  }

  cancelOrder(): void {
    if (this.order) {
      if (confirm('Are you sure you want to cancel this order?')) {
        // API call to cancel order would go here
        this.messageDialogService.info('Order cancellation functionality would go here', 'Coming Soon');
        // For now, just show a message. In a real implementation, this would call an API to cancel the order
      }
    }
  }
}