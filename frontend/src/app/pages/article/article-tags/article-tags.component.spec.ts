import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleTagsComponent } from './article-tags.component';
import { TagService } from "../../../common/services/api/tag.service";
import { of } from "rxjs";

describe('ArticleTagsComponent', () => {
  let component: ArticleTagsComponent;
  let fixture: ComponentFixture<ArticleTagsComponent>;

  let spyTagService: Partial<jasmine.SpyObj<TagService>>;

  beforeEach(() => {
    spyTagService = {
      query: jasmine.createSpy('query')
    }
    spyTagService.query?.and.returnValue(of({tags: []}));
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ArticleTagsComponent
      ],
      providers: [
        { provide: TagService, useValue: spyTagService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tags', () => {
    expect(spyTagService.query).toHaveBeenCalledTimes(1);
  });
});
