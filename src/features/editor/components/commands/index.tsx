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
import type { ReactNode, RefObject } from "react";
import { Icons } from "@/components/icons";
import { ReactRenderer } from "@tiptap/react";
import tippy, { Instance, Props, type GetReferenceClientRect } from "tippy.js";
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
                  value={item.key}
                  onSelect={() => selectItem(item.key)}
                  className={cn(
                    "flex items-center space-x-2 gap-3 transition-colors duration-200 hover:bg-transparent",
                    item.key === selectedKey &&
                      "bg-accent data-[selected]:bg-accent"
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

EditorCommandOut.displayName = "EditorCommandOut";

export const suggestions = {
  items: ({ query }: { query: string }) => {
    const commandGroups = [
      {
        heading: "AI",
        items: [
          {
            key: "aiContent",
            title: "AI Content Generation",
            description: "Generate content using AI",
            icon: <Icons.sparkles />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor.chain().focus().deleteRange(range).run();

              // Dispatch custom event after setting the node
              window.dispatchEvent(new CustomEvent("openAIContentDialog"));
            },
          },
          {
            key: "aiImage",
            title: "AI Image Generation",
            description: "Generate an image using AI",
            icon: <Icons.sparkles />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setAIImageGenerator()
                .run();
            },
          },
        ],
      },
      {
        heading: "Text Formatting",
        items: [
          {
            key: "heading1",
            title: "Heading 1",
            description: "Large section heading",
            icon: <Icons.heading1 />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 1 })
                .run();
            },
          },
          {
            key: "heading2",
            title: "Heading 2",
            description: "Medium section heading",
            icon: <Icons.heading2 />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 2 })
                .run();
            },
          },
          {
            key: "bulletList",
            title: "Bullet List",
            description: "Create a bulleted list",
            icon: <Icons.list />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleBulletList()
                .run();
            },
          },
          {
            key: "numberedList",
            title: "Numbered List",
            description: "Create a numbered list",
            icon: <Icons.listOrdered />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleOrderedList()
                .run();
            },
          },
        ],
      },
      {
        heading: "Code & Development",
        items: [
          {
            key: "codeBlock",
            title: "Code Block",
            description: "Add a block of code",
            icon: <Icons.code />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("codeBlock", { language: "typescript" })
                .run();
            },
          },
          {
            key: "liveCodeBlock",
            title: "Live Code Block",
            description: "Add an interactive code block",
            icon: <Icons.codePen />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .insertContent("<live-code-block></live-code-block>")
                .run();
            },
          },
          {
            key: "widget",
            title: "Widget",
            description: "Insert an interactive widget",
            icon: <Icons.widget />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .insertContent({
                  type: "live-code-block",
                  attrs: {
                    language: "javascript",
                    isWidget: true,
                  },
                  content: [],
                })
                .run();
            },
          },
        ],
      },
      {
        heading: "Media",
        items: [
          {
            key: "image",
            title: "Upload Image",
            description: "Upload an image from your device",
            icon: <Icons.image />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setMediaUploader({ type: "image" })
                .run();
            },
          },
          {
            key: "video",
            title: "Upload Video",
            description: "Upload and embed a video",
            icon: <Icons.video />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setMediaUploader({ type: "video" })
                .run();
            },
          },
        ],
      },
      {
        heading: "Embed",
        items: [
          {
            key: "youtube",
            title: "YouTube",
            description: "Embed a YouTube video",
            icon: <Icons.youtube />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .insertContent({
                  type: "youtubeInput",
                })
                .run();
            },
          },
        ],
      },
      {
        heading: "Other",
        items: [
          {
            key: "table",
            title: "Table",
            description: "Insert a table",
            icon: <Icons.table />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
                .run();
            },
          },
        ],
      },
    ];

    // Filter based on query
    const filteredGroups = commandGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.title.toLowerCase().includes(query.toLowerCase())
        ),
      }))
      .filter((group) => group.items.length > 0);

    return filteredGroups;
  },

  render: (elementRef?: RefObject<Element> | null) => {
    let component: ReactRenderer | null = null;
    let popup: Instance<Props>[] | null = null;

    return {
      onStart: (props: {
        editor: Editor;
        clientRect: DOMRect;
        range: Range;
      }) => {
        const popupContainer = document.createElement("div");
        popupContainer.id = "slash-command";
        component = new ReactRenderer(EditorCommandOut, {
          props: {
            ...props,
            popupContainer,
          },
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        const { selection } = props.editor.state;

        const parentNode = selection.$from.node(selection.$from.depth);
        const blockType = parentNode.type.name;

        if (blockType === "codeBlock") {
          return false;
        }

        // @ts-ignore
        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => (elementRef ? elementRef.current : document.body),
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "top-start",
        });
      },
      onUpdate: (props: {
        editor: Editor;
        clientRect: GetReferenceClientRect;
      }) => {
        component?.updateProps(props);

        popup?.[0]?.setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown: (props: { event: KeyboardEvent }) => {
        if (props.event.key === "Escape") {
          popup?.[0]?.hide();
          return true;
        }

        // @ts-ignore
        return component?.ref?.onKeyDown(props.event);
      },
      onExit: () => {
        popup?.[0]?.destroy();
        component?.destroy();
      },
    };
  },
};

export interface SuggestionItem {
  title: string;
  description: string;
  icon: ReactNode;
  searchTerms?: string[];
  command?: (props: { editor: Editor; range: Range }) => void;
}

export const createSuggestionItems = (items: SuggestionItem[]) => items;

export const handleCommandNavigation = (event: KeyboardEvent) => {
  if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
    const slashCommand = document.querySelector("#slash-command");
    if (slashCommand) {
      return true;
    }
  }
};
