import { TestBed } from '@angular/core/testing';

import { ProfileService } from './profile.service';
import { RequestHelperService } from "../utils/request-helper.service";
import { of } from "rxjs";

describe('ProfileService', () => {
  let service: ProfileService;

  let spyRequestHelperService: Partial<jasmine.SpyObj<RequestHelperService>>;

  beforeEach(() => {
    spyRequestHelperService = {
      get: jasmine.createSpy(),
      post: jasmine.createSpy(),
      delete: jasmine.createSpy()
    }
    spyRequestHelperService.get!.and.returnValue(of(null));
    spyRequestHelperService.post!.and.returnValue(of(null));
    spyRequestHelperService.delete!.and.returnValue(of(null));
  })

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProfileService,
        { provide: RequestHelperService, useValue: spyRequestHelperService }
      ]
    });
    service = TestBed.inject(ProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getProfile', () => {
    const expectedUsername = 'username';
    service.getProfile(expectedUsername);
    expect(spyRequestHelperService.get).toHaveBeenCalledWith(`/profiles/${ expectedUsername }`);
  });

  it('should call followUser', () => {
    const expectedUsername = 'username';
    service.followUser(expectedUsername);
    expect(spyRequestHelperService.post).toHaveBeenCalledWith(`/profiles/${ expectedUsername }/follow`, null);
  });

  it('should call unfollowUser', () => {
    const expectedUsername = 'username';
    service.unfollowUser(expectedUsername);
    expect(spyRequestHelperService.delete).toHaveBeenCalledWith(`/profiles/${ expectedUsername }/follow`);
  });
});
