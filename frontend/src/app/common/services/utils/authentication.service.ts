import { Injectable } from '@angular/core';
import { User } from "../../models/api/user.model";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private _currentUser$ = new BehaviorSubject<User | null>(null);

  public currentUser$(): Observable<User | null> {
    return this._currentUser$.asObservable();
  }

  public login(user: User) {
    localStorage.setItem('token', user.token);
    this._currentUser$.next(user);
  }

  public logout() {
    localStorage.removeItem('token');
    this._currentUser$.next(null);
  }
}
