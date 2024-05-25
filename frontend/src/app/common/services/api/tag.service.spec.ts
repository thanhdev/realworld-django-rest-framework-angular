import { TestBed } from '@angular/core/testing';

import { TagService } from './tag.service';
import { RequestHelperService } from "../utils/request-helper.service";
import { of } from "rxjs";

describe('TagService', () => {
  let service: TagService;

  let spyRequestHelperService: Partial<jasmine.SpyObj<RequestHelperService>>;

  beforeEach(()=> {
    spyRequestHelperService = {
      get: jasmine.createSpy('get')
    }
    spyRequestHelperService.get!.and.returnValue(of(null));
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TagService,
        { provide: RequestHelperService, useValue: spyRequestHelperService }
      ]
    });
    service = TestBed.inject(TagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should query tags', ()=> {
    service.query();
    expect(spyRequestHelperService.get).toHaveBeenCalledWith('/tags');
  });
});
