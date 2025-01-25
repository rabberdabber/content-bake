"use client";

import { PostForm } from "./post-form";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEditor } from "../../context/editor-context";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

//TODO: we should differentiate between drafts and normal posts
export function EditorActions() {
  const router = useRouter();
  const { data: session } = useSession();
  const { isDemo } = useEditor();
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const onClickPublish = () => {
    if (session) {
      setIsPublishing(true);
    } else {
      router.push("/auth/signin");
    }
  };

  const onClickSaveDraft = () => {
    if (session) {
      setIsPublishing(false);
    } else {
      router.push("/auth/signin");
    }
  };

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
                onClick={onClickSaveDraft}
              >
                <Icons.save className="h-6 w-6" />
                {session ? "Save Draft" : "Login to Save Draft"}
              </Button>
            </DialogTrigger>
          </div>

          <div className="relative flex gap-2 border-2 border-border/50 bg-muted-foreground/5 rounded-md p-1">
            <DialogTrigger asChild>
              <Button
                className="flex items-center gap-2 hover:bg-muted-foreground/10 focus:bg-muted-foreground/10"
                variant="ghost"
                onClick={onClickPublish}
              >
                <Icons.send className="h-6 w-6" />
                {session ? "Publish" : "Login to Publish"}
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
