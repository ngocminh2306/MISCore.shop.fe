import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ArticleDto } from '../../../../public-api/model/articleDto';
import { CommonTableComponent, TableColumn, PaginationConfig, FilterConfig } from '../../../components/common-table/common-table.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { QuillModule } from 'ngx-quill';
import { Title, Meta } from '@angular/platform-browser';

interface ArticleTableItem extends Omit<ArticleDto, 'createdAt' | 'updatedAt' | 'publishedAt'> {
  id: number;
  title: string;
  categoryName?: string;
  authorName?: string;
  createdAt: Date;
  updatedAt?: Date;
  publishedAt?: Date;
  excerpt?: string;
  tags?: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface CategoryItem {
  id: number;
  name: string;
}

interface AuthorItem {
  id: string;
  name: string;
}

@Component({
  selector: 'app-admin-article-manager',
  standalone: true,
  imports: [FormsModule, DatePipe, CommonTableComponent, ConfirmDialogComponent, QuillModule],
  template: `
    <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        [paginationConfig]="paginationConfig"
        [filterConfig]="filterConfig"
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
      @if (showModal && !showViewModal) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
            <div class="flex justify-between items-center px-6 pt-6 pb-4">
              <h3 class="text-lg font-semibold">
                {{ editingArticle ? 'Edit Article' : 'Create Article' }}
              </h3>
              <button (click)="closeModal()" class="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form (ngSubmit)="editingArticle ? updateArticle() : createArticle()" #articleForm="ngForm" class="flex flex-col flex-grow overflow-hidden">
              <div class="overflow-y-auto flex-grow px-6 pb-4">
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
                        @for (cat of categories; track cat.id) {
                          <option [value]="cat.id">{{ cat.name }}</option>
                        }
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
                      @for (author of authors; track author.id) {
                        <option [value]="author.id">{{ author.name }}</option>
                      }
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
              </div>

              <div class="mt-6 flex justify-end space-x-3 px-6 pb-6">
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
            </form>
          </div>
        </div>
      }

      <!-- View Article Modal -->
      @if (showViewModal) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
            <div class="flex justify-between items-center px-6 pt-6 pb-4">
              <h3 class="text-lg font-semibold">View Article</h3>
              <button (click)="closeViewModal()" class="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="overflow-y-auto flex-grow px-6 pb-4">
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
                  @if (viewingArticle?.imageUrl) {
                    <div class="mt-2">
                      <img [src]="viewingArticle!.imageUrl!" [alt]="viewingArticle?.title || ''" class="w-full max-h-64 object-contain rounded border">
                    </div>
                  } @else {
                    <p class="text-gray-900">No image available</p>
                  }
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

            <div class="mt-6 flex justify-end px-6 pb-6">
              <button
                (click)="closeViewModal()"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      }

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
export class AdminArticleManagerComponent implements OnInit {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private cdr = inject(ChangeDetectorRef);

  articles: ArticleTableItem[] = [];
  categories: CategoryItem[] = [];
  authors: AuthorItem[] = [];
  loading = false;
  error: string | null = null;

  // Pagination configuration
  paginationConfig: PaginationConfig = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  };

  // Filter configuration
  filterConfig: FilterConfig = {
    searchTerm: '',
    filters: {
      status: ''
    }
  };

  // Article form modal
  showModal = false;
  editingArticle: ArticleTableItem | null = null;
  articleFormModel: ArticleFormModel = {
    title: '',
    categoryId: null,
    authorId: null,
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
  viewingArticle: ArticleTableItem | null = null;

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
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
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
      width: '35%'
    },
    {
      key: 'categoryName',
      title: 'Category',
      sortable: true,
      type: 'text',
      width: '20%'
    },
    {
      key: 'authorName',
      title: 'Author',
      sortable: true,
      type: 'text',
      width: '20%'
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      type: 'text',
      width: '15%'
    },
    {
      key: 'createdAt',
      title: 'Created',
      sortable: true,
      type: 'date',
      width: '10%'
    }
  ];

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
      const mockArticles: ArticleTableItem[] = [
        {
          id: 1,
          title: 'Introduction to Angular',
          categoryName: 'Technology',
          authorName: 'John Doe',
          status: 'published',
          createdAt: new Date('2023-01-15'),
          isFeatured: true,
          excerpt: '',
          tags: '',
          imageUrl: '',
          metaTitle: '',
          metaDescription: ''
        },
        {
          id: 2,
          title: 'Advanced TypeScript Techniques',
          categoryName: 'Programming',
          authorName: 'Jane Smith',
          status: 'draft',
          createdAt: new Date('2023-02-20'),
          isFeatured: false,
          excerpt: '',
          tags: '',
          imageUrl: '',
          metaTitle: '',
          metaDescription: ''
        },
        {
          id: 3,
          title: 'Building E-commerce Solutions',
          categoryName: 'E-commerce',
          authorName: 'Bob Johnson',
          status: 'published',
          createdAt: new Date('2023-03-10'),
          isFeatured: true,
          excerpt: '',
          tags: '',
          imageUrl: '',
          metaTitle: '',
          metaDescription: ''
        }
      ];

      // Apply client-side filtering
      const filteredArticles = this.applyFilters(mockArticles);

      // Update pagination
      this.paginationConfig.totalItems = filteredArticles.length;
      this.paginationConfig.totalPages = Math.ceil(filteredArticles.length / this.paginationConfig.pageSize);

      // Apply client-side pagination
      const startIndex = (this.paginationConfig.currentPage - 1) * this.paginationConfig.pageSize;
      const endIndex = startIndex + this.paginationConfig.pageSize;
      this.articles = filteredArticles.slice(startIndex, endIndex);
      this.loading = false;
      this.cdr.detectChanges();
    }, 500);
  }

  private applyFilters(articles: ArticleTableItem[]): ArticleTableItem[] {
    return articles.filter((article) => {
      // Apply search filter
      const matchesSearch = !this.filterConfig.searchTerm ||
        article.title?.toLowerCase().includes(this.filterConfig.searchTerm.toLowerCase()) ||
        article.categoryName?.toLowerCase().includes(this.filterConfig.searchTerm.toLowerCase()) ||
        article.authorName?.toLowerCase().includes(this.filterConfig.searchTerm.toLowerCase());

      // Apply status filter
      const statusFilter = this.filterConfig.filters['status'];
      const matchesStatus = !statusFilter || article.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
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
      this.cdr.detectChanges();
    }, 300);
  }

  loadAuthors(): void {
    // Simulated API call - replace with actual service call
    setTimeout(() => {
      this.authors = [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' },
        { id: '3', name: 'Bob Johnson' }
      ];
      this.cdr.detectChanges();
    }, 300);
  }

  handleAction(actionName: string, item: ArticleTableItem): void {
    switch (actionName) {
      case 'view':
        this.openViewModal(item);
        break;
      case 'edit':
        this.openEditModal(item);
        break;
      case 'delete':
        if (item.id) {
          this.deleteArticle(item.id);
        }
        break;
    }
  }

  onPageChange(pageConfig: PaginationConfig): void {
    this.paginationConfig = pageConfig;
    this.loadArticles();
  }

  onFilterChange(filterConfig: FilterConfig): void {
    this.filterConfig = filterConfig;
    this.paginationConfig.currentPage = 1;
    this.loadArticles();
  }

  // Delete methods
  deleteArticle(id: number): void {
    this.articleToDelete = id;
    this.confirmDialogTitle = 'Delete Article';
    this.confirmDialogMessage = 'Are you sure you want to delete this article? This action cannot be undone.';
    this.confirmDialogConfirmText = 'Delete';
    this.confirmDialogCancelText = 'Cancel';
    this.showConfirmDialog = true;
  }

  onConfirmDelete(): void {
    if (this.articleToDelete !== null) {
      // Simulated API call - replace with actual service call
      setTimeout(() => {
        console.log('Article deleted successfully');
        this.articleToDelete = null;
        this.showConfirmDialog = false;
        this.loadArticles();
      }, 500);
    }
  }

  onCancelDelete(): void {
    this.showConfirmDialog = false;
    this.articleToDelete = null;
  }

  // Modal methods
  openCreateModal(): void {
    this.editingArticle = null;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(article: ArticleTableItem): void {
    this.editingArticle = article;
    this.articleFormModel = {
      title: article.title || '',
      categoryId: article.id ? article.id : null,
      authorId: null,
      content: article.content || '',
      excerpt: article.excerpt || '',
      tags: article.tags || '',
      imageUrl: article.imageUrl || '',
      status: article.status || 'draft',
      isFeatured: article.isFeatured ?? false,
      metaTitle: article.seoTitle || '',
      metaDescription: article.seoDescription || ''
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingArticle = null;
    this.resetForm();
  }

  openViewModal(article: ArticleTableItem): void {
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
      categoryId: null,
      authorId: null,
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
      this.loadArticles();
      this.cdr.detectChanges();
    }, 500);
  }

  // Update article method
  updateArticle(): void {
    if (!this.editingArticle?.id || !this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = null;

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
      this.loadArticles();
      this.cdr.detectChanges();
    }, 500);
  }

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

interface ArticleFormModel {
  title: string;
  categoryId: number | null;
  authorId: number | null;
  content: string;
  excerpt: string;
  tags: string;
  imageUrl: string;
  status: string;
  isFeatured: boolean;
  metaTitle: string;
  metaDescription: string;
}
