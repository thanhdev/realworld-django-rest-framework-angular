import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { ProfileService } from "../../common/services/api/profile.service";
import { ActivatedRoute, Router, UrlTree, RouterModule } from '@angular/router';
import { ProfileResponse, UserProfile } from "../../common/models/api/profile.model";
import { AuthenticationService } from "../../common/services/utils/authentication.service";
import { finalize, Observable, switchMap } from "rxjs";
import { DEFAULT_PROFILE_IMAGE } from "../../common/constants/default.constant";
import { QueryArticlesParams } from "../../common/models/api/article.model";
import { FeedMenuEnum } from "../../common/models/view/feed.view-model";
import { constructLoginUrlTree } from "../../common/guards/authentication.guard";
import { ArticlesFeedComponent } from '../article/feed/articles-feed.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  standalone: true,
  imports: [
    ArticlesFeedComponent,
    NgClass,
    RouterModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  public readonly DEFAULT_PROFILE_IMAGE = DEFAULT_PROFILE_IMAGE;
  private readonly _profileUsername: string;

  public profile = signal<UserProfile | null>(null)
  public isLoading = signal(true);
  public profileNotFound = signal(false);

  public isMyProfile = false;

  public feedQueryParams?: QueryArticlesParams;
  public loginUrlTree: UrlTree;

  private _feedMenuType?: FeedMenuEnum;

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _profileService: ProfileService,
    private readonly _authService: AuthenticationService,
    private readonly _router: Router
  ) {
    this._profileUsername = this._activatedRoute.snapshot.params['username'];
    this._feedMenuType = this._activatedRoute.snapshot.data['feedMenu'] || FeedMenuEnum.MINE;
    this.loginUrlTree = constructLoginUrlTree(_router);

    this._loadProfile();
  }

  private _loadProfile(): void {
    this.isLoading.set(true);
    this.profileNotFound.set(false);

    this._constructUserProfileRequest()
      .subscribe({
        next: (profile: ProfileResponse) => {
          this.profile.set(profile.profile);
          this._setupFeedQueryParams();
        },
        error: () => {
          this.profileNotFound.set(true)
        }
      });
  }

  private _constructUserProfileRequest(): Observable<ProfileResponse> {

    return this._authService.currentUser$.pipe(
      switchMap((user) => {
        if (!this._profileUsername || user?.username === this._profileUsername) {
          this.isMyProfile = true;
          return this._profileService.getProfile(user!.username).pipe(finalize(() => this.isLoading.set(false)));
        }

        this.isMyProfile = false;
        return this._profileService.getProfile(this._profileUsername).pipe(finalize(() => this.isLoading.set(false)));
      })
    );
  }

  private _setupFeedQueryParams(): void {
    this.feedQueryParams = {};

    if (this._feedMenuType === FeedMenuEnum.MINE) {
      this.feedQueryParams.author = this.profile()!.username;
    } else if (this._feedMenuType === FeedMenuEnum.FAVORITES) {
      this.feedQueryParams.favorited = this.profile()!.username;
    }
  }

  public follow(): void {
    this._profileService.followUser(this.profile()!.username)
      .subscribe({
        next: (profile: ProfileResponse) => {
          this.profile.set(profile.profile);
        },
        error: () => {
          this._router.navigateByUrl(this.loginUrlTree);
        }
      });
  }

  public unfollow(): void {
    this._profileService.unfollowUser(this.profile()!.username)
      .subscribe({
        next: (profile: ProfileResponse) => {
          this.profile.set(profile.profile);
        },
        error: () => {
          this._router.navigateByUrl(this.loginUrlTree);
        }
      });
  }
}
