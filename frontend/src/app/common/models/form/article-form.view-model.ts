import { FormControl } from "@angular/forms";

export interface ArticleFormViewModel {
  title: FormControl<string>;
  description: FormControl<string>;
  body: FormControl<string>;
  tagList: FormControl<string[]>;
  tagInput: FormControl<string>;
}
