import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {RegisterFormViewModel} from "../../common/models/form/authentication-form.view-model";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  public mainForm: FormGroup<RegisterFormViewModel>;
  public errorDisplayed = false;

  constructor() {
    this.mainForm = this._constructRegisterForm();
  }

  private _constructRegisterForm(): FormGroup<RegisterFormViewModel> {
    return new FormGroup(<RegisterFormViewModel>{
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required])
    });
  }
}
