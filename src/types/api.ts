import { JSONContent } from "@tiptap/react";

export interface User {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  full_name: string;
}

export type UserCreate = Omit<User, "id" | "is_active" | "is_superuser"> & {
  password: string;
};

export interface LoginResponse {
  access_token: string;
}

export interface PostPublic {
  id: string;
  feature_image_url?: string;
  title: string;
  tag?: string;
  is_published: boolean;
  excerpt: string;
  created_at: string;
  updated_at: string;
  author_id: string;
}

export interface PostPublicWithContent extends PostPublic {
  content: JSONContent;
}
