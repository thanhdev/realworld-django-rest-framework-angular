import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout.component';
import { RouterLink, RouterOutlet } from "@angular/router";
import { FooterComponent } from './footer/footer.component';



@NgModule({
  declarations: [
    HeaderComponent,
    LayoutComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink
  ],
  exports: [
    LayoutComponent
  ]
})
export class LayoutModule { }
