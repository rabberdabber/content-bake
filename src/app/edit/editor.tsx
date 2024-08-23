"use client";
import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import "@/app/mdx.css";
import "@mdxeditor/editor/style.css";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useTheme } from "next-themes";
import { Editor as EditorType } from "@tiptap/react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import ToggleGroup from "@/components/toggle-group";
import parse from "html-react-parser";
import { htmlParserOptions } from "@/config/html-parser";

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
    setMode("preview");
    editorContent === "" &&
      setEditorContent(editorRef.current?.getHTML() || "");
  };

  const onSplitPane = () => {
    setMode("split-pane");
    editorContent === "" &&
      setEditorContent(editorRef.current?.getHTML() || "");
  };

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  console.log(editorContent);
  return (
    <LayoutGroup>
      <div
        className={cn(
          "mt-8 flex flex-col gap-4 justify-center items-center w-full max-w-7xl mx-auto",
          mode === "split-pane" && "max-w-[calc(100dvw-4rem)]"
        )}
      >
        <div className="flex justify-end w-full mb-4 space-x-4 mr-4">
          <ToggleGroup
            iconsWithTooltip={[
              {
                icon: Icons.splitPane,
                tooltip: "split pane",
                onClick: onSplitPane,
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
            {
              <motion.div
                key="editor"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.75 }}
                className={cn(
                  `prose dark:prose-invert border flex-1 shadow-md rounded-lg p-4 ${
                    isSplitPane
                      ? "mr-2 min-w-[calc(50%-2rem)]"
                      : "min-w-full w-full"
                  }`,
                  mode === "preview" && "hidden"
                )}
                layoutId="editor"
              >
                <TipTapEditor
                  setEditorContent={setEditorContent}
                  editorRef={editorRef}
                />
              </motion.div>
            }
            {
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.75 }}
                className={cn(mode === "editor" && "hidden")}
                layoutId="preview"
              >
                <article>
                  <div
                    ref={blogRef}
                    className={cn(
                      "relative max-w-full mx-auto grid-cols-[1fr_min(var(--tw-trimmed-content-width),100%)_1fr] p-16 sm:p-16 pb-8 bg-page-background-light dark:bg-page-background-dark shadow-page-light dark:shadow-page-dark sm:border sm:border-page-border-light dark:border-page-border-dark sm:rounded-lg",
                      isSplitPane && "min-w-[calc(50%-2rem)] ml-2"
                    )}
                  >
                    <div className="flex flex-col items-center justify-center gap-8">
                      {parse(editorContent, htmlParserOptions)}
                    </div>
                  </div>
                </article>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </LayoutGroup>
  );
};

export default Editor;
