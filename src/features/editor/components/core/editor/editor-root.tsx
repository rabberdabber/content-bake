import { useEffect, useState } from "react";
import { EditorMode, EditorStateType } from "@/types/editor";
import EditorHeader from "./editor-header";
import { EditorContext } from "@/features/editor/context/editor-context";
import EditorBody from "./editor-body";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { sanitizeConfig } from "@/config/sanitize-config";
import DOMPurify from "dompurify";

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
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<EditorMode>("editor");
  const [openDialog, setOpenDialog] = useState(false);

  const onChangeMode = (newMode: EditorMode) => {
    setMode(newMode);

    // Update URL
    const params = new URLSearchParams(searchParams);
    params.set("mode", newMode);
    router.push(`?${params.toString()}`);

    // Sanitize content and store
    if (editor) {
      setContent(DOMPurify.sanitize(editor.getHTML() || "", sanitizeConfig));
    }
  };

  useEffect(() => {
    onChangeMode(mode);
  }, [mode]);

  useEffect(() => {
    const modeFromSearchParams = searchParams.get("mode");
    if (modeFromSearchParams) {
      setMode(modeFromSearchParams as EditorMode);
    }
  }, [searchParams]);

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
