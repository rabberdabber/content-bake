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
    <div className="container mx-auto py-4 lg:py-8">
      <article
        ref={containerRef}
        className={cn(
          "relative w-full mx-auto min-h-screen",
          "max-w-3xl",
          "p-8 md:p-12",
          "text-prose-text-light dark:text-prose-text-dark",
          "shadow-page-light dark:shadow-page-dark",
          "sm:rounded-xl",
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
            "prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-10",
            "prose-h2:text-3xl prose-h2:font-semibold prose-h2:mt-14 prose-h2:mb-6",
            "prose-h3:text-2xl prose-h3:font-medium prose-h3:mt-10 prose-h3:mb-4",
            "prose-p:text-base prose-p:leading-relaxed prose-p:my-4",
            "prose-a:text-primary prose-a:no-underline prose-a:font-medium hover:prose-a:text-primary/80",
            "prose-strong:text-foreground prose-strong:font-semibold",
            "prose-img:rounded-lg prose-img:shadow-lg prose-img:my-10",
            "prose-blockquote:border-l-4 prose-blockquote:border-primary/60",
            "prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/50",
            "prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:my-8",
            "prose-blockquote:italic",
            "prose-ul:my-6 prose-ul:list-disc prose-ul:pl-8",
            "prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-8",
            "prose-li:my-2",
            "[&_pre]:!bg-gray-950 [&_pre]:border [&_pre]:border-gray-800",
            "[&_pre]:rounded-lg [&_pre]:p-6 [&_pre]:my-8",
            "[&_code]:font-mono [&_code]:text-sm [&_code]:px-1.5 [&_code]:py-0.5",
            "[&_code]:bg-gray-100 [&_code]:dark:bg-gray-800 [&_code]:rounded-md",
            "[&>section]:border-b [&>section]:border-gray-200 [&>section]:dark:border-gray-800",
            "[&>section]:pb-10 [&>section]:mb-10",
            "prose-table:w-full prose-table:my-8",
            "prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:p-3",
            "prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700 prose-td:p-3",
            "prose-hr:my-12 prose-hr:border-gray-200 dark:prose-hr:border-gray-800"
          )}
        >
          <div className="flex flex-col space-y-4">{parsedHtmlContent}</div>
        </div>
      </article>
    </div>
  );
});

BlogPreview.displayName = "BlogPreview";

export default BlogPreview;
