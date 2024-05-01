import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FeedMenuEnum } from "../../../common/models/view/feed.view-model";
import { ArticleService } from "../../../common/services/api/article.service";
import { Article, ArticlesResponse, QueryArticlesParams } from "../../../common/models/api/article.model";
import { finalize, Observable } from "rxjs";
import { QUERY_PAGE_SIZE } from "../../../common/constants/default.constant";
import { Router } from "@angular/router";
import { constructLoginUrlTree } from "../../../common/guards/authentication.guard";

@Component({
  selector: 'app-articles-feed',
  templateUrl: './articles-feed.component.html',
  styleUrl: './articles-feed.component.scss'
})
export class ArticlesFeedComponent implements OnChanges {
  @Input() feedMenuId?: FeedMenuEnum;
  @Input() queryParams?: QueryArticlesParams = {};

  public articles: Article[] = [];
  public activePageIndex = 0;
  public totalPages = 0;
  public isLoading = true;

  constructor(
    private readonly _articleService: ArticleService,
    private readonly _router: Router
  ) {
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['feedMenuId']?.currentValue) {
      this._queryFeed();
    }

    if (changes['queryParams']?.currentValue) {
      this._queryFeed();
    }
  }

  private _queryFeed(): void {
    this.isLoading = true;
    this._constructQueryRequest()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((response:ArticlesResponse) => {
      this.articles = response.articles;
      this.totalPages = Math.ceil(response.articlesCount / QUERY_PAGE_SIZE);
      this.activePageIndex = 0;
    })
  }

  private _constructQueryRequest(): Observable<ArticlesResponse> {
    const queryParams = {
      ...this.queryParams,
      limit: QUERY_PAGE_SIZE,
      offset: this.activePageIndex * QUERY_PAGE_SIZE
    };

    if (this.feedMenuId === FeedMenuEnum.MINE) {
      return this._articleService.queryFeedArticles(queryParams);
    }

    return this._articleService.queryArticles(queryParams);
  }

  public loadPagingData(pageIndex: number): void {
    if (this.activePageIndex === pageIndex) {
      return;
    }

    this.activePageIndex = pageIndex;
    this._queryFeed();
  }

  public toggleArticleFavorite(article: Article): void {
    if (!this.articles) return;

    if (article.favorited) {
      this._articleService.unfavoriteArticle(article.slug).subscribe({
        next: (response) => {
          this._setSingleArticle(response.article);
        },
        error: () => {
          this._router.navigateByUrl(constructLoginUrlTree(this._router));
        }
      });
    } else {
      this._articleService.favoriteArticle(article.slug).subscribe({
        next: (response) => {
          this._setSingleArticle(response.article);
        },
        error: () => {
          this._router.navigateByUrl(constructLoginUrlTree(this._router));
        }
      });
    }
  }

  private _setSingleArticle(article: Article): void {
    const articleIndex = this.articles.findIndex(a => a.slug === article.slug);
    this.articles[articleIndex] = article;
    this.articles = [...this.articles]
  }
}
