import { Component, ChangeDetectionStrategy, signal, computed, Signal } from '@angular/core';
import { AuthenticationService } from "../../common/services/utils/authentication.service";
import { FeedMenu, FeedMenuEnum } from "../../common/models/view/feed.view-model";
import { QueryArticlesParams } from "../../common/models/api/article.model";
import { NgClass } from '@angular/common';
import { ArticlesFeedComponent } from '../article/feed/articles-feed.component';
import { ArticleTagsComponent } from '../article/article-tags/article-tags.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [
    NgClass,
    ArticlesFeedComponent,
    ArticleTagsComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeComponent {
  public feedList = signal<FeedMenu[]>([]);
  public activeFeed: Signal<FeedMenu | undefined>;
  public feedQueryParams = signal<QueryArticlesParams>({});

  constructor(
    private readonly _authenticationService: AuthenticationService,
  ) {
    this.activeFeed = computed(() => this.feedList().find(feed => feed.isActive));
    this.feedList.set(this._constructFeedList());
  }

  private _constructFeedList(): FeedMenu[] {
    if (this._authenticationService.currentUserToken) {
      return [
        { id: FeedMenuEnum.MINE, name: 'My Feed', isActive: false },
        { id: FeedMenuEnum.GLOBAL, name: 'Global Feed', isActive: true }
      ];
    }

    return [
      { id: FeedMenuEnum.GLOBAL, name: 'Global Feed', isActive: true }
    ];
  }

  public setActiveFeed(activeFeed: FeedMenu): void {
    if (activeFeed.id === FeedMenuEnum.TAGS) {
      this.feedQueryParams.set({ tag: activeFeed.name.slice(1) });
    } else {
      this.feedQueryParams.set({});
    }

    this.feedList.update(feedList => {
      return feedList.map(feed => {
        feed.isActive = feed.id === activeFeed.id;
        return feed;
      });
    });
  }

  public setTagsFeed(tag: string): void {
    const feedList = this._constructFeedList().map(feed => {
      feed.isActive = false;
      return feed;
    });
    const tagFeed: FeedMenu = { id: FeedMenuEnum.TAGS, name: `#${ tag }`, isActive: true };
    feedList.push(tagFeed);

    this.setActiveFeed(tagFeed);

    this.feedList.set(feedList);
  }
}
