import { useLocalStorage } from "@mantine/hooks";
import { Editor } from "@tiptap/react";
import { createContext, useContext, useEffect } from "react";

type EditorContextType = {
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
  children,
  content,
  setContent,
  editor,
  ...props
}: EditorContextType & { children: React.ReactNode }) {
  return (
    <EditorContext.Provider
      value={{
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
