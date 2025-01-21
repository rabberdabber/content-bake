"use server";

import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { cookies, headers } from "next/headers";
import {
  draftFormSchema,
  postFormSchema,
  postWithContentSchema,
} from "@/schemas/post";
import { z } from "zod";

async function getAuthToken() {
  const token = await getToken({
    req: {
      headers: Object.fromEntries(headers()),
      cookies: Object.fromEntries(
        cookies()
          .getAll()
          .map((c) => [c.name, c.value])
      ),
    } as any,
  });

  if (!token) {
    throw new Error("Not authenticated");
  }

  return token;
}

async function validatePost(formData: FormData) {
  try {
    // First validate the form data
    await postFormSchema.parseAsync({
      title: formData.get("title"),
      tag: formData.get("tag"),
      excerpt: formData.get("excerpt"),
      feature_image_url: formData.get("feature_image_url"),
    });

    // Then validate the complete post data
    await postWithContentSchema
      .omit({
        id: true,
        author_id: true,
        created_at: true,
        updated_at: true,
      })
      .parseAsync({
        ...Object.fromEntries(formData.entries()),
        content: JSON.parse(formData.get("content") as string),
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
}

async function validateDraft(formData: FormData) {
  await draftFormSchema.parseAsync({
    ...Object.fromEntries(formData.entries()),
    is_published: Boolean(formData.get("is_published")),
    content: JSON.parse(formData.get("content") as string),
  });
  return true;
}

export async function createDraft(formData: FormData) {
  console.log("Creating draft", formData);
  const token = await getAuthToken();

  //   Validate the post data before sending to the server
  await validateDraft(formData);

  console.log("Sending draft to server", formData);
  console.log(JSON.parse(formData.get("content") as string));
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
    body: JSON.stringify({
      content: JSON.parse(formData.get("content") as string),
      is_published: Boolean(formData.get("is_published") === "true"),
      title: formData.get("title"),
      author_id: formData.get("author_id"),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.log("Error creating draft", error);
    throw new Error(error?.message || "Failed to create draft");
  }

  return response.json();
}

export async function createPost(formData: FormData) {
  console.log("Creating post", formData);
  const token = await getAuthToken();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
    body: JSON.stringify({
      content: JSON.parse(formData.get("content") as string),
      is_published: Boolean(formData.get("is_published") === "true"),
      title: formData.get("title"),
      author_id: formData.get("author_id"),
      excerpt: formData.get("excerpt"),
      tag: formData.get("tag"),
      feature_image_url: formData.get("feature_image_url"),
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    console.log("Error creating post", error);
    throw new Error(error?.message || "Failed to create post");
  }

  return response.json();
}

export async function saveDraft(formData: FormData) {
  return createDraft(formData);
}

export async function publishPost(formData: FormData) {
  console.log("Publishing post", formData);
  const post = await createPost(formData);
  revalidatePath("/posts");
  return post;
}
