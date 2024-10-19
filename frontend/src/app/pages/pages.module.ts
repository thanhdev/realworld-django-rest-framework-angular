import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
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
    HomeComponent,
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
    HomeComponent
  ]
})
export class PagesModule { }
