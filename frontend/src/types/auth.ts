export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  user: {
    id: number;
    username: string;
    fullName: string;
    roles: string[];
  };
}
