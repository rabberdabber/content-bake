import React, { Key } from "react";
import { Highlight, themes, Token } from "prism-react-renderer";
import { Badge } from "../ui/badge";

type CodeBlockProps = {
  children: React.ReactNode;
  className: string;
};

const highlightClassName =
  "bg-yellow-100 bg-opacity-20 -mx-5 px-5 border-l-4 border-gray-800";

const CodeBlock = ({ children }: CodeBlockProps) => {
  if (!children || typeof children !== "object") return null;

  const {
    props: { className, children: code = "" },
  } = children as React.ReactElement<{ className: string; children: string }>;

  const classNames = className.split(" ");
  const lastClassName = classNames?.at(-1);
  const language = lastClassName ? lastClassName.replace(/language-/, "") : "";

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

  return (
    <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div className="relative max-w-[600px]">
          <div className="absolute top-0 right-0 -translate-y-[110%]">
            {language && <Badge variant="outline">{language}</Badge>}
          </div>
          <pre
            className={`${className} overflow-x-auto`}
            style={{ ...style, padding: "20px" }}
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
      )}
    </Highlight>
  );
};

export default CodeBlock;
