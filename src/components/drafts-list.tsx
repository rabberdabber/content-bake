"use client";

import { Icons } from "./icons";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PostData } from "@/schemas/post";
import {
  PostCard,
  PostCardMedia,
  PostCardTag,
  PostCardTitle,
  PostCardExcerpt,
  PostCardFooter,
} from "@/components/ui/post-card";
import { usePostFilters } from "@/hooks/use-post-filters";
import { SearchAndFilterSection } from "@/components/search-and-filter-section";
import { ResultsHeader } from "@/components/results-header";
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
