import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleCommentsComponent } from './article-comments.component';
import { RouterModule } from "@angular/router";
import { AuthenticationService } from "../../../common/services/utils/authentication.service";
import { ArticleService } from "../../../common/services/api/article.service";
import { of } from "rxjs";
import { ArticleComment } from "../../../common/models/api/comment.model";
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ArticleCommentsComponent', () => {
  let component: ArticleCommentsComponent;
  let fixture: ComponentFixture<ArticleCommentsComponent>;

  let spyArticleService: Partial<jasmine.SpyObj<ArticleService>>;

  beforeEach(() => {
    spyArticleService = {
      queryArticleComments: jasmine.createSpy('queryArticleComments'),
      createArticleComment: jasmine.createSpy('createArticleComment'),
      deleteArticleComment: jasmine.createSpy('deleteArticleComment')
    }
    spyArticleService.queryArticleComments?.and.returnValue(of({comments: [], commentsCount: 0}));
    spyArticleService.createArticleComment?.and.returnValue(of({comment: {} as ArticleComment}));
    spyArticleService.deleteArticleComment?.and.returnValue(of(void 0));
  })

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([
          { path: 'article/1', component: ArticleCommentsComponent },
        ]),
        ArticleCommentsComponent
      ],
      providers: [
        AuthenticationService,
        { provide: ArticleService, useValue: spyArticleService }
      ]
    })
      .overrideComponent(ArticleCommentsComponent, {
        remove: {
          imports: [RouterModule]
        },
        add: {
          schemas: [NO_ERRORS_SCHEMA]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(ArticleCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load comments', () => {
    expect(spyArticleService.queryArticleComments).toHaveBeenCalledTimes(1);
  });

  it('should add comment', () => {
    component.newCommentControl.setValue('test');
    component.addComment();
    expect(spyArticleService.createArticleComment).toHaveBeenCalledTimes(1);
  });

  it('should delete comment', () => {
    component.deleteComment(1);
    expect(spyArticleService.deleteArticleComment).toHaveBeenCalledTimes(1);
  });
});
