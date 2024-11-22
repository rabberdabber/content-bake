import React, { useEffect, useMemo, useRef, useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Icons } from "../icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CollapsibleWrapper, {
  useCollapsibleWrapper,
} from "./collapsible-wrapper";

interface CodeBlockProps {
  children: React.ReactNode;
  showLineNumbers?: boolean;
  fontSize?: string;
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
    <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          ref={contentRef}
          className={cn(
            className,
            "p-4 rounded-lg overflow-x-auto font-mono relative",
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

function CodeBlock({
  children,
  showLineNumbers = true,
  fontSize = "14px",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const { code, language } = useMemo(
    () => parseCodeContent(children),
    [children]
  );

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSnippet = async () => {
    const extension = getFileExtension(language);
    const filename = `code.${extension}`;
    const blob = new Blob([code], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderCodeBlock = () => (
    <div className="relative group rounded-lg">
      <div className="absolute right-4 top-4 z-20 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 bg-gray-700/50 hover:bg-gray-700 text-gray-100"
          onClick={downloadSnippet}
        >
          <Icons.download className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 bg-gray-700/50 hover:bg-gray-700 text-gray-100"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Icons.check className="h-3 w-3" />
          ) : (
            <Icons.copy className="h-3 w-3" />
          )}
        </Button>
      </div>
      <HighlightedCode
        code={code}
        language={language}
        showLineNumbers={showLineNumbers}
        fontSize={fontSize}
      />
    </div>
  );

  return (
    <CollapsibleWrapper maxHeight={400}>{renderCodeBlock()}</CollapsibleWrapper>
  );
}

export default CodeBlock;
