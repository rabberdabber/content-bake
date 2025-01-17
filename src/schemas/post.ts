import { z } from "zod";
import { JSONContent } from "@tiptap/react";

export const postWithContentSchema = z.object({
  id: z.string(),
  title: z.string().min(3, "Title must be at least 3 characters long"),
  content: z.custom<JSONContent>(),
  excerpt: z.string(), // TODO: min(10, "Excerpt must be at least 10 characters long"),
  feature_image_url: z.string().url("Please enter a valid URL").optional(),
  is_published: z.boolean(),
  tag: z.string().optional(),
  author_id: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const postSchema = postWithContentSchema.omit({
  content: true,
});
export const publicPostsSchema = z.object({
  data: postSchema.array(),
  count: z.number(),
});
export type GetPostsResponse = z.infer<typeof publicPostsSchema>;
export type PostWithContentData = z.infer<typeof postWithContentSchema>;
export type PostData = z.infer<typeof postSchema>;
