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

export interface Post {
  id: string;
  feature_image_url?: string;
  title: string;
  content: any; // TipTap JSON content
  tag?: string;
  is_published: boolean;
  excerpt: string;
  created_at: string;
  updated_at: string;
  author_id: string;
}

export interface PostResponse extends Post {
  id: string;
  created_at: string;
  updated_at: string;
  author_id: string;
}
