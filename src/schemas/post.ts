import { JSONContent } from "@tiptap/react";
import { z } from "zod";

// Schema for the post form

const NodeSchema = z.object({
  type: z.string(),
  content: z.array(z.any()).optional(),
});

export const JsonContentSchema = z.object({
  type: z.string(),
  attrs: z.object({}).optional(),
  content: z.array(NodeSchema),
});

export const postFormSchema = z.object({
  author_id: z.string().uuid(),
  slug: z.string(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  tags: z.array(z.string()).max(5, "Tags must be less than 5").optional(),
  excerpt: z
    .string()
    .min(10, "Excerpt must be at least 10 characters")
    .max(500, "Excerpt must be less than 500 characters"),
  feature_image_url: z
    .string()
    .url("Please enter a valid image URL")
    .max(100, "Image URL must be less than 100 characters")
    .optional(),
});

// Existing schemas with updated validation
export const postWithContentSchema = z.object({
  id: z.string().uuid(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  slug: z.string(),
  content: z.custom<JSONContent>(),
  excerpt: z
    .string()
    .min(10, "Excerpt must be at least 10 characters")
    .max(500, "Excerpt must be less than 500 characters"),
  feature_image_url: z
    .string()
    .url("Please enter a valid URL")
    .max(100, "Image URL must be less than 100 characters")
    .optional(),
  is_published: z.boolean(),
  tags: z.array(z.string()).max(5, "Tags must be less than 5").optional(),
  author_id: z.string().uuid(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  author: z
    .object({
      full_name: z.string(),
      email: z.string().email(),
      image_url: z.string().url().optional(),
    })
    .optional(),
});

export const tagResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  post_count: z.number(),
});

export const tagsResponseSchema = z.array(tagResponseSchema);

export const draftFormSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  content: z.custom<JSONContent>(),
  author_id: z.string().uuid(),
  is_published: z.boolean(),
  title: z.string(),
  excerpt: z.string().optional(),
  feature_image_url: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const postSchema = postWithContentSchema.omit({
  content: true,
});

export const draftSchema = draftFormSchema.omit({ content: true });

export const publicPostsSchema = z.object({
  data: postSchema.array(),
  count: z.number(),
});

export const draftPostsSchema = z.object({
  data: draftSchema.extend({ id: z.string() }).array(),
  count: z.number(),
});

export type TagResponse = z.infer<typeof tagResponseSchema>;
export type TagsResponse = z.infer<typeof tagsResponseSchema>;
export type GetPostsResponse = z.infer<typeof publicPostsSchema>;
export type PostWithContentData = z.infer<typeof postWithContentSchema>;
export type PostData = z.infer<typeof postSchema>;
export type PostFormData = z.infer<typeof postFormSchema>;
export type DraftData = z.infer<typeof draftSchema>;
export type DraftWithContentData = z.infer<typeof draftFormSchema>;
export type DraftResponse = DraftWithContentData & { id: string; slug: string };
