import { Component } from '@angular/core';
import { User } from "../../common/models/api/user.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public currentUser?: User;
  public activeRoute = '';
}
