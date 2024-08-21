"use client";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "@/app/mdx.css";
import "@mdxeditor/editor/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Editor as EditorType } from "@tiptap/react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import ToggleGroup from "@/components/toggle-group";
import parse from "html-react-parser";
import { htmlParserOptions } from "@/config/mdx";

const TipTapEditor = dynamic(() => import("@/app/edit/tiptap-editor"), {
  ssr: false,
});

const Editor = () => {
  const [isClient, setIsClient] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  const [mode, setMode] = useState<"editor" | "preview" | "split-pane">(
    "editor"
  );
  const { theme } = useTheme();
  const isSplitPane = mode === "split-pane";
  const editorRef = useRef<EditorType>(null);
  const blogRef = useRef<HTMLDivElement>(null);

  const onPreview = () => {
    console.log("onPreview");
    console.log(blogRef.current);
    const editorHTMLContent = (editorRef.current as EditorType).getHTML();
    setMode("preview");
    setEditorContent(editorHTMLContent);
    // (blogRef.current as HTMLElement).innerHTML = parse(editorHTMLContent, htmlParserOptions);
  };

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // const serializeMdx = async () => {
  //   const mdxSource = await serialize(mdxContent, {
  //     mdxOptions: {
  //       // rehypePlugins: [rehypePrettyCode, [rehypeStringify]],
  //       rehypePlugins: [
  //         rehypeMdxCodeProps,
  //         [
  //           rehypePrettyCode,
  //           {
  //             theme: "github-dark-dimmed",
  //           },
  //         ],
  //         [rehypeStringify],
  //       ],
  //       remarkPlugins: [
  //         remarkParse,
  //         remarkRehype,
  //         remarkAddLiveToMeta,
  //         remarkGfm,
  //       ],
  //       format: "mdx",
  //     },
  //   });

  //   setMdxSource(mdxSource);
  // };

  if (!isClient) {
    return null;
  }

  return (
    <div
      className={cn(
        "mt-8 flex flex-col gap-4 justify-center items-center w-full max-w-7xl mx-auto",
        mode === "split-pane" && "max-w-[100dvw]"
      )}
    >
      <div className="flex justify-end w-full mb-4 space-x-4 mr-4">
        <ToggleGroup
          iconsWithTooltip={[
            {
              icon: Icons.splitPane,
              tooltip: "split pane",
              onClick: () => setMode("split-pane"),
              selected: isSplitPane,
            },
            {
              icon: Icons.edit,
              tooltip: "Editor",
              onClick: () => setMode("editor"),
              selected: mode === "editor",
            },
            {
              icon: Icons.preview,
              tooltip: "Preview",
              onClick: onPreview,
              selected: mode === "preview",
            },
          ]}
        />
      </div>

      <div
        className={`flex p-2 rounded-md ${
          isSplitPane ? "flex-row rounded-md" : "flex-col"
        } w-full gap-4 mb-10`}
      >
        <AnimatePresence mode="wait">
          {(mode === "editor" || isSplitPane) && (
            <motion.div
              key="editor"
              initial={isSplitPane ? {} : { opacity: 0, x: -50 }}
              animate={isSplitPane ? {} : { opacity: 1, x: 0 }}
              exit={isSplitPane ? {} : { opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className={`prose dark:prose-invert border flex-1 shadow-md rounded-lg p-4 ${
                isSplitPane ? "mr-2 min-w-[50%]" : "min-w-full w-full"
              }`}
              layoutId="editor"
            >
              <TipTapEditor editorRef={editorRef} />
            </motion.div>
          )}
          {(mode === "preview" || isSplitPane) && (
            <motion.div
              key="preview"
              initial={isSplitPane ? {} : { opacity: 0, x: 50 }}
              animate={isSplitPane ? {} : { opacity: 1, x: 0 }}
              exit={isSplitPane ? {} : { opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className={`flex-1 shadow-md rounded-lg p-4 ${
                isSplitPane ? "ml-2" : "w-full"
              }`}
              layoutId="preview"
            >
              <article>
                <div
                  ref={blogRef}
                  className={cn(
                    "relative max-w-full mx-auto grid-cols-[1fr_min(var(--tw-trimmed-content-width),100%)_1fr] p-16 sm:p-16 pb-8 bg-page-background-light dark:bg-page-background-dark shadow-page-light dark:shadow-page-dark sm:border sm:border-page-border-light dark:border-page-border-dark sm:rounded-lg",
                    isSplitPane && "min-w-[50%]"
                  )}
                >
                  {parse(editorContent, htmlParserOptions)}
                </div>
              </article>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Editor;
