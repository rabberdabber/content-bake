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
import IconButton from "./ui/icon-button";
import { Icons } from "./icons";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const templateFiles = {
  "/App.js": `
import React from 'react';
import './index.css';

function App() {
  const [count, setCount] = React.useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
export default App;
  `,
  "/index.css": `
button {
  background-color: #61dafb;
  border: none;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  color: hotpink;
}
  `,
};

// function ActiveFileDisplay() {
//   const { sandpack } = useSandpack();
//   const activeFile = sandpack.activeFile;

//   return (
//     <div className="bg-gray-200 p-4">
//       <h2 className="text-lg font-semibold">Active File</h2>
//       <pre className="text-sm">{activeFile}</pre>
//     </div>
//   );
// }

type SandboxProps = {
  files?: { [key: string]: string };
  template?: SandpackPredefinedTemplate;
  showFileExplorer?: boolean;
};

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
    <div className="flex justify-between border border-zinc-700 bg-zinc-900 p-3">
      <div className="flex gap-1">
        <IconButton className="border border-slate-500">
          <Icons.eye size={15} className="hover:bg-slate-400" />
        </IconButton>
        <IconButton className="border border-slate-500">
          <Icons.terminal size={15} className="hover:bg-slate-400" />
        </IconButton>
      </div>
      <div>
        <IconButton className="border border-slate-500">
          <Icons.refresh size={15} className="hover:bg-slate-400" />
        </IconButton>
      </div>
    </div>
  );
}

function Preview() {
  return (
    <>
      <div className="rounded-b-lg bg-zinc-900 p-4">
        <div className="overflow-hidden rounded bg-white p-1">
          <SandpackPreview
            showOpenInCodeSandbox={false}
            showRefreshButton={false}
          />
        </div>
      </div>
    </>
  );
}

const SandboxContent = ({
  showFileExplorer = false,
}: {
  showFileExplorer: boolean;
}) => {
  return (
    <div className="relative flex gap-0.5 my-auto mx-0">
      <SandpackLayout className="!block !rounded-none sm:!rounded-lg !-mx-4 sm:!mx-0">
        <TitleBar />
        <div className="flex">
          <div
            className={cn(
              "border-r border-zinc-700",
              showFileExplorer ? "w-1/4" : "hidden"
            )}
          >
            <SandpackFileExplorer />
          </div>
          <div className="flex-1 flex">
            <div className="w-1/2 border-r border-zinc-700">
              <SandpackCodeEditor showTabs />
            </div>
            <div className="w-1/2">
              <Preview />
            </div>
          </div>
        </div>
        <Console />
      </SandpackLayout>
    </div>
  );
};

const Sandbox = ({
  files = templateFiles,
  template = "react",
  showFileExplorer = false,
}: SandboxProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <NodeViewWrapper className="live-code-block">
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
        <SandboxContent showFileExplorer={showFileExplorer} />
      </SandpackProvider>
    </NodeViewWrapper>
  );
};

export default Sandbox;
