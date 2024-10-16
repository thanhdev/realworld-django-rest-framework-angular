import { Component } from '@angular/core';
import { LoginUserResponse, User } from "../../common/models/api/user.model";
import { AuthenticationService } from "../../common/services/utils/authentication.service";
import { Observable } from "rxjs";
import { UserService } from "../../common/services/api/user.service";
import { DEFAULT_PROFILE_IMAGE } from "../../common/constants/default.constant";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  name: string;
  link: string;
  isActive: boolean;
  icon?: string;
  customDisplay?: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HeaderComponent {
  public currentUser$: Observable<User | null>;

  public menuItems: MenuItem[] = [];
  public readonly defaultProfileImg = DEFAULT_PROFILE_IMAGE;

  constructor(
    private readonly _authenticationService: AuthenticationService,
    private readonly _userService: UserService
  ) {
    // Get the current user from authentication service
    this.currentUser$ = this._authenticationService.currentUser$;

    this._subscribeToUserChanges();
    this._loadCurrentUser();
  }

  private _subscribeToUserChanges(): void {
    this.currentUser$.subscribe((user: User | null) => {
      this._setMenuItems(user);
    });
  }

  private _setMenuItems(user: User | null): void {
    const menuItems: MenuItem[] = [
      { name: 'Home', link: '/', isActive: true }
    ];

    if (user) {
      menuItems.push({ name: 'New Article', link: '/editor', isActive: false, icon: 'ion-compose' });
      menuItems.push({ name: 'Settings', link: '/settings', isActive: false, icon: 'ion-gear-a' });
      menuItems.push({ name: 'Profile', link: '/my-profile', isActive: false, customDisplay: 'Profile' });
    } else {
      menuItems.push({ name: 'Sign in', link: '/login', isActive: false });
      menuItems.push({ name: 'Sign up', link: '/register', isActive: false });
    }

    this.menuItems = menuItems;
  }

  public setActiveMenuItem(menuItemName: string): void {
    this.menuItems.forEach((item: MenuItem) => {
      item.isActive = item.name === menuItemName;
    });
  }

  private _loadCurrentUser(): void {
    if (this._authenticationService.currentUserToken) {
      this._userService.getCurrentUser().subscribe((response: LoginUserResponse) => {
        this._authenticationService.login(response.user);
      });
    }
  }
}
