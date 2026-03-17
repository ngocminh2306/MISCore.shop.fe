import { Component, Output, EventEmitter, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ArticleService } from '../../../public-api/api/article.service';
import { ArticleDto } from '../../../public-api/model/articleDto';

export interface ArticleItem {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedDate: Date;
  imageUrl: string;
}

@Component({
  selector: 'misc-articles-section',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-6 border-b pb-4">
          <h2 class="text-2xl font-bold text-gray-900">Bài viết nổi bật</h2>
          <a routerLink="/tin-tuc" class="text-orange-500 font-medium hover:text-orange-600">Xem tất cả</a>
        </div>

        <!-- Article Grid -->
        @if (loading) {
          <div class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        } @else if (error) {
          <div class="text-center py-8 text-red-600">
            <p>Error loading articles: {{ error }}</p>
          </div>
        } @else if (articles.length === 0) {
          <div class="text-center py-8 text-gray-500">
            <p>Không có bài viết nào</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (article of articles; track article.id) {
              <div
                class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                (click)="onArticleClick(article)">
                <div class="relative">
                  <img
                    [src]="article.imageUrl"
                    [alt]="article.title"
                    class="w-full h-48 object-cover"
                    (error)="onImageError($event)"
                  >
                  <div class="absolute top-3 left-3">
                    <span class="inline-block px-2 py-1 text-xs font-semibold text-orange-700 bg-orange-100 rounded">
                      {{ article.category }}
                    </span>
                  </div>
                </div>
                <div class="p-4">
                  <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
                    {{ article.title }}
                  </h3>
                  <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ article.excerpt }}</p>
                  <div class="flex justify-between items-center text-xs text-gray-500">
                    <span class="font-medium">{{ article.author }}</span>
                    <span>{{ formatDate(article.publishedDate) }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ArticlesSectionComponent {
  @Output() articleSelected = new EventEmitter<ArticleItem>();

  articles: ArticleItem[] = [];
  loading = false;
  error: string | null = null;

  private router = inject(Router);
  private articleService = inject(ArticleService);

  constructor() {
    this.loadArticles();
  }

  private loadArticles(): void {
    this.loading = true;
    this.error = null;

    // Get featured articles from the API
    this.articleService.apiArticleFeaturedGet(6).subscribe({
      next: (response) => {
        const articlesData = response?.data || response;

        if (Array.isArray(articlesData)) {
          this.articles = articlesData.map((apiArticle: ArticleDto) => this.mapToArticleItem(apiArticle));
        } else {
          console.warn('API response is not an array:', articlesData);
          this.articles = [];
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading articles:', error);
        this.error = 'Failed to load articles';
        this.loading = false;
      }
    });
  }

  private mapToArticleItem(apiArticle: ArticleDto): ArticleItem {
    return {
      id: apiArticle.id || 0,
      title: apiArticle.title || 'Untitled Article',
      excerpt: apiArticle.summary || apiArticle.content?.substring(0, 150) || 'No excerpt available',
      category: this.getPrimaryCategory(apiArticle),
      author: apiArticle.authorName || 'Anonymous',
      publishedDate: new Date(apiArticle.publishedAt || apiArticle.createdAt || Date.now()),
      imageUrl: apiArticle.imageUrl || 'https://placehold.co/600x400/e5e7eb/6b7280?text=No+Image'
    };
  }

  private getPrimaryCategory(apiArticle: ArticleDto): string {
    // Try different possible fields for category
    if (apiArticle.articleCategories && apiArticle.articleCategories.length > 0) {
      return apiArticle.articleCategories[0].name || apiArticle.articleCategories[0].slug || 'Uncategorized';
    }
    if (apiArticle.articleType) {
      return apiArticle.articleType;
    }
    return 'Uncategorized';
  }

  onArticleClick(article: ArticleItem): void {
    this.articleSelected.emit(article);
    // Navigate to article details page
    this.router.navigate(['/article', article.id]);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'https://placehold.co/600x400/e5e7eb/6b7280?text=No+Image';
    }
  }
}
