import React from "react";
import { generateHTML, JSONContent } from "@tiptap/react";
import parse from "html-react-parser";
import { cn } from "@/lib/utils";
import { htmlParserOptions } from "@/config/html-parser";
import extensions from "@/features/editor/components/extensions";

// TODO: add fonts
// import { Merriweather, Montserrat, JetBrains_Mono } from "next/font/google";

// const serif = Merriweather({
//   subsets: ["latin"],
//   weight: ["400", "700"],
//   style: ["normal", "italic"],
//   variable: "--font-serif",
// });

// const display = Montserrat({
//   subsets: ["latin"],
//   weight: ["500", "600", "700"],
//   variable: "--font-display",
// });

// const mono = JetBrains_Mono({
//   subsets: ["latin"],
//   weight: ["400", "500"],
//   variable: "--font-mono",
// });

interface BlogPreviewProps {
  content: JSONContent | string;
  className?: string;
  blogRef?: React.RefObject<HTMLDivElement>;
}

const BlogPreview = ({ content, className, blogRef }: BlogPreviewProps) => {
  const htmlContent =
    typeof content === "string" ? content : generateHTML(content, extensions);
  console.log(JSON.stringify(htmlContent, null, 2));
  return (
    <article
      className={cn(
        "relative w-full min-h-screen mx-auto",
        "p-8 sm:p-12 md:p-16",
        // "sm:border sm:border-page-border-light dark:border-page-border-dark",
        // "bg-white dark:bg-slate-900",
        "text-prose-text-light dark:text-prose-text-dark", // Updated text colors
        "shadow-page-light dark:shadow-page-dark",
        "sm:rounded-lg",
        className
      )}
    >
      <div
        ref={blogRef}
        className={cn(
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl",
          "mx-auto max-w-[65ch]",
          "focus:outline-none",
          "dark:prose-invert",
          "prose-headings:font-[var(--font-display)]",
          "prose-p:font-[var(--font-serif)]",
          "prose-p:leading-relaxed",
          "prose-a:font-medium",
          "prose-pre:bg-slate-900",
          "prose-pre:border prose-pre:border-slate-800",
          "[&_img]:mx-auto [&_img]:object-contain",
          "[&_pre]:!bg-slate-900 [&_pre]:border [&_pre]:border-slate-800",
          "[&_code]:font-[var(--font-mono)] [&_code]:text-sky-500"
        )}
      >
        <div className="flex flex-col">
          {parse(htmlContent, htmlParserOptions)}
        </div>
      </div>
    </article>
  );
};

export default BlogPreview;
