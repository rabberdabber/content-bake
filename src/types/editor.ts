import React from "react";
import { Editor as CoreEditor } from "@tiptap/core";
import { Editor, JSONContent } from "@tiptap/react";
import { EditorState } from "@tiptap/pm/state";
import { EditorView } from "@tiptap/pm/view";

export type EditorMode = "editor" | "preview" | "split-pane";

export interface MenuProps {
  editor: Editor;
  appendTo?: React.RefObject<any>;
  shouldHide?: boolean;
}

export interface ShouldShowProps {
  editor?: CoreEditor;
  view: EditorView;
  state?: EditorState;
  oldState?: EditorState;
  from?: number;
  to?: number;
}

export type ActionType = "saveDraft" | "publish";

export type DatabaseEditorProps = {
  onUpdate: (content: string) => Promise<void>;
  initialContent: JSONContent;
};

export type LocalEditorProps = {
  onUpdate: (content: string) => Promise<void>;
  storageKey: string;
};

export type EditorStateType = {
  editor: Editor;
  content: string;
  setContent: (content: string) => void;
};

export type EditorContextType = {
  mode: EditorMode;
  setMode: (mode: EditorMode) => void;
  openDialog: boolean;
  setOpenDialog: (openDialog: boolean) => void;
} & EditorStateType;
