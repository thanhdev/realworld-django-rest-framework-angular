import { Component } from '@angular/core';
import { AuthenticationService } from "../../common/services/utils/authentication.service";
import { Router } from "@angular/router";
import { User } from "../../common/models/api/user.model";
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent {

  public errors = {};
  public mainForm = new FormGroup({});

  constructor(
    private readonly _authenticationService: AuthenticationService,
    private readonly _router: Router
  ) {
  }

  private _subscribeToUserChanges(): void {
    this._authenticationService.currentUser$.subscribe((user) => {
      if (user) {
        this._bindFormData(user);
      }
    });
  }

  private _bindFormData(user: User): void {

  }

  public logout(): void {
    this._authenticationService.logout();
    this._router.navigateByUrl('/');
  }
}
