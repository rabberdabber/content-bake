"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import {
  EditorContent,
  useCurrentEditor,
  FloatingMenu,
  BubbleMenu,
  useEditor,
  EditorProvider,
  Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";

type IconButtonProps = ButtonProps & {
  children: React.ReactNode;
  className?: string;
};

const ICON_BUTTON_CLASSNAMES =
  "flex gap-2 [&>button]:border-slate-700 [&>button]:border [&>button]:rounded-lg [&>button]:p-2 [&>button]:bg-slate-700";

const IconButton = ({ children, className, ...props }: IconButtonProps) => {
  return (
    <Button
      {...props}
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-md bg-slate-900 text-white hover:bg-transparent hover:text-slate-900",
        className
      )}
      size="icon"
    >
      {children}
    </Button>
  );
};

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="control-group first:mt-0 ul:pl-4 ul:pr-4 ul:mt-5 ul:mb-5 ul:ml-1 ol:pl-4 ol:pr-4 ol:mt-5 ol:mb-5 ol:ml-1 li p:mt-1 li p:mb-1 h1:leading-tight h2:leading-tight h3:leading-tight h4:leading-tight h5:leading-tight h6:leading-tight h1:mt-14 h1:mb-6 h1:text-[1.4rem] h2:mt-14 h2:mb-6 h2:text-[1.2rem] h3:mt-10 h3:text-[1.1rem] h4:mt-10 h4:text-base h5:mt-10 h5:text-base h6:mt-10 h6:text-base code:bg-purple-200 code:rounded-md code:text-black code:text-[0.85rem] code:px-2 code:py-1 pre:bg-black pre:rounded-lg pre:text-white pre:font-mono pre:my-6 pre:px-4 pre:py-3 pre code:bg-transparent pre code:text-inherit pre code:text-[0.8rem] pre code:p-0 blockquote:border-l-4 blockquote:border-gray-300 blockquote:my-6 blockquote:pl-4 hr:border-none hr:border-t hr:border-gray-200 hr:my-8">
      <div
        className={cn(
          "button-group flex flex-wrap gap-4",
          ICON_BUTTON_CLASSNAMES
        )}
      >
        <IconButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          <Icons.Bold />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          <Icons.Italic />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          <Icons.Strikethrough />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "is-active" : ""}
        >
          <Icons.code />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
        >
          <Icons.XCircle />
        </IconButton>
        <IconButton onClick={() => editor.chain().focus().clearNodes().run()}>
          <Icons.Layout />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "is-active" : ""}
        >
          <Icons.Type />
        </IconButton>
        <IconButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          <Icons.Heading1 />
        </IconButton>
        <IconButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
        >
          <Icons.Heading2 />
        </IconButton>
        <IconButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "is-active" : ""
          }
        >
          <Icons.Heading3 />
        </IconButton>
        <IconButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={
            editor.isActive("heading", { level: 4 }) ? "is-active" : ""
          }
        >
          <Icons.Heading4 />
        </IconButton>
        <IconButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={
            editor.isActive("heading", { level: 5 }) ? "is-active" : ""
          }
        >
          <Icons.Heading5 />
        </IconButton>
        <IconButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={
            editor.isActive("heading", { level: 6 }) ? "is-active" : ""
          }
        >
          <Icons.Heading6 />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          <Icons.List />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          <Icons.ListOrdered />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "is-active" : ""}
        >
          <Icons.codePen />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
        >
          <Icons.Quote />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Icons.Minus />
        </IconButton>
        <IconButton onClick={() => editor.chain().focus().setHardBreak().run()}>
          <Icons.CornerDownLeft />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <Icons.Undo />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <Icons.Redo />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().setColor("#958DF1").run()}
          className={
            editor.isActive("textStyle", { color: "#958DF1" })
              ? "is-active"
              : ""
          }
        >
          <Icons.Droplet />
        </IconButton>
      </div>
    </div>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
];

const content = `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`;

export type TipTapEditorType = Editor;

type EditorProps = {
  editorRef: React.MutableRefObject<Editor | null>;
};

const Editor = ({ editorRef }: EditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none dark:prose-invert",
      },
    },
  });

  useEffect(() => {
    if (editor) {
      editorRef.current = editor;
    }
  }, [editor]);
  return (
    <>
      {editor && (
        <BubbleMenu
          className={cn(
            "bubble-menu bg-white border border-gray-200 rounded-lg shadow-md flex p-1 group [&>button]:bg-transparent [&>button]:hover:bg-gray-300 [&>button].is-active:bg-purple-500 [&>button].is-active:hover:bg-purple-600",
            ICON_BUTTON_CLASSNAMES
          )}
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <IconButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            <Icons.Bold />
          </IconButton>
          <IconButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            <Icons.Italic />
          </IconButton>
          <IconButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
          >
            <Icons.Strikethrough />
          </IconButton>
        </BubbleMenu>
      )}

      {editor && (
        <FloatingMenu
          className={cn(
            "floating-menu floating-menu flex bg-gray-300 p-0.5 rounded-md group [&>button]:bg-transparent [&>button]:p-[0.275rem] [&>button]:px-[0.425rem] [&>button]:rounded [&>button]:hover:bg-gray-300 [&>button].is-active:bg-white [&>button].is-active:text-purple-500 [&>button].is-active:hover:text-purple-600",
            ICON_BUTTON_CLASSNAMES
          )}
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <IconButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }
          >
            <Icons.Heading1 />
          </IconButton>
          <IconButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 }) ? "is-active" : ""
            }
          >
            <Icons.Heading2 />
          </IconButton>
          <IconButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
          >
            <Icons.List />
          </IconButton>
        </FloatingMenu>
      )}

      <EditorContent editor={editor} />
    </>
  );
};

const TipTapEditor = ({ editorRef }: EditorProps) => {
  return (
    <EditorProvider slotBefore={<MenuBar />} extensions={extensions}>
      <Editor editorRef={editorRef} />
    </EditorProvider>
  );
};

export default TipTapEditor;
