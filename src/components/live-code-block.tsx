"use client";
import {
  Sandpack,
  SandpackPredefinedTemplate,
} from "@codesandbox/sandpack-react";
import { nightOwl } from "@codesandbox/sandpack-themes";

const templateFiles = {
  "/App.js": `
import React from 'react';
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
};

type SandboxProps = {
  files?: { [key: string]: string };
  template?: SandpackPredefinedTemplate;
};

const Sandbox = ({
  files = templateFiles,
  template = "react",
}: SandboxProps) => {
  return (
    <div>
      <Sandpack theme={nightOwl} files={files} template={template} />
    </div>
  );
};

export default Sandbox;
