import { z } from "zod";

// Schema for the post form
export const postFormSchema = z.object({
  author_id: z.string().uuid(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  tag: z.string().max(50, "Tag must be less than 50 characters").optional(),
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
  content: z.object({}),
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
  tag: z.string().max(50, "Tag must be less than 50 characters").optional(),
  author_id: z.string().uuid(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const draftFormSchema = postWithContentSchema.pick({
  content: true,
  author_id: true,
  is_published: true,
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
export type GetPostsResponse = z.infer<typeof publicPostsSchema>;
export type PostWithContentData = z.infer<typeof postWithContentSchema>;
export type PostData = z.infer<typeof postSchema>;
export type PostFormData = z.infer<typeof postFormSchema>;
export type DraftData = z.infer<typeof draftSchema>;
export type DraftWithContentData = z.infer<typeof draftFormSchema>;
