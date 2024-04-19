import { TestBed } from '@angular/core/testing';

import { RequestHelperService } from './request-helper.service';
import { HttpClient } from "@angular/common/http";

describe('RequestHelperService', () => {
  let service: RequestHelperService;

  let apiTestUrl: string;
  let spyHttpClient: Partial<jasmine.SpyObj<HttpClient>>;

  beforeEach(()=> {
    apiTestUrl = '/apitestUrl';

    spyHttpClient = {
      get: jasmine.createSpy<any>('get'),
      post: jasmine.createSpy<any>('post'),
      put: jasmine.createSpy<any>('put'),
      delete: jasmine.createSpy<any>('delete')
    }
  })

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: spyHttpClient }
      ]
    });
    service = TestBed.inject(RequestHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send get request', ()=> {
    service.get('testUrl');
    expect(spyHttpClient.get).toHaveBeenCalledOnceWith(apiTestUrl, jasmine.objectContaining({headers: jasmine.any(Object)}));
  });

  it('should send post request', ()=> {
    service.post('testUrl', {});
    expect(spyHttpClient.post).toHaveBeenCalledOnceWith(apiTestUrl, {}, jasmine.objectContaining({ headers: jasmine.any(Object) }))
  });

  it('should send put request', ()=> {
    service.put('testUrl', {});
    expect(spyHttpClient.put).toHaveBeenCalledOnceWith(apiTestUrl, {}, jasmine.objectContaining({headers: jasmine.any(Object)}));
  });

  it('should send delete request', ()=> {
    service.delete('testUrl');
    expect(spyHttpClient.delete).toHaveBeenCalledOnceWith(apiTestUrl , jasmine.objectContaining({headers: jasmine.any(Object)}));
  });
});
