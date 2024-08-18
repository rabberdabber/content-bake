"use client";
import "@/app/mdx.css";

import React, { useState } from "react";
import { MDXEditor } from "@mdxeditor/editor";
import markdown from "@/app/editor/examples/assets/live-demo-contents.md?raw";
import { ALL_PLUGINS } from "@/app/editor/examples/_boilerplate";
import "@mdxeditor/editor/style.css";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { mdxRemoteComponents } from "@/config/mdx";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

const Editor = () => {
  const [isClient, setIsClient] = useState(false);
  const [mdxContent, setMdxContent] = useState<string>(markdown);

  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(
    null
  );
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const serializeMdx = async () => {
    console.log("mdxContent", mdxContent);
    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypePrettyCode, {
        theme: "github-dark-dimmed",
        // onVisitLine(node: any) {
        //   // Prevent lines from collapsing in `display: grid` mode, and allow empty
        //   // lines to be copy/pasted
        //   if (node.children.length === 0) {
        //     node.children = [{ type: "text", value: " " }];
        //   }
        // },
        // onVisitHighlightedLine(node: LineElement, id: string | undefined) {
        //   node.properties.className?.push("line--highlighted");
        // },
      })
      .use(rehypeStringify)
      .process(mdxContent);
    console.log("file", String(file));
    const mdxSource = await serialize(mdxContent, {
      mdxOptions: {
        rehypePlugins: [rehypePrettyCode, [rehypeStringify]],
        remarkPlugins: [remarkGfm],
        format: "mdx",
      },
    });
    console.log("mdxSource", mdxSource);
    setMdxSource(mdxSource);
  };

  React.useEffect(() => {
    serializeMdx();
  }, [mdxContent]);

  if (!isClient) {
    return null;
  }
  return (
    <div className="h-dvh w-dvw mt-[40rem] flex justify-center items-center">
      <div className="ml-72 mt-96 prose flex justify-center items-center">
        <MDXEditor
          markdown={markdown}
          onChange={(md) => {
            setMdxContent(md);
          }}
          plugins={ALL_PLUGINS}
        />
      </div>
      <div className="h-dvh w-dvw grid place-content-center">
        {mdxSource && (
          <article>
            <div
              className="
        relative 
        grid 
        grid-cols-[1fr_min(var(--tw-trimmed-content-width),100%)_1fr] 
        max-w-[80rem] 
        mx-auto 
        p-16 
        sm:p-16 
        pb-8 
        bg-page-background-light dark:bg-page-background-dark
        shadow-page-light dark:shadow-page-dark
        sm:border
        sm:border-page-border-light dark:border-page-border-dark
        sm:rounded-lg
      "
            >
              <MDXRemote {...mdxSource} components={mdxRemoteComponents} />
            </div>
          </article>
        )}
      </div>
    </div>
  );
};

export default Editor;
