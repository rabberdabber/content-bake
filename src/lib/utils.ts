import { Node } from "prosemirror-model";
import { Extensions, getSchema, JSONContent } from "@tiptap/core";
import { Editor } from "@tiptap/react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { JsonContentSchema } from "@/schemas/post";
import lodash from "lodash";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRenderContainer = (editor: Editor, nodeType: string) => {
  const {
    view,
    state: {
      selection: { from },
    },
  } = editor;

  const elements = document.querySelectorAll(".ProseMirror-selectednode");
  const elementCount = elements.length;
  const innermostNode = elements[elementCount - 1];
  const element = innermostNode;

  if (
    (element &&
      element.getAttribute("data-type") &&
      element.getAttribute("data-type") === nodeType) ||
    (element && element.classList && element.classList.contains(nodeType))
  ) {
    return element;
  }

  const node = view.domAtPos(from).node as HTMLElement;
  let container: HTMLElement | null = node;

  if (!container.tagName) {
    container = node.parentElement;
  }

  while (
    container &&
    !(
      container.getAttribute("data-type") &&
      container.getAttribute("data-type") === nodeType
    ) &&
    !container.classList.contains(nodeType)
  ) {
    container = container.parentElement;
  }

  return container;
};

export const validateSchema = (doc: JSONContent, extensions: Extensions) => {
  const schema = getSchema(extensions);
  const contentNode = Node.fromJSON(schema, doc);
  contentNode.check();
  // try {
  //   return true;
  // } catch (e) {
  //   return false;
  // }
};

export const validateAndFilterJsonContent = (jsonContent: JSONContent) => {
  const safeParseResult = JsonContentSchema.safeParse(jsonContent);

  if (!safeParseResult.success) {
    // If parsing fails, return the error or handle it
    return { success: false, error: safeParseResult.error };
  }

  // Filter out nodes with null content
  const filteredContent = safeParseResult.data.content?.filter(
    (node) => node.content !== null
  );

  return {
    success: true,
    data: {
      ...safeParseResult.data,
      content: filteredContent,
    },
  };
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars (except spaces and dashes)
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/-+/g, "-") // Replace multiple dashes with single dash
    .replace(/^-+/, "") // Remove leading dashes
    .replace(/-+$/, ""); // Remove trailing dashes
}

export const shouldRenderSearchAndFilterSection = (pathname: string) => {
  return ["/posts", "/drafts", "/published"].includes(pathname);
};

/**
 * Deep comparison function to check if two values are equal
 * Handles primitives, arrays, and objects
 */
export const isEqual = (a: any, b: any): boolean => {
  if (a === b) return true;

  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length && a.every((item, index) => isEqual(item, b[index]))
    );
  }
  console.log("comparing a and b", a, b);
  return lodash.isEqual(a, b);
};
