"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { SearchAndFilterSection } from "@/components/search-and-filter-section";
import { ResultsHeader } from "@/components/results-header";
import { usePostFilters } from "@/hooks/use-post-filters";
import { PaginationControls } from "@/components/pagination-controls";

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
  const {
    currentPage,
    searchQuery,
    currentTag,
    perPage,
    getUrlWithoutParam,
    handleSearch,
    handleTagChange,
    handlePerPageChange,
  } = usePostFilters("/posts");

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
        basePath="/posts"
      />
    </div>
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
    <div className="container max-w-7xl transition-transform duration-300 transform will-change-transform">
      <div className="grid grid-cols-1 gap-6 auto-rows-fr sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
