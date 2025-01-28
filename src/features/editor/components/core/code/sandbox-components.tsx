import React, { useEffect, useRef, useState } from "react";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackPreview,
  useSandpack,
  SandpackLayout,
  useActiveCode,
  SandpackPreviewRef,
} from "@codesandbox/sandpack-react";
import { useSandbox } from "@/contexts/sandbox/context";
import { aiApi } from "@/lib/api";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

function TitleBar() {
  const { state, dispatch } = useSandbox();
  const { showEditor, showPreview, showFileExplorer } = state;

  return (
    <div className="mb-0 flex justify-between items-center sm:rounded-t-lg bg-zinc-700 px-3 py-2">
      <span className="text-sm font-bold text-white">Code Sandbox</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => dispatch({ type: "TOGGLE_FILE_EXPLORER" })}
          className={cn(
            "p-1.5 rounded-md text-zinc-300 hover:text-white",
            showFileExplorer && "bg-zinc-600"
          )}
        >
          <Icons.post className="w-4 h-4" />
        </button>
        <button
          onClick={() => dispatch({ type: "TOGGLE_EDITOR" })}
          className={cn(
            "p-1.5 rounded-md text-zinc-300 hover:text-white",
            showEditor && "bg-zinc-600"
          )}
        >
          <Icons.code className="w-4 h-4" />
        </button>
        <button
          onClick={() => dispatch({ type: "TOGGLE_PREVIEW" })}
          className={cn(
            "p-1.5 rounded-md text-zinc-300 hover:text-white",
            showPreview && "bg-zinc-600"
          )}
        >
          <Icons.eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function Console() {
  return (
    <div className="flex justify-between border border-zinc-700 p-3 bg-white dark:bg-zinc-800">
      <div className="flex gap-2">
        <Icons.eye className="hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md p-1 bg-zinc-100 dark:bg-zinc-900" />
        <Icons.terminal className="hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md p-1 bg-zinc-100 dark:bg-zinc-900" />
      </div>
      <div>
        <Icons.refresh className="hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md p-1 bg-zinc-100 dark:bg-zinc-900" />
      </div>
    </div>
  );
}

function AIPrompt() {
  const { data: session } = useSession();
  const { dispatch } = useSandbox();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await aiApi.generateSandboxContent(prompt, !!session);
      if (response.data) {
        dispatch({ type: "UPDATE_FILES", payload: response.data });
      }
    } catch (error: any) {
      if (error?.response?.status === 429) {
        toast.error(
          "Too many requests. Please try again later or login for more requests if not already logged in."
        );
      } else if (error?.response?.status === 401) {
      } else if (error?.response?.status === 401) {
        toast.error("Authentication error. Please login to continue.");
      } else if (error?.response?.status === 400) {
        toast.error("Invalid request. Please check your prompt and try again.");
      } else if (error instanceof Error) {
        throw error;
      } else {
        toast.error("Failed to generate code. Please try again later.");
      }
    } finally {
      setIsLoading(false);
      setPrompt("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 border-t border-zinc-700 p-3 bg-zinc-100 dark:bg-zinc-800"
    >
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask AI to help with your code..."
        className="flex-1 px-3 py-1.5 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-md border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-500 dark:placeholder-zinc-400"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? (
          <Icons.loader className="w-4 h-4 animate-spin" />
        ) : (
          <Icons.send className="w-4 h-4" />
        )}
      </button>
    </form>
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

export function SandboxContent({
  previewOnly,
  onUpdate,
}: {
  previewOnly?: boolean;
  onUpdate?: (attributes: { [key: string]: string }) => void;
}) {
  const { state } = useSandbox();
  const {
    showFileExplorer,
    showPreview,
    showEditor,
    showConsole,
    showTitleBar,
    isExpanded,
  } = state;
  const { sandpack } = useSandpack();
  const { code } = useActiveCode();
  const previewRef = useRef<SandpackPreviewRef>(null);

  const { activeFile, files } = sandpack;

  useEffect(() => {
    const client = previewRef.current?.getClient();
    client?.dispatch({ type: "refresh" });
    // onUpdate?.({
    //   files: JSON.stringify(Object.keys(files).map((key) => files[key].code)),
    //   template: "react",
    //   id: state.id,
    // });
  }, [code, activeFile, files]);

  return previewOnly ? (
    <PreviewOnly />
  ) : (
    <div className="flex flex-col w-full h-full">
      <SandpackLayout
        className="!block !rounded-none sm:!rounded-lg !-mx-4 sm:!mx-0 w-full"
        style={{ minHeight: "500px" }}
      >
        {showTitleBar && <TitleBar />}
        <div className="flex w-full flex-1 overflow-hidden">
          {showFileExplorer && (
            <div className={cn("border-r border-zinc-700", "w-1/4")}>
              <SandpackFileExplorer />
            </div>
          )}
          <div className="flex-1 flex overflow-hidden">
            {showEditor && (
              <div className="border-r border-zinc-700 flex-1">
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
                  ref={previewRef}
                  showOpenInCodeSandbox={false}
                  showRefreshButton={true}
                  style={{
                    width: "100%",
                    height: isExpanded ? "600px" : "400px",
                  }}
                />
              </div>
            )}
          </div>
        </div>
        {showConsole && <Console />}
        <div className="sticky bottom-0 w-full">
          <AIPrompt />
        </div>
      </SandpackLayout>
    </div>
  );
}
