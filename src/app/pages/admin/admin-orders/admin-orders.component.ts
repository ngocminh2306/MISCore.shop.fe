import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { OrderDto, OrderService } from '../../../../public-api';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { MessageDialogService } from '../../../services/message-dialog.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, CurrencyPipe, TranslatePipe],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">{{ 'Admin Orders' | translate }}</h1>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'Search' | translate }}</label>
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (keyup.enter)="loadOrders(1)"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              [placeholder]="'Order number, user, etc.' | translate">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'Status' | translate }}</label>
            <select
              [(ngModel)]="selectedStatus"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">{{ 'All Statuses' | translate }}</option>
              <option value="Pending">{{ 'Pending' | translate }}</option>
              <option value="Processing">{{ 'Processing' | translate }}</option>
              <option value="Shipped">{{ 'Shipped' | translate }}</option>
              <option value="Delivered">{{ 'Delivered' | translate }}</option>
              <option value="Cancelled">{{ 'Cancelled' | translate }}</option>
              <option value="Refunded">{{ 'Refunded' | translate }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'Date From' | translate }}</label>
            <input
              type="date"
              [(ngModel)]="dateFrom"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'Date To' | translate }}</label>
            <input
              type="date"
              [(ngModel)]="dateTo"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'Sort By' | translate }}</label>
            <select
              [(ngModel)]="sortBy"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="orderDate">{{ 'Date' | translate }}</option>
              <option value="orderNumber">{{ 'Order Number' | translate }}</option>
              <option value="totalAmount">{{ 'Total Amount' | translate }}</option>
              <option value="orderStatus">{{ 'Status' | translate }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'Order' | translate }}</label>
            <select
              [(ngModel)]="sortOrder"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="asc">{{ 'Ascending' | translate }}</option>
              <option value="desc">{{ 'Descending' | translate }}</option>
            </select>
          </div>
        </div>

        <div class="mt-4 flex space-x-3">
          <button
            (click)="loadOrders(1)"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            {{ 'Apply Filters' | translate }}
          </button>
          <button
            (click)="resetFilters()"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            {{ 'Reset' | translate }}
          </button>
        </div>
      </div>

      <!-- Loading indicator -->
      <div *ngIf="loading" class="text-center py-8">
        <p class="text-gray-600">Loading orders...</p>
      </div>

      <!-- Error message -->
      <div *ngIf="!loading && error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <span class="block sm:inline">{{ error }}</span>
      </div>

      <!-- Orders table -->
      <div *ngIf="!loading && orders.length > 0" class="bg-white rounded-lg shadow-md overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Order ID' | translate }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Customer' | translate }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Date' | translate }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Status' | translate }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Total' | translate }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Payment' | translate }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Actions' | translate }}</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let order of orders">
              <td class="px-6 py-4 whitespace-nowrap">{{ order.orderNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ order.userId }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(order.orderDate || '') }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span [ngClass]="getStatusClass(order.orderStatus || '')" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ order.orderStatus }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ order.totalAmount | currency }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ order.paymentMethodName || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  (click)="viewOrder(order.id || 0)"
                  class="text-indigo-600 hover:text-indigo-900 mr-3">{{ 'Order Detail' | translate }}</button>

                <button
                  *ngIf="order.orderStatus === 'shipped'"
                  (click)="markAsDelivered(order.id || 0)"
                  class="ml-2 text-green-600 hover:text-green-900">{{ 'Deliver' | translate }}</button>

                <button
                  *ngIf="order.orderStatus === 'processing'"
                  (click)="markAsShipped(order.id || 0)"
                  class="ml-2 text-blue-600 hover:text-blue-900">{{ 'Ship' | translate }}</button>

                <button
                  *ngIf="order.orderStatus !== 'cancelled'"
                  (click)="cancelOrder(order.id || 0)"
                  class="ml-2 text-red-600 hover:text-red-900"
                  [disabled]="order.orderStatus === 'cancelled' || order.orderStatus === 'delivered'">{{ 'Cancel' | translate }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- No orders message -->
      <div *ngIf="!loading && orders.length === 0" class="text-center py-8">
        <p class="text-gray-600">{{ 'No orders found.' | translate }}</p>
      </div>

      <!-- Pagination -->
      <div *ngIf="!loading && orders.length > 0" class="mt-8 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button
            class="px-3 py-1 rounded-md bg-gray-200"
            [disabled]="currentPage <= 1"
            (click)="loadOrders(currentPage - 1)">
            {{ 'Previous' | translate }}
          </button>
          <button
            *ngFor="let page of getPages()"
            class="px-3 py-1 rounded-md"
            [ngClass]="page === currentPage ? 'bg-indigo-600 text-white' : 'bg-gray-200'"
            (click)="loadOrders(page)">
            {{ page }}
          </button>
          <button
            class="px-3 py-1 rounded-md bg-gray-200"
            [disabled]="currentPage >= totalPages"
            (click)="loadOrders(currentPage + 1)">
            {{ 'Next' | translate }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <div *ngIf="showOrderDetail" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" id="order-detail-modal">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex justify-between items-center pb-3 border-b">
            <h3 class="text-lg font-semibold text-gray-900">{{ 'Order Details' | translate }}</h3>
            <button
              (click)="closeOrderDetail()"
              class="text-gray-500 hover:text-gray-700">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div *ngIf="selectedOrder" class="mt-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="border-b pb-2">
                <p class="text-sm text-gray-600">{{ 'Order Number' | translate }}</p>
                <p class="font-medium">{{ selectedOrder.orderNumber }}</p>
              </div>

              <div class="border-b pb-2 relative">
                <p class="text-sm text-gray-600">{{ 'Status' | translate }}</p>
                <div class="flex items-center">
                  <span class="font-medium mr-2" [ngClass]="getStatusClass(selectedOrder.orderStatus || '')">{{ selectedOrder.orderStatus }}</span>
                  <button *ngIf="getAvailableStatusesForOrder(selectedOrder)"
                    type="button"
                    class="inline-flex justify-center px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 rounded hover:bg-indigo-200"
                    (click)="toggleOrderMenu(selectedOrder.id || 0)">
                    {{ 'Change' | translate }}
                  </button>
                </div>

                <div
                  *ngIf="activeOrderMenu === selectedOrder.id"
                  class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                  role="menu">
                  <div class="py-1" role="none">
                    <button
                      *ngFor="let status of getAvailableStatusesForOrder(selectedOrder)"
                      (click)="updateOrderStatus(selectedOrder.id || 0, status.value)"
                      class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                      role="menuitem">
                      {{ status.label }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="border-b pb-2">
                <p class="text-sm text-gray-600">{{ 'Date' | translate }}</p>
                <p class="font-medium">{{ formatDate(selectedOrder.orderDate || '') }}</p>
              </div>

              <div class="border-b pb-2">
                <p class="text-sm text-gray-600">{{ 'Customer ID' | translate }}</p>
                <p class="font-medium">{{ selectedOrder.userId }}</p>
              </div>

              <div class="border-b pb-2">
                <p class="text-sm text-gray-600">{{ 'Subtotal' | translate }}</p>
                <p class="font-medium">{{ selectedOrder.subtotal | currency }}</p>
              </div>

              <div class="border-b pb-2">
                <p class="text-sm text-gray-600">{{ 'Tax' | translate }}</p>
                <p class="font-medium">{{ selectedOrder.taxAmount | currency }}</p>
              </div>

              <div class="border-b pb-2">
                <p class="text-sm text-gray-600">{{ 'Shipping' | translate }}</p>
                <p class="font-medium">{{ selectedOrder.shippingCost?.toFixed(2) | currency }}</p>
              </div>

              <div class="border-b pb-2">
                <p class="text-sm text-gray-600">{{ 'Total' | translate }}</p>
                <p class="font-medium font-bold">{{ selectedOrder.totalAmount | currency }}</p>
              </div>

              <div class="border-b pb-2 col-span-2">
                <p class="text-sm text-gray-600">{{ 'Payment Method' | translate }}</p>
                <p class="font-medium">{{ selectedOrder.paymentMethodName || 'N/A' }}</p>
              </div>

              <div class="border-b pb-2 col-span-2">
                <p class="text-sm text-gray-600">{{ 'Shipping Method' | translate }}</p>
                <p class="font-medium">{{ selectedOrder.shippingMethodName || 'N/A' }}</p>
              </div>
            </div>

            <!-- Order Items -->
            <div class="mt-4">
              <h4 class="text-md font-semibold mb-2">{{ 'Order Items' | translate }}</h4>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Product' | translate }}</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Quantity' | translate }}</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Unit Price' | translate }}</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Total' | translate }}</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr *ngFor="let item of selectedOrder.orderItems">
                      <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {{ item.productName }}
                      </td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {{ item.quantity }}
                      </td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {{ item.unitPrice | currency }}
                      </td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {{ item.totalPrice | currency }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AdminOrdersComponent implements OnInit {
  orders: OrderDto[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  
  // Filter parameters
  searchTerm: string = '';
  selectedStatus: string = '';
  dateFrom: string = '';
  dateTo: string = '';

  // Sort parameters
  sortBy: string = 'orderDate';
  sortOrder: string = 'desc'; // 'asc' or 'desc'
  
  // Menu states
  activeOrderMenu: number | null = null;

  // Order detail view
  showOrderDetail = false;
  selectedOrder: OrderDto | null = null;
  
  // Available statuses
  availableStatuses = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' },
    { label: 'Refunded', value: 'Refunded' }
  ];

  // Step-by-step status transitions allowed
  statusTransitions: { [key: string]: string[] } = {
    'Pending': ['Processing', 'Cancelled'],
    'Processing': ['Shipped', 'Cancelled'],
    'Shipped': ['Delivered', 'Cancelled'],
    'Delivered': ['Refunded'],
    'Cancelled': [],  // Cannot change status once cancelled
    'Refunded': []    // Cannot change status once refunded
  };

  private languageService = inject(LanguageService);

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private messageDialogService: MessageDialogService
  ) {}

  ngOnInit(): void {
    this.loadOrders(1);
  }

  loadOrders(page: number): void {
    this.loading = true;
    this.error = null;
    this.currentPage = page;

    // Format dates if provided
    const startDate = this.dateFrom ? new Date(this.dateFrom).toISOString() : undefined;
    const endDate = this.dateTo ? new Date(this.dateTo).toISOString() : undefined;

    // Call API
    this.orderService.apiOrderGet(
      page,
      this.pageSize,
      undefined, // userId
      undefined, // orderStatusId - we'll handle status by name in the filter
      undefined, // paymentMethodId
      undefined, // shippingMethodId
      startDate,
      endDate,
      undefined, // minTotal
      undefined, // maxTotal
      undefined, // orderNumber
      this.searchTerm || undefined,
      this.sortBy || undefined, // sortBy
      this.sortOrder || undefined  // sortOrder
    ).subscribe({
      next: (response) => {
        // Extract orders data from response
        let ordersData;
        let totalCount = 0;

        if (response && response.data && response.data.items) {
          ordersData = response.data.items;
          totalCount = response.data.totalCount || 0;
        }

        // Apply status filter on the client side if needed
        if (this.selectedStatus) {
          ordersData = ordersData?.filter((order: any) =>
            order.orderStatus.toLowerCase() === this.selectedStatus.toLowerCase()
          );
        }

        this.orders = ordersData || [];
        this.totalPages = Math.ceil(totalCount / this.pageSize);

        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading orders:', error);
        this.error = 'Failed to load orders. Please try again later.';
        this.loading = false;
      }
    });
  }

  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
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

  getPages(): number[] {
    const pages = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  viewOrder(orderId: number): void {
    // Find the order in the current list
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      this.selectedOrder = order;
      this.showOrderDetail = true;
    } else {
      // If not found in current list, fetch the specific order
      this.orderService.apiOrderIdGet(orderId).subscribe({
        next: (response: any) => {
          this.selectedOrder = response;
          this.showOrderDetail = true;
        },
        error: (error: any) => {
          console.error('Error loading order details:', error);
          this.error = 'Failed to load order details.';
        }
      });
    }
  }

  toggleOrderMenu(orderId: number): void {
    this.activeOrderMenu = this.activeOrderMenu === orderId ? null : orderId;
  }

  closeOrderDetail(): void {
    this.showOrderDetail = false;
    this.selectedOrder = null;
  }

  updateOrderStatus(orderId: number, newStatus: string): void {
    // Find the order being updated
    const updatingOrder = this.orders.find(order => order.id === orderId);
    if (!updatingOrder) {
      this.messageDialogService.error('Order not found', 'Error');
      return;
    }

    // Validate if the status transition is allowed
    const availableStatuses = this.getAvailableStatusesForOrder(updatingOrder);
    const isValidTransition = availableStatuses.some(status => status.value === newStatus);

    if (!isValidTransition) {
      const errorMessage = `Invalid status transition. From "${updatingOrder.orderStatus}", you can only change to: ${this.statusTransitions[updatingOrder.orderStatus || '']?.join(', ') || 'no other statuses'}.`;
      this.messageDialogService.error(errorMessage, 'Invalid Status Change');
      console.warn('Invalid status transition attempted:', updatingOrder.orderStatus, '->', newStatus);
      return;
    }

    // Confirm the status change with the user
    const confirmMessage = `Changing order status from "${updatingOrder.orderStatus}" to "${newStatus}". Are you sure?`;
    if (!confirm(confirmMessage)) {
      return; // User cancelled
    }

    // Disable the menu during the request
    this.activeOrderMenu = null;

    // Show loading state by updating the order temporarily
    updatingOrder.orderStatus = `${newStatus} (Updating...)`;

    // Update the order status with the API
    this.orderService.apiOrderIdStatusPut(orderId, this.mapStatusNameToId(newStatus)).subscribe({
      next: (response: any) => {
        console.log(`Order ${orderId} status updated to ${newStatus}`);

        // Show success notification
        this.messageDialogService.success(`Order ${orderId} status successfully updated to ${newStatus}`, 'Success');

        this.loadOrders(this.currentPage); // Refresh the list
      },
      error: (error: any) => {
        console.error('Error updating order status:', error);

        // Restore the original order status if it was updated temporarily
        // We'll reload all orders anyway, so this is just visual restoration until reload
        if (updatingOrder) {
          updatingOrder.orderStatus = this.orders.find(o => o.id === orderId)?.orderStatus || updatingOrder.orderStatus;
        }

        const errorMessage = error?.error?.message || error?.message || 'Failed to update order status. Please try again.';
        this.error = errorMessage;

        // Show error message using message dialog service
        this.messageDialogService.error(`Error updating order status: ${errorMessage}`, 'Error');
      }
    });
  }

  /**
   * Get available statuses for a specific order based on current status and allowed transitions
   * @param order The order to check allowed transitions for
   * @returns Array of available status options
   */
  getAvailableStatusesForOrder(order: OrderDto): { label: string, value: string }[] {
    // If the order has pre-computed available statuses, return them
    if ('availableStatuses' in order && order.availableStatuses) {
      return order.availableStatuses as { label: string, value: string }[];
    }

    // Otherwise, compute them on the fly (for orders loaded separately)
    const currentStatus = order.orderStatus || '';

    // Get allowed transitions for the current status
    const allowedTransitions = this.statusTransitions[currentStatus] || [];

    // Filter the available statuses to only include allowed transitions
    return this.availableStatuses.filter(status =>
      allowedTransitions.includes(status.value)
    );
  }

  /**
   * Handle status change from select dropdown
   * @param order The order being updated
   * @param event The change event
   */
  onStatusChange(order: OrderDto, value: any): void {
    const newStatus = value;

    // If no status selected (empty option), do nothing
    if (!newStatus) {
      return;
    }

    // Validate if the status transition is allowed
    const availableStatuses = this.getAvailableStatusesForOrder(order);
    const isValidTransition = availableStatuses.some(status => status.value.toLocaleLowerCase() === newStatus.toLocaleLowerCase());

    if (!isValidTransition) {
      const errorMessage = `Invalid status transition. From "${order.orderStatus}", you can only change to: ${this.statusTransitions[order.orderStatus || '']?.join(', ') || 'no other statuses'}.`;
      this.messageDialogService.error(errorMessage, 'Invalid Status Change');
      console.warn('Invalid status transition attempted:', order.orderStatus, '->', newStatus);

      // Reset the select to the current status
      value = order.orderStatus;
      return;
    }

    // Confirm the status change with the user
    const confirmMessage = `Changing order status from "${order.orderStatus}" to "${newStatus}". Are you sure?`;
    if (!confirm(confirmMessage)) {
      // Reset the select to the current status if user cancels
      value = order.orderStatus;
      return; // User cancelled
    }

    // Update the order status
    this.updateOrderStatus(order.id || 0, newStatus);
  }

  private mapStatusNameToId(statusName: string): number {
    // This is a temporary mapping - in a real app, you would likely fetch these from an API
    // Map status names to IDs as expected by the backend
    const statusMap: { [key: string]: number } = {
      'Pending': 1,
      'Processing': 2,
      'Shipped': 3,
      'Delivered': 4,
      'Cancelled': 5,
      'Refunded': 6
    };

    return statusMap[statusName] || 1; // Default to 'Pending' ID
  }

  markAsShipped(orderId: number): void {
    this.orderService.apiOrderIdMarkShippedPut(orderId).subscribe({
      next: (response: any) => {
        console.log(`Order ${orderId} marked as shipped`);
        this.loadOrders(this.currentPage);
      },
      error: (error: any) => {
        console.error('Error marking order as shipped:', error);
        this.error = 'Failed to mark order as shipped.';
      }
    });
  }

  markAsDelivered(orderId: number): void {
    this.orderService.apiOrderIdMarkDeliveredPut(orderId).subscribe({
      next: (response: any) => {
        console.log(`Order ${orderId} marked as delivered`);
        this.loadOrders(this.currentPage);
      },
      error: (error: any) => {
        console.error('Error marking order as delivered:', error);
        this.error = 'Failed to mark order as delivered.';
      }
    });
  }

  cancelOrder(orderId: number): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.apiOrderIdCancelPut(orderId).subscribe({
        next: (response: any) => {
          console.log(`Order ${orderId} cancelled`);
          this.loadOrders(this.currentPage);
        },
        error: (error: any) => {
          console.error('Error cancelling order:', error);
          this.error = 'Failed to cancel order.';
        }
      });
    }
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.loadOrders(1);
  }
}