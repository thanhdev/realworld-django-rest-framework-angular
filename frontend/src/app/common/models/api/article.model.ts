import { UserProfile } from "./profile.model";
import { QueryPaginationParams } from "./query-pagination.model";

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: UserProfile;
}


export interface ArticleResponse {
  article: Article;
}

export interface QueryArticlesParams extends QueryPaginationParams {
  tag?: string;
  author?: string;
  favorited?: string;
}

export interface ArticlesResponse {
  articles: Article[];
  articlesCount: number;
}

export interface CreateArticlePayload {
  article: {
    title: string;
    description: string;
    body: string;
    tagList: string[];
  }
}

export interface UpdateArticlePayload {
  article: Partial<CreateArticlePayload['article']>
}
