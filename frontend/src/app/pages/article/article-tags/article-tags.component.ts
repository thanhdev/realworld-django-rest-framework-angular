import { Component, EventEmitter, Output, signal, ChangeDetectionStrategy } from '@angular/core';
import { TagService } from "../../../common/services/api/tag.service";
import { TagsResponse } from '../../../common/models/api/tag.model';

@Component({
  selector: 'app-article-tags',
  templateUrl: './article-tags.component.html',
  styleUrl: './article-tags.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleTagsComponent {
  @Output() tagSelected: EventEmitter<string> = new EventEmitter();

  public tags= signal<string[]>([]);

  constructor(
    private readonly _tagService: TagService
  ) {
    this._loadTags();
  }

  private _loadTags(): void {
    this._tagService.query().subscribe((response: TagsResponse) => {
      this.tags.set(response.tags);
    });
  }
}
