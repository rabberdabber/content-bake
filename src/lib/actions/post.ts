"use server";

import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { cookies, headers } from "next/headers";
import { draftFormSchema, PostData, PostFormData } from "@/schemas/post";
import { slugify } from "@/lib/utils";
import { JSONContent } from "@tiptap/react";

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
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/`, {
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
  const title = formData.get("title") as string;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
    body: JSON.stringify({
      content: JSON.parse(formData.get("content") as string),
      is_published: Boolean(formData.get("is_published") === "true"),
      title: title,
      slug: slugify(title),
      author_id: formData.get("author_id"),
      excerpt: formData.get("excerpt"),
      tags: JSON.parse(formData.get("tags") as string),
      feature_image_url: formData.get("feature_image_url"),
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    console.log("Error creating post", error);
    throw new Error(error?.message || "Failed to create post");
  }
  revalidatePath("/posts");
  revalidatePath("/published");
  revalidatePath("/drafts");
  return response.json();
}

export async function saveDraft(formData: FormData) {
  const post = (await createDraft(formData)) as PostData;
  revalidatePath("/drafts");
  return post;
}

export async function publishPost(formData: FormData) {
  console.log("Publishing post", formData);
  const post = (await createPost(formData)) as PostData;
  revalidatePath("/posts");
  revalidatePath("/published");
  return post;
}

export async function patchPost(id: string, formData: FormData, slug?: string) {
  console.log("Patching post with id", id, formData);
  const token = await getAuthToken();
  const content = JSON.parse(formData.get("content") as string);
  const is_published = Boolean(formData.get("is_published"));
  const tags = formData.get("tags") as string;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.accessToken}`,
      },
      body: JSON.stringify({
        ...Object.fromEntries(formData.entries()),
        ...(content ? { content } : {}),
        ...(is_published ? { is_published: true } : {}),
        ...(tags ? { tags } : {}),
      }),
    }
  );
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    console.log("Error patching post", error);
    throw new Error(error?.message || "Failed to patch post");
  }

  // Revalidate based on whether we have a slug
  if (slug) {
    revalidatePath(`/posts/${slug}`);
  } else {
    // Revalidate all relevant paths for drafts
    revalidatePath("/drafts");
    revalidatePath("/posts");
    revalidatePath("/published");
  }

  return response.json() as Promise<PostData>;
}

export async function deletePost(postId: string) {
  const token = await getAuthToken();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    }
  );
  revalidatePath("/published");
  revalidatePath("/posts");
  return response.json();
}
