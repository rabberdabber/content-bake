"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useState } from "react";

type ButtonConfig = {
  label: string;
  icon: keyof typeof Icons;
  onClick: () => void;
  loading?: boolean;
  children?: React.ReactNode;
};

type EditorActionsDialogProps = {
  buttons: ButtonConfig[];
  children?: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function EditorActionsDialog({
  open,
  setOpen,
  buttons,
  children,
}: EditorActionsDialogProps) {
  const [triggerIndex, setTriggerIndex] = useState(-1);
  return (
    <div className="flex gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        {buttons.map((button, index) => {
          const Icon = Icons[button.icon];
          return (
            <div
              key={index}
              className="relative flex gap-2 border-2 border-border/50 bg-muted-foreground/5 rounded-md p-1"
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-muted-foreground/10 focus:bg-muted-foreground/10 p-1"
                  disabled={button.loading}
                  onClick={() => {
                    setTriggerIndex(index);
                    button.onClick();
                  }}
                >
                  <Icon className="h-6 w-6" />
                  {button.label}
                </Button>
              </DialogTrigger>
            </div>
          );
        })}

        <DialogContent
          className={cn("overflow-y-auto min-w-[75dvw] h-[90dvh]")}
        >
          {triggerIndex !== -1 && buttons[triggerIndex].children}
        </DialogContent>
      </Dialog>
    </div>
  );
}
