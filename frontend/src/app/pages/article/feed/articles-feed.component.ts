import { Component, Input, OnChanges, SimpleChanges, signal, ChangeDetectionStrategy } from '@angular/core';
import { FeedMenuEnum } from "../../../common/models/view/feed.view-model";
import { ArticleService } from "../../../common/services/api/article.service";
import { Article, ArticleResponse, ArticlesResponse, QueryArticlesParams } from "../../../common/models/api/article.model";
import { finalize, Observable } from "rxjs";
import { QUERY_PAGE_SIZE } from "../../../common/constants/default.constant";
import { Router, RouterModule } from '@angular/router';
import { constructLoginUrlTree } from "../../../common/guards/authentication.guard";
import { CommonModule } from '@angular/common';
import { ArticleMetaComponent } from '../article-meta/article-meta.component';

@Component({
  selector: 'app-articles-feed',
  templateUrl: './articles-feed.component.html',
  styleUrl: './articles-feed.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    ArticleMetaComponent
  ]
})
export class ArticlesFeedComponent implements OnChanges {
  @Input() feedMenuId?: FeedMenuEnum;
  @Input() queryParams?: QueryArticlesParams = {};

  public articles = signal<Article[]>([]);
  public activePageIndex = signal(0);
  public isLoading = signal(true);
  public totalPages = 0;

  constructor(
    private readonly _articleService: ArticleService,
    private readonly _router: Router
  ) {
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['feedMenuId']?.currentValue || changes['queryParams']?.currentValue) {
      this.activePageIndex.set(0);
      this._queryFeed();
    }
  }

  private _queryFeed(): void {
    this.isLoading.set(true);
    this._constructQueryRequest()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((response: ArticlesResponse) => {
        this.totalPages = Math.ceil(response.articlesCount / QUERY_PAGE_SIZE);
        this.articles.set(response.articles);
      })
  }

  private _constructQueryRequest(): Observable<ArticlesResponse> {
    const queryParams = {
      ...this.queryParams,
      limit: QUERY_PAGE_SIZE,
      offset: this.activePageIndex() * QUERY_PAGE_SIZE
    };

    if (this.feedMenuId === FeedMenuEnum.MINE) {
      return this._articleService.queryFeedArticles(queryParams);
    }

    return this._articleService.queryArticles(queryParams);
  }

  public loadPagingData(pageIndex: number): void {
    if (this.activePageIndex() === pageIndex) {
      return;
    }

    this.activePageIndex.set(pageIndex);
    this._queryFeed();
  }

  public toggleArticleFavorite(article: Article): void {
    if (!this.articles()) return;

    if (article.favorited) {
      this._articleService.unfavoriteArticle(article.slug).subscribe({
        next: (response: ArticleResponse) => {
          this._setSingleArticle(response.article);
        },
        error: () => {
          this._router.navigateByUrl(constructLoginUrlTree(this._router));
        }
      });
    } else {
      this._articleService.favoriteArticle(article.slug).subscribe({
        next: (response: ArticleResponse) => {
          this._setSingleArticle(response.article);
        },
        error: () => {
          this._router.navigateByUrl(constructLoginUrlTree(this._router));
        }
      });
    }
  }

  private _setSingleArticle(article: Article): void {
    const articleIndex = this.articles().findIndex((a: Article) => a.slug === article.slug);
    this.articles.update((articles: Article[]) => {
      if (articleIndex > -1) {
        articles[articleIndex] = article;
      }

      return [...articles];
    });
  }
}
