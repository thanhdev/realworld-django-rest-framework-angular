import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FeedMenuEnum } from "../../../common/models/view/feed.view-model";
import { ArticleService } from "../../../common/services/api/article.service";
import { Article, ArticlesResponse } from "../../../common/models/api/article.model";
import { Observable } from "rxjs";
import { DEFAULT_PROFILE_IMAGE, QUERY_PAGE_SIZE } from "../../../common/constants/default.constant";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent implements OnChanges {
  public readonly DEFAULT_PROFILE_IMAGE =  DEFAULT_PROFILE_IMAGE;
  @Input() feedMenuId?: FeedMenuEnum;

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
  }

  private _queryFeed(pageIndex = 0): void {
    console.log(pageIndex)
    this._constructQueryRequest().subscribe((response:ArticlesResponse) => {
      this.articles = response.articles;
      this.totalPages = Math.ceil(response.articlesCount / QUERY_PAGE_SIZE);
    })
  }

  private _constructQueryRequest(): Observable<ArticlesResponse> {
    const queryParams = {
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
    this._queryFeed(this.activePageIndex);
  }
}
