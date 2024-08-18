"use client";
import { Children, ReactElement, useEffect, useRef, ReactNode } from "react";
import { useClipboard } from "@mantine/hooks";
import { Icons } from "./icons";
import { useTheme } from "next-themes";

type CopyCodeProps = {
  children: ReactNode;
};

function CopyCode({ children }: CopyCodeProps) {
  const { copy, copied } = useClipboard();
  const codeRef = useRef<string>("");
  const { theme } = useTheme();

  useEffect(() => {
    const result: string[] = [];
    Children.forEach(children, (child) => {
      result.push((child as ReactElement).props.children);
    });
    codeRef.current = result[0];
  }, []);

  return (
    <div className="absolute right-0 top-0 translate-y-[100%] -translate-x-[50%] hover:bg-gray-600 p-1 rounded-md">
      {copied ? (
        <Icons.check color="green" />
      ) : (
        <Icons.copy
          onClick={() => copy(codeRef.current)}
          color={theme === "dark" ? "gray" : "black"}
        />
      )}
    </div>
  );
}

export default CopyCode;
