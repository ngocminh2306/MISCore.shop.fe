import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { OrderDto, OrderService } from '../../../../public-api';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { MessageDialogService } from '../../../services/message-dialog.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { LanguageService } from '../../../services/language.service';
import { CommonTableComponent, TableColumn } from '../../../components/common-table/common-table.component';


@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, TranslatePipe, CommonTableComponent],
  template: `
    <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">{{ 'Admin Orders' | translate }}</h1>
        <div class="mt-4 flex justify-between items-center">
          <p class="text-gray-600">{{ 'View and manage customer orders' | translate }}</p>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label for="order-search" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Search' | translate }}</label>
            <input
              type="text"
              id="order-search"
              [(ngModel)]="searchTerm"
              (keyup.enter)="loadOrders(1)"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              [placeholder]="'Order number, user, etc.' | translate">
          </div>

          <div>
            <label for="order-status" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Status' | translate }}</label>
            <select
              id="order-status"
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
            <label for="order-date-from" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Date From' | translate }}</label>
            <input
              id="order-date-from"
              type="date"
              [(ngModel)]="dateFrom"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          </div>

          <div>
            <label for="order-date-to" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Date To' | translate }}</label>
            <input
              id="order-date-to"
              type="date"
              [(ngModel)]="dateTo"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          </div>

          <div>
            <label for="order-sort-by" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Sort By' | translate }}</label>
            <select
              id="order-sort-by"
              [(ngModel)]="sortBy"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="orderDate">{{ 'Date' | translate }}</option>
              <option value="orderNumber">{{ 'Order Number' | translate }}</option>
              <option value="totalAmount">{{ 'Total Amount' | translate }}</option>
              <option value="orderStatus">{{ 'Status' | translate }}</option>
            </select>
          </div>

          <div>
            <label for="order-sort-order" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Order' | translate }}</label>
            <select
              id="order-sort-order"
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

      <!-- Orders Table using CommonTable Component -->
      <misc-common-table
        [data]="orders"
        [columns]="tableColumns"
        tableName="orders"
        [loading]="loading"
        [error]="error"
        [paginationConfig]="{
          currentPage: currentPage,
          pageSize: pageSize,
          totalItems: totalCount,
          totalPages: totalPages
        }"
        [filterConfig]="{
          searchTerm: searchTerm,
          filters: { status: selectedStatus }
        }"
        [showActions]="true"
        [rowActions]="[
          { name: 'view', title: 'Order Detail', color: 'indigo' },
          { name: 'ship', title: 'Ship', color: 'blue', class: 'ship-action' },
          { name: 'deliver', title: 'Deliver', color: 'green', class: 'deliver-action' },
          { name: 'cancel', title: 'Cancel', color: 'red', class: 'cancel-action' }
        ]"
        (action)="handleAction($event.name, $event.item)"
        (pageChange)="onPageChange($event)"
        (filterChange)="onFilterChange($event)">
      </misc-common-table>

      <!-- Order Detail Modal -->
      @if (showOrderDetail) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">
                {{ 'Order Details' | translate }}
              </h3>
              <button (click)="closeOrderDetail()" class="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            @if (selectedOrder) {
              <div class="mt-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="border-b pb-2">
                    <p class="text-sm text-gray-600">{{ 'Order Number' | translate }}</p>
                    <p class="font-medium">{{ selectedOrder.orderNumber }}</p>
                  </div>

                  <div class="border-b pb-2">
                    <p class="text-sm text-gray-600">{{ 'Status' | translate }}</p>
                    <p class="font-medium">
                      <span [ngClass]="getStatusClass(selectedOrder.orderStatus)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                        {{ selectedOrder.orderStatus }}
                      </span>
                    </p>
                  </div>

                  <div class="border-b pb-2">
                    <p class="text-sm text-gray-600">{{ 'Date' | translate }}</p>
                    <p class="font-medium">{{ formatDate(selectedOrder.orderDate) }}</p>
                  </div>

                  <div class="border-b pb-2">
                    <p class="text-sm text-gray-600">{{ 'Customer' | translate }}</p>
                    <p class="font-medium">{{ selectedOrder.userName || selectedOrder.userId }}</p>
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
                @if (selectedOrder.orderItems && selectedOrder.orderItems.length > 0) {
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
                          @for (item of selectedOrder.orderItems; track item.id) {
                            <tr>
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
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #f9fafb;
      min-height: calc(100vh - 200px);
    }
  `]
})
export class AdminOrdersComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageDialogService = inject(MessageDialogService);
  private readonly languageService = inject(LanguageService);
  private cdr = inject(ChangeDetectorRef);

  orders: OrderDto[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;

  // Filter parameters
  searchTerm: string = '';
  selectedStatus: string = '';
  dateFrom: string = '';
  dateTo: string = '';

  // Sort parameters
  sortBy: string = 'orderDate';
  sortOrder: string = 'desc';

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
    'Cancelled': [],
    'Refunded': []
  };

  // Table configuration
  tableColumns: TableColumn[] = [
    {
      key: 'orderNumber',
      title: 'Order ID',
      sortable: true,
      type: 'text',
      width: '15%'
    },
    {
      key: 'userName',
      title: 'Customer',
      sortable: true,
      type: 'text',
      width: '20%'
    },
    {
      key: 'orderDate',
      title: 'Date',
      sortable: true,
      type: 'date',
      width: '15%'
    },
    {
      key: 'orderStatus',
      title: 'Status',
      sortable: true,
      type: 'text',
      width: '15%'
    },
    {
      key: 'totalAmount',
      title: 'Total',
      sortable: true,
      type: 'number',
      width: '15%'
    },
    {
      key: 'paymentMethodName',
      title: 'Payment',
      sortable: false,
      type: 'text',
      width: '20%'
    }
  ];

  ngOnInit(): void {
    this.loadOrders(1);
  }

  loadOrders(page: number): void {
    this.loading = true;
    this.error = null;
    this.currentPage = page;

    const startDate = this.dateFrom ? new Date(this.dateFrom).toISOString() : undefined;
    const endDate = this.dateTo ? new Date(this.dateTo).toISOString() : undefined;

    this.orderService.apiOrderGet(
      page,
      this.pageSize,
      undefined,
      undefined,
      undefined,
      undefined,
      startDate,
      endDate,
      undefined,
      undefined,
      undefined,
      this.searchTerm || undefined,
      this.sortBy || undefined,
      this.sortOrder || undefined
    ).subscribe({
      next: (response) => {
        let ordersData: OrderDto[] = [];
        let totalCount = 0;
        this.cdr.markForCheck();
        if (response?.data?.items) {
          ordersData = response.data.items;
          totalCount = response.data.totalCount || 0;
        }

        // Map to Order interface and apply status filter
        let filteredOrders: OrderDto[] = ordersData.map((dto: OrderDto) => ({
          id: dto.id || 0,
          orderNumber: dto.orderNumber,
          userId: dto.userId,
          userName: dto.userName,
          orderStatus: dto.orderStatus || '',
          orderDate: dto.orderDate || '',
          totalAmount: dto.totalAmount || 0,
          paymentMethodName: dto.paymentMethodName,
          shippingMethodName: dto.shippingMethodName
        }));

        if (this.selectedStatus) {
          filteredOrders = filteredOrders.filter((order) =>
            order.orderStatus?.toLowerCase() === this.selectedStatus.toLowerCase()
          );
        }

        this.orders = filteredOrders;
        this.totalCount = totalCount;
        this.totalPages = Math.ceil(totalCount / this.pageSize);
        this.loading = false;
      },
      error: (error) => {
        this.cdr.markForCheck();
        console.error('Error loading orders:', error);
        this.error = 'Failed to load orders. Please try again later.';
        this.loading = false;
      }
    });
  }

  formatDate(date: string | undefined | null): string {
    if (!date) {
      return '';
    }
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  }

  getStatusClass(status: string | undefined | null): string {
    if (!status) {
      return 'bg-gray-100 text-gray-800';
    }
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

  viewOrder(orderId: number): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      this.selectedOrder = order;
      this.showOrderDetail = true;
    } else {
      this.orderService.apiOrderIdGet(orderId).subscribe({
        next: (response) => {
          const dto = response.data as OrderDto;
          this.selectedOrder = {
            id: dto.id || 0,
            orderNumber: dto.orderNumber,
            userId: dto.userId,
            userName: dto.userName,
            orderStatus: dto.orderStatus || '',
            orderDate: dto.orderDate || '',
            totalAmount: dto.totalAmount || 0,
            paymentMethodName: dto.paymentMethodName,
            shippingMethodName: dto.shippingMethodName
          };
          this.showOrderDetail = true;
        },
        error: (error) => {
          console.error('Error loading order details:', error);
          this.error = 'Failed to load order details.';
        }
      });
    }
  }

  closeOrderDetail(): void {
    this.showOrderDetail = false;
    this.selectedOrder = null;
  }

  updateOrderStatus(orderId: number, newStatus: string): void {
    const updatingOrder = this.orders.find(order => order.id === orderId);
    if (!updatingOrder) {
      this.messageDialogService.error('Order not found', 'Error');
      return;
    }

    const availableStatuses = this.getAvailableStatusesForOrder(updatingOrder);
    const isValidTransition = availableStatuses.some(status => status.value === newStatus);

    if (!isValidTransition) {
      const errorMessage = `Invalid status transition. From "${updatingOrder.orderStatus}", you can only change to: ${this.statusTransitions[updatingOrder.orderStatus || '']?.join(', ') || 'no other statuses'}.`;
      this.messageDialogService.error(errorMessage, 'Invalid Status Change');
      console.warn('Invalid status transition attempted:', updatingOrder.orderStatus, '->', newStatus);
      return;
    }

    const confirmMessage = `Changing order status from "${updatingOrder.orderStatus}" to "${newStatus}". Are you sure?`;
    if (!confirm(confirmMessage)) {
      return;
    }

    updatingOrder.orderStatus = `${newStatus} (Updating...)`;

    this.orderService.apiOrderIdStatusPut(orderId, this.mapStatusNameToId(newStatus)).subscribe({
      next: () => {
        console.log(`Order ${orderId} status updated to ${newStatus}`);
        this.messageDialogService.success(`Order ${orderId} status successfully updated to ${newStatus}`, 'Success');
        this.loadOrders(this.currentPage);
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        if (updatingOrder) {
          updatingOrder.orderStatus = this.orders.find(o => o.id === orderId)?.orderStatus || updatingOrder.orderStatus;
        }
        const errorMessage = error?.error?.message || error?.message || 'Failed to update order status. Please try again.';
        this.error = errorMessage;
        this.messageDialogService.error(`Error updating order status: ${errorMessage}`, 'Error');
      }
    });
  }

  getAvailableStatusesForOrder(order: OrderDto): { label: string, value: string }[] {
    const currentStatus = order.orderStatus || '';
    const allowedTransitions = this.statusTransitions[currentStatus] || [];

    return this.availableStatuses.filter(status =>
      allowedTransitions.includes(status.value)
    );
  }

  private mapStatusNameToId(statusName: string): number {
    const statusMap: { [key: string]: number } = {
      'Pending': 1,
      'Processing': 2,
      'Shipped': 3,
      'Delivered': 4,
      'Cancelled': 5,
      'Refunded': 6
    };

    return statusMap[statusName] || 1;
  }

  markAsShipped(orderId: number): void {
    this.orderService.apiOrderIdMarkShippedPut(orderId).subscribe({
      next: () => {
        console.log(`Order ${orderId} marked as shipped`);
        this.messageDialogService.success(`Order ${orderId} marked as shipped`, 'Success');
        this.loadOrders(this.currentPage);
      },
      error: (error) => {
        console.error('Error marking order as shipped:', error);
        this.error = 'Failed to mark order as shipped.';
        this.messageDialogService.error('Failed to mark order as shipped.', 'Error');
      }
    });
  }

  markAsDelivered(orderId: number): void {
    this.orderService.apiOrderIdMarkDeliveredPut(orderId).subscribe({
      next: () => {
        console.log(`Order ${orderId} marked as delivered`);
        this.messageDialogService.success(`Order ${orderId} marked as delivered`, 'Success');
        this.loadOrders(this.currentPage);
      },
      error: (error) => {
        console.error('Error marking order as delivered:', error);
        this.error = 'Failed to mark order as delivered.';
        this.messageDialogService.error('Failed to mark order as delivered.', 'Error');
      }
    });
  }

  cancelOrder(orderId: number): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.apiOrderIdCancelPut(orderId).subscribe({
        next: () => {
          console.log(`Order ${orderId} cancelled`);
          this.messageDialogService.success(`Order ${orderId} cancelled`, 'Success');
          this.loadOrders(this.currentPage);
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          this.error = 'Failed to cancel order.';
          this.messageDialogService.error('Failed to cancel order.', 'Error');
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

  handleAction(actionName: string, item: OrderDto): void {
    switch (actionName) {
      case 'view':
        this.viewOrder(item.id || 0);
        break;
      case 'ship':
        if (item.orderStatus === 'Processing') {
          this.markAsShipped(item.id || 0);
        }
        break;
      case 'deliver':
        if (item.orderStatus === 'Shipped') {
          this.markAsDelivered(item.id || 0);
        }
        break;
      case 'cancel':
        if (item.orderStatus !== 'Cancelled' && item.orderStatus !== 'Delivered') {
          this.cancelOrder(item.id || 0);
        }
        break;
    }
  }

  onPageChange(pageConfig: { currentPage: number; pageSize: number }): void {
    this.currentPage = pageConfig.currentPage;
    this.pageSize = pageConfig.pageSize;
    this.loadOrders(this.currentPage);
  }

  onFilterChange(filterConfig: { searchTerm: string; filters: Record<string, string> }): void {
    this.searchTerm = filterConfig.searchTerm;
    this.selectedStatus = filterConfig.filters?.['status'] || '';
    this.loadOrders(1);
  }
}
