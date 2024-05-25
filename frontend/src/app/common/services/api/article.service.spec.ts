import { TestBed } from '@angular/core/testing';

import { ArticleService } from './article.service';
import { RequestHelperService } from "../utils/request-helper.service";
import { of } from "rxjs";
import { CreateArticlePayload } from "../../models/api/article.model";

describe('ArticleService', () => {
  let service: ArticleService;
  let spyRequestHelperService: Partial<jasmine.SpyObj<RequestHelperService>>;

  beforeEach(()=> {
    spyRequestHelperService = {
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post'),
      put: jasmine.createSpy('put'),
      delete: jasmine.createSpy('delete')
    }
    spyRequestHelperService.get!.and.returnValue(of(null));
    spyRequestHelperService.post!.and.returnValue(of(null));
    spyRequestHelperService.put!.and.returnValue(of(null));
    spyRequestHelperService.delete!.and.returnValue(of(null));
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ArticleService,
        { provide: RequestHelperService, useValue: spyRequestHelperService }
      ]
    });
    service = TestBed.inject(ArticleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create article', ()=> {
    const expectedPayload: CreateArticlePayload = {
      article: {
        title: 'title',
        description: 'description',
        body: 'body',
        tagList: ['tag1', 'tag2']
      }
    }
    service.createArticle(expectedPayload);
    expect(spyRequestHelperService.post).toHaveBeenCalledWith('/articles', expectedPayload);
  });

  it('should get article', ()=> {
    const expectedSlug = 'slug';
    service.getArticle(expectedSlug);
    expect(spyRequestHelperService.get).toHaveBeenCalledWith(`/articles/${expectedSlug}`);
  });

  it('should update article', ()=> {
    const expectedSlug = 'slug';
    const expectedPayload = { article: { title: 'title' } };
    service.updateArticle(expectedSlug, expectedPayload);
    expect(spyRequestHelperService.put).toHaveBeenCalledWith(`/articles/${expectedSlug}`, expectedPayload);
  });

  it('should delete article', ()=> {
    const expectedSlug = 'slug';
    service.deleteArticle(expectedSlug);
    expect(spyRequestHelperService.delete).toHaveBeenCalledWith(`/articles/${expectedSlug}`);
  });

  it('should query articles', ()=> {
    const expectedParams = { tag: 'tag' };
    service.queryArticles(expectedParams);
    expect(spyRequestHelperService.get).toHaveBeenCalledWith('/articles', {params: expectedParams});
  });

  it('should query feed articles', ()=> {
    const expectedParams = { tag: 'tag' };
    service.queryFeedArticles(expectedParams);
    expect(spyRequestHelperService.get).toHaveBeenCalledWith('/articles/feed', {params: expectedParams});
  });

  it('should favorite article', ()=> {
    const expectedSlug = 'slug';
    service.favoriteArticle(expectedSlug);
    expect(spyRequestHelperService.post).toHaveBeenCalledWith(`/articles/${expectedSlug}/favorite`, null);
  });

  it('should unfavorite article', ()=> {
    const expectedSlug = 'slug';
    service.unfavoriteArticle(expectedSlug);
    expect(spyRequestHelperService.delete).toHaveBeenCalledWith(`/articles/${expectedSlug}/favorite`);
  });

  it('should query article comments', ()=> {
    const expectedSlug = 'slug';
    service.queryArticleComments(expectedSlug);
    expect(spyRequestHelperService.get).toHaveBeenCalledWith(`/articles/${expectedSlug}/comments`);
  });

  it('should create article comment', ()=> {
    const expectedSlug = 'slug';
    const expectedPayload = { comment: { body: 'body' } };
    service.createArticleComment(expectedSlug, expectedPayload);
    expect(spyRequestHelperService.post).toHaveBeenCalledWith(`/articles/${expectedSlug}/comments`, expectedPayload);
  });

  it('should delete article comment', ()=> {
    const expectedSlug = 'slug';
    const expectedCommentId = 2;
    service.deleteArticleComment(expectedSlug, expectedCommentId);
    expect(spyRequestHelperService.delete).toHaveBeenCalledWith(`/articles/${expectedSlug}/comments/${expectedCommentId}`);
  });
});
