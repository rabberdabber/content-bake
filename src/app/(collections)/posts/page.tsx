import { Suspense } from "react";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import PostsList from "@/components/posts-list";
import { publicPostsSchema } from "@/schemas/post";
import { POSTS_PER_PAGE } from "@/config/post";

type PostsSearchParams = {
  page?: string;
  perPage?: string;
  search?: string;
  tag?: string;
  sort_order?: "asc" | "desc";
  start_date?: string; // Format: YYYY-MM-DD
  end_date?: string; // Format: YYYY-MM-DD
};

export const dynamic = "force-dynamic";

async function getPosts(params: PostsSearchParams) {
  const searchParams = new URLSearchParams();

  // Only pass sorting and date parameters to the server
  if (params.sort_order) searchParams.set("sort_order", params.sort_order);
  if (params.start_date) searchParams.set("start_date", params.start_date);
  if (params.end_date) searchParams.set("end_date", params.end_date);

  const queryString = searchParams.toString();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/posts${
    queryString ? `?${queryString}` : ""
  }`;

  const posts = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const postsResponse = await posts.json();
  const postsDataSafeParse = await publicPostsSchema.safeParseAsync(
    postsResponse
  );

  if (!postsDataSafeParse.success) {
    console.log(postsDataSafeParse.error);
    throw new Error("Error fetching posts");
  }

  return postsDataSafeParse.data;
}

async function Posts({ params }: { params: PostsSearchParams }) {
  const { data: allPosts, count: totalPosts } = await getPosts(params);
  const page = Number(params.page) || 1;
  const perPage = Number(params.perPage) || POSTS_PER_PAGE;
  const search = params.search || "";
  const tag = params.tag || "all";

  let filteredPosts = allPosts;

  // Apply search filter client-side
  if (search) {
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Apply tag filter client-side
  if (tag && tag !== "all") {
    filteredPosts = filteredPosts.filter((post) => post.tags?.includes(tag));
  }

  const startIndex = (page - 1) * perPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + perPage);

  return (
    <PostsList
      posts={paginatedPosts}
      totalPosts={filteredPosts.length}
      isPublic
    />
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
    sort_order?: "asc" | "desc";
    start_date?: string;
    end_date?: string;
  };
}) {
  return (
    <div className="min-h-[calc(100dvh-16rem)] w-full py-6 lg:py-10 px-4">
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
