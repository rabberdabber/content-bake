"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { DraftWithContentData } from "@/schemas/post";
import { generateHTML } from "@tiptap/react";
import extensions from "@/features/editor/components/extensions";
import { useSession } from "next-auth/react";

const EditorContainer = dynamic(
  () =>
    import("@/features/editor/components/editor-container").then(
      (mod) => mod.EditorContainer
    ),
  { ssr: false }
);

export default function DraftPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [draft, setDraft] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!session) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/drafts/${params.id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) =>
        setDraft(
          generateHTML((data as DraftWithContentData).content, extensions)
        )
      );
  }, [params.id, session]);

  if (!draft) return null;
  if (!session) return <div>You are not authorized to view this page</div>;

  const handleSave = async (content: string) => {
    try {
      setIsSaving(true);
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/drafts/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <EditorContainer
      initialContent={draft}
      onSave={handleSave}
      source="draft"
    />
  );
}
