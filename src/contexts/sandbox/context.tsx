import { createContext, useContext, useReducer } from "react";

type SandboxState = {
  id: string;
  showFileExplorer: boolean;
  showPreview: boolean;
  showEditor: boolean;
  showConsole: boolean;
  showTitleBar: boolean;
  isExpanded: boolean;
  files: { [key: string]: string };
};

const initialState: SandboxState = {
  id: "",
  showFileExplorer: false,
  showPreview: true,
  showEditor: true,
  showConsole: false,
  showTitleBar: true,
  isExpanded: false,
  files: {},
};

type SandboxAction =
  | { type: "SET_ID"; payload: string }
  | { type: "UPDATE_FILES"; payload: { [key: string]: string } }
  | { type: "TOGGLE_FILE_EXPLORER" }
  | { type: "TOGGLE_PREVIEW" }
  | { type: "TOGGLE_EDITOR" }
  | { type: "TOGGLE_CONSOLE" }
  | { type: "TOGGLE_TITLE_BAR" }
  | { type: "SET_EXPANDED"; payload: boolean };

const sandboxReducer = (
  state: SandboxState,
  action: SandboxAction
): SandboxState => {
  switch (action.type) {
    case "SET_ID":
      return { ...state, id: action.payload };
    case "UPDATE_FILES":
      return { ...state, files: action.payload };
    case "TOGGLE_FILE_EXPLORER":
      return { ...state, showFileExplorer: !state.showFileExplorer };
    case "TOGGLE_PREVIEW":
      return { ...state, showPreview: !state.showPreview };
    case "TOGGLE_EDITOR":
      return { ...state, showEditor: !state.showEditor };
    case "TOGGLE_CONSOLE":
      return { ...state, showConsole: !state.showConsole };
    case "TOGGLE_TITLE_BAR":
      return { ...state, showTitleBar: !state.showTitleBar };
    case "SET_EXPANDED":
      return { ...state, isExpanded: action.payload };
    default:
      return state;
  }
};

type SandboxContextType = {
  state: SandboxState;
  dispatch: React.Dispatch<SandboxAction>;
};

const SandboxContext = createContext<SandboxContextType | null>(null);

export const useSandbox = () => {
  const context = useContext(SandboxContext);
  if (!context) {
    throw new Error("useSandbox must be used within a SandboxProvider");
  }
  return context;
};

export { SandboxContext, sandboxReducer };
export type { SandboxState, SandboxAction };
