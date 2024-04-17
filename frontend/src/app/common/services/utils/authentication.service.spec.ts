import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { User } from "../../models/api/user.model";

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationService
      ]
    });
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and set token to local storage', (done: DoneFn)=> {
    const expectedUser: User = {
      email: 'a@hotmail.com',
      username: 'a',
      token: 'thisIsToken'
    }

    service.login(expectedUser);
    service.currentUser$.subscribe(user => {
      expect(user).toEqual(expectedUser);
      expect(localStorage.getItem('token')).toEqual(expectedUser.token);
      done();
    });
  });

  it('should logout and remove token from local storage', (done: DoneFn)=> {
    service.logout();
    service.currentUser$.subscribe(user => {
      expect(user).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
      done();
    });
  });
});
