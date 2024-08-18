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
import { Icons } from "@/components/icons";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const Editor = () => {
  const [isClient, setIsClient] = useState(false);
  const [mdxContent, setMdxContent] = useState<string>(markdown);

  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(
    null
  );
  const [splitPane, setSplitPane] = useState<boolean>(false);
  const [mode, setMode] = useState<"editor" | "preview">("editor");

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const serializeMdx = async () => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypePrettyCode, {
        theme: "github-dark-dimmed",
      })
      .use(rehypeStringify)
      .process(mdxContent);

    const mdxSource = await serialize(mdxContent, {
      mdxOptions: {
        rehypePlugins: [rehypePrettyCode, [rehypeStringify]],
        remarkPlugins: [remarkGfm],
        format: "mdx",
      },
    });

    setMdxSource(mdxSource);
  };

  React.useEffect(() => {
    serializeMdx();
  }, [mdxContent]);

  if (!isClient) {
    return null;
  }

  return (
    <div
      className={cn(
        "mt-8 flex flex-col gap-4 justify-center items-center w-full max-w-7xl mx-auto",
        splitPane && "max-w-[100dvw]"
      )}
    >
      <div className="flex justify-end w-full mb-4 space-x-4">
        <Icons.splitPane
          onClick={() => setSplitPane(!splitPane)}
          className={`hover:text-blue-800 cursor-pointer ${
            splitPane ? "text-blue-800" : ""
          }`}
        />
        {!splitPane && (
          <>
            {mode === "preview" ? (
              <Icons.edit
                onClick={() => setMode("editor")}
                className="hover:text-blue-800 cursor-pointer"
              />
            ) : (
              <Icons.preview
                onClick={() => setMode("preview")}
                className="hover:text-blue-800 cursor-pointer"
              />
            )}
          </>
        )}
      </div>

      <div
        className={`flex border p-2 rounded-md ${
          splitPane ? "flex-row rounded-md" : "flex-col"
        } w-full gap-4 mb-10`}
      >
        <AnimatePresence mode="wait">
          {(mode === "editor" || splitPane) && (
            <motion.div
              key="editor"
              initial={splitPane ? {} : { opacity: 0, x: -50 }}
              animate={splitPane ? {} : { opacity: 1, x: 0 }}
              exit={splitPane ? {} : { opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className={`prose flex-1 bg-white shadow-md rounded-lg p-4 ${
                splitPane ? "mr-2 min-w-[50%]" : "min-w-full w-full"
              }`}
              layoutId="editor"
            >
              <MDXEditor
                markdown={markdown}
                onChange={(md) => setMdxContent(md)}
                plugins={ALL_PLUGINS}
              />
            </motion.div>
          )}
          {(mode === "preview" || splitPane) && (
            <motion.div
              key="preview"
              initial={splitPane ? {} : { opacity: 0, x: 50 }}
              animate={splitPane ? {} : { opacity: 1, x: 0 }}
              exit={splitPane ? {} : { opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className={`flex-1 bg-white shadow-md rounded-lg p-4 ${
                splitPane ? "ml-2" : "w-full"
              }`}
              layoutId="preview"
            >
              {mdxSource && (
                <article>
                  <div
                    className={cn(
                      "relative max-w-full mx-auto grid-cols-[1fr_min(var(--tw-trimmed-content-width),100%)_1fr] p-16 sm:p-16 pb-8 bg-page-background-light dark:bg-page-background-dark shadow-page-light dark:shadow-page-dark sm:border sm:border-page-border-light dark:border-page-border-dark sm:rounded-lg",
                      splitPane && "min-w-[50%]"
                    )}
                  >
                    <MDXRemote
                      {...mdxSource}
                      components={mdxRemoteComponents}
                    />
                  </div>
                </article>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Editor;
