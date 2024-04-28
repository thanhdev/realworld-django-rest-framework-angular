import { Component } from '@angular/core';
import { ArticleService } from "../../../common/services/api/article.service";
import { ArticleComment } from "../../../common/models/api/comment.model";
import { ActivatedRoute, Router, UrlTree } from "@angular/router";
import { AuthenticationService } from "../../../common/services/utils/authentication.service";
import { FormControl } from "@angular/forms";
import { DEFAULT_PROFILE_IMAGE } from "../../../common/constants/default.constant";
import { User } from "../../../common/models/api/user.model";
import { constructLoginUrlTree } from "../../../common/guards/authentication.guard";

@Component({
  selector: 'app-article-comments',
  templateUrl: './article-comments.component.html',
  styleUrl: './article-comments.component.scss'
})
export class ArticleCommentsComponent {
  public readonly DEFAULT_PROFILE_IMAGE = DEFAULT_PROFILE_IMAGE;
  public currentUser?: User;
  public comments: ArticleComment[] = [];
  public newCommentControl = new FormControl('');
  private _articleSlug: string;
  public loginUrlTree: UrlTree;

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _articleService: ArticleService,
    private readonly _authService: AuthenticationService,
    private readonly _router: Router
  ) {
    this._articleSlug = this._activatedRoute.snapshot.params['slug'];
    this.loginUrlTree = constructLoginUrlTree(_router);
    this._loadComments();
    this._getCurrentUser();
  }

  private _loadComments(): void {
    this._articleService.queryArticleComments(this._articleSlug)
      .subscribe((response) => {
        this.comments = response.comments;
      });
  }

  private _getCurrentUser(): void {
    this._authService.currentUser$.subscribe(user => {
      this.currentUser = user || undefined;
    });
  }

  public deleteComment(commentId: number): void {
    this._articleService.deleteArticleComment(this._articleSlug, commentId)
      .subscribe(() => {
        this.comments = this.comments.filter(comment => comment.id !== commentId);
      });
  }

  public addComment(): void {
    const commentBody = this.newCommentControl.value;
    if (!commentBody) return;

    const payload = { comment: { body: commentBody } };

    this._articleService.createArticleComment(this._articleSlug, payload)
      .subscribe((response) => {
        this.comments.unshift(response.comment);
        this.newCommentControl.reset();
      });
  }
}
