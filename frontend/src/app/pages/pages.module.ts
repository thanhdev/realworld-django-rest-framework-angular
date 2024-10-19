import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ArticleComponent } from './article/article.component';
import { ProfileComponent } from './profile/profile.component';
import { MarkdownModule } from "ngx-markdown";
import { ErrorMessageComponent } from '../shared/error-message/error-message.component';
import { EditorComponent } from './editor/editor.component';


@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MarkdownModule.forChild(),
    ErrorMessageComponent,
    EditorComponent,
    ArticleComponent
  ],
  exports: [
    HomeComponent
  ]
})
export class PagesModule { }
