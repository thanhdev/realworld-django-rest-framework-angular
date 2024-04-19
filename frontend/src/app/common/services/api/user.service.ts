import { Injectable } from '@angular/core';
import { RequestHelperService } from "../utils/request-helper.service";
import { CreateUserPayload, LoginUserPayload, LoginUserResponse, UpdateUserPayload } from "../../models/api/user.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private readonly _requestHelper: RequestHelperService
  ) { }

  public registerUser(payload: CreateUserPayload): Observable<void> {
    return this._requestHelper.post('/users', payload);
  }

  public userLogin(payload: LoginUserPayload): Observable<LoginUserResponse> {
    return this._requestHelper.post('/users/login', payload);
  }

  public getCurrentUser(): Observable<LoginUserResponse> {
    return this._requestHelper.get('/user');
  }

  public updateUser(payload: UpdateUserPayload): Observable<LoginUserResponse> {
    return this._requestHelper.put('/user', payload);
  }
}
