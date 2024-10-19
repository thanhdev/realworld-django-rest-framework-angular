import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { CommonModule } from "@angular/common";
import { AuthenticationService } from "../../common/services/utils/authentication.service";
import { FeedMenuEnum } from "../../common/models/view/feed.view-model";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ArticlesFeedComponent } from '../article/feed/articles-feed.component';
import { ArticleTagsComponent } from '../article/article-tags/article-tags.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HomeComponent
      ],
      providers: [
        AuthenticationService
      ]
    })
      .overrideComponent(HomeComponent, {
        remove: {
          imports: [ArticlesFeedComponent, ArticleTagsComponent]
        },
        add: {
          schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }
      })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set global feed as default active item', () => {
    expect(component.activeFeed()?.id).toBe(FeedMenuEnum.GLOBAL);
  });

  it('should add tag feed and set active', () => {
    const originalFeedList = component.feedList();
    component.setTagsFeed('tag');
    expect(component.feedList().length).toBe(originalFeedList.length + 1);
    expect(component.activeFeed()?.id).toBe(FeedMenuEnum.TAGS);
  });
});
