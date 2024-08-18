"use client";
import React, { Children, ReactElement, useEffect, useRef } from "react";

type CodeSnippetProps = {
  children: string;
};

function CodeSnippet({ children }: CodeSnippetProps) {
  const codeRef = useRef<string>("");

  useEffect(() => {
    const result: string[] = [];
    Children.forEach(children, (child) => {
      result.push((child as unknown as ReactElement).props.children);
    });
    codeRef.current = result[0];
  }, []);

  return (
    <pre className="p-4 bg-gray-800 text-white rounded-md">
      <code>{children}</code>
    </pre>
  );
}

export default CodeSnippet;
