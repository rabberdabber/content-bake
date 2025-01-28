import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import EditDraft from "@/components/edit-draft";
import { DraftResponse } from "@/schemas/post";

async function getDraft(id: string) {
  const env = process.env.NEXT_ENV;
  const cookieName =
    env === "local"
      ? "next-auth.session-token"
      : "__Secure-next-auth.session-token";
  const posts = await fetch(`${process.env.NEXTAUTH_URL}/api/drafts/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(cookies().get(cookieName) && {
        Authorization: `Bearer ${cookies().get(cookieName)?.value}`,
      }),
      cache: "no-store",
    },
  });

  if (!posts.ok) {
    if (posts.status === 401) {
      redirect("/auth/signin");
    }
    throw new Error("Failed to fetch published posts");
  }
  return posts.json();
}

export default async function Page({ params }: { params: { id: string } }) {
  const draft = await getDraft(params.id);
  console.log("draftData", draft);
  return <EditDraft draft={draft} />;
}
