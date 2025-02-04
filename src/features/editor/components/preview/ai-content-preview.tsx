import React, { useState, memo, useMemo, useEffect, useRef } from "react";
import { JSONContent } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { generateHTML } from "@tiptap/react";
import parse from "html-react-parser";
import { validateSchema } from "@/lib/utils";
import { htmlParserOptions } from "@/config/html-parser";
import extensions from "@/features/editor/components/extensions";
import { useDebounce } from "@/hooks/use-debounce";
import { useScrollIntoView } from "@mantine/hooks";

interface AIContentPreviewProps {
  content: JSONContent | null;
  editor: Editor | null;
  isLoading: boolean;
  className?: string;
}

export function AIContentPreview({
  content,
  editor,
  isLoading,
  className,
}: AIContentPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  if (!editor) return null;

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent
        ref={previewRef}
        className="h-[500px] overflow-y-auto p-4 prose prose-sm dark:prose-invert max-w-none"
      >
        {isLoading && !content && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[400px]" />
            <Skeleton className="h-4 w-[300px]" />
            <Skeleton className="h-4 w-[350px]" />
          </div>
        )}

        {content && <BlogPreview content={content} />}
      </CardContent>
    </Card>
  );
}

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
  className?: string;
  blogRef?: React.RefObject<HTMLDivElement>;
  content: JSONContent;
  targetRef?: React.RefObject<HTMLDivElement>;
}

const BlogPreview = memo(
  ({ className, blogRef, content }: BlogPreviewProps) => {
    const [htmlContent, setHtmlContent] = useState<string>("");
    const debouncedSetHtmlContent = useDebounce(setHtmlContent, 500);
    const renderCount = useRef(0);

    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
      duration: 200,
      offset: 60,
      cancelable: true,
      isList: false,
    });

    useEffect(() => {
      // Wait for content to be processed and rendered
      const timeoutId = setTimeout(() => {
        if (targetRef.current && htmlContent) {
          scrollIntoView({ alignment: "end" });
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }, [htmlContent, scrollIntoView]);

    // Memoize the parsed HTML content
    const parsedHtmlContent = useMemo(() => {
      renderCount.current += 1;
      console.log(`BlogPreview has rendered ${renderCount.current} times`);
      return parse(htmlContent, htmlParserOptions);
    }, [htmlContent]); // Only re-parse when htmlContent changes

    useEffect(() => {
      const processContent = () => {
        if (typeof content !== "string") {
          try {
            validateSchema(content, extensions);
            const generatedHTML = generateHTML(content, extensions);
            debouncedSetHtmlContent(generatedHTML);
          } catch (e) {
            console.error("Error in BlogPreview for content:", content, e);
          }
        } else {
          debouncedSetHtmlContent(content);
        }
      };

      processContent();
    }, [content, debouncedSetHtmlContent]);

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
          <div className="flex flex-col">{parsedHtmlContent}</div>
          <div ref={targetRef} className="h-4" />
        </div>
      </article>
    );
  }
);

BlogPreview.displayName = "BlogPreview";

export default BlogPreview;
