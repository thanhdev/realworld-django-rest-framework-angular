import { Component, EventEmitter, Output } from '@angular/core';
import { ArticleService } from "../../../common/services/api/article.service";

@Component({
  selector: 'app-article-tags',
  templateUrl: './article-tags.component.html',
  styleUrl: './article-tags.component.scss'
})
export class ArticleTagsComponent {
  @Output() tagSelected: EventEmitter<string> = new EventEmitter();

  public tags: string[] = [];

  constructor(
    private readonly _articleService: ArticleService
  ) {
    this._loadTags();
  }

  private _loadTags(): void {
    this._articleService.queryTags().subscribe(response => {
      this.tags = response.tags;
    });
  }
}
