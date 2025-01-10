"use client";

import { useEffect, useState } from "react";
import { postsApi } from "@/lib/api";
import { Post } from "@/types/api";
import BlogPreview from "@/features/editor/components/preview/blog-preview"; // TODO: change to blog preview from posts

export default function PostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await postsApi.getPost(params.id);
      setPost(response);
    };
    fetchPost();
  }, [params.id]);

  console.log(post);
  if (!post) {
    return <div className="container max-w-4xl py-6 lg:py-10">Loading...</div>;
  }

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <BlogPreview content={post.content || ""} />
    </div>
  );
}
