import { BubbleMenu, isNodeSelection, isTextSelection } from "@tiptap/react";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import type { BubbleMenuProps } from "@tiptap/react";
import type { ReactNode } from "react";
import type { Instance, Props } from "tippy.js";

export interface EditorBubbleProps extends BubbleMenuProps {
  readonly children: ReactNode;
}

export const EditorBubble = forwardRef<HTMLDivElement, EditorBubbleProps>(
  ({ children, tippyOptions, editor, ...rest }, ref) => {
    if (!editor) return null;

    const instanceRef = useRef<Instance<Props> | null>(null);

    useEffect(() => {
      if (!instanceRef.current || !tippyOptions?.placement) return;

      instanceRef.current.setProps({ placement: tippyOptions.placement });
      instanceRef.current.popperInstance?.update();
    }, [tippyOptions?.placement]);

    const bubbleMenuProps: Omit<BubbleMenuProps, "children" | "editor"> =
      useMemo(() => {
        const shouldShow: BubbleMenuProps["shouldShow"] = ({
          editor,
          state,
          from,
          to,
        }) => {
          const { selection } = state;
          const { empty } = selection;

          if (
            !editor.isEditable ||
            editor.isActive("imageBlock") ||
            editor.isActive("live-code-block") ||
            editor.isActive("table") ||
            editor.isActive("codeBlock") ||
            editor.isActive("embedInput") ||
            empty ||
            isNodeSelection(selection)
          ) {
            const { doc, selection } = state;
            const isText = isTextSelection(selection);
            if (!isText) return false;
            const isEmpty =
              selection.empty ||
              (isText && doc.textBetween(from, to).length === 0);
            if (isEmpty) return false;
            return false;
          }
          return true;
        };

        return {
          shouldShow,
          tippyOptions: {
            onCreate: (val) => {
              instanceRef.current = val;
            },
            moveTransition: "transform 0.15s ease-out",
            ...tippyOptions,
          },
          ...rest,
        };
      }, [rest, tippyOptions]);

    return (
      <BubbleMenu editor={editor} {...bubbleMenuProps}>
        {children}
      </BubbleMenu>
    );
  }
);

EditorBubble.displayName = "EditorBubble";

export default EditorBubble;
