import React, { useEffect, useMemo, useRef, useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
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
            "p-4 rounded-lg overflow-x-auto font-mono relative not-prose",
            !isExpanded && "max-h-[400px]"
          )}
          style={{
            ...style,
            backgroundColor: "#011627",
            fontSize: fontSize,
            lineHeight: "1.5",
            overflow: !isExpanded ? "hidden" : "auto",
          }}
        >
          <div className="relative">
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className="table-row">
                {showLineNumbers && (
                  <span
                    className="table-cell text-gray-500 text-right pr-4 select-none w-12 opacity-50"
                    style={{ fontSize }}
                  >
                    {i + 1}
                  </span>
                )}
                <span className="table-cell">
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
}: {
  language: string;
  onCopy: () => void;
  onDownload: () => void;
  copied: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8">
          <Image
            src={getLanguageIcon(language)}
            alt={`${language} icon`}
            className="absolute inset-0 object-contain not-prose"
            onError={(e) => {
              // Fallback to generic code icon if image fails to load
              e.currentTarget.src =
                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg";
            }}
            fill
            unoptimized
          />
        </div>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {language.toLowerCase()}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDownload}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Icons.download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download code</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCopy}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {copied ? (
                  <Icons.check className="h-4 w-4" />
                ) : (
                  <Icons.copy className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{copied ? "Copied!" : "Copy code"}</TooltipContent>
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
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { code, language } = useMemo(
    () => parseCodeContent(children),
    [children]
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, [code]);

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
    <div className="relative group rounded-lg border border-gray-200 dark:border-gray-700">
      <CodeBlockHeader
        language={language}
        onCopy={copyToClipboard}
        onDownload={downloadSnippet}
        copied={copied}
      />

      {isLoading ? (
        <div className="h-32 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
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
    <CollapsibleWrapper maxHeight={400}>{renderCodeBlock()}</CollapsibleWrapper>
  );
}

export default CodeBlock;
