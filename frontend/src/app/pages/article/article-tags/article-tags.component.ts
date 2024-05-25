import { Component, EventEmitter, Output } from '@angular/core';
import { TagService } from "../../../common/services/api/tag.service";

@Component({
  selector: 'app-article-tags',
  templateUrl: './article-tags.component.html',
  styleUrl: './article-tags.component.scss'
})
export class ArticleTagsComponent {
  @Output() tagSelected: EventEmitter<string> = new EventEmitter();

  public tags: string[] = [];

  constructor(
    private readonly _tagService: TagService
  ) {
    this._loadTags();
  }

  private _loadTags(): void {
    this._tagService.query().subscribe(response => {
      this.tags = response.tags;
    });
  }
}
