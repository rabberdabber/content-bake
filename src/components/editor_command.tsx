import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import type { Editor, Range } from "@tiptap/core";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { suggestions } from "./tiptap-extensions/commands-suggestion";
import { cn } from "@/lib/utils";

interface EditorCommandOutProps {
  query: string;
  range: Range;
  editor: Editor;
  popupContainer: HTMLElement;
}

interface EditorCommandOutRef {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

export const EditorCommandOut = forwardRef<
  EditorCommandOutRef,
  EditorCommandOutProps
>(({ query, range, editor }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const commandListRef = useRef<HTMLDivElement>(null);
  const initialSelectionMade = useRef(false);
  const isKeyboardNavigation = useRef(false);

  const groupedItems = suggestions.items({ query });
  const filteredGroups = groupedItems
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((group) => group.items.length > 0);

  // Flatten items for keyboard navigation
  const filteredItems = filteredGroups.flatMap((group) => group.items);

  const selectItem = (key: string) => {
    const item = filteredItems.find((item) => item.key === key);
    if (item) {
      item.command({ editor, range });
    }
  };

  const updateSelection = (newIndex: number) => {
    isKeyboardNavigation.current = true;
    setSelectedKey(filteredItems[newIndex].key);
  };

  const upHandler = () => {
    const currentIndex = filteredItems.findIndex(
      (item) => item.key === selectedKey
    );
    const newIndex =
      (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    updateSelection(newIndex);
  };

  const downHandler = () => {
    const currentIndex = filteredItems.findIndex(
      (item) => item.key === selectedKey
    );
    const newIndex = (currentIndex + 1) % filteredItems.length;
    updateSelection(newIndex);
  };

  const enterHandler = () => {
    if (selectedKey) {
      selectItem(selectedKey);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (
      filteredItems.length > 0 &&
      !selectedKey &&
      !initialSelectionMade.current
    ) {
      setSelectedKey(filteredItems[0].key);
      initialSelectionMade.current = true;
    }
  }, [filteredItems, selectedKey]);

  useEffect(() => {
    const scrollSelectedItemIntoView = () => {
      if (!isKeyboardNavigation.current) return;

      const element = commandListRef.current?.querySelector(
        `[data-key="${selectedKey}"]`
      );
      if (element) {
        element.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
      isKeyboardNavigation.current = false;
    };

    scrollSelectedItemIntoView();
  }, [selectedKey]);

  useEffect(() => {
    setSelectedKey(null);
    initialSelectionMade.current = false;
  }, [search]);

  useImperativeHandle(ref, () => ({
    onKeyDown: (event: KeyboardEvent) => {
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
    <Command className="min-w-[300px]">
      <CommandInput
        ref={inputRef}
        placeholder="Search command..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList ref={commandListRef}>
        <CommandEmpty>No command found.</CommandEmpty>
        {filteredGroups.map((group, groupIndex) => (
          <React.Fragment key={group.heading}>
            {groupIndex > 0 && <CommandSeparator />}
            <CommandGroup heading={group.heading}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.key}
                  onSelect={() => selectItem(item.key)}
                  className={cn(
                    "flex items-center space-x-2 gap-3 hover:bg-accent",
                    item.key === selectedKey ? "bg-accent" : ""
                  )}
                  onMouseEnter={() => {
                    isKeyboardNavigation.current = false;
                    setSelectedKey(item.key);
                  }}
                  data-key={item.key}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="flex items-center justify-center w-8 h-8 border border-slate-300 p-1 rounded-sm">
                      {item.icon}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.description}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </React.Fragment>
        ))}
      </CommandList>
    </Command>
  );
});
