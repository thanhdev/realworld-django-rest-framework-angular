import { Injectable } from '@angular/core';
import {RequestHelperService} from "../utils/request-helper.service";
import {CreateUserPayload} from "../../models/api/user.model";
import {Observable} from "rxjs";

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
}
