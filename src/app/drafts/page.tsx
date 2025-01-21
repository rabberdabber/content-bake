import { Suspense } from "react";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { draftPostsSchema } from "@/schemas/post";
import { PostsSearchParams } from "@/types/post";
import { POSTS_PER_PAGE } from "@/config/post";
import DraftsList from "@/components/drafts-list";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";

async function getDrafts() {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  const posts = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/drafts`, //?page=${page}&per_page=${perPage}`
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const postsResponse = await posts.json();
  console.log(`DraftsResponse: ${JSON.stringify(postsResponse, null, 2)}`);
  const postsDataSafeParse = await draftPostsSchema.safeParseAsync(
    postsResponse
  );

  if (!postsDataSafeParse.success) {
    console.log(postsDataSafeParse.error);
    throw new Error("Error fetching posts");
  }
  const { data, count } = postsDataSafeParse.data;

  let filteredPosts = data;

  console.log(
    "%c" + JSON.stringify(filteredPosts, null, 2),
    "color: #00ff00; font-weight: bold;"
  );
  console.log(count);
  return {
    data: filteredPosts,
    count,
  };
}

// Main page component

async function Drafts({ params }: { params: PostsSearchParams }) {
  const { data: allDrafts, count: totalDrafts } = await getDrafts();
  const page = Number(params.page) || 1;
  const perPage = Number(params.perPage) || POSTS_PER_PAGE;
  const search = params.search || "";
  const tag = params.tag || "all";
  let filteredDrafts = allDrafts;

  if (search) {
    filteredDrafts = filteredDrafts;
    // .filter(
    //   (post) =>
    //     post?.title?.toLowerCase().includes(search.toLowerCase()) ||
    //     post?.excerpt?.toLowerCase().includes(search.toLowerCase())
    // );
  }

  if (tag && tag !== "all") {
    // filteredPosts = filteredPosts.filter((post) => post.tag === tag);
  }

  const startIndex = (page - 1) * perPage;
  const paginatedDrafts = filteredDrafts.slice(
    startIndex,
    startIndex + perPage
  );

  return <DraftsList drafts={paginatedDrafts} totalDrafts={totalDrafts} />;
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
}) {
  return (
    <div className="min-h-[calc(100vh-8rem)] container max-w-4xl py-6 lg:py-10">
      <Suspense
        fallback={
          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        }
      >
        <Drafts params={searchParams} />
      </Suspense>
    </div>
  );
}
