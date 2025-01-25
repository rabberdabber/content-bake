"use client";

import dynamic from "next/dynamic";
import extensions from "@/features/editor/components/extensions";
import { generateHTML, JSONContent } from "@tiptap/react";
import { useEffect, useState } from "react";

const demoContent: JSONContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: {
        textAlign: "left",
        level: 1,
      },
      content: [
        {
          type: "text",
          text: "Understanding Python Decorators",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "Decorators are a powerful and useful tool in Python, enabling developers to modify the behavior of a function or class method. They are often used to implement cross-cutting concerns such as logging, timing, and access control.",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "A decorator is a function that takes another function as an argument and returns a new function that adds some kind of functionality. Python provides a simple syntax for these, using the '@' symbol. Let's explore an example of how to create and use decorators.",
        },
      ],
    },
    {
      type: "codeBlock",
      attrs: {
        language: "python",
      },
      content: [
        {
          type: "text",
          text: 'def my_decorator(func):\n    def wrapper():\n        print("Something is happening before the function is called.")\n        func()\n        print("Something is happening after the function is called.")\n    return wrapper\n\n@my_decorator\ndef say_hello():\n    print("Hello!")\n\nsay_hello()',
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: 'In this example, the decorator function "my_decorator" is used to wrap the "say_hello" function. The "wrapper" function inside the decorator prints messages before and after calling the original function.',
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "When you run this script, the output will be:",
        },
      ],
    },
    {
      type: "codeBlock",
      attrs: {
        language: "shell",
      },
      content: [
        {
          type: "text",
          text: "Something is happening before the function is called.\nHello!\nSomething is happening after the function is called.",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: 'As you can see, the "my_decorator" function adds behavior to "say_hello" without modifying the function itself. This is particularly useful for aspects that need to be applied across multiple functions.',
        },
      ],
    },
  ],
};

const EditorContainer = dynamic(
  () =>
    import("@/features/editor/components/editor-container").then(
      (mod) => mod.EditorContainer
    ),
  { ssr: false }
);

export default function Page() {
  const [isClient, setIsClient] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    setIsClient(true);
    setContent(generateHTML(demoContent, extensions));
  }, []);

  if (!isClient) return null;
  return (
    <EditorContainer type="local" storageKey="demo-content" isDraft isDemo />
  );
}
