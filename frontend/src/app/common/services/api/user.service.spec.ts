import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { RequestHelperService } from "../utils/request-helper.service";
import { of } from "rxjs";
import { CreateUserPayload, LoginUserPayload, UpdateUserPayload } from "../../models/api/user.model";

describe('UserService', () => {
  let service: UserService;

  let spyRequestHelperService: Partial<jasmine.SpyObj<RequestHelperService>>;

  beforeEach(()=> {
    spyRequestHelperService = {
      post: jasmine.createSpy('post'),
      get: jasmine.createSpy('get'),
      put: jasmine.createSpy('put')
    }

    spyRequestHelperService.post!.and.returnValue(of(null));
    spyRequestHelperService.get!.and.returnValue(of(null));
    spyRequestHelperService.put!.and.returnValue(of(null));
  })

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: RequestHelperService, useValue: spyRequestHelperService }
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register new user', ()=> {
    const expectedPayload: CreateUserPayload = {
      user: {
        email: 'a@hotmail.com',
        username: 'a',
        password: 'thisIsPassword'
      }
    }
    service.registerUser(expectedPayload);
    expect(spyRequestHelperService.post).toHaveBeenCalledWith('/users', expectedPayload);
  });

  it('should login user', ()=> {
    const expectedPayload: LoginUserPayload = {
      user: {
        email: 'a@hotmail.com',
        password: 'thisIsPassword'
      }
    }

    service.userLogin(expectedPayload);
    expect(spyRequestHelperService.post).toHaveBeenCalledWith('/users/login', expectedPayload);
  });

  it('should get current user', () => {
    service.getCurrentUser();
    expect(spyRequestHelperService.get).toHaveBeenCalledOnceWith('/user');
  });

  it('should update user', ()=> {
    const expectedPayload: UpdateUserPayload = {
      user: {
        email: 'email@example.com',
        username: 'hello',
        image: 'http://localhost/img.png',
        bio: 'short bio',
        password: 'thisIsNewPassword'
      }
    };

    service.updateUser(expectedPayload);
    expect(spyRequestHelperService.put).toHaveBeenCalledOnceWith('/user', expectedPayload)
  });
});
