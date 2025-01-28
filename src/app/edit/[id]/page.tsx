import { PostWithContentData } from "@/schemas/post";
import EditPost from "@/components/edit-post";

export const getPost = async (id: string) => {
  const post = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/by-slug/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const postData = (await post.json()) as PostWithContentData;
  return postData;
};

export default async function Page({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  return <EditPost post={post} />;
}
