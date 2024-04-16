export interface User {
  email: string;
  token: string;
  username: string;
  bio?: string;
  image?: string;
}

export interface CreateUserPayload {
  user: {
    email: string;
    username: string;
    password: string;
  }
}

export interface LoginUserPayload {
  user: {
    email: string;
    password: string;
  }
}

export interface LoginUserResponse {
  user: User;
}

export interface UpdateUserPayload  {
  user: {
    email?: string;
    username?: string;
    bio?: string;
    image?: string;
    password?: string;
  }
}
