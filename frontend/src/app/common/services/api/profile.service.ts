import { Injectable } from '@angular/core';
import { RequestHelperService } from "../utils/request-helper.service";
import { Observable } from "rxjs";
import { ProfileResponse } from "../../models/api/profile.model";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private readonly _requestHelper: RequestHelperService
  ) { }

  public getProfile(username: string): Observable<ProfileResponse> {
    return this._requestHelper.get(`/profiles/${username}`);
  }

  public followUser(username: string): Observable<ProfileResponse> {
    return this._requestHelper.post(`/profiles/${username}/follow`, null);
  }

  public unfollowUser(username: string): Observable<ProfileResponse> {
    return this._requestHelper.delete(`/profiles/${username}/follow`);
  }
}
