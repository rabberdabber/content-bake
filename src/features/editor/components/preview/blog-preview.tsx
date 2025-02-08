import React, { useState, useEffect, useRef, memo, useMemo } from "react";
import { generateHTML } from "@tiptap/react";
import parse from "html-react-parser";
import { cn, validateSchema } from "@/lib/utils";
import { htmlParserOptions } from "@/config/html-parser";
import extensions from "@/features/editor/components/extensions";
import { useDebounce } from "@/hooks/use-debounce";
import { useEditor } from "../../context/editor-context";

interface BlogPreviewProps {
  className?: string;
  blogRef?: React.RefObject<HTMLDivElement>;
}

const BlogPreview = memo(({ className, blogRef }: BlogPreviewProps) => {
  const { content } = useEditor();
  const [htmlContent, setHtmlContent] = useState<string>("");
  const debouncedSetHtmlContent = useDebounce(setHtmlContent, 500);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsedHtmlContent = useMemo(() => {
    return parse(htmlContent, htmlParserOptions);
  }, [htmlContent]);

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
    <div className="container mx-auto py-4 lg:py-6">
      <article
        ref={containerRef}
        className={cn(
          "relative w-full mx-auto",
          "max-w-4xl",
          "p-6 sm:p-8 md:p-10",
          "text-prose-text-light dark:text-prose-text-dark",
          "shadow-page-light dark:shadow-page-dark",
          "sm:rounded-lg",
          "bg-white dark:bg-gray-900",
          "border border-gray-200 dark:border-gray-800",
          className
        )}
      >
        <div
          ref={blogRef}
          className={cn(
            "prose dark:prose-invert max-w-none",
            "prose-headings:font-display prose-headings:tracking-tight",
            "prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-6",
            "prose-h2:text-3xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4",
            "prose-h3:text-2xl prose-h3:font-medium prose-h3:mt-6 prose-h3:mb-3",
            "prose-p:text-base prose-p:leading-7 prose-p:my-4",
            "prose-a:text-primary prose-a:no-underline hover:prose-a:text-primary/80",
            "prose-strong:text-foreground prose-strong:font-semibold",
            "prose-img:rounded-lg prose-img:shadow-md prose-img:my-8",
            "[&_img]:mx-auto [&_img]:object-cover",
            "prose-blockquote:border-l-4 prose-blockquote:border-primary/60",
            "prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/50",
            "prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:my-6",
            "prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6",
            "prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6",
            "[&_pre]:!bg-gray-950 [&_pre]:border [&_pre]:border-gray-800",
            "[&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:my-4",
            "[&_code]:font-mono [&_code]:text-sm",
            "[&>section]:border-b [&>section]:border-gray-200 [&>section]:dark:border-gray-800",
            "[&>section]:pb-6 [&>section]:mb-6",
            "prose-table:w-full prose-table:my-6",
            "prose-th:bg-gray-100 dark:prose-th:bg-gray-800",
            "prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700",
            "prose-hr:my-8"
          )}
        >
          <div className="flex flex-col">{parsedHtmlContent}</div>
        </div>
      </article>
    </div>
  );
});

BlogPreview.displayName = "BlogPreview";

export default BlogPreview;
