import React, { useEffect, useReducer, useState } from "react";
import {
  SandpackPredefinedTemplate,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { NodeViewWrapper } from "@tiptap/react";
import { atomDark } from "@codesandbox/sandpack-themes";
import CollapsibleWrapper from "@/components/collapsible-wrapper";
import {
  SandboxContext,
  sandboxReducer,
  SandboxState,
} from "@/contexts/sandbox/context";
import { SandboxContent } from "./sandbox-components";
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

  // TODO: React for now, but we should make this dynamic
  return (
    <SandboxContext.Provider value={{ state, dispatch }}>
      <SandpackProvider
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
      </SandpackProvider>
    </SandboxContext.Provider>
  );
}

const Sandbox = ({
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
              <SandboxContent previewOnly={previewOnly} />
            </SandboxProvider>
          </div>
        </CollapsibleWrapper>
      </div>
    </NodeViewWrapper>
  );
};

export default Sandbox;
