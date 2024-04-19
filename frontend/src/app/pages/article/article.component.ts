import { Component } from '@angular/core';
import { Article } from "../../common/models/api/article.model";
import { ArticleService } from "../../common/services/api/article.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../../common/services/utils/authentication.service";

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
}
