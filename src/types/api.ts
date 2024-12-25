export interface User {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  full_name: string;
}

export interface LoginResponse {
  access_token: string;
}
