import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleComponent } from './article.component';
import { CommonModule } from "@angular/common";
import { AuthenticationService } from "../../common/services/utils/authentication.service";
import { ActivatedRoute, ActivatedRouteSnapshot, RouterModule } from "@angular/router";
import { ArticleService } from "../../common/services/api/article.service";
import { of } from "rxjs";
import { Article } from "../../common/models/api/article.model";
import { ProfileService } from "../../common/services/api/profile.service";
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { ArticleCommentsComponent } from './article-comment/article-comments.component';

describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;

  let mockArticle: Article;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let spyArticleService: Partial<jasmine.SpyObj<ArticleService>>;
  let spyProfileService: Partial<jasmine.SpyObj<ProfileService>>;

  beforeEach(()=> {
    mockArticle = {
      slug: '1',
      title: 'title',
      description: 'description',
      body: 'body',
      tagList: [] as string[],
      favorited: false,
      favoritesCount: 0,
      author: {
        username: 'username',
        bio: 'bio',
        image: 'image',
        following: false
      }
    } as Article;

    mockActivatedRoute = {
      snapshot: {
        params: {
          slug: '1'
        }
      } as unknown as ActivatedRouteSnapshot
    }

    spyArticleService = {
      getArticle: jasmine.createSpy('getArticle'),
      deleteArticle: jasmine.createSpy('deleteArticle'),
      favoriteArticle: jasmine.createSpy('favoriteArticle'),
      unfavoriteArticle: jasmine.createSpy('unfavoriteArticle')
    }
    spyArticleService.getArticle!.and.returnValue(of({ article: mockArticle }));
    spyArticleService.deleteArticle!.and.returnValue(of(void 0));
    spyArticleService.favoriteArticle!.and.returnValue(of({ article: mockArticle }));
    spyArticleService.unfavoriteArticle!.and.returnValue(of({ article: mockArticle }));

    spyProfileService = {
      followUser: jasmine.createSpy('followUser'),
      unfollowUser: jasmine.createSpy('unfollowUser')
    }
    spyProfileService.followUser!.and.returnValue(of({ profile: mockArticle.author }));
    spyProfileService.unfollowUser!.and.returnValue(of({ profile: mockArticle.author }));
  })

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterModule.forRoot([
          { path: 'article/1', component: ArticleComponent }
        ]),
        MarkdownModule.forRoot(),
        ArticleComponent
      ],
      providers: [
        AuthenticationService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ArticleService, useValue: spyArticleService },
        { provide: ProfileService, useValue: spyProfileService }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
      .overrideComponent(ArticleComponent, {
        remove: {
          imports: [RouterModule, ArticleCommentsComponent]
        },
        add: {
          schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }
      })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load article', () => {
    expect(spyArticleService.getArticle).toHaveBeenCalledWith('1');
    expect(component.article()).toEqual(mockArticle);
  });

  it('should delete article', () => {
    component.delete();
    expect(spyArticleService.deleteArticle).toHaveBeenCalledWith('1');
  });

  it('should follow user', () => {
    component.toggleAuthorFollowed(true);
    expect(spyProfileService.followUser).toHaveBeenCalledWith('username');
  });

  it('should unfollow user', () => {
    component.toggleAuthorFollowed(false);
    expect(spyProfileService.unfollowUser).toHaveBeenCalledWith('username');
  });

  it('should toggle article favorited', () => {
    component.toggleArticleFavorited(true);
    expect(spyArticleService.favoriteArticle).toHaveBeenCalledWith('1');
  });

  it('should toggle article unfavorited', () => {
    component.toggleArticleFavorited(false);
    expect(spyArticleService.unfavoriteArticle).toHaveBeenCalledWith('1');
  });
});
