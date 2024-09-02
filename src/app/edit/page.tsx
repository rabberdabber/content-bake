import { Metadata } from "next";
import EditBlog from "./edit-blog";

export const metadata: Metadata = {
  title: "Blog Editor",
  description: "Bite Sized Blog by bake.",
};

const EditorPage = () => {
  return <EditBlog />;
};

export default EditorPage;
