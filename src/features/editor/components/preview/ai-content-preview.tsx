import React, {
  useState,
  memo,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
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
import { motion, AnimatePresence } from "framer-motion";

interface AIContentPreviewProps {
  content: JSONContent | null;
  editor: Editor | null;
  isLoading: boolean;
  className?: string;
}

const LoadingAnimation = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="space-y-4"
  >
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ width: "100%", opacity: 0.5 }}
        animate={{
          opacity: [0.5, 1, 0.5],
          transition: {
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
          },
        }}
        className="h-4 bg-muted rounded"
        style={{ width: `${Math.random() * 40 + 60}%` }}
      />
    ))}
  </motion.div>
);

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
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingAnimation />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {content && <BlogPreview content={content} />}
            </motion.div>
          )}
        </AnimatePresence>
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
}

const BlogPreview = memo(
  ({ className, blogRef, content }: BlogPreviewProps) => {
    const [htmlContent, setHtmlContent] = useState<string>("");
    const debouncedSetHtmlContent = useDebounce(setHtmlContent, 500);
    const renderCount = useRef(0);
    const targetRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
      if (targetRef.current) {
        targetRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, []);

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        if (targetRef.current && htmlContent) {
          scrollToBottom();
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }, [htmlContent, scrollToBottom]);

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
