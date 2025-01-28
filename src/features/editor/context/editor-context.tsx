import { createContext, useContext } from "react";
import { EditorContextType } from "@/types/editor";

export const EditorContext = createContext<EditorContextType | undefined>(
  undefined
);

export function EditorProvider({
  children,
  content,
  setContent,
  editor,
  mode,
  setMode,
  openDialog,
  setOpenDialog,
}: EditorContextType & { children: React.ReactNode }) {
  return (
    <EditorContext.Provider
      value={{
        content,
        setContent,
        editor,
        mode,
        setMode,
        openDialog,
        setOpenDialog,
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
