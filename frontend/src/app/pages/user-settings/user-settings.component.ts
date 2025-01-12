import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { AuthenticationService } from "../../common/services/utils/authentication.service";
import { Router } from "@angular/router";
import { LoginUserResponse, UpdateUserPayload, User } from "../../common/models/api/user.model";
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserProfileFormViewModel } from "../../common/models/form/user-profile-form.view-model";
import { UserService } from "../../common/services/api/user.service";
import { ErrorMessageComponent } from '../../shared/error-message/error-message.component';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ErrorMessageComponent
  ]
})
export class UserSettingsComponent {

  public readonly errors = signal({});
  public readonly displaySuccessMessage = signal(false);
  public mainForm: FormGroup<UserProfileFormViewModel>;

  constructor(
    private readonly _authenticationService: AuthenticationService,
    private readonly _userService: UserService,
    private readonly _router: Router
  ) {
    this.mainForm = this._constructForm();
    this._subscribeToUserChanges();
  }

  private _constructForm(): FormGroup<UserProfileFormViewModel> {
    return new FormGroup(<UserProfileFormViewModel> {
      username: new FormControl<string>('', [Validators.required]),
      email: new FormControl<string>('', [Validators.required, Validators.email]),
      password: new FormControl<string>(''),
      bio: new FormControl<string>(''),
      image: new FormControl<string>('')
    });
  }

  private _subscribeToUserChanges(): void {
    this._authenticationService.currentUser$.subscribe((user) => {
      if (user) {
        this._bindFormData(user);
      }
    });
  }

  private _bindFormData(user: User): void {
    this.mainForm.reset({
      username: user.username,
      email: user.email,
      bio: user.bio,
      image: user.image
    });
  }

  public updateProfile(): void {
    const formValue = this.mainForm.value;

    const payload: UpdateUserPayload = {
      user: {...formValue}
    }

    if (!formValue.password) {
      delete payload.user.password;
    }

    this.errors.set({});

    this._userService.updateUser(payload).subscribe({
      next: (user: LoginUserResponse) => {
        this.displaySuccessMessage.set(true);
        this._authenticationService.login(user.user);
      },
      error: (error) => {
        this.errors.set(error.error.errors);
      }
    });
  }

  public logout(): void {
    this._authenticationService.logout();
    this._router.navigateByUrl('/');
  }
}
