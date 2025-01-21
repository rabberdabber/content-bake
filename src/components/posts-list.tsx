"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { PostData } from "@/schemas/post";
import { POSTS_PER_PAGE } from "@/config/post";
import { useEffect } from "react";
import { useState } from "react";
import { dynamicBlurDataUrl } from "@/lib/image/utils";

interface PostsListProps {
  posts: PostData[];
  totalPosts: number;
}

export default function PostsList({ posts, totalPosts }: PostsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search");
  const currentTag = searchParams.get("tag");
  const perPage = Number(searchParams.get("perPage")) || POSTS_PER_PAGE;

  // URL helper functions
  const getUrlWithoutParam = (paramToRemove: string) => {
    const params = new URLSearchParams();
    if (searchQuery && paramToRemove !== "search")
      params.set("search", searchQuery);
    if (currentTag && currentTag !== "all" && paramToRemove !== "tag")
      params.set("tag", currentTag);
    if (currentPage > 1 && paramToRemove !== "page")
      params.set("page", currentPage.toString());
    const queryString = params.toString();
    return `/posts${queryString ? `?${queryString}` : ""}`;
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get("search") as string;

    const params = new URLSearchParams();
    if (searchValue) params.set("search", searchValue);
    if (currentTag && currentTag !== "all") params.set("tag", currentTag);
    router.push(`/posts${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleTagChange = (value: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (value && value !== "all") params.set("tag", value);
    router.push(`/posts${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handlePerPageChange = (value: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (currentTag && currentTag !== "all") params.set("tag", currentTag);
    params.set("per_page", value);
    router.push(`/posts${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="space-y-8">
      <SearchAndFilterSection
        searchQuery={searchQuery}
        currentTag={currentTag}
        handleSearch={handleSearch}
        handleTagChange={handleTagChange}
      />

      <ResultsHeader
        currentPosts={posts.length}
        totalPosts={totalPosts}
        searchQuery={searchQuery}
        currentTag={currentTag}
        perPage={perPage}
        getUrlWithoutParam={getUrlWithoutParam}
        handlePerPageChange={handlePerPageChange}
      />

      <PostGrid posts={posts} />

      <PaginationControls
        currentPage={currentPage}
        totalPosts={totalPosts}
        perPage={perPage}
        searchQuery={searchQuery}
        currentTag={currentTag}
      />
    </div>
  );
}

function SearchAndFilterSection({
  searchQuery,
  currentTag,
  handleSearch,
  handleTagChange,
}: {
  searchQuery: string | null;
  currentTag: string | null;
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => void;
  handleTagChange: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search posts..."
              name="search"
              defaultValue={searchQuery || ""}
              className="w-full pr-16"
            />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
            >
              Search
            </Button>
          </div>
        </form>
        <Select
          defaultValue={currentTag || "all"}
          onValueChange={handleTagChange}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tags</SelectItem>
            <SelectItem value="tutorial">Tutorial</SelectItem>
            <SelectItem value="news">News</SelectItem>
            <SelectItem value="review">Review</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function ResultsHeader({
  currentPosts,
  totalPosts,
  searchQuery,
  currentTag,
  perPage,
  getUrlWithoutParam,
  handlePerPageChange,
}: {
  currentPosts: number;
  totalPosts: number;
  searchQuery: string | null;
  currentTag: string | null;
  perPage: number;
  getUrlWithoutParam: (param: string) => string;
  handlePerPageChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Badge variant="secondary" className="gap-1">
        <span className="text-muted-foreground">
          Found {currentPosts} posts out of {totalPosts} posts
        </span>{" "}
      </Badge>

      <div className="flex gap-2">
        <ActiveFilters
          searchQuery={searchQuery}
          currentTag={currentTag}
          getUrlWithoutParam={getUrlWithoutParam}
        />
        <PerPageSelect
          perPage={perPage}
          handlePerPageChange={handlePerPageChange}
        />
      </div>
    </div>
  );
}

function ActiveFilters({
  searchQuery,
  currentTag,
  getUrlWithoutParam,
}: {
  searchQuery: string | null;
  currentTag: string | null;
  getUrlWithoutParam: (param: string) => string;
}) {
  return (
    <>
      {searchQuery && (
        <Badge variant="secondary" className="gap-1">
          Search: {searchQuery}
          <Link
            href={getUrlWithoutParam("search")}
            className="ml-1 hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </Link>
        </Badge>
      )}
      {currentTag && currentTag !== "all" && (
        <Badge variant="secondary" className="gap-1">
          Tag: {currentTag}
          <Link
            href={getUrlWithoutParam("tag")}
            className="ml-1 hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </Link>
        </Badge>
      )}
    </>
  );
}

function PerPageSelect({
  perPage,
  handlePerPageChange,
}: {
  perPage: number;
  handlePerPageChange: (value: string) => void;
}) {
  return (
    <Select
      defaultValue={perPage.toString()}
      onValueChange={handlePerPageChange}
    >
      <SelectTrigger className="w-[110px]">
        <SelectValue placeholder="Items per page" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="6">6 per page</SelectItem>
        <SelectItem value="12">12 per page</SelectItem>
        <SelectItem value="24">24 per page</SelectItem>
      </SelectContent>
    </Select>
  );
}

function PostGrid({ posts }: { posts: PostData[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}

function PostCard({ post, index }: { post: PostData; index: number }) {
  const [blurDataUrl, setBlurDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlurDataUrl = async () => {
      const url = await dynamicBlurDataUrl(post.feature_image_url || "");
      setBlurDataUrl(url);
    };
    fetchBlurDataUrl();
  }, [post.feature_image_url]);

  return (
    <article
      className="group relative flex flex-col bg-card hover:bg-card/50 border border-muted 
      rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
    >
      {post.feature_image_url && (
        <div className="relative w-full pt-[56.25%]">
          <Image
            src={post.feature_image_url}
            alt={post.title}
            fill
            className="absolute inset-0 object-cover transition-transform duration-300 
            group-hover:scale-105"
            priority={index <= 1}
            blurDataURL={blurDataUrl ?? undefined}
            placeholder={blurDataUrl ? "blur" : undefined}
          />
        </div>
      )}
      <div className="flex flex-col flex-1 p-4 space-y-4">
        {post.tag && (
          <div className="flex flex-wrap gap-2">
            <span
              className="px-2 py-1 text-xs font-medium rounded-full 
              bg-primary/10 text-primary"
            >
              {post.tag}
            </span>
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
              {format(new Date(post.created_at), "MMMM dd, yyyy")}
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
  );
}

// New component for pagination controls
function PaginationControls({
  currentPage,
  totalPosts,
  perPage,
  searchQuery,
  currentTag,
}: {
  currentPage: number;
  totalPosts: number;
  perPage: number;
  searchQuery: string | null;
  currentTag: string | null;
}) {
  if (Math.ceil(totalPosts / perPage) <= 1) return null;

  return (
    <Pagination className="justify-center">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={`/posts?page=${currentPage - 1}${
                searchQuery ? `&search=${searchQuery}` : ""
              }${
                currentTag && currentTag !== "all" ? `&tag=${currentTag}` : ""
              }`}
            />
          </PaginationItem>
        )}
        {Array.from(
          { length: Math.ceil(totalPosts / perPage) },
          (_, i) => i + 1
        ).map((pageNum) => (
          <PaginationItem key={pageNum}>
            <PaginationLink
              href={`/posts?page=${pageNum}${
                searchQuery ? `&search=${searchQuery}` : ""
              }${
                currentTag && currentTag !== "all" ? `&tag=${currentTag}` : ""
              }`}
              isActive={pageNum === currentPage}
            >
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        ))}
        {currentPage < Math.ceil(totalPosts / perPage) && (
          <PaginationItem>
            <PaginationNext
              href={`/posts?page=${currentPage + 1}${
                searchQuery ? `&search=${searchQuery}` : ""
              }${
                currentTag && currentTag !== "all" ? `&tag=${currentTag}` : ""
              }`}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
