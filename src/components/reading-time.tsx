"use client";

import readingTime from "reading-time";
import { generateHTML, JSONContent } from "@tiptap/react";
import extensions from "@/features/editor/components/extensions";

export function ReadingTime({ content }: { content: JSONContent }) {
  const readingTimeForHTML = readingTime(generateHTML(content, extensions));
  return <span>{Math.round(readingTimeForHTML.minutes)} min read</span>;
}
