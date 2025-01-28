import { z } from "zod";
import {
  PostFormData,
  postFormSchema,
  postWithContentSchema,
} from "@/schemas/post";
import { JSONContent } from "@tiptap/react";

export const validatePost = async (
  data: PostFormData & { content: JSONContent; is_published: boolean }
) => {
  try {
    const validationSchema = postFormSchema;

    await validationSchema.parseAsync({
      title: data.title,
      tags: data.tags,
      excerpt: data.excerpt,
      feature_image_url: data.feature_image_url,
      author_id: data.author_id,
      slug: data.slug,
    });

    const contentSchema = postWithContentSchema;

    await contentSchema
      .omit({
        id: true,
        author_id: true,
        created_at: true,
        updated_at: true,
      })
      .parseAsync({
        ...data,
        tags: data.tags as string[],
        is_published: data.is_published,
        content: data.content as JSONContent,
      });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
    }
    throw error;
  }
};
