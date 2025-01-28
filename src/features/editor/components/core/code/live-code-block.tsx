import React, { useEffect, useReducer, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { SandpackPredefinedTemplate } from "@codesandbox/sandpack-react";
import { NodeViewWrapper, NodeViewProps, Editor } from "@tiptap/react";
import { atomDark } from "@codesandbox/sandpack-themes";
import CollapsibleWrapper from "@/components/collapsible-wrapper";
import {
  SandboxContext,
  sandboxReducer,
  SandboxState,
} from "@/contexts/sandbox/context";
import { templateFiles } from "@/config/sandbox";

type SandPackContentProps = {
  showFileExplorer?: boolean;
  showPreview?: boolean;
  showConsole?: boolean;
  showEditor?: boolean;
  showTitleBar?: boolean;
  previewOnly?: boolean;
};

type SandboxProps = {
  files?: { [key: string]: string };
  template?: SandpackPredefinedTemplate;
  id?: string;
} & SandPackContentProps;

type SandboxProviderProps = {
  children: React.ReactNode;
  initialFiles?: { [key: string]: string };
  initialShowFileExplorer?: boolean;
  initialShowPreview?: boolean;
  initialShowEditor?: boolean;
  initialShowConsole?: boolean;
  initialShowTitleBar?: boolean;
  template?: SandpackPredefinedTemplate;
  id?: string;
};

const initialState: Omit<SandboxState, "id"> = {
  files: templateFiles,
  isExpanded: false,
  showFileExplorer: false,
  showPreview: true,
  showEditor: true,
  showConsole: false,
  showTitleBar: true,
};

// Add dynamic imports for SandpackProvider and components
const DynamicSandpackProvider = dynamic(
  () =>
    import("@codesandbox/sandpack-react").then((mod) => mod.SandpackProvider),
  {
    ssr: false,
    loading: () => <div>Loading sandbox...</div>,
  }
);

const DynamicSandboxContent = dynamic(
  () => import("./sandbox-components").then((mod) => mod.SandboxContent),
  {
    ssr: false,
    loading: () => <div>Loading content...</div>,
  }
);

function SandboxProvider({ children, id, initialFiles }: SandboxProviderProps) {
  const [isClient, setIsClient] = useState(false);

  // UI state
  const [state, dispatch] = useReducer(sandboxReducer, {
    ...initialState,
    id: id || crypto.randomUUID(),
    files: initialFiles || templateFiles,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <SandboxContext.Provider value={{ state, dispatch }}>
      <DynamicSandpackProvider
        template="react"
        theme={atomDark}
        files={state.files}
        options={{
          autorun: true,
          recompileMode: "immediate",
          recompileDelay: 0,
          experimental_enableServiceWorker: true,
          initMode: "user-visible",
          initModeObserverOptions: { rootMargin: `1000px 0px` },
        }}
      >
        {children}
      </DynamicSandpackProvider>
    </SandboxContext.Provider>
  );
}

// Base Sandbox component without NodeViewWrapper
export function BaseSandbox({ previewOnly = false, id, files }: SandboxProps) {
  return (
    <div className="mt-[1rem] w-full">
      <CollapsibleWrapper>
        <div className="relative w-full" style={{ minHeight: "500px" }}>
          <SandboxProvider id={id} initialFiles={files}>
            <DynamicSandboxContent previewOnly={previewOnly} />
          </SandboxProvider>
        </div>
      </CollapsibleWrapper>
    </div>
  );
}

// Editor-specific version with NodeViewWrapper
const EditorSandbox = React.memo(
  ({
    editor,
    node,
    updateAttributes,
    getPos,
    ...props
  }: SandboxProps & Partial<NodeViewProps>) => {
    const sandboxId = node?.attrs?.id;
    const sandboxTemplate = node?.attrs?.template || "react";

    // Try to get files from localStorage first, fallback to node attrs or template
    const sandboxFiles = useMemo(() => {
      if (sandboxId) {
        const storedFiles = localStorage.getItem(`sandbox-files-${sandboxId}`);
        if (storedFiles) {
          try {
            return JSON.parse(storedFiles);
          } catch (e) {
            console.error("Failed to parse stored sandbox files:", e);
          }
        }
      }
      return node?.attrs?.files || templateFiles;
    }, [sandboxId, node?.attrs?.files]);

    // const onUpdate = (files: { [key: string]: string }) => {
    //   if (!editor || !updateAttributes) return;

    //   // Update the node attributes with new files
    //   updateAttributes({
    //     files,
    //     template: sandboxTemplate,
    //     id: sandboxId,
    //   });

    //   // Store in localStorage as backup
    //   if (sandboxId) {
    //     localStorage.setItem(
    //       `sandbox-files-${sandboxId}`,
    //       JSON.stringify(files)
    //     );
    //   }

    //   // Optional: Focus the editor at the end of the operation
    //   editor.commands.focus();
    // };

    return (
      <NodeViewWrapper className="w-full">
        <BaseSandbox {...props} id={sandboxId} files={sandboxFiles} />
      </NodeViewWrapper>
    );
  }
);

EditorSandbox.displayName = "EditorSandbox";

// Export both versions
export { EditorSandbox };
export default BaseSandbox;
