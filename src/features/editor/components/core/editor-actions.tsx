"use client";

import { PostForm } from "./post-form";
import { saveDraft } from "@/lib/actions/post";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEditor } from "../../context/editor-context";
import { useSession } from "next-auth/react";
import { useLocalStorage } from "@mantine/hooks";
import Link from "next/link";
import { cn } from "@/lib/utils";

//TODO: we should differentiate between drafts and normal posts
export function EditorActions() {
  const { data: session } = useSession();
  const { editor, type, isDraft } = useEditor();
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [_, setLocalStorageContent] = useLocalStorage({
    key: "editor-content",
    defaultValue: "",
  });

  return (
    <>
      <div className="flex gap-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div className="relative flex gap-2 border-2 border-border/50 bg-muted-foreground/5 rounded-md p-1">
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-muted-foreground/10 focus:bg-muted-foreground/10 p-1"
                disabled={isSavingDraft}
                onClick={() => setIsPublishing(false)}
              >
                <Icons.save className="h-6 w-6" />
                Save Draft
              </Button>
            </DialogTrigger>
          </div>

          <div className="relative flex gap-2 border-2 border-border/50 bg-muted-foreground/5 rounded-md p-1">
            <DialogTrigger asChild>
              <Button
                className="flex items-center gap-2 hover:bg-muted-foreground/10 focus:bg-muted-foreground/10"
                variant="ghost"
                onClick={() => setIsPublishing(true)}
              >
                <Icons.send className="h-6 w-6" />
                Publish
              </Button>
            </DialogTrigger>
          </div>

          <DialogContent
            className={cn("overflow-y-auto min-w-[50dvw] h-[90dvh]")}
          >
            <PostForm
              isDraft={!isPublishing}
              submitLabel={isPublishing ? "Publish" : "Save Draft"}
              onSuccess={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
