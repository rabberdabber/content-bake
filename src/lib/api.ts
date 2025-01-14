import { Post } from "@/types/api";
import axios from "axios";
import { getSession } from "next-auth/react";
import { DEFAULT_IMAGE_GENERATION_CONFIG } from "@/config/image-generation";
import type { ImageGenerationConfig } from "@/config/image-generation";

// Create axios instance with default config
console.log(
  "api -> process.env.NEXT_PUBLIC_API_URL",
  process.env.NEXT_PUBLIC_API_URL
);
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Posts related API calls
// TODO: use zod to validate API responses
export const postsApi = {
  createPost: async (post: Post) => {
    const response = await api.post("/posts/", {
      ...post,
      is_published: true,
    });
    return response.data;
  },

  getPosts: async () => {
    const response = await api.get("/posts/");
    return response.data;
  },

  getPost: async (postId: string) => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  updatePost: async (postId: string, post: Partial<Post>) => {
    const response = await api.put(`/posts/${postId}`, post);
    return response.data;
  },

  deletePost: async (postId: string) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  // For draft functionality
  saveDraft: async (draft: Post) => {
    const response = await api.post("/posts/", {
      ...draft,
      is_published: false,
    });
    return response.data;
  },
};

// Auth related API calls
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const formData = new URLSearchParams();
    formData.append("username", credentials.email);
    formData.append("password", credentials.password);

    const response = await api.post("/login/access-token", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  getUserProfile: async (accessToken: string) => {
    const response = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },
};

// AI related API calls
interface AIImageResponse {
  url: string;
  id: string;
}

export const aiApi = {
  generateContent: async (params: {
    prompt: string;
    style?: string;
    tone?: string;
    include_code?: boolean;
    include_image?: boolean;
  }) => {
    const response = await api.post("/ai/generate-content", params, {
      headers: {
        Accept: "text/event-stream",
      },
      responseType: "stream",
    });
    console.log("response", response);

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data;
  },

  generateImage: async (
    prompt: string,
    config: Partial<ImageGenerationConfig> = {}
  ): Promise<AIImageResponse> => {
    const response = await api.post("/ai/generate-image", {
      prompt,
      width: config.width || DEFAULT_IMAGE_GENERATION_CONFIG.width,
      height: config.height || DEFAULT_IMAGE_GENERATION_CONFIG.height,
      model: config.model || DEFAULT_IMAGE_GENERATION_CONFIG.model,
      promptUpsampling:
        config.promptUpsampling ||
        DEFAULT_IMAGE_GENERATION_CONFIG.promptUpsampling,
      outputFormat:
        config.outputFormat || DEFAULT_IMAGE_GENERATION_CONFIG.outputFormat,
      safetyTolerance:
        config.safetyTolerance ||
        DEFAULT_IMAGE_GENERATION_CONFIG.safetyTolerance,
      raw: config.raw || DEFAULT_IMAGE_GENERATION_CONFIG.raw,
    });
    return response.data;
  },
};

// Image related API calls
export const imageApi = {
  uploadImage: async (
    imageId: string,
    file: File | Blob,
    options: {
      isBlob?: boolean;
    } = {}
  ): Promise<{ url: string }> => {
    const formData = new FormData();

    if (options.isBlob) {
      formData.append("file", file, "generated-image.png");
    } else {
      formData.append("file", file);
    }

    const response = await api.post(`/images/upload/${imageId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Helper function to convert base64/URL to Blob
  urlToBlob: async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  },
};

export const mediaApi = {
  uploadMedia: async (
    type: "image" | "gif" | "video",
    mediaId: string,
    file: File | Blob,
    options: {
      isBlob?: boolean;
    } = {}
  ): Promise<{ url: string }> => {
    const formData = new FormData();

    if (options.isBlob) {
      formData.append("file", file, `${type}-media.${file.type.split("/")[1]}`);
    } else {
      formData.append("file", file);
    }

    const response = await api.post(`/media/upload/${mediaId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Helper function to convert base64/URL to Blob
  urlToBlob: async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  },
};

// Update interceptor to use NextAuth session
api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

export default api;
