import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { type Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { EditorMode } from "@/types/editor";

type IconWithTooltip = {
  icon: Icon;
  tooltip: string;
  mode: EditorMode;
};

type ToggleGroupProps = {
  iconsWithTooltip: IconWithTooltip[];
  selectedMode: EditorMode;
  onClick: (mode: EditorMode) => void;
};

export default function ToggleGroup({
  iconsWithTooltip,
  selectedMode,
  onClick,
}: ToggleGroupProps) {
  return (
    <div className="flex items-center space-x-2 px-2 py-1 border rounded-md w-fit bg-muted-foreground/5">
      {iconsWithTooltip.map(({ icon: Icon, tooltip, mode }, index) => (
        <TooltipProvider key={tooltip}>
          <Tooltip>
            <TooltipTrigger asChild>
              <>
                <Button
                  variant="ghost"
                  className={cn(
                    "p-2",
                    "hover:bg-muted-foreground/10 focus:bg-muted-foreground/10"
                  )}
                  size="icon"
                  key={index}
                  onClick={() => onClick(mode)}
                >
                  <Icon key={index} className="h-6 w-6" />
                </Button>
              </>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="mt-1">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
