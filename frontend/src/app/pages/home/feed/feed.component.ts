import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FeedMenuEnum } from "../../../common/models/view/feed.view-model";
import { ArticleService } from "../../../common/services/api/article.service";
import { Article, ArticlesResponse, QueryArticlesParams } from "../../../common/models/api/article.model";
import { Observable } from "rxjs";
import { QUERY_PAGE_SIZE } from "../../../common/constants/default.constant";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent implements OnChanges {
  @Input() feedMenuId?: FeedMenuEnum;
  @Input() queryParams?: Partial<QueryArticlesParams> = {};

  public articles: Article[] = [];
  public activePageIndex = 0;
  public totalPages = 0;

  constructor(
    private readonly _articleService: ArticleService
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
    this._constructQueryRequest().subscribe((response:ArticlesResponse) => {
      this.articles = response.articles;
      this.totalPages = Math.ceil(response.articlesCount / QUERY_PAGE_SIZE);
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
}
