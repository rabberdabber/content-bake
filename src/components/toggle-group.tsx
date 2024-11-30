import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { type Icon } from "./icons";
import { cn } from "@/lib/utils";

type IconWithTooltip = {
  icon: Icon;
  tooltip: string;
  onClick?: () => void;
  selected: boolean;
};

type ToggleGroupProps = {
  iconsWithTooltip: IconWithTooltip[];
};

export default function ToggleGroup({ iconsWithTooltip }: ToggleGroupProps) {
  return (
    <div className="flex items-center space-x-4 border rounded-md">
      <div className="flex items-center space-x-2 px-2 py-1 border rounded-md">
        {iconsWithTooltip.map(
          ({ icon: Icon, tooltip, onClick, selected }, index) => (
            <TooltipProvider key={tooltip}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "p-2",
                      selected && "bg-gray-100 dark:bg-gray-800 rounded-md"
                    )}
                    size="icon"
                    key={index}
                    onClick={onClick}
                  >
                    <Icon key={index} className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="mt-1">
                  {tooltip}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        )}
      </div>
    </div>
  );
}
