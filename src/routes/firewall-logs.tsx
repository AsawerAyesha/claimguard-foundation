import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/firewall-logs")({
  head: () => ({ meta: [{ title: "Firewall Logs | ClaimGuard" }, { name: "description", content: "Review ClaimGuard AI firewall decisions and risk signals." }] }),
  component: FirewallLogs,
});

function FirewallLogs() {
  return (
    <div className="flex flex-1 items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <ShieldCheck className="mx-auto size-6 text-primary" aria-hidden="true" />
        <h1 className="mt-4 text-xl font-semibold text-foreground">Firewall Logs</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Agent safeguards and decision traces will appear here.</p>
      </div>
    </div>
  );
}