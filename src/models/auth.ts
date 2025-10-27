export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  username: string;
  email: string;
  groups: string[];
}
