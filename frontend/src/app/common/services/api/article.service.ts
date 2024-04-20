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
import {
  ArticleCommentResponse,
  ArticleCommentsResponse,
  CreateArticleCommentPayload
} from "../../models/api/comment.model";

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

  public favoriteArticle(slug: string): Observable<ArticleResponse> {
    return this._requestHelper.post(`/articles/${ slug }/favorite`, null);
  }

  public unfavoriteArticle(slug: string): Observable<ArticleResponse> {
    return this._requestHelper.delete(`/articles/${ slug }/favorite`);
  }

  public queryArticleComments(articleSlug: string): Observable<ArticleCommentsResponse> {
    return this._requestHelper.get(`/articles/${ articleSlug }/comments`);
  }

  public createArticleComment(articleSlug: string, payload: CreateArticleCommentPayload): Observable<ArticleCommentResponse> {
    return this._requestHelper.post(`/articles/${ articleSlug }/comments`, payload);
  }

  public deleteArticleComment(articleSlug: string, commentId: number): Observable<void> {
    return this._requestHelper.delete(`/articles/${ articleSlug }/comments/${ commentId }`);
  }
}
