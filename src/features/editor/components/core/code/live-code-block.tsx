import React, { useEffect, useReducer, useState } from "react";
import dynamic from "next/dynamic";
import { SandpackPredefinedTemplate } from "@codesandbox/sandpack-react";
import { NodeViewWrapper } from "@tiptap/react";
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
};

const initialState: SandboxState = {
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

function SandboxProvider({ children }: SandboxProviderProps) {
  const [isClient, setIsClient] = useState(false);

  // UI state
  const [state, dispatch] = useReducer(sandboxReducer, initialState);

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

const Sandbox = React.memo(
  ({
    files = templateFiles,
    template = "react",
    showFileExplorer = false,
    showPreview = true,
    showEditor = true,
    showConsole = false,
    showTitleBar = true,
    previewOnly = false,
  }: SandboxProps) => {
    return (
      <NodeViewWrapper className="live-code-block w-full">
        <div className="mt-[1rem] w-full">
          <CollapsibleWrapper>
            <div className="relative w-full" style={{ minHeight: "500px" }}>
              <SandboxProvider
                initialFiles={files}
                initialShowFileExplorer={showFileExplorer}
                initialShowPreview={showPreview}
                initialShowEditor={showEditor}
                initialShowConsole={showConsole}
                initialShowTitleBar={showTitleBar}
                template={template}
              >
                <DynamicSandboxContent previewOnly={previewOnly} />
              </SandboxProvider>
            </div>
          </CollapsibleWrapper>
        </div>
      </NodeViewWrapper>
    );
  }
);

Sandbox.displayName = "Sandbox";

export default Sandbox;
