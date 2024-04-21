import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class RequestHelperService {

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthenticationService
  ) { }

  public get(url: string, queryOptions: any = {}): Observable<any> {
    const options = {
      ...queryOptions,
      headers: this._constructRequestHeaders()
    }

    return this._httpClient.get(this._decorateUrl(url), options);
  }

  public post(url: string, body: any): Observable<any> {
    return this._httpClient.post(this._decorateUrl(url), body, {headers: this._constructRequestHeaders()});
  }

  public put(url: string, body: any): Observable<any> {
    return this._httpClient.put(this._decorateUrl(url), body, {headers: this._constructRequestHeaders()});
  }

  public delete(url: string): Observable<any> {
    return this._httpClient.delete(this._decorateUrl(url), {headers: this._constructRequestHeaders()});
  }

  private _decorateUrl(url: string): string {
    return `${environment.apiUrl}${url}`;
  }

  private _constructRequestHeaders(): HttpHeaders {
    if (!this._authService.currentUserToken) return new HttpHeaders();

    return new HttpHeaders({
      Authorization: `Token ${this._authService.currentUserToken}`
    });
  }
}
