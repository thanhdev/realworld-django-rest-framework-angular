import { UserProfile } from "./profile.model";

export interface ArticleComment {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: UserProfile;
}

export interface ArticleCommentsResponse {
  comments: ArticleComment[];
}

export interface CreateArticleCommentPayload {
  comment: {
    body: string;
  };
}

export interface ArticleCommentResponse {
  comment: ArticleComment;
}
