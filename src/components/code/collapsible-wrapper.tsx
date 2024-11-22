import React, { useRef, useState, createContext, useContext } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Icons } from "../icons";
import { cn } from "@/lib/utils";

interface CollapsibleWrapperContextType {
  isExpanded: boolean;
  isOverflowing: boolean;
  setIsExpanded: (value: boolean) => void;
  setIsOverflowing: (value: boolean) => void;
  maxHeight: number;
}

const CollapsibleWrapperContext =
  createContext<CollapsibleWrapperContextType | null>(null);

function useCollapsibleWrapper() {
  const context = useContext(CollapsibleWrapperContext);
  if (!context) {
    throw new Error(
      "useCollapsibleWrapper must be used within a CollapsibleWrapperProvider"
    );
  }
  return context;
}

interface CollapsibleWrapperProps {
  children: React.ReactNode;
  maxHeight?: number;
  className?: string;
}

function CollapsibleWrapper({
  children,
  maxHeight = 500,
  className,
}: CollapsibleWrapperProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const contextValue = {
    isExpanded,
    isOverflowing,
    setIsExpanded,
    setIsOverflowing,
    maxHeight,
  };

  return (
    <CollapsibleWrapperContext.Provider value={contextValue}>
      <Collapsible
        open={isExpanded}
        onOpenChange={setIsExpanded}
        className={cn("w-full relative", className)}
      >
        {!isExpanded && (
          <div
            ref={contentRef}
            style={{ maxHeight: `${maxHeight}px` }}
            className="overflow-hidden"
          >
            {children}
          </div>
        )}

        <CollapsibleContent>{children}</CollapsibleContent>

        <CollapsibleTrigger asChild>
          {(isExpanded || isOverflowing) && (
            <Button
              variant="ghost"
              className={cn(
                "absolute bottom-0",
                "rounded-none",
                "w-full justify-center",
                "bg-[#011627] text-gray-400",
                "hover:bg-gray-800 hover:text-gray-50",
                "dark:bg-[#011627] dark:text-gray-400",
                "dark:hover:bg-gray-800 dark:hover:text-gray-50",
                "border border-gray-800 dark:border-gray-800",
                "justify-start"
              )}
            >
              {isExpanded && (
                <div className="flex items-center gap-2">
                  <Icons.chevronUp />
                  <span>Show less</span>
                </div>
              )}
              {isOverflowing && !isExpanded && (
                <div className="flex items-center gap-2">
                  <Icons.chevronDown />
                  <span>Show more</span>
                </div>
              )}
            </Button>
          )}
        </CollapsibleTrigger>
      </Collapsible>
    </CollapsibleWrapperContext.Provider>
  );
}

export { useCollapsibleWrapper };
export default CollapsibleWrapper;
