import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ArticleService, ArticleDto } from '../../../public-api';

interface ArticleItem {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  publishedDate: Date;
  imageUrl: string;
  tags: string[];
}

interface RelatedArticleItem {
  id: number;
  title: string;
  category: string;
  author: string;
  publishedDate: Date;
  imageUrl: string;
}

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  article: ArticleItem | null = null;
  relatedArticles: RelatedArticleItem[] = [];
  loading = false;
  loadingRelated = false;
  error: string | null = null;
  currentUrl = '';

  // Scroll tracking
  scrollProgress = 0;
  showCopyToast = false;

  private articleService = inject(ArticleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    const articleId = this.route.snapshot.paramMap.get('id');
    if (articleId) {
      this.loadArticle(Number(articleId));
      this.loadRelatedArticles(Number(articleId));
    }

    // Set current URL for sharing
    if (typeof window !== 'undefined') {
      this.currentUrl = window.location.href;
    }
  }

  loadArticle(articleId: number): void {
    this.loading = true;
    this.error = null;

    this.articleService.apiArticleIdGet(articleId).subscribe({
      next: (response) => {
        // Extract article data from response wrapper if needed
        const articleData = response?.data || response;

        if (articleData && typeof articleData === 'object' && 'id' in articleData) {
          const article = articleData as ArticleDto;
          this.article = {
            id: article.id || 0,
            title: article.title || 'Untitled Article',
            content: article.content || article.summary || 'No content available',
            excerpt: article.summary || article.content?.substring(0, 150) || 'No excerpt available',
            category: this.getPrimaryCategory(article),
            author: article.authorName || 'Anonymous',
            publishedDate: new Date(article.publishedAt || article.createdAt || Date.now()),
            imageUrl: article.imageUrl || 'https://placehold.co/1200x600/e5e7eb/6b7280?text=No+Image',
            tags: this.getArticleTags(article)
          };

          // Set page title and meta tags
          this.titleService.setTitle(this.article.title + ' | Blog');
          this.metaService.updateTag({ name: 'description', content: this.article.excerpt });
          this.metaService.updateTag({ name: 'keywords', content: this.article.tags.join(', ') });
        } else {
          this.error = 'Article not found';
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading article:', err);
        this.error = 'Failed to load article';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadRelatedArticles(currentArticleId: number): void {
    this.loadingRelated = true;

    this.articleService.apiArticleFeaturedGet(3).subscribe({
      next: (response) => {
        const articlesData = response?.data || response;

        if (Array.isArray(articlesData)) {
          this.relatedArticles = articlesData
            .filter((article) => article && typeof article === 'object' && 'id' in article && article.id !== currentArticleId)
            .slice(0, 3)
            .map((apiArticle) => {
              const article = apiArticle as ArticleDto;
              return {
                id: article.id || 0,
                title: article.title || 'Untitled Article',
                category: this.getPrimaryCategory(article),
                author: article.authorName || 'Anonymous',
                publishedDate: new Date(article.publishedAt || article.createdAt || Date.now()),
                imageUrl: article.imageUrl || 'https://placehold.co/600x400/e5e7eb/6b7280?text=No+Image'
              };
            });
        }

        this.loadingRelated = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading related articles:', err);
        this.relatedArticles = [];
        this.loadingRelated = false;
        this.cdr.detectChanges();
      }
    });
  }

  private getPrimaryCategory(apiArticle: ArticleDto): string {
    if (apiArticle.articleCategories && apiArticle.articleCategories.length > 0) {
      return apiArticle.articleCategories[0].name || apiArticle.articleCategories[0].slug || 'Uncategorized';
    }
    if (apiArticle.articleType) {
      return apiArticle.articleType;
    }
    return 'Uncategorized';
  }

  private getArticleTags(apiArticle: ArticleDto): string[] {
    if (apiArticle.articleTags && Array.isArray(apiArticle.articleTags)) {
      return apiArticle.articleTags
        .map((tag) => tag.name || tag.slug || 'untitled')
        .filter((name): name is string => !!name);
    }
    return [];
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getInitials(name: string | undefined): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'https://placehold.co/600x400/e5e7eb/6b7280?text=No+Image';
    }
  }

  navigateToArticle(articleId: number): void {
    this.router.navigate(['/article', articleId]);
  }

  copyLink(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.currentUrl).then(() => {
        this.showCopyToast = true;
        setTimeout(() => {
          this.showCopyToast = false;
        }, 2000);
        this.cdr.detectChanges();
      });
    }
  }
}
