import { Component } from '@angular/core';
import { User } from "../../common/models/api/user.model";
import { AuthenticationService } from "../../common/services/utils/authentication.service";
import { Observable } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public currentUser$: Observable<User | null>;

  constructor(
    private readonly _authenticationService: AuthenticationService
  ) {
    // Get the current user from authentication service
    this.currentUser$ = this._authenticationService.currentUser$();
  }
}
