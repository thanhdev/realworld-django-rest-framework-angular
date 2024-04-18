import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ArticleFormViewModel} from "../../common/models/form/article-form.view-model";
import {CreateArticlePayload} from "../../common/models/api/article.model";
import {ArticleService} from "../../common/services/api/article.service";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent {
  public errors = {};
  public mainForm: FormGroup<ArticleFormViewModel>;
  public displaySuccessMessage = false;

  constructor(
    private readonly _articleService: ArticleService,
  ) {
    this.mainForm = this._constructForm();
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
    let tag = this.mainForm.value.tagInput?.trim();
    if (!tag || this.mainForm.value.tagList!.includes(tag)) {
      this.mainForm.controls.tagInput.reset();
      return;
    }
    this.mainForm.controls.tagList.setValue([...this.mainForm.value.tagList!, tag]);
    this.mainForm.controls.tagInput.reset();
  }

  public removeTag(tag: string) {
    this.mainForm.controls.tagList.setValue(this.mainForm.value.tagList!.filter(t => t !== tag));
  }
}
