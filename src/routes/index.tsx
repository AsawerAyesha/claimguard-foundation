import { Activity, ArrowUpRight, MessageSquareText, ShieldCheck } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ClaimGuard Dashboard | NovaCover" },
      { name: "description", content: "Monitor insurance claim reviews, AI agent activity, and firewall decisions in ClaimGuard." },
      { property: "og:title", content: "ClaimGuard Dashboard | NovaCover" },
      { property: "og:description", content: "Monitor insurance claim reviews, AI agent activity, and firewall decisions in ClaimGuard." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="flex flex-col justify-between gap-5 border-b border-border pb-8 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-primary">Operations overview</p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Claims intelligence</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Review active claim conversations and monitor automated safeguards across the NovaCover claims workflow.</p>
        </div>
        <a href="/claims-chat" className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-[var(--shadow-primary)] transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:self-auto">
          Open claims chat <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </div>

      <section aria-label="System summary" className="grid grid-cols-1 border-b border-border sm:grid-cols-3">
        {[
          { label: "Active sessions", value: "12", detail: "3 awaiting review", icon: MessageSquareText },
          { label: "Firewall checks", value: "1,284", detail: "99.8% passed", icon: ShieldCheck },
          { label: "Agent uptime", value: "99.99%", detail: "All systems nominal", icon: Activity },
        ].map((item, index) => (
          <div key={item.label} className={`py-6 sm:px-6 ${index > 0 ? "border-t border-border sm:border-l sm:border-t-0" : "sm:pl-0"}`}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
              <item.icon className="size-4 text-primary" aria-hidden="true" />
            </div>
            <p className="mt-3 font-mono text-2xl font-semibold tracking-tight text-foreground">{item.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-1 items-center justify-center py-16 text-center">
        <div className="max-w-md">
          <span className="mx-auto flex size-11 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-[var(--shadow-surface)]">
            <MessageSquareText className="size-5" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-base font-semibold text-foreground">Chat-first claim analysis</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Start in Claims Chat to investigate coverage, review evidence, and trace each AI decision.</p>
        </div>
      </section>
    </div>
  );
}
