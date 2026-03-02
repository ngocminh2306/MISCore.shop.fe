import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { LanguageService } from '../../services/language.service';

export interface TableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'image' | 'custom';
  format?: (value: any) => string;
  width?: string;
}

export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface SortConfig {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface FilterConfig {
  searchTerm: string;
  filters: { [key: string]: string };
}

@Component({
  selector: 'misc-common-table',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, TranslatePipe],
  template: `
    <!-- Search and Filters -->
    <div class="bg-white shadow rounded-lg p-4 mb-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Search' | translate }}</label>
          <input
            type="text"
            id="search"
            [value]="filterConfig.searchTerm"
            (input)="onSearchChange($event)"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="{{ 'Search' | translate }} {{ tableName }}..."
          >
        </div>
        <!-- Custom filter slots will be added dynamically -->
        <div class="flex items-end">
          <button
            (click)="onFilter()"
            class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
            {{ 'Apply Filters' | translate }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading and Error States -->
    @if (loading) {
      <div class="bg-white shadow rounded-lg p-8 text-center mb-4">
        <div class="flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
        <p class="mt-4 text-sm text-gray-600">{{ 'Loading' | translate }} {{ tableName }}...</p>
      </div>
    }

    @if (error) {
      <div class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">{{ 'Error' | translate }}</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Main Table -->
    <div class="bg-white shadow overflow-hidden rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            @for (column of columns; track column.key) {
              <th
                [style.width]="column.width"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                (click)="column.sortable && onSort(column.key)">
                <div class="flex items-center">
                  <span>{{ column.title }}</span>
                  @if (column.sortable && sortConfig.sortBy === column.key) {
                    @if (sortConfig.sortOrder === 'asc') {
                      <svg
                        class="ml-1 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                      </svg>
                    } @else {
                      <svg
                        class="ml-1 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    }
                  }
                </div>
              </th>
            }
            <!-- Actions column if enabled -->
            @if (showActions) {
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ 'Actions' | translate }}
              </th>
            }
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          @for (item of data; track item.id || $index) {
            <tr class="hover:bg-gray-50">
              @for (column of columns; track column.key) {
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  @switch (column.type) {
                    @case ('text') {
                      {{ item[column.key] }}
                    }
                    @case ('number') {
                      {{ item[column.key] | number:'1.2-2' }}
                    }
                    @case ('date') {
                      {{ item[column.key] | date:'short' }}
                    }
                    @case ('boolean') {
                      <span
                        [class]="'px-2 inline-flex text-xs leading-5 font-semibold rounded-full ' +
                          (item[column.key] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')">
                        {{ item[column.key] ? ('Yes' | translate) : ('No' | translate) }}
                      </span>
                    }
                    @case ('image') {
                      <img
                        [src]="item[column.key] || 'https://placehold.co/40x40'"
                        [alt]="item[column.key]"
                        class="h-10 w-10 rounded-md object-cover">
                    }
                    @case ('custom') {
                      {{ column.format ? column.format(item[column.key]) : item[column.key] }}
                    }
                    @default {
                      {{ item[column.key] }}
                    }
                  }
                </td>
              }

              <!-- Actions column -->
              @if (showActions) {
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  @if (rowActions.length > 0) {
                    @for (action of rowActions; track action.name) {
                      <span
                        class="mr-3"
                        [class.mr-0]="$last">
                        <a
                          [class]="'hover:text-' + action.color + '-700 ' + (action.class || '')"
                          [ngClass]="action.color ? 'text-' + action.color + '-600' : 'text-indigo-600'"
                          (click)="onAction(action.name, item, $index)"
                          href="javascript:void(0)">
                          {{ action.title }}
                        </a>
                      </span>
                    }
                  }
                </td>
              }
            </tr>
          } @empty {
            <tr>
              <td [attr.colspan]="columns.length + (showActions ? 1 : 0)" class="px-6 py-4 text-center text-sm text-gray-500">
                {{ 'No' | translate }} {{ tableName }} {{ 'found' | translate }}.
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-b-lg">
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          (click)="previousPage()"
          [disabled]="paginationConfig.currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ 'Previous' | translate }}
        </button>
        <button
          (click)="nextPage()"
          [disabled]="paginationConfig.currentPage === paginationConfig.totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ 'Next' | translate }}
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div class="flex items-center">
          <span class="text-sm text-gray-700 mr-4">
            {{ 'Showing' | translate }} <span class="font-medium">{{ getStartItemIndex() }}</span> {{ 'to' | translate }}
            <span class="font-medium">{{ getEndItemIndex() }}</span> {{ 'of' | translate }}
            <span class="font-medium">{{ paginationConfig.totalItems }}</span> {{ 'results' | translate }}
          </span>
          <select
            [(ngModel)]="paginationConfig.pageSize"
            (change)="onPageSizeChange()"
            class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            <option [value]="5">5</option>
            <option [value]="10">10</option>
            <option [value]="20">20</option>
            <option [value]="50">50</option>
          </select>
          <span class="ml-2 text-sm text-gray-700">{{ 'per page' | translate }}</span>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              (click)="previousPage()"
              [disabled]="paginationConfig.currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="sr-only">{{ 'Previous' | translate }}</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>

            @for (page of getPageNumbers(); track page) {
              <button
                (click)="goToPage(page)"
                [class]="'relative inline-flex items-center px-4 py-2 border text-sm font-medium ' +
                  (page === paginationConfig.currentPage
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50')">
                {{ page }}
              </button>
            }

            <button
              (click)="nextPage()"
              [disabled]="paginationConfig.currentPage === paginationConfig.totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="sr-only">{{ 'Next' | translate }}</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
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
export class CommonTableComponent implements OnInit {
  languageService = inject(LanguageService);

  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() tableName: string = 'items';
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Input() paginationConfig: PaginationConfig = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  };
  @Input() sortConfig: SortConfig = {
    sortBy: '',
    sortOrder: 'asc'
  };
  @Input() filterConfig: FilterConfig = {
    searchTerm: '',
    filters: {}
  };
  @Input() showActions: boolean = false;
  @Input() rowActions: Array<{
    name: string;
    title: string;
    color?: string;
    class?: string;
  }> = [];

  @Output() sortChange = new EventEmitter<SortConfig>();
  @Output() filterChange = new EventEmitter<FilterConfig>();
  @Output() pageChange = new EventEmitter<PaginationConfig>();
  @Output() action = new EventEmitter<{ name: string; item: any; index: number }>();

  constructor() { }

  ngOnInit(): void {
  }

  onSort(sortBy: string): void {
    if (this.sortConfig.sortBy === sortBy) {
      // Toggle sort direction
      this.sortConfig.sortOrder = this.sortConfig.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // New sort column
      this.sortConfig.sortBy = sortBy;
      this.sortConfig.sortOrder = 'asc';
    }
    this.sortChange.emit(this.sortConfig);
  }

  onSearchChange(event: any): void {
    this.filterConfig.searchTerm = event.target.value;
  }

  onFilter(): void {
    this.filterChange.emit(this.filterConfig);
  }

  previousPage(): void {
    if (this.paginationConfig.currentPage > 1) {
      this.paginationConfig.currentPage--;
      this.pageChange.emit(this.paginationConfig);
    }
  }

  nextPage(): void {
    if (this.paginationConfig.currentPage < this.paginationConfig.totalPages) {
      this.paginationConfig.currentPage++;
      this.pageChange.emit(this.paginationConfig);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.paginationConfig.totalPages && page !== this.paginationConfig.currentPage) {
      this.paginationConfig.currentPage = page;
      this.pageChange.emit(this.paginationConfig);
    }
  }

  onPageSizeChange(): void {
    this.paginationConfig.currentPage = 1; // Reset to first page
    this.pageChange.emit(this.paginationConfig);
  }

  getPageNumbers(): number[] {
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, this.paginationConfig.currentPage - halfVisible);
    let endPage = Math.min(this.paginationConfig.totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if needed to show maxVisiblePages
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getStartItemIndex(): number {
    return (this.paginationConfig.currentPage - 1) * this.paginationConfig.pageSize + 1;
  }

  getEndItemIndex(): number {
    const endIndex = this.paginationConfig.currentPage * this.paginationConfig.pageSize;
    return Math.min(endIndex, this.paginationConfig.totalItems);
  }

  onAction(name: string, item: any, index: number): void {
    this.action.emit({ name, item, index });
  }
}