import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackPreview,
  useSandpack,
  SandpackLayout,
} from "@codesandbox/sandpack-react";
import { useSandbox } from "@/contexts/sandbox/context";
import { aiApi } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

function AIPrompt() {
  const { dispatch: sandpackDispatch, listen } = useSandpack();
  const { dispatch } = useSandbox();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setIsLoading(true);
      const response = await aiApi.generateSandboxContent(prompt);
      if (response.data) {
        dispatch({ type: "UPDATE_FILES", payload: response.data });
        sandpackDispatch({ type: "refresh" });
        toast.success("AI generated code added to sandbox");
      }
    } catch (error: any) {
      if (error?.response?.status === 429) {
        throw new Error(
          "Too many requests. Please try again later or login for more requests."
        );
      } else if (error?.response?.status === 401) {
        throw new Error("Authentication error. Please login to continue.");
      } else if (error?.response?.status === 400) {
        throw new Error(
          "Invalid request. Please check your prompt and try again."
        );
      } else if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Failed to generate image. Please try again later.");
      }
    } finally {
      setIsLoading(false);
      setPrompt("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 border-t border-zinc-700 p-3 bg-zinc-800"
    >
      <input
        disabled={isLoading}
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask AI to help with your code..."
        className="flex-1 px-3 py-1.5 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        disabled={isLoading}
        type="submit"
        className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

function TitleBar() {
  const {
    state: { showEditor, showPreview, showFileExplorer },
    dispatch,
  } = useSandbox();

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

const SandboxContent = ({ previewOnly }: { previewOnly?: boolean }) => {
  const {
    state: {
      showEditor,
      showPreview,
      showFileExplorer,
      showTitleBar,
      isExpanded,
      showConsole,
    },
  } = useSandbox();

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
                  showOpenInCodeSandbox={false}
                  showRefreshButton={false}
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
};

export { SandboxContent };
