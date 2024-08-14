import Image from "next/image";
import Link from "next/link";
import { formatDate } from "date-fns";

import { getBlogPostList } from "../file-helper";

export default async function Page() {
  const posts = await getBlogPostList();

  return (
    <div className="min-h-screen container max-w-4xl py-6 lg:py-10">
      {posts?.length ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {posts.map((post, index) => (
            <article
              key={post.title}
              className="group relative flex flex-col space-y-2 hover:scale-105 border border-slate-700 rounded-md max-h-[25rem]"
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
                  {post.abstract && (
                    <p className="text-muted-foreground line-clamp-4 text-ellipsis">
                      {post.abstract}
                    </p>
                  )}
                  {post.publishedOn && (
                    <p className="text-sm text-muted-foreground mb-1">
                      {formatDate(post.publishedOn, "MMMM dd, yyyy")}
                    </p>
                  )}
                </div>
              </div>
              <Link href={`/posts/${post.slug}`} className="absolute inset-0">
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
