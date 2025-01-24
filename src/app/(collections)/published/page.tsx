import { cookies } from "next/headers";
import { Suspense } from "react";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import PostsList from "@/components/posts-list";
import { publicPostsSchema } from "@/schemas/post";
import { PostsSearchParams } from "@/types/post";
import { POSTS_PER_PAGE } from "@/config/post";
import { redirect } from "next/navigation";
import { PaginationControls } from "@/components/pagination-controls";

export const dynamic = "force-dynamic";
export const runtime = "edge";

async function getPublishedPosts() {
  const env = process.env.NEXT_ENV;
  const cookieName =
    env === "local"
      ? "next-auth.session-token"
      : "__Secure-next-auth.session-token";
  const posts = await fetch(`${process.env.NEXTAUTH_URL}/api/published`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(cookies().get(cookieName) && {
        Authorization: `Bearer ${cookies().get(cookieName)?.value}`,
      }),
      cache: "no-store",
    },
  });

  if (!posts.ok) {
    if (posts.status === 401) {
      redirect("/auth/signin");
    }
    throw new Error("Failed to fetch published posts");
  }

  const postsResponse = await posts.json();
  const postsDataSafeParse = await publicPostsSchema.safeParseAsync(
    postsResponse
  );

  if (!postsDataSafeParse.success) {
    console.error(postsDataSafeParse.error);
    throw new Error("Error fetching published posts");
  }

  const { data, count } = postsDataSafeParse.data;
  return { data, count };
}

async function Posts({ params }: { params: PostsSearchParams }) {
  const { data: allPosts, count: totalPosts } = await getPublishedPosts();
  const page = Number(params.page) || 1;
  const perPage = Number(params.perPage) || POSTS_PER_PAGE;
  const search = params.search || "";
  const tag = params.tag || "all";

  let filteredPosts = allPosts;

  if (search) {
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (tag && tag !== "all") {
    filteredPosts = filteredPosts.filter((post) => post.tag === tag);
  }

  const startIndex = (page - 1) * perPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + perPage);

  return (
    <>
      <PostsList
        posts={paginatedPosts}
        totalPosts={filteredPosts.length}
        isPublic={false}
      />
      <PaginationControls totalPosts={filteredPosts.length} />
    </>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page?: string;
    search?: string;
    tag?: string;
    perPage?: string;
  };
}): Promise<JSX.Element> {
  return (
    <div className="min-h-[calc(100vh-8rem)] w-full">
      <Suspense
        fallback={
          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        }
      >
        <Posts params={searchParams} />
      </Suspense>
    </div>
  );
}
