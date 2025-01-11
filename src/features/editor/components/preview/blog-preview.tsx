import React, { useState, useEffect, useRef, memo, useMemo } from "react";
import { generateHTML, JSONContent } from "@tiptap/react";
import parse from "html-react-parser";
import { cn, validateSchema } from "@/lib/utils";
import { htmlParserOptions } from "@/config/html-parser";
import extensions from "@/features/editor/components/extensions";
import { useDebounce } from "@/hooks/use-debounce";

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

const BlogPreview = memo(
  ({ content, className, blogRef }: BlogPreviewProps) => {
    const [htmlContent, setHtmlContent] = useState<string>("");
    const debouncedSetHtmlContent = useDebounce(setHtmlContent, 500);
    const containerRef = useRef<HTMLDivElement>(null);
    const renderCount = useRef(0);

    // Memoize the parsed HTML content
    const parsedHtmlContent = useMemo(() => {
      renderCount.current += 1;
      console.log(`BlogPreview has rendered ${renderCount.current} times`);
      return parse(htmlContent, htmlParserOptions);
    }, [htmlContent]); // Only re-parse when htmlContent changes

    useEffect(() => {
      // Scroll to center when content updates
      if (containerRef.current) {
        const timer = setTimeout(() => {
          containerRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [htmlContent]);

    useEffect(() => {
      const processContent = () => {
        if (typeof content !== "string") {
          try {
            validateSchema(content, extensions);
            const generatedHTML = generateHTML(content, extensions);
            debouncedSetHtmlContent(generatedHTML);
          } catch (e) {
            console.error("Error in BlogPreview", e);
          }
        } else {
          debouncedSetHtmlContent(content);
        }
      };

      processContent();
    }, [content, debouncedSetHtmlContent]);

    return (
      <article
        ref={containerRef}
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
          <div className="flex flex-col">{parsedHtmlContent}</div>
        </div>
      </article>
    );
  }
);

BlogPreview.displayName = "BlogPreview";

export default BlogPreview;
