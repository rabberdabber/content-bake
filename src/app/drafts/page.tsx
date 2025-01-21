import { cookies } from "next/headers";
import { Suspense } from "react";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { draftPostsSchema } from "@/schemas/post";
import { PostsSearchParams } from "@/types/post";
import { POSTS_PER_PAGE } from "@/config/post";
import DraftsList from "@/components/drafts-list";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function getDrafts() {
  const env = process.env.NEXT_ENV;
  const cookieName =
    env === "local"
      ? "next-auth.session-token"
      : "__Secure-next-auth.session-token";
  const posts = await fetch(`${process.env.NEXTAUTH_URL}/api/drafts`, {
    headers: {
      "Content-Type": "application/json",
      "Accept-Type": "application/json",
      ...(cookies().get(cookieName) && {
        Authorization: `Bearer ${cookies().get(cookieName)?.value}`,
      }),
    },
  });

  if (!posts.ok) {
    if (posts.status === 401) {
      redirect("/auth/signin");
    }
    throw new Error("Failed to fetch drafts");
  }

  const postsResponse = await posts.json();
  console.log(
    `response from local server : ${JSON.stringify(postsResponse, null, 2)}`
  );
  const postsDataSafeParse = await draftPostsSchema.safeParseAsync(
    postsResponse
  );

  if (!postsDataSafeParse.success) {
    console.error(postsDataSafeParse.error);
    throw new Error("Error fetching drafts");
  }

  const { data, count } = postsDataSafeParse.data;
  return { data, count };
}

async function Drafts({ params }: { params: PostsSearchParams }) {
  const { data: allDrafts, count: totalDrafts } = await getDrafts();
  const page = Number(params.page) || 1;
  const perPage = Number(params.perPage) || POSTS_PER_PAGE;
  const search = params.search || "";
  const tag = params.tag || "all";

  let filteredDrafts = allDrafts;

  if (search) {
    // filteredDrafts = filteredDrafts.filter(
    //   (draft) =>
    //     draft.title?.toLowerCase().includes(search.toLowerCase()) ||
    //     draft.excerpt?.toLowerCase().includes(search.toLowerCase())
    // );
  }

  if (tag && tag !== "all") {
    // filteredDrafts = filteredDrafts.filter((draft) => draft.tag === tag);
  }

  const startIndex = (page - 1) * perPage;
  const paginatedDrafts = filteredDrafts.slice(
    startIndex,
    startIndex + perPage
  );

  return (
    <DraftsList drafts={paginatedDrafts} totalDrafts={filteredDrafts.length} />
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
