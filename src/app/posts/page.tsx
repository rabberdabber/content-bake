"use client";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "date-fns";

import { postsApi } from "@/lib/api";
import { Post } from "@/types/api";
import { useEffect } from "react";
import { useState } from "react";

export default function Page() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await postsApi.getPosts();
      posts.data && setPosts(posts.data);
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen container max-w-4xl py-6 lg:py-10">
      {posts?.length ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="group relative flex flex-col space-y-2 hover:shadow-md border border-muted rounded-xl max-h-[25rem]"
            >
              {post.image && (
                <div className="w-full h-[40%] flex justify-center items-center">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={504}
                    height={152}
                    className="block w-full h-full rounded-md border bg-muted transition-colors object-cover"
                    priority={index <= 1}
                  />
                </div>
              )}
              <div className="flex flex-col justify-between h-56 p-2">
                <h2 className="text-2xl font-extrabold">{post.title}</h2>
                <div className="flex flex-col gap-2 mt-auto">
                  {post.excerpt && (
                    <p className="text-muted-foreground line-clamp-4 text-ellipsis">
                      {post.excerpt}
                    </p>
                  )}
                  {post.created_at && (
                    <p className="text-sm font-extralight text-muted-foreground mb-1">
                      {formatDate(new Date(post.created_at), "MMMM dd, yyyy")}
                    </p>
                  )}
                </div>
              </div>
              <Link href={`/posts/${post.id}`} className="absolute inset-0">
                <span className="sr-only">View Article</span>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p>No posts published.</p>
      )}
    </div>
  );
}
