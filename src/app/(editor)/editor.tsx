"use client";
import React, { useEffect, useState } from "react";
import {
  EditorContent,
  useCurrentEditor,
  useEditor,
  EditorProvider,
  Editor as EditorType,
} from "@tiptap/react";
import EditorBubble from "./editor-bubble";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import IconButton from "@/components/ui/icon-button";
import ImageUploadDialog from "@/components/dialogs/image-upload-dialog";
import DOMPurify from "dompurify";
import extensions from "./extensions";
import { Separator } from "@/components/ui/separator";
import { NodeSelector } from "./selectors/node-selector";
import { LinkSelector } from "./selectors/link-selector";
import { TextButtons } from "./selectors/text-buttons";
import { ColorSelector } from "./selectors/color-selector";

export const tableHTML = `
  <table style="width:100%">
    <tr>
      <th>Firstname</th>
      <th>Lastname</th>
      <th>Age</th>
    </tr>
    <tr>
      <td>Jill</td>
      <td>Smith</td>
      <td>50</td>
    </tr>
    <tr>
      <td>Eve</td>
      <td>Jackson</td>
      <td>94</td>
    </tr>
    <tr>
      <td>John</td>
      <td>Doe</td>
      <td>80</td>
    </tr>
  </table>
`;

const content = `
<h1>Hello Please Edit the blog</h1>
<pre>
  <code class="language-typescript">
const a: number = 1;
// This is a comment
const b: number = 2;
// highlight-line
const c: number = a + b;
  </code>
</pre>
<p>Hello</p>
`;

const ICON_BUTTON_CLASSNAMES =
  "flex gap-2 [&>button]:border-slate-700 [&>button]:border [&>button]:rounded-lg [&>button]:p-2 [&>button]:bg-slate-700";

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
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertContent(tableHTML, {
                parseOptions: {
                  preserveWhitespace: false,
                },
              })
              .run()
          }
        >
          <Icons.Table />
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
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleNode("live-code-block", "div", { level: 1 })
              .run()
          }
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

export type TipTapEditorType = EditorType;

type EditorProps = {
  editorRef: React.MutableRefObject<EditorType | null>;
  setEditorContent?: React.Dispatch<React.SetStateAction<string>>;
};

const Editor = ({ editorRef, setEditorContent }: EditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    onUpdate: ({}) => {
      onContentUpdate();
    },
    onCreate: ({ editor }) => {
      onContentUpdate();
    },
    extensions: extensions,
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none dark:prose-invert",
      },
    },
  });
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [image, setImage] = useState<string | File | null>(null);
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);

  const onContentUpdate = () => {
    console.log("onContentUpdate");
    console.log(
      DOMPurify.sanitize(editor?.getHTML() || "", {
        ADD_TAGS: ["live-code-block"],
      })
    );
    setEditorContent?.(
      DOMPurify.sanitize(editor?.getHTML() || "", {
        ADD_TAGS: ["live-code-block"],
      })
    );
  };

  useEffect(() => {
    if (editor) {
      editorRef.current = editor;
    }
  }, [editor]);

  useEffect(() => {
    if (editor && image) {
      editor
        .chain()
        .focus()
        .setImage({
          src:
            typeof image === "string"
              ? image
              : URL.createObjectURL(image as File),
        })
        .run();
    }
  }, [image]);

  useEffect(() => {
    if (editor) {
      const editorElement = editor.view.dom;
      editorElement.addEventListener("openImageDialog", () => {
        setOpenImageDialog(true);
      });
      return () => {
        editorElement.removeEventListener("openImageDialog", () => {});
      };
    }
  }, [editor, openImageDialog]);

  return (
    <>
      <EditorBubble
        tippyOptions={{
          placement: "top",
        }}
        className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
        editor={editor}
      >
        {/* <IconButton
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
        </IconButton> */}
        <Separator orientation="vertical" />
        <NodeSelector
          open={openNode}
          onOpenChange={setOpenNode}
          editor={editor}
        />
        <Separator orientation="vertical" />

        <LinkSelector
          open={openLink}
          onOpenChange={setOpenLink}
          editor={editor}
        />
        <Separator orientation="vertical" />
        <TextButtons editor={editor} />
        <Separator orientation="vertical" />
        <ColorSelector
          open={openColor}
          onOpenChange={setOpenColor}
          editor={editor}
        />
      </EditorBubble>
      <EditorContent
        editor={editor}
        className={openImageDialog ? "blur-sm" : ""}
      />
      <div className="relative mb-4 mt-4">
        <ImageUploadDialog
          image={image}
          setImage={setImage}
          open={openImageDialog}
          setOpen={setOpenImageDialog}
          onSubmit={() => setOpenImageDialog(false)}
          onCancel={() => setOpenImageDialog(false)}
        />
      </div>
    </>
  );
};

const TipTapEditor = ({ editorRef, setEditorContent }: EditorProps) => {
  return (
    // <EditorProvider extensions={extensions}>
    <Editor editorRef={editorRef} setEditorContent={setEditorContent} />
    // </EditorProvider>
  );
};

export default TipTapEditor;
