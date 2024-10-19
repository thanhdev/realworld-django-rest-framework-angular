import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorComponent } from './editor.component';
import { CommonModule } from "@angular/common";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ArticleService } from "../../common/services/api/article.service";
import { Article } from "../../common/models/api/article.model";
import { of } from "rxjs";
import { ReactiveFormsModule } from "@angular/forms";
import { ErrorMessageComponent } from '../../shared/error-message/error-message.component';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockArticle: Article;
  let spyArticleService: Partial<jasmine.SpyObj<ArticleService>>;

  beforeEach(() => {
    mockActivatedRoute = {
      snapshot: {
        params: {
          slug: 'slug'
        }
      } as unknown as ActivatedRouteSnapshot
    };

    mockArticle = {
      title: 'title',
      slug: 'slug',
      description: 'description',
      body: 'body',
      tagList: ['tag1', 'tag2']
    } as Article;

    spyArticleService = {
      getArticle: jasmine.createSpy('getArticle'),
      updateArticle: jasmine.createSpy('updateArticle')
    }
    spyArticleService.getArticle!.and.returnValue(of({ article: mockArticle }));
    spyArticleService.updateArticle!.and.returnValue(of({ article: mockArticle }));
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ErrorMessageComponent,
        CommonModule,
        ReactiveFormsModule,
        EditorComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ArticleService, useValue: spyArticleService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should construct editor form', () => {
    expect(component.mainForm).toBeTruthy();
  });

  it('should load article and bind form data', () => {
    expect(spyArticleService.getArticle).toHaveBeenCalledWith('slug');
    expect(component.mainForm.value).toEqual({
      title: 'title',
      description: 'description',
      body: 'body',
      tagList: ['tag1', 'tag2'],
      tagInput: ''
    });
  });

  it('should add tag', () => {
    component.mainForm.controls.tagInput.setValue('tag3');
    component.addTag();
    expect(component.mainForm.value.tagList).toEqual(['tag1', 'tag2', 'tag3']);
    expect(component.mainForm.value.tagInput).toEqual('');
  });

  it('should remove tag', ()=> {
    component.mainForm.controls.tagList.setValue(['tag1', 'tag2', 'tag3']);
    component.removeTag('tag2');
    expect(component.mainForm.value.tagList).toEqual(['tag1', 'tag3']);
  });

  it('should update article', ()=> {
    component.submitForm();
    expect(spyArticleService.updateArticle).toHaveBeenCalledOnceWith(mockArticle.slug, jasmine.any(Object));
    expect(component.displaySuccessMessage()).toBeTrue();
    expect(component.errors()).toEqual({});
  });
});
