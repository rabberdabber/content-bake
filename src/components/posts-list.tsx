"use client";

import Link from "next/link";
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

import { Icons } from "./icons";
import { PostCard } from "@/components/ui/post-card";
import {
  PostCardMedia,
  PostCardTag,
  PostCardTitle,
  PostCardExcerpt,
  PostCardFooter,
} from "@/components/ui/post-card";

interface PostsListProps {
  posts: PostData[];
  totalPosts: number;
  isPublic: boolean;
}

export default function PostsList({
  posts,
  totalPosts,
  isPublic,
}: PostsListProps) {
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

      <PostGrid posts={posts} isPublic={isPublic} />

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
    <div className="space-y-4 container max-w-4xl">
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search posts..."
              name="search"
              defaultValue={searchQuery || ""}
              className="pr-16 w-full"
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
    <div className="flex items-center justify-between container max-w-4xl">
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
      <Button variant="outline" className="gap-2">
        <Icons.plus className="h-4 w-4" />
        Create Post
      </Button>
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

function PostGrid({
  posts,
  isPublic,
}: {
  posts: PostData[];
  isPublic: boolean;
}) {
  return (
    <div className="container max-w-7xl">
      <div className="grid grid-cols-1 gap-6 auto-rows-fr sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
        {posts.map((post, index) => (
          <PostCard
            key={post.id}
            id={post.id}
            index={index}
            href={`/posts/${post.id}`}
            media={
              post.feature_image_url && (
                <PostCardMedia
                  src={post.feature_image_url}
                  alt={post.title}
                  priority={index <= 1}
                  index={index}
                />
              )
            }
            tag={post.tag && <PostCardTag>{post.tag}</PostCardTag>}
            title={<PostCardTitle>{post.title}</PostCardTitle>}
            excerpt={
              post.excerpt && <PostCardExcerpt>{post.excerpt}</PostCardExcerpt>
            }
            footer={
              <PostCardFooter date={post.created_at} actionText="Read more →" />
            }
            actions={
              !isPublic && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-background/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 
                  transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("delete");
                  }}
                >
                  <Icons.trash className="h-4 w-4" />
                </Button>
              )
            }
          />
        ))}
      </div>
    </div>
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
