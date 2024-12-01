import React from "react";
import parse from "html-react-parser";
import { cn } from "@/lib/utils";
import { htmlParserOptions } from "@/config/html-parser";

interface BlogPreviewProps {
  content: string;
  className?: string;
  blogRef?: React.RefObject<HTMLDivElement>;
}

const BlogPreview = ({ content, className, blogRef }: BlogPreviewProps) => {
  return (
    <article
      className={cn(
        "relative max-w-full min-h-screen mx-auto",
        "grid-cols-[1fr_min(var(--tw-trimmed-content-width),100%)_1fr]",
        "p-16 sm:p-16 pb-8",
        "bg-page-background-light dark:bg-page-background-dark",
        "shadow-page-light dark:shadow-page-dark",
        "sm:border sm:border-page-border-light dark:border-page-border-dark",
        "sm:rounded-lg",
        className
      )}
    >
      <div
        ref={blogRef}
        className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none dark:prose-invert"
      >
        <div className="flex flex-col justify-center items-center gap-8">
          {parse(content, htmlParserOptions)}
        </div>
      </div>
    </article>
  );
};

export default BlogPreview;
