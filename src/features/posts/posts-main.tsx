"use client";

import { PostWithContentData } from "@/schemas/post";
import parse from "html-react-parser";
import { htmlParserOptions } from "@/config/html-parser";
import { generateHTML } from "@tiptap/react";
import extensions from "../editor/components/extensions";
import { useEffect } from "react";
import { useState } from "react";

export function PostsMain({
  postContent,
}: {
  postContent: PostWithContentData["content"];
}) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null;
  }
  return (
    <div className="min-h-screen prose-h1:text-center container max-w-4xl ">
      {parse(generateHTML(postContent, extensions), htmlParserOptions)}
    </div>
  );
}
