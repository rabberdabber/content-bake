"use client";

import { Icons } from "@/components/icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { breakpoints, useMediaQuery } from "@/lib/hooks/use-media-query";
import { signOut, useSession } from "next-auth/react";

import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { TooltipProvider } from "./ui/tooltip";
import { cn } from "@/lib/utils";

export function NavUser() {
  const isMobile = !useMediaQuery(breakpoints.md);
  const { data: session } = useSession();
  const full_name = session?.user.full_name || "";
  const avatar = session?.user.image || "/avatar.png";
  const email = session?.user.email || "";
  const is_superuser = session?.user.is_superuser || false;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex gap-1 items-center justify-center">
          <Avatar className="h-12 w-12 rounded-full hover:cursor-pointer hover:outline hover:outline-muted-foreground">
            <AvatarImage
              src={avatar}
              alt={full_name}
              className={cn("object-cover", is_superuser && "object-top")}
            />
            <AvatarFallback className="rounded-lg">{full_name}</AvatarFallback>
          </Avatar>
          <Icons.chevronsUpDown className="ml-auto size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={"bottom"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={avatar}
                alt={full_name}
                className={cn(
                  "object-cover object-top",
                  is_superuser && "object-top"
                )}
              />
              <AvatarFallback className="rounded-lg">User</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{full_name}</span>
              <span className="truncate text-xs">{email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-not-allowed"
          onClick={() => {}}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>Choose Avatar</TooltipTrigger>
              <TooltipContent>Coming Soon</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <Icons.logout />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
