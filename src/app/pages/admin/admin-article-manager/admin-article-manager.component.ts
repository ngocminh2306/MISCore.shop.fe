import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { CommonTableComponent, TableColumn } from '../../../components/common-table/common-table.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-admin-article-manager',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule, CommonTableComponent, ConfirmDialogComponent, QuillModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Article Manager</h1>
        <div class="mt-4 flex justify-between items-center">
          <p class="text-gray-600">View and manage articles</p>
          <button
            (click)="openCreateModal()"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Add New Article
          </button>
        </div>
      </div>

      <!-- Articles Table using Common Table Component -->
      <misc-common-table
        [data]="articles"
        [columns]="tableColumns"
        tableName="articles"
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
          filters: { status: statusFilter }
        }"
        [showActions]="true"
        [rowActions]="[
          { name: 'view', title: 'View', color: 'blue' },
          { name: 'edit', title: 'Edit', color: 'indigo' },
          { name: 'delete', title: 'Delete', color: 'red' }
        ]"
        (action)="handleAction($event.name, $event.item)"
        (pageChange)="onPageChange($event)"
        (filterChange)="onFilterChange($event)">
      </misc-common-table>

      <!-- Create/Edit Article Modal -->
      <div *ngIf="showModal && !showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
          <div class="flex justify-between items-center mb-4 p-6 pb-0">
            <h3 class="text-lg font-semibold">
              {{ editingArticle ? 'Edit Article' : 'Create Article' }}
            </h3>
            <button (click)="closeModal()" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="overflow-y-auto flex-grow px-6 pb-2">
            <form (ngSubmit)="editingArticle ? updateArticle() : createArticle()" #articleForm="ngForm">
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      [(ngModel)]="articleFormModel.title"
                      name="title"
                      required
                      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Article title"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      [(ngModel)]="articleFormModel.categoryId"
                      name="categoryId"
                      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select a category</option>
                      <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <select
                    [(ngModel)]="articleFormModel.authorId"
                    name="authorId"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select an author</option>
                    <option *ngFor="let author of authors" [value]="author.id">{{ author.name }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                  <quill-editor
                    [(ngModel)]="articleFormModel.content"
                    name="content"
                    [modules]="quillModules"
                    class="w-full bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Article content"
                    style="height: 200px;">
                  </quill-editor>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                    <textarea
                      [(ngModel)]="articleFormModel.excerpt"
                      name="excerpt"
                      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Article excerpt"
                      rows="3"
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <input
                      type="text"
                      [(ngModel)]="articleFormModel.tags"
                      name="tags"
                      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Comma-separated tags"
                    >
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="text"
                      [(ngModel)]="articleFormModel.imageUrl"
                      name="imageUrl"
                      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Article image URL"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      [(ngModel)]="articleFormModel.status"
                      name="status"
                      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                  <input
                    type="text"
                    [(ngModel)]="articleFormModel.metaTitle"
                    name="metaTitle"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Meta title for SEO"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <textarea
                    [(ngModel)]="articleFormModel.metaDescription"
                    name="metaDescription"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Meta description for SEO"
                    rows="2"
                  ></textarea>
                </div>

                <div class="flex items-center">
                  <input
                    type="checkbox"
                    [(ngModel)]="articleFormModel.isFeatured"
                    name="isFeatured"
                    id="isFeatured"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  >
                  <label for="isFeatured" class="ml-2 block text-sm text-gray-700">Featured Article</label>
                </div>
              </div>
            </form>
          </div>

          <div class="mt-6 flex justify-end space-x-3 p-6 pt-0">
            <button
              type="button"
              (click)="closeModal()"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="!articleForm.form.valid"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ editingArticle ? 'Update Article' : 'Create Article' }}
            </button>
          </div>
        </div>
      </div>

      <!-- View Article Modal -->
      <div *ngIf="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
          <div class="flex justify-between items-center mb-4 p-6 pb-0">
            <h3 class="text-lg font-semibold">View Article</h3>
            <button (click)="closeViewModal()" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="overflow-y-auto flex-grow px-6 pb-2">
            <div class="space-y-4">
              <div>
                <h4 class="text-md font-medium text-gray-700 mb-1">Title</h4>
                <p class="text-gray-900">{{ viewingArticle?.title }}</p>
              </div>

              <div>
                <h4 class="text-md font-medium text-gray-700 mb-1">Category</h4>
                <p class="text-gray-900">{{ viewingArticle?.categoryName || 'N/A' }}</p>
              </div>

              <div>
                <h4 class="text-md font-medium text-gray-700 mb-1">Author</h4>
                <p class="text-gray-900">{{ viewingArticle?.authorName || 'N/A' }}</p>
              </div>

              <div>
                <h4 class="text-md font-medium text-gray-700 mb-1">Status</h4>
                <span class="inline-block px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full">
                  {{ viewingArticle?.status || 'N/A' }}
                </span>
              </div>

              <div>
                <h4 class="text-md font-medium text-gray-700 mb-1">Created At</h4>
                <p class="text-gray-900">{{ viewingArticle?.createdAt | date:'medium' }}</p>
              </div>

              <div>
                <h4 class="text-md font-medium text-gray-700 mb-1">Featured</h4>
                <p class="text-gray-900">{{ viewingArticle?.isFeatured ? 'Yes' : 'No' }}</p>
              </div>

              <div>
                <h4 class="text-md font-medium text-gray-700 mb-1">Image</h4>
                <div class="mt-2" *ngIf="viewingArticle?.imageUrl">
                  <img [src]="viewingArticle.imageUrl" [alt]="viewingArticle.title" class="w-full max-h-64 object-contain rounded border">
                </div>
                <p class="text-gray-900" *ngIf="!viewingArticle?.imageUrl">No image available</p>
              </div>

              <div>
                <h4 class="text-md font-medium text-gray-700 mb-1">Excerpt</h4>
                <p class="text-gray-900">{{ viewingArticle?.excerpt || 'N/A' }}</p>
              </div>

              <div>
                <h4 class="text-md font-medium text-gray-700 mb-1">Tags</h4>
                <p class="text-gray-900">{{ viewingArticle?.tags || 'N/A' }}</p>
              </div>

              <div>
                <h4 class="text-md font-medium text-gray-700 mb-1">Content</h4>
                <div class="text-gray-900 bg-gray-50 p-4 rounded border max-h-64 overflow-y-auto" [innerHTML]="viewingArticle?.content" [style]="{'white-space': 'pre-wrap'}"></div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 class="text-md font-medium text-gray-700 mb-1">Meta Title</h4>
                  <p class="text-gray-900">{{ viewingArticle?.metaTitle || 'N/A' }}</p>
                </div>

                <div>
                  <h4 class="text-md font-medium text-gray-700 mb-1">Meta Description</h4>
                  <p class="text-gray-900">{{ viewingArticle?.metaDescription || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end p-6 pt-0">
            <button
              (click)="closeViewModal()"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Confirm Dialog -->
      <misc-confirm-dialog
        [isOpen]="showConfirmDialog"
        [title]="confirmDialogTitle"
        [message]="confirmDialogMessage"
        [confirmButtonText]="confirmDialogConfirmText"
        [cancelButtonText]="confirmDialogCancelText"
        (confirmed)="onConfirmDelete()"
        (cancelled)="onCancelDelete()">
      </misc-confirm-dialog>
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
export class AdminArticleManagerComponent {
  articles: any[] = [];
  categories: any[] = [];
  authors: any[] = [];
  searchTerm = '';
  statusFilter = '';
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;
  deletingId: number | null = null;
  loading = false;
  error: string | null = null;

  // Article form modal
  showModal = false;
  editingArticle: any = null;
  articleFormModel = {
    title: '',
    categoryId: 0,
    authorId: 0,
    content: '',
    excerpt: '',
    tags: '',
    imageUrl: '',
    status: 'draft',
    isFeatured: false,
    metaTitle: '',
    metaDescription: ''
  };

  // View article modal
  showViewModal = false;
  viewingArticle: any = null;

  // Confirm dialog properties
  showConfirmDialog = false;
  confirmDialogTitle = '';
  confirmDialogMessage = '';
  confirmDialogConfirmText = 'Confirm';
  confirmDialogCancelText = 'Cancel';
  articleToDelete: number | null = null;

  // Quill editor modules configuration
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ]
  };

  // Table configuration
  tableColumns: TableColumn[] = [
    {
      key: 'title',
      title: 'Title',
      sortable: true,
      width: '40%'
    },
    {
      key: 'categoryName',
      title: 'Category',
      sortable: true,
      width: '20%'
    },
    {
      key: 'authorName',
      title: 'Author',
      sortable: true,
      width: '20%'
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      type: 'text',
      width: '20%',
      // badgeConfig: {
      //   draft: { class: 'bg-gray-200 text-gray-800', text: 'Draft' },
      //   published: { class: 'bg-green-200 text-green-800', text: 'Published' },
      //   archived: { class: 'bg-red-200 text-red-800', text: 'Archived' }
      // }
    }
  ];

  constructor(private titleService: Title, private metaService: Meta) {}

  ngOnInit(): void {
    this.titleService.setTitle('Article Manager | Admin Panel');
    this.metaService.updateTag({ name: 'description', content: 'Manage articles in the admin panel. Create, edit, and delete articles with ease.' });
    this.metaService.updateTag({ name: 'keywords', content: 'admin, article management, content management, articles, blog' });
    this.loadArticles();
    this.loadCategories();
    this.loadAuthors();
  }

  loadArticles(): void {
    this.loading = true;
    this.error = null;

    // Simulated API call - replace with actual service call
    setTimeout(() => {
      // Mock data for articles
      const mockArticles = [
        {
          id: 1,
          title: 'Introduction to Angular',
          categoryName: 'Technology',
          authorName: 'John Doe',
          status: 'published',
          createdAt: new Date('2023-01-15'),
          isFeatured: true
        },
        {
          id: 2,
          title: 'Advanced TypeScript Techniques',
          categoryName: 'Programming',
          authorName: 'Jane Smith',
          status: 'draft',
          createdAt: new Date('2023-02-20'),
          isFeatured: false
        },
        {
          id: 3,
          title: 'Building E-commerce Solutions',
          categoryName: 'E-commerce',
          authorName: 'Bob Johnson',
          status: 'published',
          createdAt: new Date('2023-03-10'),
          isFeatured: true
        }
      ];

      // Apply client-side filtering
      let filteredArticles = mockArticles.filter((article: any) => {
        // Apply search filter
        const matchesSearch = !this.searchTerm ||
          article.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          article.categoryName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          article.authorName.toLowerCase().includes(this.searchTerm.toLowerCase());

        // Apply status filter
        const matchesStatus = !this.statusFilter ||
          article.status === this.statusFilter;

        return matchesSearch && matchesStatus;
      });

      // Calculate pagination values
      this.totalCount = filteredArticles.length;
      this.totalPages = Math.ceil(this.totalCount / this.pageSize);

      // Apply client-side pagination
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.articles = filteredArticles.slice(startIndex, endIndex);
      this.loading = false;
    }, 500);
  }

  loadCategories(): void {
    // Simulated API call - replace with actual service call
    setTimeout(() => {
      this.categories = [
        { id: 1, name: 'Technology' },
        { id: 2, name: 'Programming' },
        { id: 3, name: 'E-commerce' },
        { id: 4, name: 'Design' }
      ];
    }, 300);
  }

  loadAuthors(): void {
    // Simulated API call - replace with actual service call
    setTimeout(() => {
      this.authors = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Bob Johnson' }
      ];
    }, 300);
  }

  applyFilters(): void {
    // Reset to first page when applying filters
    this.currentPage = 1;
    this.loadArticles();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadArticles();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadArticles();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadArticles();
    }
  }

  getPageNumbers(): number[] {
    const totalVisiblePages = 5;
    const pages: number[] = [];

    let startPage = Math.max(1, this.currentPage - Math.floor(totalVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + totalVisiblePages - 1);

    // Adjust start page if needed to ensure enough pages are shown
    if (endPage - startPage + 1 < totalVisiblePages) {
      startPage = Math.max(1, endPage - totalVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Improved delete method using confirm dialog
  deleteArticle(id: number): void {
    this.articleToDelete = id;
    this.confirmDialogTitle = 'Delete Article';
    this.confirmDialogMessage = 'Are you sure you want to delete this article? This action cannot be undone.';
    this.confirmDialogConfirmText = 'Delete';
    this.confirmDialogCancelText = 'Cancel';
    this.showConfirmDialog = true;
  }

  getCurrentPageEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalCount);
  }

  // Handle confirm delete
  onConfirmDelete(): void {
    if (this.articleToDelete !== null) {
      this.deletingId = this.articleToDelete; // Set loading state

      // Simulated API call - replace with actual service call
      setTimeout(() => {
        console.log('Article deleted successfully');
        // Reset deletingId
        this.deletingId = null;
        this.articleToDelete = null;
        // Reload articles after deletion
        this.loadArticles();
        this.showConfirmDialog = false;
      }, 500);
    }
  }

  // Handle cancel delete
  onCancelDelete(): void {
    this.showConfirmDialog = false;
    this.articleToDelete = null;
  }

  handleAction(actionName: string, item: any): void {
    switch(actionName) {
      case 'view':
        this.openViewModal(item);
        break;
      case 'edit':
        this.openEditModal(item);
        break;
      case 'delete':
        this.deleteArticle(item.id);
        break;
    }
  }

  onPageChange(pageConfig: any): void {
    this.currentPage = pageConfig.currentPage;
    this.pageSize = pageConfig.pageSize;
    this.loadArticles();
  }

  onFilterChange(filterConfig: any): void {
    this.searchTerm = filterConfig.searchTerm;
    this.statusFilter = filterConfig.filters?.status || '';
    this.currentPage = 1; // Reset to first page when filters change
    this.loadArticles();
  }

  // Modal methods
  openCreateModal(): void {
    this.editingArticle = null;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(article: any): void {
    this.editingArticle = article;
    this.articleFormModel = {
      title: article.title || '',
      categoryId: article.categoryId || null,
      authorId: article.authorId || null,
      content: article.content || '',
      excerpt: article.excerpt || '',
      tags: article.tags || '',
      imageUrl: article.imageUrl || '',
      status: article.status || 'draft',
      isFeatured: article.isFeatured || false,
      metaTitle: article.metaTitle || '',
      metaDescription: article.metaDescription || ''
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingArticle = null;
    this.resetForm();
  }

  openViewModal(article: any): void {
    this.viewingArticle = article;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.viewingArticle = null;
  }

  resetForm(): void {
    this.articleFormModel = {
      title: '',
      categoryId: 0,
      authorId: 0,
      content: '',
      excerpt: '',
      tags: '',
      imageUrl: '',
      status: 'draft',
      isFeatured: false,
      metaTitle: '',
      metaDescription: ''
    };
  }

  // Create article method
  createArticle(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = null;

    // Prepare the request body
    const createDto = {
      ...this.articleFormModel,
      categoryId: this.articleFormModel.categoryId ? parseInt(this.articleFormModel.categoryId.toString()) : null,
      authorId: this.articleFormModel.authorId ? parseInt(this.articleFormModel.authorId.toString()) : null
    };

    // Simulated API call - replace with actual service call
    setTimeout(() => {
      console.log('Article created successfully', createDto);
      this.loading = false;
      this.closeModal();
      this.loadArticles(); // Reload the list
    }, 500);
  }

  // Update article method
  updateArticle(): void {
    if (!this.editingArticle?.id || !this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = null;
    
    // Prepare the request body
    const updateDto = {
      ...this.articleFormModel,
      categoryId: this.articleFormModel.categoryId ? parseInt(this.articleFormModel.categoryId.toString()) : null,
      authorId: this.articleFormModel.authorId ? parseInt(this.articleFormModel.authorId.toString()) : null
    };
    
    // Simulated API call - replace with actual service call
    setTimeout(() => {
      console.log('Article updated successfully', updateDto);
      this.loading = false;
      this.closeModal();
      this.loadArticles(); // Reload the list
    }, 500);
  }

  // Validate form method
  validateForm(): boolean {
    if (!this.articleFormModel.title.trim()) {
      alert('Article title is required');
      return false;
    }
    if (!this.articleFormModel.content.trim()) {
      alert('Article content is required');
      return false;
    }
    return true;
  }
}