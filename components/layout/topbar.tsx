"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./theme-toggle";
import { GlobalSearch } from "./global-search";
import { useGymStore } from "@/lib/store";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const unread = useGymStore((s) => s.notifications.filter((n) => !n.read).length);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur lg:px-6">
      <button className="lg:hidden" onClick={onMenu} aria-label="Open menu">
        <Menu className="size-5" />
      </button>

      <GlobalSearch />

      <div className="ml-auto flex items-center gap-1.5">
        <Badge tone="warning" className="hidden sm:inline-flex">
          ● DEMO MODE
        </Badge>
        <ThemeToggle />
        <Link
          href="/notifications"
          className="relative rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white">
              {unread}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
