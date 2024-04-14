import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { RequestHelperService } from "../utils/request-helper.service";
import { of } from "rxjs";
import { CreateUserPayload } from "../../models/api/user.model";

describe('UserService', () => {
  let service: UserService;

  let spyRequestHelperService: Partial<jasmine.SpyObj<RequestHelperService>>;

  beforeEach(()=> {
    spyRequestHelperService = {
      post: jasmine.createSpy('post')
    }

    spyRequestHelperService.post!.and.returnValue(of(null));
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
});
