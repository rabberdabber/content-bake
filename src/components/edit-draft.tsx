"use client";
import { useBlockDatabaseEditor } from "@/lib/hooks/use-editor";
import dynamic from "next/dynamic";
import { EditorActionsDialog } from "@/features/editor/components/core/editor-actions";
import { PostForm } from "@/features/editor/components/core/post-form";
import { createPost, patchPost } from "@/lib/actions/post";
import { toast } from "sonner";
import {
  DraftResponse,
  DraftWithContentData,
  PostData,
  PostFormData,
} from "@/schemas/post";
import { validatePost } from "@/lib/validation/post";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { slugify } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DraftForm } from "@/features/editor/components/core/draft-form";

const EditorRoot = dynamic(
  () =>
    import("@/features/editor/components/core/editor/editor-root").then(
      (mod) => mod.EditorRoot
    ),
  { ssr: false }
);

function EditDraft({ draft }: { draft: DraftResponse }) {
  const router = useRouter();
  const { editor, content, setContent } = useBlockDatabaseEditor({
    onUpdate: async (content) => {
      console.log("local editor content", content);
    },
    initialContent: draft.content,
  });
  const { data: session } = useSession();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePublishSubmit = async (data: DraftWithContentData) => {
    setIsPublishing(true);
    console.log("data", data);
    let success = false;
    let post: PostData | null = null;
    const formData = new FormData();
    const allData = {
      ...data,
      author_id: session?.user.id!,
      slug: slugify(data.title),
      content: editor?.getJSON(),
      is_published: true,
    };
    await validatePost(allData);
    for (const key in allData) {
      const value = allData[key as keyof typeof allData];
      if (Array.isArray(value) || typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value as string);
      }
    }
    formData.delete("content");
    formData.append("content", JSON.stringify(editor?.getJSON()));
    try {
      post = await patchPost(draft.id, formData, draft.slug);
      success = true;
    } catch (error) {
      console.error("Error patching post", error);
      toast.error(`Error updating post, ${error}`);
    } finally {
      setIsPublishing(false);
      if (success) {
        toast.success(
          <div>
            <p className="inline-block mr-2">Post published successfully</p>
            <Link
              className="underline"
              href={`/posts/${post?.slug}`}
              target="_blank"
            >
              View post
            </Link>
          </div>
        );
      }
    }
    setIsDialogOpen(false);
    setContent("");
    router.push("/posts");
  };

  const handleDraftSubmit = async (data: PostFormData) => {
    setIsPublishing(true);
    let success = false;
    let post: PostData | null = null;
    const formData = new FormData();
    const allData = {
      ...data,
      author_id: session?.user.id!,
      slug: data.title ? slugify(data.title) : `draft-${Date.now()}`,
      content: editor?.getJSON(),
      is_published: false,
    };

    // For drafts, we only validate the content
    const draftValidation = {
      ...allData,
      title: allData.title || `Draft ${new Date().toLocaleDateString()}`,
      excerpt: allData.excerpt || null,
      feature_image_url: allData.feature_image_url || null,
    };

    for (const key in draftValidation) {
      const value = draftValidation[key as keyof typeof draftValidation];
      if (Array.isArray(value) || typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value as string);
      }
    }

    try {
      post = await createPost(formData);
      success = true;
    } catch (error) {
      console.error("Error saving draft", error);
      toast.error(`Error saving draft, ${error}`);
    } finally {
      setIsPublishing(false);
      if (success) {
        toast.success("Draft saved successfully");
        setContent("");
        router.push("/drafts");
      }
    }
    setIsDialogOpen(false);
  };

  console.log("draft", draft);
  return (
    <EditorRoot
      editor={editor}
      content={content}
      setContent={setContent}
      actions={
        <EditorActionsDialog
          open={isDialogOpen}
          setOpen={setIsDialogOpen}
          buttons={[
            {
              label: "Save",
              icon: "save",
              onClick: () => {
                console.log("save");
              },
              children: (
                <PostForm
                  onSubmit={handleDraftSubmit}
                  isSubmitting={isPublishing}
                />
              ),
            },
            {
              label: "Publish",
              icon: "send",
              onClick: () => {
                console.log("publish");
              },
              children: (
                <DraftForm
                  onSubmit={handlePublishSubmit}
                  isSubmitting={isPublishing}
                />
              ),
            },
          ]}
        />
      }
    />
  );
}

export default dynamic(() => Promise.resolve(EditDraft), { ssr: false });
