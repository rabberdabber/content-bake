"use client";

import { JSONContent } from "@tiptap/react";
import dynamic from "next/dynamic";
import { EditorActionsDialog } from "@/features/editor/components/core/editor-actions";
import { useBlockDatabaseEditor } from "@/lib/hooks/use-editor";
import { PostFormData, PostWithContentData } from "@/schemas/post";
import { PostForm } from "@/features/editor/components/core/post-form";
import { validatePost } from "@/lib/validation/post";
import { patchPost } from "@/lib/actions/post";
import { useSession } from "next-auth/react";
import { slugify, isEqual } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const EditorRoot = dynamic(
  () =>
    import("@/features/editor/components/core/editor/editor-root").then(
      (mod) => mod.EditorRoot
    ),
  { ssr: false }
);

function EditPost({ post }: { post: PostWithContentData }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    editor,
    content: editorContent,
    setContent,
  } = useBlockDatabaseEditor({
    onUpdate: async (content) => {},
    initialContent: post.content,
  });

  const handleSubmit = async (data: PostFormData) => {
    setIsLoading(true);
    let success = false;
    const allData = {
      ...data,
      author_id: session?.user.id!,
      slug: slugify(data.title),
      content: editor?.getJSON(),
      is_published: true,
    };
    const updatedDataKeys = new Set<keyof typeof allData>();
    await validatePost(allData);
    for (const key in allData) {
      console.log(
        "data vs post for key",
        key,
        allData[key as keyof typeof allData],
        post[key as keyof typeof post]
      );
      if (
        !isEqual(
          allData[key as keyof typeof data],
          post[key as keyof typeof post]
        )
      ) {
        updatedDataKeys.add(key as keyof typeof allData);
      }
    }
    console.log("updatedDataKeys", updatedDataKeys);
    const formData = new FormData();
    for (const key of Array.from(updatedDataKeys)) {
      console.log("going to append to formData", key);
      console.log(
        typeof allData[key as keyof typeof allData],
        allData[key as keyof typeof allData]
      );
      if (
        Array.isArray(allData[key as keyof typeof allData]) ||
        typeof allData[key as keyof typeof allData] === "object"
      ) {
        formData.append(
          key,
          JSON.stringify(allData[key as keyof typeof allData])
        );
      } else if (typeof allData[key as keyof typeof allData] === "boolean") {
        formData.append(
          key,
          allData[key as keyof typeof allData] ? "true" : "false"
        );
      } else {
        formData.append(key, allData[key as keyof typeof allData] as string);
      }
    }
    try {
      await patchPost(post.id, formData, post.slug);
      success = true;
    } catch (error) {
      console.error("Error patching post", error);
      toast.error(`Error updating post, ${error}`);
    } finally {
      setIsLoading(false);
      if (success) {
        toast.success(
          <div>
            <p className="inline-block mr-2">Post updated successfully</p>
            <Link
              className="underline"
              href={`/posts/${post.slug}`}
              target="_blank"
            >
              View post
            </Link>
          </div>
        );
      }
      setIsDialogOpen(false);
      router.push("/posts");
    }
  };

  return (
    <EditorRoot
      editor={editor}
      content={editorContent}
      setContent={setContent}
      actions={
        <EditorActionsDialog
          buttons={[
            {
              label: "Update post",
              icon: "send",
              onClick: () => {
                console.log("publish");
              },
            },
          ]}
          open={isDialogOpen}
          setOpen={setIsDialogOpen}
        >
          <PostForm
            defaultValues={post}
            onSubmit={handleSubmit}
            submitButtonText="Update post"
            isSubmitting={isLoading}
          />
        </EditorActionsDialog>
      }
    />
  );
}

export default dynamic(() => Promise.resolve(EditPost), { ssr: false });
