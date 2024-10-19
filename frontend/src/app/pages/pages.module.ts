import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { ArticlesFeedComponent } from './article/feed/articles-feed.component';
import { ArticleComponent } from './article/article.component';
import { ArticleMetaComponent } from './article/article-meta/article-meta.component';
import { ProfileComponent } from './profile/profile.component';
import { ArticleCommentsComponent } from './article/article-comment/article-comments.component';
import { ArticleTagsComponent } from './article/article-tags/article-tags.component';
import { MarkdownModule } from "ngx-markdown";
import { ErrorMessageComponent } from '../shared/error-message/error-message.component';
import { EditorComponent } from './editor/editor.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserSettingsComponent,
    ArticlesFeedComponent,
    ArticleComponent,
    ArticleMetaComponent,
    ProfileComponent,
    ArticleCommentsComponent,
    ArticleTagsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MarkdownModule.forChild(),
    ErrorMessageComponent,
    EditorComponent
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    HomeComponent
  ]
})
export class PagesModule { }
