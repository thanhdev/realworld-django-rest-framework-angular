import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from "@angular/common/http";
import {map, Observable} from "rxjs";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RequestHelperService {

  constructor(
    private readonly _httpClient: HttpClient
  ) { }

  public get(url: string, params?: Object, options?: any): Observable<any> {
    return this._httpClient.get(this._decorateUrl(url), { params, ...options });
  }

  public post(url: string, body: any, options?: any): Observable<any> {
    return this._httpClient.post(this._decorateUrl(url), body, options);
  }

  public put(url: string, body: any, options?: any): Observable<any> {
    return this._httpClient.put(this._decorateUrl(url), body, options);
  }

  public delete(url: string, options?: any): Observable<any> {
    return this._httpClient.delete(this._decorateUrl(url), options);
  }

  private _decorateUrl(url: string): string {
    return `${environment.apiUrl}${url}`;
  }
}
