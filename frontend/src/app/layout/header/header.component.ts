import { Component } from '@angular/core';
import { User } from "../../common/models/api/user.model";
import { AuthenticationService } from "../../common/services/utils/authentication.service";
import { Observable } from "rxjs";

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
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public currentUser$: Observable<User | null>;

  public menuItems: MenuItem[] = [];
  public defaultProfileImg = 'https://static.productionready.io/images/smiley-cyrus.jpg';

  constructor(
    private readonly _authenticationService: AuthenticationService
  ) {
    // Get the current user from authentication service
    this.currentUser$ = this._authenticationService.currentUser$();

    this._subscribeToUserChanges();
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
}
