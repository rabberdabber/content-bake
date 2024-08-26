import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Button } from "../ui/button";

interface CommandItem {
  title: string;
  command: ({ editor, range }: { editor: any; range: any }) => void;
}

interface CommandsListProps {
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

const CommandsList = forwardRef((props: CommandsListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="flex flex-col space-y-1 p-2 max-h-[300px] overflow-y-auto">
      {props.items.map((item, index) => (
        <Button
          key={index}
          variant={index === selectedIndex ? "default" : "ghost"}
          className="justify-start"
          onClick={() => selectItem(index)}
        >
          {item.title}
        </Button>
      ))}
    </div>
  );
});

CommandsList.displayName = "CommandsList";

export default CommandsList;
