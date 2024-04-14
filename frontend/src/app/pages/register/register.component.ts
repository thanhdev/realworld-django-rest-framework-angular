import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {RegisterFormViewModel} from "../../common/models/form/authentication-form.view-model";
import {UserService} from "../../common/services/api/user.service";
import {CreateUserPayload} from "../../common/models/api/user.model";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  public mainForm: FormGroup<RegisterFormViewModel>;
  public errorDisplayed = false;
  public successDisplayed = false;

  constructor(
    private readonly _userService: UserService
  ) {
    this.mainForm = this._constructRegisterForm();
  }

  private _constructRegisterForm(): FormGroup<RegisterFormViewModel> {
    return new FormGroup(<RegisterFormViewModel>{
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required])
    });
  }

  public registerUser(): void {
    const formValue = this.mainForm.value;

    const payload: CreateUserPayload = {
      user: {
        email: formValue.email!,
        password: formValue.password!,
        username: formValue.username!
      }
    }
    this._userService.registerUser(payload).subscribe({
      next: () => {
        this.successDisplayed = true;
        this.mainForm.reset();
      },
      error: () => {
        this.errorDisplayed = true;
      }
    });
  }
}
