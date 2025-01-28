import { cn } from "@/lib/utils";
import { PostWithContentData, publicPostsSchema } from "@/schemas/post";
import { PostsMain } from "@/features/posts/posts-main";
import PostHero from "@/features/posts/post-hero";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const posts = await fetch(process.env.NEXT_PUBLIC_API_URL + "/posts", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const postsResponse = await posts.json();
  const postsDataSafeParse = await publicPostsSchema.safeParseAsync(
    postsResponse
  );

  if (!postsDataSafeParse.success) {
    console.log(postsDataSafeParse.error);
    throw new Error("Error fetching posts");
  }
  const { data } = postsDataSafeParse.data;
  return data.map((post) => ({ id: slugify(post.title) }));
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/by-slug/${params.id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const postData = (await post.json()) as PostWithContentData;

  console.log(
    "%c" + JSON.stringify(postData, null, 2),
    "color: #00ff00; font-weight: bold;"
  );
  return (
    <div className="container max-w-full py-6 lg:py-10">
      <PostHero data={postData} />
      <article
        className={cn(
          "relative w-full mx-auto",
          "p-8 sm:p-12 md:p-16",
          "text-prose-text-light dark:text-prose-text-dark",
          "shadow-page-light dark:shadow-page-dark",
          "sm:rounded-lg"
        )}
      >
        <div
          className={cn(
            "prose dark:prose-invert max-w-none",
            "prose-headings:font-display prose-headings:tracking-tight",
            "prose-h1:text-4xl prose-h1:font-bold",
            "prose-h2:text-3xl prose-h2:font-semibold",
            "prose-h3:text-2xl prose-h3:font-medium",
            "prose-p:text-base prose-p:leading-7",
            "prose-a:text-primary hover:prose-a:text-primary/80",
            "prose-strong:text-foreground",
            "prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md",
            "prose-pre:bg-muted prose-pre:text-muted-foreground",
            "prose-img:rounded-lg prose-img:shadow-md",
            "prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground",
            "[&_img]:mx-auto [&_img]:object-cover",
            "[&_pre]:!bg-muted [&_pre]:border [&_pre]:border-border",
            "[&_code]:font-mono"
          )}
        >
          <PostsMain postContent={postData.content} />
        </div>
      </article>
    </div>
  );
}
