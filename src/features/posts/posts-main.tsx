"use client";

import { Post } from "@/types/api";
import parse from "html-react-parser";
import { htmlParserOptions } from "@/config/html-parser";
import { generateHTML } from "@tiptap/react";
import extensions from "../editor/components/extensions";

export function PostsMain({ postContent }: { postContent: Post["content"] }) {
  const htmlContent = generateHTML(postContent, extensions);
  return <>{parse(htmlContent, htmlParserOptions)}</>;
}
