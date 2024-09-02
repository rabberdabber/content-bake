import React, { Key, useRef, useState, useEffect, useMemo } from "react";
import { Highlight, themes, Token } from "prism-react-renderer";
import { Badge } from "../ui/badge";
import { Icons } from "../icons";
import IconButton from "../ui/icon-button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

type CodeBlockProps = {
  children: React.ReactNode;
  className: string;
};

const getFileExtension = (language: string): string => {
  const extensionMap: { [key: string]: string } = {
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

  return extensionMap[language] || "txt";
};

const highlightClassName =
  "bg-yellow-100 bg-opacity-20 -mx-5 px-5 border-l-4 border-gray-800";

const MAX_HEIGHT = 400;

const CodeBlock = ({ children }: CodeBlockProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const { code, language } = useMemo(() => {
    if (!children || typeof children !== "object") {
      return { code: "", language: "" };
    }

    const { props } = children as React.ReactElement<{
      className: string;
      children: string;
    }>;
    const classNames = props.className?.split(" ") || [];
    const lastClassName = classNames.at(-1);
    const language = lastClassName
      ? lastClassName.replace(/language-/, "")
      : "";
    return { code: props.children || "", language };
  }, [children]);

  useEffect(() => {
    if (preRef.current && preRef.current.scrollHeight > MAX_HEIGHT) {
      setIsOverflowing(true);
    }
  }, [code]);

  if (!code || code.length === 0) return null;

  let highlightStart = false;
  let highlightNext = false;

  const processLine = (
    line: Token[]
  ): { shouldHighlight: boolean; shouldExclude: boolean } => {
    let shouldHighlight = highlightStart;
    let shouldExclude = false;

    const commentToken = line.find((token) => token.types.includes("comment"));
    if (commentToken) {
      const content = commentToken.content.trim();

      if (content.endsWith("highlight-start")) {
        highlightStart = true;
        shouldExclude = true;
      } else if (content.endsWith("highlight-end")) {
        highlightStart = false;
        shouldExclude = true;
      } else if (content.endsWith("highlight-line")) {
        highlightNext = true;
        shouldExclude = true;
      }
    } else if (highlightNext) {
      shouldHighlight = true;
      highlightNext = false;
    }

    return { shouldHighlight, shouldExclude };
  };

  const renderHighlight = (isCollapsed: boolean = false) => (
    <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => {
        const isOverflowing =
          preRef.current && preRef.current.scrollHeight > MAX_HEIGHT;

        console.log(isOverflowing);
        console.log(preRef.current?.scrollHeight);
        return (
          <div className="relative">
            <div className="absolute top-0 right-0 translate-y-2 -translate-x-4 flex gap-4">
              <IconButton className="border border-gray-800 bg-gray-900 p-1">
                <Icons.copy
                  onClick={() => {
                    const processedCode = tokens
                      .map((line) => {
                        const { shouldExclude } = processLine(line);
                        if (shouldExclude) return "";
                        return line.map((token) => token.content).join("");
                      })
                      .filter(Boolean)
                      .join("\n");
                    navigator.clipboard.writeText(processedCode);
                  }}
                />
              </IconButton>
              <IconButton className="border border-gray-800 bg-gray-900 p-1">
                <Icons.download
                  onClick={() => {
                    const processedCode = tokens
                      .map((line) => {
                        const { shouldExclude } = processLine(line);
                        if (shouldExclude) return "";
                        return line.map((token) => token.content).join("");
                      })
                      .filter(Boolean)
                      .join("\n");
                    const extension = getFileExtension(language);
                    const filename = `code.${extension}`;
                    const blob = new Blob([processedCode], {
                      type: "text/plain",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = filename;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                />
              </IconButton>
            </div>
            <pre
              ref={preRef}
              className={`${className} overflow-x-auto`}
              style={{
                ...style,
                padding: "20px",
                maxHeight:
                  isOverflowing && isCollapsed ? `${MAX_HEIGHT}px` : "none",
                overflow: isOverflowing && isCollapsed ? "hidden" : "auto",
              }}
            >
              {tokens.map((line, i) => {
                const { key, ...lineProps } = getLineProps({ line, key: i });
                const { shouldHighlight, shouldExclude } = processLine(line);
                if (shouldHighlight) {
                  lineProps.className = `${lineProps.className} ${highlightClassName}`;
                }
                if (shouldExclude) {
                  return null;
                }
                return (
                  <div key={key as Key} {...lineProps}>
                    {line.map((token, key) => {
                      const { key: tokenKey, ...tokenProps } = getTokenProps({
                        token,
                        key,
                      });
                      return (
                        <span key={tokenKey as Key} {...tokenProps}>
                          {token.content}
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            </pre>
          </div>
        );
      }}
    </Highlight>
  );

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <div className="relative max-w-[800px]">
        <div className="absolute top-0 right-0 -translate-y-[110%]">
          {language && <Badge variant="outline">{language}</Badge>}
        </div>
        {renderHighlight(!isOpen)}
      </div>
      {isOverflowing && (
        <>
          <CollapsibleContent>{renderHighlight()}</CollapsibleContent>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">
              {isOpen ? "Show less" : "Show more"}
            </Button>
          </CollapsibleTrigger>
        </>
      )}
    </Collapsible>
  );
};

export default CodeBlock;
