"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import type { TagResponse } from "@/schemas/post";

interface TagSelectorProps {
  availableTags: TagResponse[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagSelector({
  availableTags,
  selectedTags,
  onTagsChange,
  placeholder = "Select or create tags...",
}: TagSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [tagInput, setTagInput] = React.useState("");

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      if (currentValue.trim() && selectedTags.length < 5) {
        const newTag = currentValue.trim();
        if (!selectedTags.includes(newTag)) {
          onTagsChange([...selectedTags, newTag]);
        }
        setTagInput("");
      }
    },
    [selectedTags, onTagsChange]
  );

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-col space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedTags.length > 0
              ? `${selectedTags.length} tags selected`
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput
              placeholder="Search or create tags..."
              value={tagInput}
              onValueChange={setTagInput}
            />
            <CommandList>
              <CommandEmpty className="p-2">
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => handleSelect(tagInput)}
                >
                  Create tag &quot;{tagInput || "new tag"}&quot;
                </Button>
              </CommandEmpty>
              <CommandGroup heading="Existing Tags">
                {availableTags
                  .filter((tag) =>
                    tag.name.toLowerCase().includes(tagInput.toLowerCase())
                  )
                  .map((tag) => (
                    <CommandItem
                      key={tag.id}
                      value={tag.name}
                      onSelect={handleSelect}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedTags.includes(tag.name)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {tag.name}
                      {tag.post_count > 0 && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          {tag.post_count} posts
                        </span>
                      )}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="cursor-pointer"
            onClick={() => handleRemoveTag(tag)}
          >
            {tag}
            <X className="ml-2 h-3 w-3" />
          </Badge>
        ))}
      </div>
    </div>
  );
}
