"use client";

import { PostForm } from "./post-form";
import { saveDraft, publishPost } from "@/lib/actions/post";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEditor } from "../../context/editor-context";
import { useSession } from "next-auth/react";
import { useLocalStorage } from "@mantine/hooks";

export function EditorActions() {
  const { data: session } = useSession();
  const { editor, type } = useEditor();
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [localStorageContent, setLocalStorageContent] = useLocalStorage({
    key: "editor-content",
    defaultValue: "",
  });

  const handleSaveDraft = async () => {
    if (!editor) return;
    const formData = new FormData();
    formData.append("title", "Draft");
    formData.append("excerpt", "Draft");
    formData.append("content", JSON.stringify(editor.getJSON()));
    formData.append("is_published", "false");
    formData.append("author_id", session?.user.id as string);
    try {
      setIsSavingDraft(true);
      await saveDraft(formData);
      toast.success("Draft saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save draft");
    } finally {
      setIsSavingDraft(false);
      if (type === "local") {
        setLocalStorageContent("");
      }
      editor.commands.setContent("");
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="gap-2"
        disabled={isSavingDraft}
        onClick={handleSaveDraft}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Icons.send className="h-6 w-6" />
            Publish
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <PostForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
