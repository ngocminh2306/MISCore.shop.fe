import { Component, OnInit, inject, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArticleService } from '../../../public-api';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  article: any = null;
  relatedArticles: any[] = [];
  loading = false;
  loadingRelated = false;
  error: string | null = null;
  currentUrl: string = '';
  
  // Scroll tracking
  scrollProgress = 0;
  showCopyToast = false;

  private articleService = inject(ArticleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private titleService = inject(Title);
  private metaService = inject(Meta);

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
      next: (response: any) => {
        const articleData = response?.data || response;

        if (articleData) {
          this.article = {
            id: articleData.id,
            title: articleData.title || 'Untitled Article',
            content: articleData.content || articleData.description || 'No content available',
            excerpt: articleData.excerpt || articleData.shortDescription || 'No excerpt available',
            category: this.getPrimaryCategory(articleData),
            author: articleData.author || articleData.createdBy || 'Anonymous',
            publishedDate: new Date(articleData.createdAt || articleData.publishedAt || Date.now()),
            imageUrl: articleData.mainImageUrl || articleData.image || 'https://placehold.co/1200x600/e5e7eb/6b7280?text=No+Image',
            tags: this.getArticleTags(articleData)
          };

          // Set page title and meta tags
          this.titleService.setTitle(this.article.title + ' | Blog');
          this.metaService.updateTag({ name: 'description', content: this.article.excerpt });
          this.metaService.updateTag({ name: 'keywords', content: this.article.tags.join(', ') });
        } else {
          this.error = 'Article not found';
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading article:', err);
        this.error = 'Failed to load article';
        this.loading = false;
      }
    });
  }

  loadRelatedArticles(currentArticleId: number): void {
    // Show loading indicator for related articles
    this.loadingRelated = true;

    // Get featured articles as "related" articles
    this.articleService.apiArticleFeaturedGet(3).subscribe({
      next: (response: any) => {
        const articlesData = response?.data || response;

        if (Array.isArray(articlesData)) {
          this.relatedArticles = articlesData
            .filter((article: any) => article.id !== currentArticleId) // Exclude current article
            .slice(0, 3) // Limit to 3 articles
            .map((apiArticle: any) => ({
              id: apiArticle.id,
              title: apiArticle.title || 'Untitled Article',
              category: this.getPrimaryCategory(apiArticle),
              author: apiArticle.author || apiArticle.createdBy || 'Anonymous',
              publishedDate: new Date(apiArticle.createdAt || apiArticle.publishedAt || Date.now()),
              imageUrl: apiArticle.mainImageUrl || apiArticle.image || 'https://placehold.co/600x400/e5e7eb/6b7280?text=No+Image'
            }));
        }

        this.loadingRelated = false;
      },
      error: (err) => {
        console.error('Error loading related articles:', err);
        // Set empty array if there's an error, so the UI doesn't break
        this.relatedArticles = [];
        this.loadingRelated = false;
      }
    });
  }

  private getPrimaryCategory(apiArticle: any): string {
    // Try different possible fields for category
    if (apiArticle.articleCategories && apiArticle.articleCategories.length > 0) {
      return apiArticle.articleCategories[0].name || apiArticle.articleCategories[0].title || 'Uncategorized';
    }
    if (apiArticle.category) {
      return apiArticle.category;
    }
    if (apiArticle.articleType) {
      return apiArticle.articleType;
    }
    return 'Uncategorized';
  }

  private getArticleTags(apiArticle: any): string[] {
    // Get tags from article data
    if (apiArticle.articleTags && Array.isArray(apiArticle.articleTags)) {
      return apiArticle.articleTags.map((tag: any) => tag.name || tag.title || 'untitled').filter((name: string) => name);
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

  onImageError(event: any): void {
    event.target.src = 'https://placehold.co/600x400/e5e7eb/6b7280?text=No+Image';
  }

  navigateToArticle(articleId: string): void {
    this.router.navigate(['/article', articleId]);
  }

  copyLink(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.currentUrl).then(() => {
        this.showCopyToast = true;
        setTimeout(() => {
          this.showCopyToast = false;
        }, 2000);
      });
    }
  }
}