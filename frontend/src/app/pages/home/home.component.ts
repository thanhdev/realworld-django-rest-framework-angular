import { Component } from '@angular/core';
import { AuthenticationService } from "../../common/services/utils/authentication.service";
import { FeedMenu, FeedMenuEnum } from "../../common/models/view/feed.view-model";
import { QueryArticlesParams } from "../../common/models/api/article.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
  public feedList: FeedMenu[];
  public activeFeed?: FeedMenu;
  public feedQueryParams?: QueryArticlesParams;

  constructor(
    private readonly _authenticationService: AuthenticationService,
  ) {
    this.feedList = this._constructFeedList();
    this.activeFeed = this.feedList.find(feed => feed.isActive);
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
    this.activeFeed = activeFeed;

    if (activeFeed.id === FeedMenuEnum.TAGS) {
      this.feedQueryParams = { tag: activeFeed.name.slice(1) };
      return;
    }

    this.feedQueryParams = {};
    this.feedList = this.feedList.map(feed => {
      feed.isActive = feed.id === activeFeed.id;
      return feed;
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

    this.feedList = feedList;
  }
}
