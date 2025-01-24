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
  return (
    <div className="prose-h1:text-center container max-w-4xl text-green prose prose-headings:font-[var(--font-display)] prose-p:font-[var(--font-serif)] prose-p:leading-relaxed prose-a:font-medium prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 [&_img]:mx-auto [&_img]:object-contain [&_pre]:!bg-slate-900 [&_pre]:border [&_pre]:border-slate-800 [&_code]:font-[var(--font-mono)] [&_code]:text-sky-500">
      {parse(htmlContent, htmlParserOptions)}
    </div>
  );
}
