import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react";
import React, { useCallback } from "react";
import * as PopoverMenu from "@/components/ui/popover-menu";

import { Toolbar } from "@/components/ui/toolbar";
import { isRowGripSelected } from "./utils";
import { Icons } from "@/components/icons";
import { MenuProps, ShouldShowProps } from "@/types/editor";

export const TableRowMenu = React.memo(
  ({ editor, appendTo }: MenuProps): JSX.Element => {
    const shouldShow = useCallback(
      ({ view, state, from }: ShouldShowProps) => {
        if (!state || !from) {
          return false;
        }

        return isRowGripSelected({ editor, view, state, from });
      },
      [editor]
    );

    const onAddRowBefore = useCallback(() => {
      editor.chain().focus().addRowBefore().run();
    }, [editor]);

    const onAddRowAfter = useCallback(() => {
      editor.chain().focus().addRowAfter().run();
    }, [editor]);

    const onDeleteRow = useCallback(() => {
      editor.chain().focus().deleteRow().run();
    }, [editor]);

    return (
      <BaseBubbleMenu
        editor={editor}
        pluginKey="tableRowMenu"
        updateDelay={0}
        tippyOptions={{
          appendTo: () => {
            return appendTo?.current;
          },
          placement: "left",
          offset: [0, 15],
          popperOptions: {
            modifiers: [{ name: "flip", enabled: false }],
          },
        }}
        shouldShow={shouldShow}
      >
        <Toolbar.Wrapper isVertical>
          <PopoverMenu.Item
            iconComponent={<Icons.arrowUpToLine />}
            close={false}
            label="Add row before"
            onClick={onAddRowBefore}
          />
          <PopoverMenu.Item
            iconComponent={<Icons.arrowDownToLine />}
            close={false}
            label="Add row after"
            onClick={onAddRowAfter}
          />
          <PopoverMenu.Item
            iconComponent={<Icons.trash />}
            close={false}
            label="Delete row"
            onClick={onDeleteRow}
          />
        </Toolbar.Wrapper>
      </BaseBubbleMenu>
    );
  }
);

TableRowMenu.displayName = "TableRowMenu";

export default TableRowMenu;
