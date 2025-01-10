import React from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { type SupportedLanguage } from "@/types/code";

interface LanguageSelectorProps {
  value: SupportedLanguage;
  open: boolean;
  setOpen: (open: boolean) => void;
  setValue: (value: SupportedLanguage) => void;
  defaultLanguage: SupportedLanguage;
  languages: SupportedLanguage[];
  updateAttributes: (attrs: { language: SupportedLanguage }) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  open,
  setOpen,
  setValue,
  defaultLanguage,
  languages,
  updateAttributes,
}) => {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[min-content] bg-background border border-input hover:bg-accent hover:text-accent-foreground"
        >
          <span className="text-foreground">
            {value
              ? languages
                  .find((lang) => lang === value)
                  ?.charAt(0)
                  .toUpperCase() + value.slice(1)
              : "Select Language..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-popover border border-border">
        <Command className="bg-transparent">
          <CommandInput
            placeholder="Search Language..."
            className="border-none focus:ring-0"
          />
          <CommandList>
            <CommandEmpty className="text-muted-foreground">
              No Language found.
            </CommandEmpty>
            <CommandGroup>
              {languages.map((lang, index) => (
                <CommandItem
                  key={index}
                  value={lang}
                  onSelect={(currentValue) => {
                    updateAttributes({ language: lang });
                    setValue(lang);
                    setOpen(false);
                  }}
                  className="text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      defaultLanguage === lang ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSelector;
