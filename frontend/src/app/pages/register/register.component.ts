import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RegisterFormViewModel } from "../../common/models/form/authentication-form.view-model";
import { UserService } from "../../common/services/api/user.service";
import { CreateUserPayload } from "../../common/models/api/user.model";
import { HttpErrorResponse } from "@angular/common/http";
import { Router, RouterModule } from '@angular/router';
import { ErrorMessageComponent } from '../../shared/error-message/error-message.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ErrorMessageComponent,
    ReactiveFormsModule,
    RouterModule
  ],
  standalone: true
})
export class RegisterComponent {
  public mainForm: FormGroup<RegisterFormViewModel>;
  public errors = signal({});
  public successDisplayed = signal(false);

  constructor(
    private readonly _userService: UserService,
    private readonly _router: Router
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

    this.errors.set({});

    this._userService.registerUser(payload).subscribe({
      next: () => {
        this.successDisplayed.set(true);

        setTimeout(
          () => {this._router.navigateByUrl('/login');},
          2000
        );
      },
      error: (err: HttpErrorResponse) => {
        this.successDisplayed.set(false);
        this.errors.set(err.error.errors);
      }
    });
  }
}
