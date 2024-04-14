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
