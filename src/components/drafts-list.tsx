"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PostCard,
  PostCardMedia,
  PostCardTag,
  PostCardTitle,
  PostCardExcerpt,
  PostCardFooter,
} from "@/components/ui/post-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import type { DraftData, PostData } from "@/schemas/post";
import { Icons } from "./icons";
import { useCollections } from "@/app/(collections)/collections-context";
import { deletePost } from "@/lib/actions/post";
import { toast } from "sonner";
interface DraftsListProps {
  drafts: Partial<PostData>[];
  totalDrafts: number;
}

export default function DraftsList({ drafts, totalDrafts }: DraftsListProps) {
  const { setCurrentCollections, setTotalCollections } = useCollections();

  useEffect(() => {
    setCurrentCollections(drafts);
    setTotalCollections(totalDrafts);
  }, [drafts, totalDrafts]);

  return (
    <div className="space-y-8">
      <DraftGrid drafts={drafts} />
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
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Partial<PostData> | null>(
    null
  );

  const handleDelete = async () => {
    if (!selectedPost) return;
    setIsDeleting(true);
    try {
      await deletePost(selectedPost.id!);
      router.refresh();
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
      setOpen(false);
      setSelectedPost(null);
      toast.success("Draft deleted successfully");
    }
  };

  if (drafts.length === 0) {
    return (
      <EmptyState
        icon="pencil"
        title="No drafts found"
        description="You haven't created any drafts yet. Start writing your first draft!"
        action={{
          label: "Create Draft",
          href: "/edit",
        }}
      />
    );
  }

  return (
    <div className="container max-w-7xl">
      <div className="grid grid-cols-1 gap-6 auto-rows-fr sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
        {drafts.map((draft, index) => (
          <PostCard
            key={draft.id}
            id={draft.id!}
            href={`/drafts/${draft.slug}`}
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
            tags={
              draft.tags &&
              draft.tags.map((tag) => (
                <PostCardTag key={tag}>{tag}</PostCardTag>
              ))
            }
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
                  setOpen(true);
                  setSelectedPost(draft);
                }}
              >
                <Icons.trash className="h-4 w-4" />
              </Button>
            }
          />
        ))}
      </div>
      {selectedPost && (
        <ConfirmationDialog
          open={open}
          onOpenChange={setOpen}
          title="Delete Draft"
          description="Are you sure you want to delete this draft? This action cannot be undone."
          onConfirm={handleDelete}
          onReject={() => {
            setOpen(false);
            setSelectedPost(null);
          }}
          confirmText="Delete Draft"
          rejectText="Cancel"
          loading={isDeleting}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {selectedPost.feature_image_url && (
                <div className="relative w-20 h-20 overflow-hidden rounded-md">
                  <Image
                    src={selectedPost.feature_image_url}
                    alt={selectedPost.title || ""}
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
