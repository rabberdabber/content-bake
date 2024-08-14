"use client";
import { Children, ReactElement, useEffect, useRef, ReactNode } from "react";
import { useClipboard } from "@mantine/hooks";
import { Icons } from "./icons";

type CopyCodeProps = {
  children: ReactNode;
};

function CopyCode({ children }: CopyCodeProps) {
  const { copy, copied } = useClipboard();
  const codeRef = useRef<string>("");

  useEffect(() => {
    const result: string[] = [];
    Children.forEach(children, (child) => {
      result.push((child as ReactElement).props.children);
    });
    codeRef.current = result[0];
  }, []);

  return (
    <div className="absolute right-0 top-0 translate-y-[100%] -translate-x-[50%]">
      {copied ? (
        <Icons.check color="green" />
      ) : (
        <Icons.copy onClick={() => copy(codeRef.current)} />
      )}
    </div>
  );
}

export default CopyCode;
