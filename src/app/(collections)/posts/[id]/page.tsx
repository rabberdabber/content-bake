import { cn } from "@/lib/utils";
import { PostWithContentData, publicPostsSchema } from "@/schemas/post";
import { PostsMain } from "@/features/posts/posts-main";
import PostHero from "@/features/posts/post-hero";
import { slugify } from "@/lib/utils";
import { Metadata } from "next";
import { cache } from "react";

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

type Props = {
  params: { id: string };
};

const getPost = cache(async (slug: string): Promise<PostWithContentData> => {
  const post = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/by-slug/${slug}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return post.json();
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.id);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      ...(post.feature_image_url && {
        images: [{ url: post.feature_image_url, width: 1200, height: 630 }],
      }),
    },
  };
}

export default async function PostPage({ params }: Props) {
  const postData = await getPost(params.id);

  return (
    <div className="container max-w-full py-8 lg:py-12">
      <PostHero data={postData} />
      <article
        className={cn(
          "relative w-full mx-auto",
          "p-8 sm:p-12 md:p-16",
          "text-prose-text-light dark:text-prose-text-dark",
          "shadow-page-light dark:shadow-page-dark",
          "sm:rounded-lg",
          "bg-white dark:bg-gray-900",
          "border border-gray-200 dark:border-gray-800"
        )}
      >
        <div
          className={cn(
            "prose dark:prose-invert max-w-none",
            "prose-headings:font-display prose-headings:tracking-tight",
            "prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-8",
            "prose-h2:text-3xl prose-h2:font-semibold prose-h2:mt-12 prose-h2:mb-6",
            "prose-h3:text-2xl prose-h3:font-medium prose-h3:mt-8 prose-h3:mb-4",
            "prose-p:text-base prose-p:leading-7 prose-p:my-6",
            "prose-a:text-primary prose-a:no-underline hover:prose-a:text-primary/80",
            "prose-strong:text-foreground prose-strong:font-semibold",
            "prose-img:rounded-lg prose-img:shadow-md prose-img:my-8",
            "prose-blockquote:border-l-4 prose-blockquote:border-primary/60",
            "prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/50",
            "prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:my-8",
            "prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6",
            "prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6",
            "[&_pre]:!bg-gray-950 [&_pre]:border [&_pre]:border-gray-800",
            "[&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:my-6",
            "[&_code]:font-mono [&_code]:text-sm",
            "[&>section]:border-b [&>section]:border-gray-200 [&>section]:dark:border-gray-800",
            "[&>section]:pb-8 [&>section]:mb-8",
            "prose-table:w-full prose-table:my-8",
            "prose-th:bg-gray-100 dark:prose-th:bg-gray-800",
            "prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700",
            "prose-hr:my-12 prose-hr:border-gray-200 dark:prose-hr:border-gray-800"
          )}
        >
          <PostsMain postContent={postData.content} />
        </div>
      </article>
    </div>
  );
}
