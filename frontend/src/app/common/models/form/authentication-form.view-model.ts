import { FormControl } from "@angular/forms";

export interface LoginFormViewModel {
  email: FormControl<string>;
  password: FormControl<string>;
}

export interface RegisterFormViewModel {
  username: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}
