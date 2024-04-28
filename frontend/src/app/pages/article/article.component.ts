import { Component } from '@angular/core';
import { Article } from "../../common/models/api/article.model";
import { ArticleService } from "../../common/services/api/article.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../../common/services/utils/authentication.service";
import { ProfileService } from "../../common/services/api/profile.service";
import { constructLoginUrlTree } from "../../common/guards/authentication.guard";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent {
  public article?: Article;

  private _articleSlug: string
  public isArticleOwner = false;

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _articleService: ArticleService,
    private readonly _authService: AuthenticationService,
    private readonly _profileService: ProfileService,
    private readonly _router: Router
  ) {
    this._articleSlug = this._activatedRoute.snapshot.params['slug'];
    this._loadArticle();
  }

  private _loadArticle(): void {
    this._articleService.getArticle(this._articleSlug).subscribe(response => {
      this.article = response.article;
      this._checkArticleOwner();
    });
  }

  private _checkArticleOwner(): void {
    this._authService.currentUser$.subscribe(user => {
      this.isArticleOwner = this.article?.author.username === user?.username;
    });
  }

  public delete(): void {
    if (this.article) {
      this._articleService.deleteArticle(this.article.slug).subscribe(() => {
        this._router.navigateByUrl('/');
      });
    }
  }

  public toggleArticleFavorited(favorited: boolean): void {
    if (!this.article) return;

    if (favorited) {
      this._articleService.favoriteArticle(this.article.slug).subscribe({
        next: response => {
          this.article = response.article;
        },
        error: () => {
          this._router.navigateByUrl(constructLoginUrlTree(this._router));
        }
      });
    } else {
      this._articleService.unfavoriteArticle(this.article.slug).subscribe({
        next: response => {
          this.article = response.article;
        },
        error: () => {
          this._router.navigateByUrl(constructLoginUrlTree(this._router));
        }
      });
    }
  }

  public toggleAuthorFollowed(followed: boolean): void {
    if (!this.article) return;

    if (followed) {
      this._profileService.followUser(this.article.author.username).subscribe({
        next: response => {
          this.article!.author = response.profile;
        },
        error: () => {
          this._router.navigateByUrl(constructLoginUrlTree(this._router));
        }
      });
    } else {
      this._profileService.unfollowUser(this.article.author.username).subscribe({
        next: response => {
          this.article!.author = response.profile;
        },
        error: () => {
          this._router.navigateByUrl(constructLoginUrlTree(this._router));
        }
      });
    }
  }
}
