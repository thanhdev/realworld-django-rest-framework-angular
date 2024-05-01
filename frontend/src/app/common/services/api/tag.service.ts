import { Injectable } from '@angular/core';
import { RequestHelperService } from "../utils/request-helper.service";
import { Observable } from "rxjs";
import { TagsResponse } from "../../models/api/tag.model";

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(
    private readonly _requestHelper: RequestHelperService
  ) { }

  public query(): Observable<TagsResponse> {
    return this._requestHelper.get('/tags');
  }
}
