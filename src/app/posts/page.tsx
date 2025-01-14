import Image from "next/image";
import Link from "next/link";
import { formatDate } from "date-fns";
import { Suspense } from "react";
import { postsApi } from "@/lib/api";
import { Post } from "@/types/api";

export const dynamic = "force-dynamic";

// Create a separate Posts component for the async data fetching
async function Posts() {
  const posts = await postsApi.getPosts();
  const postsData = (posts.data || []) as Post[];

  return (
    <>
      {postsData.length ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {postsData.map((post, index) => (
            <article
              key={post.id}
              className="group relative flex flex-col bg-card hover:bg-card/50 border border-muted 
              rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
            >
              {post.feature_image_url && (
                <div className="relative w-full pt-[56.25%]">
                  {" "}
                  {/* 16:9 aspect ratio */}
                  <Image
                    src={post.feature_image_url}
                    alt={post.title}
                    fill
                    className="absolute inset-0 object-cover transition-transform duration-300 
                    group-hover:scale-105"
                    priority={index <= 1}
                  />
                </div>
              )}
              <div className="flex flex-col flex-1 p-4 space-y-4">
                {post.tag && (
                  <div className="flex flex-wrap gap-2">
                    {post.tag && (
                      <span
                        key={post.tag}
                        className="px-2 py-1 text-xs font-medium rounded-full 
                        bg-primary/10 text-primary"
                      >
                        {post.tag}
                      </span>
                    )}
                  </div>
                )}

                <h2
                  className="text-xl font-bold leading-tight line-clamp-2 
                  group-hover:text-primary transition-colors"
                >
                  {post.title}
                </h2>

                {post.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between mt-auto pt-4">
                  {post.created_at && (
                    <time className="text-sm text-muted-foreground">
                      {formatDate(new Date(post.created_at), "MMMM dd, yyyy")}
                    </time>
                  )}
                  <span
                    className="text-sm font-medium text-primary opacity-0 
                    group-hover:opacity-100 transition-opacity"
                  >
                    Read more →
                  </span>
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
    </>
  );
}

// Main page component
export default function Page() {
  return (
    <div className="min-h-screen container max-w-4xl py-6 lg:py-10">
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full border-2 border-current border-t-transparent h-4 w-4"></div>
          </div>
        }
      >
        <Posts />
      </Suspense>
    </div>
  );
}
