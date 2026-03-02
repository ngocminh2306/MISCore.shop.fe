import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Order, OrderDto, OrderService, OrderStatus } from '../../../public-api';


@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [RouterLink, CommonModule, CurrencyPipe],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">{{ isAdmin ? 'Admin Orders' : 'Order History' }}</h1>

      <!-- Success message from checkout -->
      @if (successMessage) {
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span class="block sm:inline">{{ successMessage }}</span>
        </div>
      }

      <div *ngIf="loading" class="text-center py-8">
        <p class="text-gray-600">Loading orders...</p>
      </div>

      <div *ngIf="!loading && error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <span class="block sm:inline">{{ error }}</span>
      </div>

      <div *ngIf="!loading && orders.length === 0" class="text-center py-8">
        <p class="text-gray-600">No orders found.</p>
      </div>

      <div *ngIf="!loading && orders.length > 0" class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Order Summary Table -->
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let order of orders">
              <td class="px-6 py-4 whitespace-nowrap">{{ order.orderNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(order.orderDate) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span [ngClass]="getStatusClass(order.orderStatus)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ order.orderStatus }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ order.totalAmount | currency }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <a [routerLink]="['/order', order.id]" class="text-indigo-600 hover:text-indigo-900 mr-4">View</a>
                <a href="#" class="text-blue-600 hover:text-blue-900" *ngIf="!isAdmin">Reorder</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!loading && orders.length > 0" class="mt-8 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button
            class="px-3 py-1 rounded-md bg-gray-200"
            [disabled]="currentPage <= 1"
            (click)="loadOrders(currentPage - 1)">
            Previous
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
            Next
          </button>
        </nav>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class OrderHistoryComponent implements OnInit {
  orders: OrderDto[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  isAdmin = true;
  successMessage: string | null = null;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check if current user is admin
    const user = this.authService.getUser();
    if (user && user.roles && user.roles.includes('admin')) {
      this.isAdmin = true;
    }

    // Check if there's a success message from checkout
    if (history.state && history.state.orderPlacedSuccess) {
      this.successMessage = history.state.message || 'Order placed successfully!';
    }

    this.loadOrders(1);
  }

  loadOrders(page: number): void {
    this.loading = true;
    this.error = null;
    this.currentPage = page;

    // Use admin API if user is admin, otherwise use regular API
    const apiCall = this.orderService.apiOrderMyOrdersGet(page, this.pageSize);

    apiCall.subscribe({
      next: (response) => {
        // Process the API response to extract orders data
        // The structure may vary based on the actual API response format
        this.orders = response?.data || [];

        // Calculate total pages based on API response
        this.totalPages = Math.ceil(((response?.data?.length || 0) || 0) / this.pageSize);

        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading orders:', error);
        this.error = 'Failed to load orders. Please try again later.';
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string | null | undefined): string {
    if(dateString === null || dateString === undefined) {
      return '';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  getStatusClass(status: string | null | undefined): string {
    if (!status) {
      return 'bg-gray-100 text-gray-800';
    }
    switch (status?.toLowerCase()) {
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
}