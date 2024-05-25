import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ArticleFormViewModel } from "../../common/models/form/article-form.view-model";
import { Article, CreateArticlePayload, UpdateArticlePayload } from "../../common/models/api/article.model";
import { ArticleService } from "../../common/services/api/article.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent {
  public errors = {};
  public mainForm: FormGroup<ArticleFormViewModel>;
  public displaySuccessMessage = false;

  private readonly _articleSlug?: string;
  private _article?: Article;

  constructor(
    private readonly _articleService: ArticleService,
    private readonly _activatedRoute: ActivatedRoute
  ) {
    this._articleSlug = this._activatedRoute.snapshot.params['slug'];
    this.mainForm = this._constructForm();
    this._loadArticle();
  }

  private _constructForm(): FormGroup<ArticleFormViewModel> {
    return new FormGroup(<ArticleFormViewModel>{
      title: new FormControl<string>('', [Validators.required]),
      description: new FormControl<string>('', [Validators.required]),
      body: new FormControl<string>('', [Validators.required]),
      tagList: new FormControl<string[]>([]),
      tagInput: new FormControl<string>('')
    });
  }

  private _loadArticle(): void {
    if (!this._articleSlug) {
      return;
    }

    this._articleService.getArticle(this._articleSlug).subscribe(response => {
      this._article = response.article;
      this._bindFormData();
    });
  }

  private _bindFormData(): void {
    if (!this._article) {
      return;
    }

    this.mainForm.reset({
      title: this._article.title,
      description: this._article.description,
      body: this._article.body,
      tagList: this._article.tagList,
      tagInput: ''
    });
  }

  public submitForm(): void {
    this.displaySuccessMessage = false;
    this.errors = {};

    if (this.mainForm.invalid) {
      return;
    }

    const formValue = this.mainForm.value;
    const payload: CreateArticlePayload = {
      article: {
        title: formValue.title!,
        description: formValue.description!,
        body: formValue.body!,
        tagList: formValue.tagList!,
      }
    };

    if (this._articleSlug) {
      this._updateArticle(payload as UpdateArticlePayload);
    } else {
      this._createArticle(payload);
    }
  }

  private _updateArticle(payload: UpdateArticlePayload): void {
    this._articleService.updateArticle(this._articleSlug!, payload).subscribe({
      next: () => {
        this.displaySuccessMessage = true;
      },
      error: (err) => {
        this.errors = err.error.errors;
      }
    });
  }

  private _createArticle(payload: CreateArticlePayload): void {
    this._articleService.createArticle(payload).subscribe({
      next: () => {
        this.displaySuccessMessage = true;
        this.mainForm.reset(this._constructForm().value);
      },
      error: (err) => {
        this.errors = err.error.errors;
      }
    });
  }

  public addTag(): void {
    const tag = this.mainForm.value.tagInput?.trim();
    if (!tag || this.mainForm.value.tagList!.includes(tag)) {
      this.mainForm.controls.tagInput.reset();
      return;
    }
    this.mainForm.controls.tagList.setValue([...this.mainForm.value.tagList!, tag]);
    this.mainForm.controls.tagInput.reset('');
  }

  public removeTag(tag: string) {
    this.mainForm.controls.tagList.setValue(this.mainForm.value.tagList!.filter(t => t !== tag));
  }
}
