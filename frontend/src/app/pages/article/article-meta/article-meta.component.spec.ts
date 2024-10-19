import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleMetaComponent } from './article-meta.component';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Article } from "../../../common/models/api/article.model";

describe('ArticleMetaComponent', () => {
  let component: ArticleMetaComponent;
  let fixture: ComponentFixture<ArticleMetaComponent>;

  let mockArticle: Article;

  beforeEach(() => {
    mockArticle = {
      slug: 'test',
      title: 'Test',
      description: 'Test',
      body: 'Test',
      tagList: [] as string[],
      favorited: false,
      favoritesCount: 0,
      author: {
        username: 'test',
        bio: 'test',
        image: 'test',
        following: false
      }
    } as Article;
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterModule.forRoot([]),
        ArticleMetaComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleMetaComponent);
    component = fixture.componentInstance;
    component.article = mockArticle;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
