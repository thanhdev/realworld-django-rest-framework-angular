import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginFormViewModel } from "../../common/models/form/authentication-form.view-model";
import { UserService } from "../../common/services/api/user.service";
import { LoginUserPayload, LoginUserResponse } from "../../common/models/api/user.model";
import { HttpErrorResponse } from "@angular/common/http";
import { AuthenticationService } from "../../common/services/utils/authentication.service";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ErrorMessageComponent } from '../../shared/error-message/error-message.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ErrorMessageComponent,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class LoginComponent {
  public errors = signal({});

  public mainForm: FormGroup<LoginFormViewModel>;

  constructor(
    private readonly _userService: UserService,
    private readonly _authenticationService: AuthenticationService,
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute
  ) {
    this.mainForm = this._constructMainForm();
  }

  private _constructMainForm(): FormGroup<LoginFormViewModel> {
    return new FormGroup(<LoginFormViewModel>{
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  public login(): void {
    const payload: LoginUserPayload = {
      user: {
        email: this.mainForm.value.email!,
        password: this.mainForm.value.password!
      }
    };

    this._userService.userLogin(payload).subscribe({
      next: (response: LoginUserResponse) => {
        // If successful, store the user and redirect to the previous page
        this._authenticationService.login(response.user);
        this._router.navigateByUrl(this._activatedRoute.snapshot.queryParams['returnUrl'] || '/');
      },
      error: (err: HttpErrorResponse) => {
        this.errors.set(err.error.errors);
      }
    });
  }
}
