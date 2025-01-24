"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Icons } from "./icons";
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
import {
  PostCard,
  PostCardMedia,
  PostCardTag,
  PostCardTitle,
  PostCardExcerpt,
  PostCardFooter,
} from "@/components/ui/post-card";
import { usePostFilters } from "@/hooks/use-post-filters";
import { PaginationControls } from "@/components/pagination-controls";

interface DraftsListProps {
  drafts: Partial<PostData>[];
  totalDrafts: number;
}

export default function DraftsList({ drafts, totalDrafts }: DraftsListProps) {
  const {
    currentPage,
    searchQuery,
    currentTag,
    perPage,
    getUrlWithoutParam,
    handleSearch,
    handleTagChange,
    handlePerPageChange,
  } = usePostFilters("/drafts");

  return (
    <div className="space-y-8">
      <SearchAndFilterSection
        searchQuery={searchQuery}
        currentTag={currentTag}
        handleSearch={handleSearch}
        handleTagChange={handleTagChange}
      />

      <ResultsHeader
        currentPosts={drafts.length}
        totalPosts={totalDrafts}
        searchQuery={searchQuery}
        currentTag={currentTag}
        perPage={perPage}
        getUrlWithoutParam={getUrlWithoutParam}
        handlePerPageChange={handlePerPageChange}
      />

      <DraftGrid drafts={drafts} />

      <PaginationControls
        currentPage={currentPage}
        totalPosts={totalDrafts}
        perPage={perPage}
        basePath="/drafts"
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
            <Icons.x className="h-3 w-3" />
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
            <Icons.x className="h-3 w-3" />
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

function DraftGrid({ drafts }: { drafts: Partial<PostData>[] }) {
  return (
    <div className="container max-w-7xl">
      <div className="grid grid-cols-1 gap-6 auto-rows-fr sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
        {drafts.map((draft, index) => (
          <PostCard
            key={draft.id}
            id={draft.id!}
            href={`/drafts/${draft.id}`}
            index={index}
            media={
              <PostCardMedia
                src={
                  draft.feature_image_url ||
                  `/placeholders/${(index % 6) + 1}.jpg`
                }
                alt={draft.title || ""}
                index={index}
                priority={index <= 1}
              />
            }
            tag={draft.tag && <PostCardTag>{draft.tag}</PostCardTag>}
            title={
              <PostCardTitle>
                {draft.title || `Draft ${index + 1}`}
              </PostCardTitle>
            }
            excerpt={
              draft.excerpt && (
                <PostCardExcerpt>{draft.excerpt}</PostCardExcerpt>
              )
            }
            footer={
              <PostCardFooter date={draft.created_at} actionText="Edit →" />
            }
            actions={
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
            }
          />
        ))}
      </div>
    </div>
  );
}
