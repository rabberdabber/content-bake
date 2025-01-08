import Image from "next/image";
import {
  DOMNode,
  domToReact,
  Element,
  HTMLReactParserOptions,
} from "html-react-parser";

import { cn } from "../lib/utils";
import Sandbox from "@/components/code/live-code-block";
import CodeBlock from "@/components/code/code-block";
import VideoPlayer from "@/components/video-player";
import { DEFAULT_IMAGE_GENERATION_CONFIG } from "./image-generation";

export const htmlParserOptions: HTMLReactParserOptions = {
  replace({
    name,
    attribs,
    children,
  }: {
    name: string;
    attribs: Element["attribs"];
    children: ChildNode[];
  }) {
    if (!attribs) return;

    switch (name) {
      case "h1":
        return (
          <h1
            className={cn(
              "mt-2 scroll-m-20 text-4xl font-bold tracking-tight self-center",
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
              "mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0",
              attribs.class
            )}
          >
            {domToReact(children as DOMNode[], htmlParserOptions)}
          </h2>
        );

      case "h3":
        return (
          <h3
            className={cn(
              "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
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
              "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
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
              attribs.class
            )}
          >
            {domToReact(children as DOMNode[], htmlParserOptions)}
          </p>
        );

      case "ul":
        return (
          <ul className={cn("my-6 ml-6 list-disc", attribs.class)}>
            {domToReact(children as DOMNode[], htmlParserOptions)}
          </ul>
        );

      case "ol":
        return (
          <ol className={cn("my-6 ml-6 list-decimal", attribs.class)}>
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
              "mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground",
              attribs.class
            )}
          >
            {domToReact(children as DOMNode[], htmlParserOptions)}
          </blockquote>
        );

      case "img":
        const width = attribs.width
          ? Number(attribs.width)
          : DEFAULT_IMAGE_GENERATION_CONFIG.width;
        const height = attribs.height
          ? Number(attribs.height)
          : DEFAULT_IMAGE_GENERATION_CONFIG.height;
        return (
          <div
            className="flex justify-center items-center mx-auto p-4 m-4"
            style={{ width, height }}
          >
            <Image
              className={cn("rounded-md", attribs.class)}
              alt={attribs.alt || ""}
              src={attribs.src as string}
              style={{
                objectFit: "contain",
                width: "100%",
                height: "100%",
              }}
              width={width}
              height={height}
              priority
            />
          </div>
        );

      case "hr":
        return <hr className="my-4 md:my-8" />;

      case "table":
        return (
          <div className="my-6 w-full overflow-y-auto">
            <table className={cn("w-full", attribs.class)}>
              {domToReact(children as DOMNode[], htmlParserOptions)}
            </table>
          </div>
        );

      case "tr":
        return (
          <tr className={cn("m-0 border-t p-0 even:bg-muted", attribs.class)}>
            {domToReact(children as DOMNode[], htmlParserOptions)}
          </tr>
        );

      case "th":
        return (
          <th
            className={cn(
              "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
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
              "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
              attribs.class
            )}
          >
            {domToReact(children as DOMNode[], htmlParserOptions)}
          </td>
        );

      case "pre":
        return (
          <CodeBlock
            className={cn(
              "relative rounded px-[0.5rem] font-mono text-sm border border-transparent py-[1rem] mb-2",
              attribs.class
            )}
          >
            {domToReact(children as DOMNode[], htmlParserOptions)}
          </CodeBlock>
        );

      case "code":
        return (
          <code
            className={cn(
              "relative rounded px-[0.5rem] font-mono text-sm border border-slate-700 py-[1rem] w-full",
              attribs.class
            )}
          >
            {domToReact(children as DOMNode[], htmlParserOptions)}
          </code>
        );
      case "live-code-block":
        if (attribs["data-is-widget"] !== undefined) {
          return (
            <div className="mb-2">
              <Sandbox
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
            <Sandbox showEditor showPreview />
          </div>
        );
      case "video":
        return (
          <div
            className="mb-2"
            style={{
              width: DEFAULT_IMAGE_GENERATION_CONFIG.width,
              height: DEFAULT_IMAGE_GENERATION_CONFIG.height,
            }}
          >
            <VideoPlayer
              src={attribs.src as string}
              width={attribs.width ? Number(attribs.width) : 500}
              height={attribs.height ? Number(attribs.height) : 500}
            />
          </div>
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
