import React, {
forwardRef,
useState,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface CommandItemProps {
  title: string;
  description: string;
  command: ({ editor, range }: { editor: any; range: any }) => void;
  icon: React.ReactNode;
}

interface CommandsListProps {
  items: CommandItemProps[];
  command: (item: CommandItemProps) => void;
}

interface CommandsListRef {
  onKeyDown: (event: KeyboardEvent) => void;
}

const CommandsList = forwardRef<CommandsListRef, CommandsListProps>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [search, setSearch] = useState("");
    const commandListRef = useRef<HTMLDivElement>(null);

    const filteredItems = props.items.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );

    const selectItem = (index: number) => {
      const item = filteredItems[index];
      if (item) {
        props.command(item);
      }
    };

    useEffect(() => {
      setSelectedIndex(0);
    }, [search]);

    useEffect(() => {
      const scrollSelectedItemIntoView = () => {
        const element = commandListRef.current?.querySelector(
          `[data-index="${selectedIndex}"]`
        );
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      };

      scrollSelectedItemIntoView();
    }, [selectedIndex]);

    const upHandler = () => {
      setSelectedIndex(
        (prevIndex) =>
          (prevIndex - 1 + filteredItems.length) % filteredItems.length
      );
    };

    const downHandler = () => {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % filteredItems.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

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
      // <Command className="min-w-[300px]">
      //   <CommandInput
      //     placeholder="Search command..."
      //     value={search}
      //     onValueChange={setSearch}
      //   />
      //   <CommandList ref={commandListRef}>
      //     <CommandEmpty>No command found.</CommandEmpty>
      //     <CommandGroup>
      //       {filteredItems.map((item, index) => {
      //         if (index === selectedIndex) {
      //           console.log("selectedIndex", selectedIndex);
      //         }
      //         return (
      //           <CommandItem
      //             key={item.title}
      //             onSelect={() => selectItem(index)}
      //             onMouseEnter={() => {}}
      //             className={cn(
      //               "flex items-center space-x-2 gap-3 hover:bg-foreground/10",
      //               index === selectedIndex ? "bg-foreground/10" : ""
      //             )}
      //             data-index={index}
      //           >
      //             <div className="flex items-center gap-4 flex-1">
      //               <span className="flex items-center justify-center w-8 h-8 border border-slate-300 p-1 rounded-sm">
      //                 {item.icon}
      //               </span>
      //               <div className="flex flex-col">
      //                 <span className="font-medium">{item.title}</span>
      //                 <span className="text-sm text-muted-foreground">
      //                   {item.description}
      //                 </span>
      //               </div>
      //             </div>
      //           </CommandItem>
      //         );
      //       })}
      //     </CommandGroup>
      //   </CommandList>
      // </Command>
      <></>
    );
  }
);

CommandsList.displayName = "CommandsList";

export default CommandsList;
