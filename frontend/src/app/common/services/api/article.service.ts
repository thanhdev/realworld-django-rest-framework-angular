import { Injectable } from '@angular/core';
import { RequestHelperService } from "../utils/request-helper.service";
import {
  ArticleResponse,
  ArticlesResponse,
  CreateArticlePayload,
  QueryArticlesParams,
  UpdateArticlePayload
} from "../../models/api/article.model";
import { Observable } from "rxjs";

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

  public getArticle(slug: string): Observable<ArticleResponse> {
    return this._requestHelper.get(`/articles/${slug}`);
  }

  public updateArticle(slug: string, payload: UpdateArticlePayload): Observable<ArticleResponse> {
    return this._requestHelper.put(`/articles/${slug}`, payload);
  }

  public deleteArticle(slug: string): Observable<void> {
    return this._requestHelper.delete(`/articles/${slug}`);
  }

  public queryArticles(params: QueryArticlesParams): Observable<ArticlesResponse> {
    return this._requestHelper.get('/articles', {params});
  }

  public queryFeedArticles(params: QueryArticlesParams): Observable<ArticlesResponse> {
    return this._requestHelper.get('/articles/feed', {params});
  }
}
