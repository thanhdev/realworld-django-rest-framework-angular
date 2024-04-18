import {Injectable} from '@angular/core';
import {RequestHelperService} from "../utils/request-helper.service";
import {
  ArticleResponse,
  ArticlesResponse,
  CreateArticlePayload,
  QueryArticlesParams
} from "../../models/api/article.model";
import {Observable} from "rxjs";
import { QueryPaginationParams } from "../../models/api/query-pagination.model";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(
    private readonly _requestHelper: RequestHelperService
  ) { }

  public createArticle(payload: CreateArticlePayload): Observable<ArticleResponse> {
    return this._requestHelper.post('/articles', payload);
  }

  public queryArticles(params: QueryArticlesParams): Observable<ArticlesResponse> {
    return this._requestHelper.get('/articles', {params});
  }

  public queryFeedArticles(params: QueryPaginationParams): Observable<ArticlesResponse> {
    return this._requestHelper.get('/articles/feed', {params});
  }
}
