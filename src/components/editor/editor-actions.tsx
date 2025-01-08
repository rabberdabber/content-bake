"use client";

import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { postsApi } from "@/lib/api";
import { useState } from "react";
import { useLocalStorage } from "@mantine/hooks";

interface EditorActionsProps {
  editor: Editor | null;
}

export function EditorActions({ editor }: EditorActionsProps) {
  const [content, setContent] = useLocalStorage({
    key: "editor-content",
    defaultValue: "",
  });
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="gap-2"
        disabled={isSavingDraft || !editor}
        onClick={async () => {
          try {
            setIsSavingDraft(true);
            const content = editor?.getJSON() || "";
            await postsApi.saveDraft({
              id: crypto.randomUUID(),
              title: "Draft",
              content: content,
              tag: "draft",
              is_published: false,
              excerpt: "draft",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              author_id: "1",
            });
            toast.success("Draft saved successfully!");
          } catch (error) {
            toast.error("Failed to save draft");
          } finally {
            setIsSavingDraft(false);
          }
        }}
      >
        {isSavingDraft ? (
          <>
            <Spinner className="h-6 w-6" />
            Saving...
          </>
        ) : (
          <>
            <Icons.save className="h-6 w-6" />
            Save Draft
          </>
        )}
      </Button>

      <Button
        className="gap-2"
        disabled={isPublishing || !editor}
        onClick={async () => {
          try {
            setIsPublishing(true);
            const content = editor?.getJSON() || "";
            await postsApi.createPost({
              id: crypto.randomUUID(),
              title: "Test",
              content: content,
              tag: "test",
              is_published: true,
              excerpt: "test",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              author_id: "1",
            });
            toast.success("Post published successfully!");
          } catch (error) {
            toast.error("Failed to publish post");
          } finally {
            setIsPublishing(false);
            setContent("");
          }
        }}
      >
        {isPublishing ? (
          <>
            <Spinner className="h-6 w-6" />
            Publishing...
          </>
        ) : (
          <>
            <Icons.send className="h-6 w-6" />
            Publish
          </>
        )}
      </Button>
    </>
  );
}
