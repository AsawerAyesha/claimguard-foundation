import type { ReactNode } from "react";
import { Circle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export function MainArea({ children }: { children: ReactNode }) {
  return (
    <SidebarInset className="min-w-0">
      <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-xl sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger className="size-8 shrink-0 text-muted-foreground hover:text-foreground" />
          <span className="h-4 w-px bg-border" aria-hidden="true" />
          <p className="truncate text-xs font-medium tracking-wide text-muted-foreground sm:text-sm">
            NovaCover Internal System
          </p>
        </div>
        <Badge variant="success" className="shrink-0 gap-1.5">
          <Circle className="size-1.5 fill-current" aria-hidden="true" />
          <span className="hidden sm:inline">System Online</span>
          <span className="sm:hidden">Online</span>
        </Badge>
      </header>
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </SidebarInset>
  );
}