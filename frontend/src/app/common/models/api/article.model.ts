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
}


export interface ArticleResponse {
  article: Article;
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
  article: {
    title?: string;
    description?: string;
    body?: string;
    tagList?: string[];
  }
}


