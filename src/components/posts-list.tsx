"use client";

import { Button } from "@/components/ui/button";
import type { PostData } from "@/schemas/post";
import { Icons } from "./icons";
import { PostCard } from "@/components/ui/post-card";
import {
  PostCardMedia,
  PostCardTag,
  PostCardTitle,
  PostCardExcerpt,
  PostCardFooter,
} from "@/components/ui/post-card";
import { useCollections } from "@/app/(collections)/collections-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmationDialog } from "./ui/confirmation-dialog";
import { deletePost } from "@/lib/actions/post";
import Image from "next/image";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "sonner";

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
  const { setCurrentCollections, setTotalCollections } = useCollections();

  useEffect(() => {
    setCurrentCollections(posts);
    setTotalCollections(totalPosts);
  }, [posts, totalPosts]);

  return <PostGrid posts={posts} isPublic={isPublic} />;
}

function PostGrid({
  posts,
  isPublic,
}: {
  posts: PostData[];
  isPublic: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);

  const handleDelete = async () => {
    if (!selectedPost) return;
    setIsDeleting(true);
    try {
      await deletePost(selectedPost.id);
      router.refresh();
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
      setOpen(false);
      setSelectedPost(null);
      toast.success("Post deleted successfully");
    }
  };

  if (posts.length === 0) {
    return (
      <EmptyState
        icon="post"
        title="No posts found"
        description={
          isPublic
            ? "There are no published posts yet. Check back later!"
            : "You haven't published any posts yet. Start writing your first post!"
        }
        action={
          !isPublic
            ? {
                label: "Create Post",
                href: "/edit",
              }
            : undefined
        }
      />
    );
  }

  return (
    <div className="container max-w-7xl transition-transform duration-300 transform will-change-transform">
      <div className="grid grid-cols-1 gap-6 auto-rows-fr sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {posts.map((post, index) => (
          <PostCard
            key={post.id}
            id={post.id}
            index={index}
            href={`/posts/${post.slug}`}
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
            tags={
              post.tags && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <PostCardTag key={tag}>{tag}</PostCardTag>
                  ))}
                </div>
              )
            }
            title={<PostCardTitle>{post.title}</PostCardTitle>}
            excerpt={
              post.excerpt && <PostCardExcerpt>{post.excerpt}</PostCardExcerpt>
            }
            footer={
              <PostCardFooter date={post.created_at} actionText="Read more →" />
            }
            actions={
              !isPublic && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-background/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 
                  transition-opacity hover:bg-primary hover:text-primary-foreground"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/edit/${post.slug}`);
                    }}
                  >
                    <Icons.edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-background/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 
                  transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(true);
                      setSelectedPost(post);
                    }}
                  >
                    <Icons.trash className="h-4 w-4" />
                  </Button>
                </div>
              )
            }
          />
        ))}
      </div>
      {selectedPost && (
        <ConfirmationDialog
          open={open}
          onOpenChange={setOpen}
          title="Delete Post"
          description="Are you sure you want to delete this post? This action cannot be undone."
          onConfirm={handleDelete}
          onReject={() => {
            setOpen(false);
            setSelectedPost(null);
          }}
          confirmText="Delete Post"
          rejectText="Cancel"
          loading={isDeleting}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {selectedPost.feature_image_url && (
                <div className="relative w-20 h-20 overflow-hidden rounded-md">
                  <Image
                    src={selectedPost.feature_image_url}
                    alt={selectedPost.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              )}
              <div>
                <h3 className="font-medium">{selectedPost.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Slug: {selectedPost.slug}
                </p>
              </div>
            </div>
            {selectedPost.excerpt && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {selectedPost.excerpt}
              </p>
            )}
            {selectedPost.tags && selectedPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-md bg-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </ConfirmationDialog>
      )}
    </div>
  );
}
