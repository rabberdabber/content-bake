import { cn } from "@/lib/utils";
import { postWithContentSchema } from "@/schemas/post";
import { PostsMain } from "@/features/posts/posts-main";
import PostHero from "@/features/posts/post-hero";

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/posts/" + params.id,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const postDataSafeParse = await postWithContentSchema.safeParseAsync(
    await post.json()
  );

  if (!postDataSafeParse.success) {
    console.log(postDataSafeParse.error);
    return <div>Error fetching post</div>;
  }

  const postData = postDataSafeParse.data;

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <PostHero
        title={postData.title || "title"}
        publishedOn={postData.created_at || new Date().toISOString()}
        coverImage={{
          src: postData.feature_image_url || "",
          alt: postData.title || "title",
        }}
      />
      <article
        className={cn(
          "relative w-full min-h-screen mx-auto",
          "p-8 sm:p-12 md:p-16",
          "text-prose-text-light dark:text-prose-text-dark", // Updated text colors
          "shadow-page-light dark:shadow-page-dark",
          "sm:rounded-lg"
        )}
      >
        <div
          className={cn(
            "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl",
            "mx-auto max-w-[65ch]",
            "focus:outline-none",
            "dark:prose-invert",
            "prose-headings:font-[var(--font-display)]",
            "prose-p:font-[var(--font-serif)]",
            "prose-p:leading-relaxed",
            "prose-a:font-medium",
            "prose-pre:bg-slate-900",
            "prose-pre:border prose-pre:border-slate-800",
            "[&_img]:mx-auto [&_img]:object-contain",
            "[&_pre]:!bg-slate-900 [&_pre]:border [&_pre]:border-slate-800",
            "[&_code]:font-[var(--font-mono)] [&_code]:text-sky-500"
          )}
        >
          <div className="flex flex-col">
            <PostsMain postContent={postData.content} />
          </div>
        </div>
      </article>
      );
    </div>
  );
}
