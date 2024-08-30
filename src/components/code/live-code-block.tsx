import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative flex gap-0.5 my-auto mx-0"
    >
      <SandpackLayout className="!block !rounded-none sm:!rounded-lg !-mx-4 sm:!mx-0">
        <TitleBar />
        <div className="flex">
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: showFileExplorer ? "25%" : 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "border-r border-zinc-700",
              showFileExplorer ? "w-1/4" : "hidden"
            )}
          >
            <SandpackFileExplorer />
          </motion.div>
          <div className="flex-1 flex">
            <motion.div
              initial={{ width: "50%" }}
              animate={{ width: showFileExplorer ? "50%" : "75%" }}
              transition={{ duration: 0.3 }}
              className="border-r border-zinc-700"
            >
              <SandpackCodeEditor showTabs />
            </motion.div>
            <motion.div
              initial={{ width: "50%" }}
              animate={{ width: showFileExplorer ? "50%" : "25%" }}
              transition={{ duration: 0.3 }}
            >
              <Preview />
            </motion.div>
          </div>
        </div>
        {/* <Console /> */}
      </SandpackLayout>
    </motion.div>
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
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
      </motion.div>
    </NodeViewWrapper>
  );
};

export default Sandbox;
