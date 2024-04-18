import {Injectable} from '@angular/core';
import {RequestHelperService} from "../utils/request-helper.service";
import {ArticleResponse, CreateArticlePayload} from "../../models/api/article.model";
import {Observable} from "rxjs";

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

}
