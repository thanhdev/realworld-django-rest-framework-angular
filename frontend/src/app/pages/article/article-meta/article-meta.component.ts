import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { DEFAULT_PROFILE_IMAGE } from "../../../common/constants/default.constant";
import { Article } from "../../../common/models/api/article.model";
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-article-meta',
  templateUrl: './article-meta.component.html',
  styleUrl: './article-meta.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    DatePipe
  ]
})
export class ArticleMetaComponent {

  public readonly DEFAULT_PROFILE_IMAGE = DEFAULT_PROFILE_IMAGE;
  @Input({required: true}) article!: Article;
  @Input() enableUserActions = false;
  @Input() enableAuthorActions = false;

  @Output() deleted: EventEmitter<void> = new EventEmitter();
  @Output() favorited: EventEmitter<boolean> = new EventEmitter();
  @Output() followed: EventEmitter<boolean> = new EventEmitter();
}
