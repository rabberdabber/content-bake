import { Editor } from "@tiptap/react";
import { createContext, useContext } from "react";

type EditorContextType = {
  isDemo: boolean;
  isDraft: boolean;
  content: string;
  setContent: (content: string) => void;
  editor: Editor | null;
} & (
  | {
      type: "initial";
      initialContent: string;
    }
  | {
      type: "local";
      storageKey: string;
    }
);

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({
  isDemo,
  isDraft,
  children,
  content,
  setContent,
  editor,
  ...props
}: EditorContextType & { children: React.ReactNode }) {
  return (
    <EditorContext.Provider
      value={{
        isDemo,
        isDraft,
        content,
        setContent,
        editor,
        ...props,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
}
