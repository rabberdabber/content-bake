import { Button, ButtonProps } from "./button";
import { cn } from "@/lib/utils";

// TODO: Add a tooltip to the IconButton component
const IconButton = ({ children, className, ...props }: ButtonProps) => {
  return (
    <Button
      {...props}
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-md bg-slate-900 text-white hover:bg-transparent hover:text-slate-900",
        className
      )}
      size="icon"
    >
      {children}
    </Button>
  );
};

export default IconButton;
