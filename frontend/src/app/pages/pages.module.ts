import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { RouterModule } from "@angular/router";
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { EditorComponent } from './editor/editor.component';
import { FeedComponent } from './home/feed/feed.component';
import { ArticleComponent } from './article/article.component';
import { ArticleMetaComponent } from './article/article-meta/article-meta.component';
import { ProfileComponent } from './profile/profile.component';
import { ArticleCommentsComponent } from './article/article-comment/article-comments.component';
import { ArticleTagsComponent } from './article/article-tags/article-tags.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserSettingsComponent,
    EditorComponent,
    FeedComponent,
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
    SharedModule
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    HomeComponent
  ]
})
export class PagesModule { }
