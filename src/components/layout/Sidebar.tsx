import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpenText, LayoutDashboard, MessageSquareText, Shield, ShieldCheck } from "lucide-react";

import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

const navigation = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Claims Chat", href: "/claims-chat", icon: MessageSquareText },
  { label: "Firewall Logs", href: "/firewall-logs", icon: ShieldCheck },
  { label: "Policy Reference", href: "/policy-reference", icon: BookOpenText },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <SidebarRoot collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="h-16 justify-center border-b border-sidebar-border px-3">
        <Link to="/" className="flex items-center gap-3 overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[var(--shadow-primary)]">
            <Shield className="size-4" aria-hidden="true" />
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold tracking-tight">ClaimGuard</span>
              <span className="block truncate text-[10px] font-medium uppercase tracking-[0.18em] text-sidebar-foreground/50">by NovaCover</span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-1 py-4">
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {navigation.map((item) => {
                const active = pathname === item.href;
                const content = (
                  <>
                    <item.icon aria-hidden="true" />
                    <span>{item.label}</span>
                  </>
                );

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.label} className="h-10 gap-3 px-3">
                      <Link to={item.href}>{content}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 overflow-hidden px-1 py-2 text-sidebar-foreground/55">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-sidebar-border bg-sidebar-accent">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
          </span>
          {!collapsed && <span className="truncate font-mono text-[10px] uppercase tracking-wider">Secure environment</span>}
        </div>
      </SidebarFooter>
      <SidebarRail />
    </SidebarRoot>
  );
}