import React, { useEffect, useMemo, useRef, useState } from "react";
import { Highlight, PrismTheme, themes } from "prism-react-renderer";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CollapsibleWrapper, {
  useCollapsibleWrapper,
} from "@/components/collapsible-wrapper";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  showLineNumbers?: boolean;
  fontSize?: string;
  theme?: PrismTheme;
}

interface CodeContent {
  code: string;
  language: string;
}

const LANGUAGE_EXTENSIONS: Record<string, string> = {
  javascript: "js",
  typescript: "ts",
  python: "py",
  java: "java",
  cpp: "cpp",
  csharp: "cs",
  go: "go",
  rust: "rs",
  swift: "swift",
  kotlin: "kt",
  ruby: "rb",
  php: "php",
  html: "html",
  css: "css",
  scss: "scss",
  json: "json",
  yaml: "yaml",
  markdown: "md",
  sql: "sql",
  shell: "sh",
  powershell: "ps1",
  dockerfile: "Dockerfile",
};

const getFileExtension = (language: string): string => {
  return LANGUAGE_EXTENSIONS[language] || language;
};

const parseCodeContent = (children: React.ReactNode): CodeContent => {
  if (!children || typeof children !== "object") {
    return { code: "", language: "" };
  }

  const element = children as React.ReactElement<{
    className: string;
    children: string | string[];
  }>;

  // Extract code content
  const rawCode = element.props.children;
  const code = Array.isArray(rawCode) ? rawCode.join("") : rawCode || "";

  // Extract language from className
  const classNames = element.props.className?.split(" ") || [];
  const languageClass = classNames.find((className) =>
    className.startsWith("language-")
  );
  const language = languageClass ? languageClass.replace("language-", "") : "";

  return { code, language };
};

function HighlightedCode({
  code,
  language,
  showLineNumbers = true,
  fontSize = "14px",
  theme = themes.nightOwl,
}: {
  code: string;
  language: string;
} & Omit<CodeBlockProps, "children">) {
  const { maxHeight, setIsOverflowing, isExpanded } = useCollapsibleWrapper();
  const contentRef = useRef<HTMLPreElement>(null);
  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > maxHeight);
    }
  }, [maxHeight]);

  return (
    <Highlight theme={theme} code={code.trim()} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          ref={contentRef}
          className={cn(
            className,
            "p-4 md:p-6 rounded-b-lg overflow-x-auto font-mono relative not-prose",
            !isExpanded && "max-h-[400px]",
            "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500 dark:hover:scrollbar-thumb-gray-500"
          )}
          style={{
            ...style,
            backgroundColor: "#282c34",
            fontSize: fontSize,
            lineHeight: "1.6",
            overflow: !isExpanded ? "hidden" : "auto",
          }}
        >
          <div className="relative table min-w-full">
            {tokens.map((line, i) => (
              <div
                key={i}
                {...getLineProps({ line })}
                className={cn(
                  "table-row relative group",
                  "hover:bg-gray-700/20 transition-colors duration-150"
                )}
              >
                {showLineNumbers && (
                  <span
                    className={cn(
                      "table-cell text-gray-500 text-right pr-4 select-none pl-4",
                      "w-[3.5rem] sticky left-0 bg-inherit",
                      "border-r border-r-gray-700/30",
                      "group-hover:text-gray-400 transition-colors duration-150"
                    )}
                    style={{ fontSize }}
                  >
                    {i + 1}
                  </span>
                )}
                <span className="table-cell pl-4 whitespace-pre">
                  {line.map((token, key) => (
                    <span
                      key={key}
                      {...getTokenProps({ token })}
                      style={{
                        ...getTokenProps({ token }).style,
                        fontSize,
                      }}
                    />
                  ))}
                </span>
              </div>
            ))}
          </div>
        </pre>
      )}
    </Highlight>
  );
}

const getLanguageIcon = (language: string): string => {
  // Normalize the language name

  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${language}/${language}-original.svg`;
};

function CodeBlockHeader({
  language,
  onCopy,
  onDownload,
  copied,
  deleteNode,
}: {
  language: string;
  onCopy: () => void;
  onDownload: () => void;
  copied: boolean;
  deleteNode?: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3",
        "border-b border-gray-200 dark:border-gray-700",
        "bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm",
        "rounded-t-lg sticky top-0 z-10"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative w-6 h-6 md:w-8 md:h-8 transition-all duration-200">
          <Image
            src={getLanguageIcon(language)}
            alt={`${language} icon`}
            className={cn(
              "absolute inset-0 object-contain not-prose",
              "transition-all duration-200 hover:scale-110"
            )}
            onError={(e) => {
              e.currentTarget.src =
                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg";
            }}
            fill
            unoptimized
          />
        </div>
        <span
          className={cn(
            "text-sm font-medium text-gray-600 dark:text-gray-300",
            "hidden sm:inline-block"
          )}
        >
          {language.toLowerCase()}
        </span>
      </div>
      <div className="flex items-center gap-1 md:gap-2">
        {deleteNode && (
          <Button
            variant="destructive"
            size="icon"
            className={cn(
              "absolute top-2 right-0 hidden focus:block h-8 w-8 md:h-9 md:w-9",
              "transition-all duration-200 hover:scale-105"
            )}
            onClick={deleteNode}
          >
            <Icons.trash className="h-4 w-4" />
          </Button>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDownload}
                className={cn(
                  "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                  "transition-all duration-200 hover:scale-105",
                  "h-8 w-8 md:h-9 md:w-9"
                )}
              >
                <Icons.download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Download code</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCopy}
                className={cn(
                  "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                  "transition-all duration-200 hover:scale-105",
                  "h-8 w-8 md:h-9 md:w-9",
                  copied && "text-green-500 dark:text-green-400"
                )}
              >
                {copied ? (
                  <Icons.check className="h-4 w-4" />
                ) : (
                  <Icons.copy className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              {copied ? "Copied!" : "Copy code"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

function CodeBlock({
  children,
  showLineNumbers = true,
  fontSize = "14px",
  theme = themes.nightOwl,
  className,
  deleteNode,
}: CodeBlockProps & { deleteNode?: () => void }) {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);

  const { code, language } = useMemo(
    () => parseCodeContent(children),
    [children]
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, [code]);

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      if (blockRef.current?.contains(e.target as Node)) {
        setIsFocused(true);
      } else {
        setIsFocused(false);
      }
    };

    document.addEventListener("focusin", handleFocus);
    document.addEventListener("focusout", handleFocus);

    return () => {
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("focusout", handleFocus);
    };
  }, []);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSnippet = async () => {
    const extension = getFileExtension(language);
    const filename = `code.${extension}`;
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderCodeBlock = () => (
    <div
      ref={blockRef}
      className={cn(
        "relative group rounded-lg border border-gray-200 dark:border-gray-700",
        "transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600",
        "shadow-lg hover:shadow-xl",
        className
      )}
    >
      <CodeBlockHeader
        language={language}
        onCopy={copyToClipboard}
        onDownload={downloadSnippet}
        copied={copied}
        deleteNode={deleteNode}
      />

      {isLoading ? (
        <div className="h-32 flex items-center justify-center bg-[#282c34] rounded-b-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <HighlightedCode
          code={code}
          language={language}
          showLineNumbers={showLineNumbers}
          fontSize={fontSize}
          theme={theme}
        />
      )}
    </div>
  );

  return (
    <CollapsibleWrapper maxHeight={600}>{renderCodeBlock()}</CollapsibleWrapper>
  );
}

export default CodeBlock;
