import React, { useEffect, useState } from "react";
import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPredefinedTemplate,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { NodeViewWrapper } from "@tiptap/react";
import { SandpackFileExplorer } from "sandpack-file-explorer";
import { atomDark } from "@codesandbox/sandpack-themes";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import CollapsibleWrapper, {
  useCollapsibleWrapper,
} from "./collapsible-wrapper";

type SandPackContentProps = {
  showFileExplorer?: boolean;
  showPreview?: boolean;
  showConsole?: boolean;
  showEditor?: boolean;
  showTitleBar?: boolean;
  previewOnly?: boolean;
};

const templateFiles = {
  "/App.js": `
import React from 'react';
import './index.css';

function App() {
  return (
    <div className="circle-grid">
      {[...Array(20)].map((_, index) => (
        <div key={index} className="circle"></div>
      ))}
    </div>
  );
}

export default App;
  `,
  "/index.css": `
body {
  margin: 0;
  padding: 20px;
  background-color: #f0f0f0;
}

.circle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 20px;
  padding: 20px;
}

.circle {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: linear-gradient(45deg, #3498db, #8e44ad);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.circle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #e74c3c, #f39c12);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.circle:hover {
  transform: scale(1.1);
}

.circle:hover::before {
  opacity: 1;
}
  `,
};
type SandboxProps = {
  files?: { [key: string]: string };
  template?: SandpackPredefinedTemplate;
} & SandPackContentProps;

function TitleBar() {
  return (
    <div className="mb-0  flex justify-between items-center sm:rounded-t-lg bg-zinc-700 px-3 py-2">
      <span className="text-sm font-bold text-white">Title</span>
      <span className="">Actions</span>
    </div>
  );
}

function Console() {
  return (
    <div className="flex justify-between border border-zinc-700  p-3 bg-white">
      <div className="flex gap-2">
        <Icons.eye className="hover:bg-slate-400 rounded-md p-1 bg-black" />
        <Icons.terminal className="hover:bg-slate-400 rounded-md p-1 bg-black" />
      </div>
      <div>
        <Icons.refresh className="hover:bg-slate-400 rounded-md p-1 bg-black" />
      </div>
    </div>
  );
}

function PreviewOnly() {
  return (
    <div className="w-full min-h-[500px] h-full">
      <SandpackPreview
        showOpenInCodeSandbox={false}
        showRefreshButton={false}
        style={{
          width: "100%",
          minHeight: "500px",
          overflow: "hidden",
        }}
      />
    </div>
  );
}

const SandboxContent = ({
  previewOnly,
  showFileExplorer,
  showPreview,
  showEditor,
  showConsole,
  showTitleBar,
}: SandPackContentProps) => {
  const { isExpanded } = useCollapsibleWrapper();

  return previewOnly ? (
    <PreviewOnly />
  ) : (
    <div
      className={cn(
        "flex gap-0.5 w-full",
        isExpanded ? "h-full" : "max-h-[400px]"
      )}
    >
      <SandpackLayout className="!block !rounded-none sm:!rounded-lg !-mx-4 sm:!mx-0 w-full">
        {showTitleBar && <TitleBar />}
        <div className="flex w-full">
          {showFileExplorer && (
            <div
              className={cn(
                "border-r border-zinc-700",
                showFileExplorer && "w-1/4"
              )}
            >
              <SandpackFileExplorer />
            </div>
          )}
          <div className="flex-1 flex">
            {showEditor && (
              <div className="border-r border-zinc-700">
                <SandpackCodeEditor
                  showTabs
                  style={{
                    height: isExpanded ? "600px" : "400px",
                  }}
                />
              </div>
            )}
            {showPreview && (
              <div className="border-l border-zinc-700 flex-1">
                <SandpackPreview
                  showOpenInCodeSandbox={false}
                  showRefreshButton={false}
                  style={{
                    width: "100%",
                    height: isExpanded ? "600px" : "400px",
                    overflow: "hidden",
                  }}
                />
              </div>
            )}
          </div>
        </div>
        {showConsole && <Console />}
      </SandpackLayout>
    </div>
  );
};

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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <NodeViewWrapper className="live-code-block w-full">
      <div className="mt-[1rem] w-full min-h-[500px]">
        <CollapsibleWrapper maxHeight={500}>
          <SandpackProvider
            template={template}
            theme={atomDark}
            files={files}
            options={{
              autorun: true,
              recompileMode: "delayed",
              recompileDelay: 500,
              experimental_enableServiceWorker: true,
              initMode: "user-visible",
              initModeObserverOptions: { rootMargin: `1000px 0px` },
            }}
          >
            <SandboxContent
              showFileExplorer={showFileExplorer}
              showPreview={showPreview}
              showEditor={showEditor}
              showConsole={showConsole}
              showTitleBar={showTitleBar}
              previewOnly={previewOnly}
            />
          </SandpackProvider>
        </CollapsibleWrapper>
      </div>
    </NodeViewWrapper>
  );
};

export default Sandbox;
