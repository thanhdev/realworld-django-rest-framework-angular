import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { LoginFormViewModel } from "../../common/models/form/authentication-form.view-model";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public errorDisplayed = false;

  public mainForm: FormGroup<LoginFormViewModel>;

  constructor() {
    this.mainForm = this._constructMainForm();
  }

  private _constructMainForm(): FormGroup<LoginFormViewModel> {
    return new FormGroup(<LoginFormViewModel>{
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }
}
