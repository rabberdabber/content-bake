import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface CommandItem {
  title: string;
  command: ({ editor, range }: { editor: any; range: any }) => void;
  icon: React.ReactNode;
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
    <div className="flex flex-col space-y-1 p-2 max-h-[500px] overflow-y-auto">
      <Command>
        <CommandInput placeholder="Search command..." />
        <CommandList>
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {props.items.map((item, index) => (
              <CommandItem
                key={item.title}
                value={item.title}
                onSelect={() => {
                  selectItem(index);
                }}
                className={cn(
                  "flex items-center space-x-2 gap-2",
                  index === selectedIndex ? "bg-foreground/10" : ""
                )}
              >
                {item.icon}
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
});

CommandsList.displayName = "CommandsList";

export default CommandsList;
