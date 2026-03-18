import { Component, OnInit, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FileProcessingService } from '../../../../public-api/api/fileProcessing.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { LanguageService } from '../../../services/language.service';
import { Subscription, interval } from 'rxjs';
import { FileProcessingStatistics } from '../../../../public-api/model/fileProcessingStatistics';
import { FileProcessingTaskResponse } from '../../../../public-api/model/fileProcessingTaskResponse';
import { PaginationConfig, SortConfig, FilterConfig } from '../../../components/common-table/common-table.component';

@Component({
  selector: 'app-admin-file-processing',
  standalone: true,
  imports: [FormsModule, DatePipe, TranslatePipe],
  template: `
    <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">{{ 'File Processing' | translate }}</h1>
        <p class="mt-2 text-gray-600">{{ 'Monitor and manage file processing tasks' | translate }}</p>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- Total Tasks -->
        <div class="bg-white shadow rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">{{ 'Total Tasks' | translate }}</p>
              <p class="text-2xl font-semibold text-gray-900">{{ statistics?.totalTasks ?? 0 }}</p>
            </div>
          </div>
        </div>

        <!-- Pending Tasks -->
        <div class="bg-white shadow rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">{{ 'Pending' | translate }}</p>
              <p class="text-2xl font-semibold text-gray-900">{{ statistics?.pendingTasks ?? 0 }}</p>
            </div>
          </div>
        </div>

        <!-- Processing Tasks -->
        <div class="bg-white shadow rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">{{ 'Processing' | translate }}</p>
              <p class="text-2xl font-semibold text-gray-900">{{ statistics?.processingTasks ?? 0 }}</p>
            </div>
          </div>
        </div>

        <!-- Completed Tasks -->
        <div class="bg-white shadow rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">{{ 'Completed' | translate }}</p>
              <p class="text-2xl font-semibold text-gray-900">{{ statistics?.completedTasks ?? 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Statistics Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <!-- Queued Tasks -->
        <div class="bg-white shadow rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-purple-500 rounded-md p-3">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">{{ 'Queued' | translate }}</p>
              <p class="text-2xl font-semibold text-gray-900">{{ statistics?.queuedTasks ?? 0 }}</p>
            </div>
          </div>
        </div>

        <!-- Failed Tasks -->
        <div class="bg-white shadow rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-red-500 rounded-md p-3">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">{{ 'Failed' | translate }}</p>
              <p class="text-2xl font-semibold text-gray-900">{{ statistics?.failedTasks ?? 0 }}</p>
            </div>
          </div>
        </div>

        <!-- Cancelled Tasks -->
        <div class="bg-white shadow rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-gray-500 rounded-md p-3">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">{{ 'Cancelled' | translate }}</p>
              <p class="text-2xl font-semibold text-gray-900">{{ statistics?.cancelledTasks ?? 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="bg-white shadow rounded-lg p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Status' | translate }}</label>
            <select
              id="status"
              [(ngModel)]="filterConfig.filters['status']"
              (change)="applyFilters()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">{{ 'All Statuses' | translate }}</option>
              <option value="Pending">{{ 'Pending' | translate }}</option>
              <option value="Queued">{{ 'Queued' | translate }}</option>
              <option value="Processing">{{ 'Processing' | translate }}</option>
              <option value="Completed">{{ 'Completed' | translate }}</option>
              <option value="Failed">{{ 'Failed' | translate }}</option>
              <option value="Cancelled">{{ 'Cancelled' | translate }}</option>
            </select>
          </div>
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Search' | translate }}</label>
            <input
              type="text"
              id="search"
              [(ngModel)]="filterConfig.searchTerm"
              (keyup.enter)="applyFilters()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="{{ 'Search by file name or task ID...' | translate }}"
            >
          </div>
          <div class="flex items-end">
            <button (click)="applyFilters()" class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              {{ 'Apply Filters' | translate }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tasks Table -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">{{ 'Processing Tasks' | translate }}</h3>
          
          @if (loading) {
            <div class="flex justify-center items-center py-12">
              <svg class="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="ml-3 text-gray-600">{{ 'Loading tasks...' | translate }}</span>
            </div>
          } @else if (error) {
            <div class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="mt-2 text-red-600">{{ error }}</p>
              <button (click)="loadTasks()" class="mt-4 text-indigo-600 hover:text-indigo-500">{{ 'Retry' | translate }}</button>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Task ID' | translate }}</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'File Name' | translate }}</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Status' | translate }}</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Progress' | translate }}</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Created' | translate }}</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Completed' | translate }}</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'Actions' | translate }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  @for (task of tasks; track task.taskId) {
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{{ task.taskId }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ task.fileName }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span [class]="getStatusClass(task.status)">{{ task.status }}</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            class="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                            [style.width.%]="task.progress ?? 0">
                          </div>
                        </div>
                        <span class="text-xs text-gray-500">{{ task.progress ?? 0 }}%</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ task.createdAt | date:'medium' }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ task.completedAt | date:'medium' }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div class="flex space-x-2">
                          @if (task.status === 'Completed') {
                            <button 
                              (click)="downloadTask(task.taskId!)"
                              class="text-indigo-600 hover:text-indigo-900"
                              title="{{ 'Download' | translate }}">
                              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                          }
                          @if (task.status === 'Failed' || task.status === 'Cancelled') {
                            <button 
                              (click)="retryTask(task.taskId!)"
                              class="text-yellow-600 hover:text-yellow-900"
                              title="{{ 'Retry' | translate }}">
                              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                          }
                          @if (task.status === 'Pending' || task.status === 'Queued' || task.status === 'Processing') {
                            <button 
                              (click)="cancelTask(task.taskId!)"
                              class="text-red-600 hover:text-red-900"
                              title="{{ 'Cancel' | translate }}">
                              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                            </button>
                          }
                        </div>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p class="mt-2">{{ 'No tasks found' | translate }}</p>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            @if (paginationConfig.totalPages > 1) {
              <div class="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
                <div class="flex flex-1 justify-between sm:hidden">
                  <button
                    (click)="goToPage(paginationConfig.currentPage - 1)"
                    [disabled]="paginationConfig.currentPage === 1"
                    class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {{ 'Previous' | translate }}
                  </button>
                  <button
                    (click)="goToPage(paginationConfig.currentPage + 1)"
                    [disabled]="paginationConfig.currentPage === paginationConfig.totalPages"
                    class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {{ 'Next' | translate }}
                  </button>
                </div>
                <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p class="text-sm text-gray-700">
                      {{ 'Showing' | translate }}
                      <span class="font-medium">{{ (paginationConfig.currentPage - 1) * paginationConfig.pageSize + 1 }}</span>
                      {{ 'to' | translate }}
                      <span class="font-medium">{{ Math.min(paginationConfig.currentPage * paginationConfig.pageSize, paginationConfig.totalItems) }}</span>
                      {{ 'of' | translate }}
                      <span class="font-medium">{{ paginationConfig.totalItems }}</span>
                      {{ 'results' | translate }}
                    </p>
                  </div>
                  <div>
                    <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        (click)="goToPage(paginationConfig.currentPage - 1)"
                        [disabled]="paginationConfig.currentPage === 1"
                        class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                      >
                        <span class="sr-only">{{ 'Previous' | translate }}</span>
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                        </svg>
                      </button>
                      @for (page of getPagesArray(); track page) {
                        <button
                          (click)="goToPage(page)"
                          [class.bg-indigo-600]="page === paginationConfig.currentPage"
                          [class.text-white]="page === paginationConfig.currentPage"
                          [class.text-gray-900]="page !== paginationConfig.currentPage"
                          class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        >
                          {{ page }}
                        </button>
                      }
                      <button
                        (click)="goToPage(paginationConfig.currentPage + 1)"
                        [disabled]="paginationConfig.currentPage === paginationConfig.totalPages"
                        class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                      >
                        <span class="sr-only">{{ 'Next' | translate }}</span>
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #f9fafb;
      min-height: calc(100vh - 200px);
    }

    .status-pending,
    .status-queued {
      @apply inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800;
    }

    .status-processing {
      @apply inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800;
    }

    .status-completed {
      @apply inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800;
    }

    .status-failed {
      @apply inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800;
    }

    .status-cancelled {
      @apply inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800;
    }
  `]
})
export class AdminFileProcessingComponent implements OnInit, OnDestroy {
  private fileProcessingService = inject(FileProcessingService);
  languageService = inject(LanguageService);

  statistics: FileProcessingStatistics | null = null;
  tasks: FileProcessingTaskResponse[] = [];
  loading = false;
  error: string | null = null;

  paginationConfig: PaginationConfig = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  };

  sortConfig: SortConfig = {
    sortBy: 'createdAt',
    sortOrder: 'desc'
  };

  filterConfig: FilterConfig = {
    searchTerm: '',
    filters: {
      status: ''
    }
  };

  private refreshSubscription?: Subscription;
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadStatistics();
    this.loadTasks();

    // Auto-refresh every 30 seconds for processing tasks
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.loadStatistics();
      this.loadTasks();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadStatistics(): void {
    this.fileProcessingService.apiFileProcessingStatisticsGet().subscribe({
      next: (response) => {
        this.statistics = response.data || null;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
        this.cdr.markForCheck();
      }
    });
  }

  loadTasks(): void {
    this.loading = true;
    this.error = null;

    const status = this.filterConfig.filters['status'] || undefined;

    this.fileProcessingService.apiFileProcessingTasksGet(
      status,
      this.paginationConfig.currentPage,
      this.paginationConfig.pageSize
    ).subscribe({
      next: (response) => {
        this.tasks = response.data?.items || [];
        this.paginationConfig.totalItems = response.data?.totalItems || 0;
        this.paginationConfig.totalPages = response.data?.totalPages || 0;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.error = this.languageService.getTranslation('Failed to load tasks. Please try again.');
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applyFilters(): void {
    this.paginationConfig.currentPage = 1;
    this.loadTasks();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.paginationConfig.totalPages) {
      return;
    }
    this.paginationConfig.currentPage = page;
    this.loadTasks();
  }

  getPagesArray(): number[] {
    const pages: number[] = [];
    const totalPages = this.paginationConfig.totalPages;
    const currentPage = this.paginationConfig.currentPage;

    // Show at most 5 pages
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    // Adjust if we're at the edges
    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(totalPages, start + 4);
      } else {
        start = Math.max(1, end - 4);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  getStatusClass(status: string | null | undefined): string {
    const statusLower = status?.toLowerCase() || '';
    switch (statusLower) {
      case 'pending':
      case 'queued':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'completed':
        return 'status-completed';
      case 'failed':
        return 'status-failed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  }

  downloadTask(taskId: string): void {
    this.fileProcessingService.apiFileProcessingDownloadTaskIdGet(taskId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `task-${taskId}.zip`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading task:', error);
        alert(this.languageService.getTranslation('Failed to download task result. Please try again.'));
      }
    });
  }

  retryTask(taskId: string): void {
    if (!confirm(this.languageService.getTranslation('Are you sure you want to retry this task?'))) {
      return;
    }

    this.fileProcessingService.apiFileProcessingRetryTaskIdPost(taskId).subscribe({
      next: () => {
        this.loadStatistics();
        this.loadTasks();
      },
      error: (error) => {
        console.error('Error retrying task:', error);
        alert(this.languageService.getTranslation('Failed to retry task. Please try again.'));
      }
    });
  }

  cancelTask(taskId: string): void {
    if (!confirm(this.languageService.getTranslation('Are you sure you want to cancel this task?'))) {
      return;
    }

    this.fileProcessingService.apiFileProcessingCancelTaskIdPost(taskId).subscribe({
      next: () => {
        this.loadStatistics();
        this.loadTasks();
      },
      error: (error) => {
        console.error('Error cancelling task:', error);
        alert(this.languageService.getTranslation('Failed to cancel task. Please try again.'));
      }
    });
  }

  get Math(): Math {
    return Math;
  }
}
