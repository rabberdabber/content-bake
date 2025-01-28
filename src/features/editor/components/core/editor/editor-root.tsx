import { useEffect, useState } from "react";
import { EditorMode, EditorStateType } from "@/types/editor";
import EditorHeader from "./editor-header";
import { EditorContext } from "@/features/editor/context/editor-context";
import EditorBody from "./editor-body";
import { useRouter } from "next/navigation";

export const EditorRoot = ({
  editor,
  content,
  setContent,
  children,
  actions,
}: EditorStateType & {
  children?: React.ReactNode;
  actions?: React.ReactNode;
}) => {
  const router = useRouter();
  const [mode, setMode] = useState<EditorMode>(() => {
    // Read from localStorage during initialization
    if (typeof window !== "undefined") {
      return (localStorage.getItem("editor-mode") as EditorMode) || "editor";
    }
    return "editor";
  });
  const [openDialog, setOpenDialog] = useState(false);

  const onChangeMode = (newMode: EditorMode) => {
    if (newMode === "editor") {
      editor.commands.focus("start");
    }
    setMode(newMode);
    localStorage.setItem("editor-mode", newMode);
  };

  useEffect(() => {
    const savedMode = localStorage.getItem("editor-mode") as EditorMode;
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    onChangeMode(mode);
  }, [mode]);

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
      <EditorHeader>{actions}</EditorHeader>
      <EditorBody />
      {children}
    </EditorContext.Provider>
  );
};
