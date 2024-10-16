import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  imports: [HeaderComponent, FooterComponent, RouterModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {

}
