import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesFeedComponent } from './articles-feed.component';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ArticleService } from "../../../common/services/api/article.service";
import { of } from "rxjs";
import { FeedMenuEnum } from "../../../common/models/view/feed.view-model";
import { SimpleChange } from "@angular/core";

describe('ArticlesFeedComponent', () => {
  let component: ArticlesFeedComponent;
  let fixture: ComponentFixture<ArticlesFeedComponent>;

  let spyArticleService: Partial<jasmine.SpyObj<ArticleService>>;

  beforeEach(() => {
    spyArticleService = {
      queryFeedArticles: jasmine.createSpy('queryFeedArticles'),
      queryArticles: jasmine.createSpy('queryArticles')
    };
    spyArticleService.queryFeedArticles!.and.returnValue(of({ articles: [], articlesCount: 0 }));
    spyArticleService.queryArticles!.and.returnValue(of({ articles: [], articlesCount: 0 }));
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterModule.forRoot([
          { path: '', component: ArticlesFeedComponent }
        ]),
        ArticlesFeedComponent
      ],
      providers: [
        { provide: ArticleService, useValue: spyArticleService },
      ]
    })
      .overrideComponent(ArticlesFeedComponent, {
        remove: {
          imports: [RouterModule]
        }
      })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlesFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should query feed articles when feedMenuId changes', () => {
    spyArticleService.queryFeedArticles!.calls.reset();

    component.feedMenuId = FeedMenuEnum.MINE;
    component.ngOnChanges({ feedMenuId: new SimpleChange(null, component.feedMenuId, false) });

    expect(spyArticleService.queryFeedArticles).toHaveBeenCalledTimes(1);
  });

  it('should query articles when queryParams changes', () => {
    spyArticleService.queryArticles!.calls.reset();

    component.queryParams = { tag: 'tag' };
    component.ngOnChanges({ queryParams: new SimpleChange(null, component.queryParams, false) });
    expect(spyArticleService.queryArticles).toHaveBeenCalledTimes(1);
  });
});
