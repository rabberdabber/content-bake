import Image from "next/image";
import {
  DOMNode,
  domToReact,
  Element,
  HTMLReactParserOptions,
} from "html-react-parser";

import { cn } from "../lib/utils";
import CodeBlock from "@/features/editor/components/core/code/code-block";
import VideoPlayer from "@/components/video-player";
import { DEFAULT_IMAGE_GENERATION_CONFIG } from "./image-generation";
import BaseSandbox from "@/features/editor/components/core/code/live-code-block";
import { templateFiles } from "./sandbox";

export const htmlParserOptions: HTMLReactParserOptions = {
  replace: (domNode: DOMNode) => {
    if (!("name" in domNode && "attribs" in domNode)) {
      return;
    }

    const { name, attribs, children } = domNode;
    const parent = (domNode as Element).parent;

    switch (name) {
      case "h1":
        return (
          <h1
            className={cn(
              "mt-2 scroll-m-20",
              "text-4xl font-bold tracking-tight",
              "pb-4 mb-4",
              "border-b border-border",
              "text-foreground/90",
              "self-center",
              attribs.class
            )}
          >
            {domToReact(children as DOMNode[], htmlParserOptions)}
          </h1>
        );

      case "h2":
        return (
          <h2
            className={cn(
              "group relative",
              "mt-10 scroll-m-20",
              "text-3xl font-semibold tracking-tight",
              "pb-2 mb-4",
              "border-b border-border",
              "first:mt-0",
              "hover:text-primary transition-colors",
              "[&:hover_span]:opacity-100",
              attribs.class
            )}
          >
            {domToReact(children as DOMNode[], htmlParserOptions)}
            <span
              className="absolute -left-5 opacity-0 transition-opacity text-primary"
              aria-hidden="true"
            >
              #
            </span>
          </h2>
        );

      case "h3":
        return (
          <h3
            className={cn(
              "group relative",
              "mt-8 scroll-m-20",
              "text-2xl font-semibold tracking-tight",
              "pb-2 mb-4",
              "text-foreground/80",
              "pl-4 border-l-4 border-border",
              "hover:border-primary transition-colors",
              attribs.class
            )}
          >
            {domToReact(children as DOMNode[], htmlParserOptions)}
          </h3>
        );

      case "h4":
        return (
          <h4
            className={cn(
              "mt-8 scroll-m-20",
              "text-xl font-semibold tracking-tight",
              "pb-1 mb-4",
              "text-foreground/70",
              "pl-4 border-l-2 border-border",
              "hover:border-primary transition-colors",
              attribs.class
            )}
          >
            {domToReact(children as DOMNode[], htmlParserOptions)}
          </h4>
        );

      case "h5":
        return (
          <h5
            className={cn(
              "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
              attribs.class
            )}
          >
            {domToReact(children as DOMNode[], htmlParserOptions)}
          </h5>
        );

      case "h6":
        return (
          <h6
            className={cn(
              "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
              attribs.class
            )}
          >
            {domToReact(children as DOMNode[], htmlParserOptions)}
          </h6>
        );

      case "a":
        return (
          <a
            className={cn(
              "font-medium underline underline-offset-4",
              attribs.class
            )}
            href={attribs.href}
          >
            {domToReact(children as DOMNode[], htmlParserOptions)}
          </a>
        );

      case "p":
        return (
          <p
            className={cn(
              "leading-7 [&:not(:first-child)]:mt-6",
              "text-foreground/70",
              attribs.class
            )}
          >
            {domToReact(children as DOMNode[], htmlParserOptions)}
          </p>
        );

      case "ul":
        return (
          <ul className={cn("mt-4 ml-6 list-disc first:mt-0", attribs.class)}>
            {domToReact(children as DOMNode[], htmlParserOptions)}
          </ul>
        );

      case "ol":
        return (
          <ol
            className={cn("mt-4 ml-6 list-decimal first:mt-0", attribs.class)}
          >
            {domToReact(children as DOMNode[], htmlParserOptions)}
          </ol>
        );

      case "li":
        return (
          <li className={cn("mt-2", attribs.class)}>
            {domToReact(children as DOMNode[], htmlParserOptions)}
          </li>
        );

      case "blockquote":
        return (
          <blockquote
            className={cn(
              "mt-6 border-l-4",
              "pl-6 py-4 italic",
              "bg-muted/50",
              "rounded-r-lg",
              "border-primary/60",
              "[&>*]:text-muted-foreground",
              "first:mt-0",
              attribs.class
            )}
          >
            {domToReact(children as DOMNode[], htmlParserOptions)}
          </blockquote>
        );

      case "img":
        const parseSize = (
          size: string | undefined,
          defaultSize: number
        ): number => {
          if (!size) return defaultSize;
          // If it's a percentage, convert it to pixels using the default size
          if (size.endsWith("%")) {
            const percentage = Number(size.replace("%", ""));
            return (percentage / 100) * defaultSize;
          }
          // Otherwise parse as number
          return Number(size) || defaultSize;
        };

        const width = parseSize(
          attribs["data-width"],
          DEFAULT_IMAGE_GENERATION_CONFIG.width
        );
        const height = DEFAULT_IMAGE_GENERATION_CONFIG.height;
        const align = attribs["data-align"] || "center";

        return (
          <div
            className={cn(
              "flex justify-center items-center p-2 mt-2 first:mt-0",
              align === "left" && "mr-auto",
              align === "right" && "ml-auto",
              align === "center" && "mx-auto"
            )}
            style={{
              width: attribs["data-width"]?.endsWith("%")
                ? attribs["data-width"]
                : `${width}px`,
            }}
          >
            <Image
              className={cn("rounded-md", attribs.class)}
              alt={attribs.alt || ""}
              src={attribs.src as string}
              width={width}
              height={height}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                maxWidth: "100%",
                maxHeight: "500px",
              }}
              priority
            />
          </div>
        );

      case "hr":
        return <hr className="mt-4 first:mt-0" />;

      case "table":
        return (
          <div className="mt-4 w-full overflow-y-auto first:mt-0">
            <table
              className={cn(
                "w-full border-collapse border border-border bg-background text-sm rounded-md",
                attribs.class
              )}
            >
              {domToReact(children as DOMNode[], htmlParserOptions)}
            </table>
          </div>
        );

      case "tr":
        return (
          <tr
            className={cn(
              "not-prose border-b border-border transition-colors hover:bg-muted/50",
              "even:bg-muted/50",
              attribs.class
            )}
          >
            {domToReact(children as DOMNode[], htmlParserOptions)}
          </tr>
        );

      case "th":
        return (
          <th
            className={cn(
              "not-prose border border-border px-3 py-2 text-center font-medium text-foreground/80",
              "bg-muted [&[align=left]]:text-left [&[align=right]]:text-right",
              attribs.class
            )}
          >
            {domToReact(children as DOMNode[], htmlParserOptions)}
          </th>
        );

      case "td":
        return (
          <td
            className={cn(
              "not-prose border border-border px-3 py-2 text-center text-foreground/80",
              "[&[align=left]]:text-left [&[align=right]]:text-right",
              attribs.class
            )}
          >
            {domToReact(children as DOMNode[], htmlParserOptions)}
          </td>
        );

      case "pre":
        return (
          <div className="relative group">
            <CodeBlock>
              {domToReact(children as DOMNode[], htmlParserOptions)}
            </CodeBlock>
            <button
              className={cn(
                "absolute top-4 right-4",
                "opacity-0 group-hover:opacity-100",
                "transition-opacity",
                "px-2 py-1",
                "text-xs font-medium",
                "bg-primary/10 text-primary",
                "rounded border border-primary/20",
                "hover:bg-primary/20"
              )}
              onClick={() => {
                const code = (children[0] as Element)?.children[0]?.data;
                if (code) navigator.clipboard.writeText(code);
              }}
            >
              Copy
            </button>
          </div>
        );

      case "code":
        const isInPre = parent && "name" in parent && parent.name === "pre";
        return (
          <code
            className={cn(
              "font-mono",
              isInPre
                ? ["text-sm block", "p-4", "bg-transparent", "overflow-x-auto"]
                : [
                    "text-sm",
                    "rounded",
                    "bg-muted",
                    "px-1.5 py-0.5",
                    "border border-border",
                    "text-primary",
                  ],
              attribs?.class
            )}
          >
            {domToReact(children as DOMNode[], htmlParserOptions)}
          </code>
        );
      case "livecodeblock":
        if (attribs["data-is-widget"] !== undefined) {
          return (
            <div className="mb-2">
              <BaseSandbox
                files={JSON.parse(
                  attribs["files"] || JSON.stringify(templateFiles)
                )}
                showPreview
                previewOnly
                showConsole={false}
                showEditor={false}
                showTitleBar={false}
              />
            </div>
          );
        }
        return (
          <div className="mb-2">
            <BaseSandbox
              files={JSON.parse(
                attribs["files"] || JSON.stringify(templateFiles)
              )}
              showEditor
              showPreview
            />
          </div>
        );
      case "video":
        return (
          <VideoPlayer
            src={attribs.src as string}
            poster={attribs.poster}
            onError={(error) => console.error("Video error:", error)}
            className="w-full h-full object-cover"
          />
        );
      case "div":
        if (attribs["data-youtube-video"] !== undefined) {
          const iframe = children[0] as Element;
          if (iframe && iframe.name === "iframe") {
            return (
              <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={iframe.attribs.src}
                  width={iframe.attribs.width || "640"}
                  height={iframe.attribs.height || "360"}
                  allowFullScreen={iframe.attribs.allowfullscreen === "true"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            );
          }
        }
        return domToReact(children as DOMNode[], htmlParserOptions);
    }
  },
};
