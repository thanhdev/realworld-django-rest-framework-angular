import { Component } from '@angular/core';
import { AuthenticationService } from "../../common/services/utils/authentication.service";
import { FeedMenu, FeedMenuEnum } from "../../common/models/view/feed.view-model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
  public feedList: FeedMenu[];
  public activeFeed?: FeedMenu;

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

    this.feedList = this.feedList.map(feed => {
      feed.isActive = feed.id === activeFeed.id;
      return feed;
    });
  }
}
