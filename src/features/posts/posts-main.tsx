"use client";

import { PostWithContentData } from "@/schemas/post";
import parse from "html-react-parser";
import { htmlParserOptions } from "@/config/html-parser";
import { generateHTML } from "@tiptap/react";
import extensions from "../editor/components/extensions";

export function PostsMain({
  postContent,
}: {
  postContent: PostWithContentData["content"];
}) {
  const htmlContent = generateHTML(postContent, extensions);
  return <div className="prose">{parse(htmlContent, htmlParserOptions)}</div>;
}
