import { createFileRoute } from "@tanstack/react-router";
import { Banknote, Check, Clock3, Inbox, Search, Shield, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea, type PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/claims-chat")({
  head: () => ({
    meta: [
      { title: "Claims Chat | ClaimGuard" },
      { name: "description", content: "Chat-first AI workspace for investigating NovaCover insurance claims." },
    ],
  }),
  component: ClaimsChat,
});

type MockMessage = { id: string; role: "user" | "assistant"; text: string; summary?: { label: string; value: string }[] };
type PipelineStatus = "Pending" | "Active" | "Complete" | "Blocked";
type MockSession = { id: string; claimNumber: string; title: string; updatedAt: string; messages: MockMessage[]; pipeline: PipelineStatus[] };

const sessions: MockSession[] = [
  { id: "clm-88421", claimNumber: "CLM-88421", title: "Storm damage · Residential", updatedAt: "Updated 2 min ago", pipeline: ["Complete", "Complete", "Active", "Pending"], messages: [
    { id: "m1", role: "user", text: "A tree fell onto my garage during last night's storm. I need to start a claim." },
    { id: "m2", role: "assistant", text: "I’ve located your homeowner policy and opened a preliminary review. Here is what I have so far:", summary: [{ label: "Policy Number", value: "NC-HO-294810" }, { label: "Incident Date", value: "June 14, 2026" }, { label: "Coverage Type", value: "Dwelling + Structures" }, { label: "Claim Status", value: "Assessment" }] },
    { id: "m3", role: "user", text: "The garage roof is damaged, but nobody was hurt." },
    { id: "m4", role: "assistant", text: "Thank you. I’ve recorded that there were no injuries. The Assessment Agent is checking your detached-structure coverage and deductible now." },
  ] },
  { id: "clm-88103", claimNumber: "CLM-88103", title: "Rear collision · Auto", updatedAt: "Updated 18 min ago", pipeline: ["Complete", "Complete", "Complete", "Active"], messages: [
    { id: "a1", role: "user", text: "Can you check whether the repair payment has been approved?" },
    { id: "a2", role: "assistant", text: "Yes. The assessment is complete and the approved repair payment is now being prepared.", summary: [{ label: "Policy Number", value: "NC-AU-118204" }, { label: "Incident Date", value: "June 8, 2026" }, { label: "Coverage Type", value: "Collision" }, { label: "Approved Amount", value: "$4,860.00" }] },
  ] },
  { id: "clm-87992", claimNumber: "CLM-87992", title: "Water loss · Residential", updatedAt: "Updated yesterday", pipeline: ["Complete", "Blocked", "Pending", "Pending"], messages: [
    { id: "w1", role: "user", text: "The upstairs pipe burst and water reached the kitchen ceiling." },
    { id: "w2", role: "assistant", text: "I paused this claim because the submitted notes contain sensitive account information. Please remove bank details before continuing." },
  ] },
];

const pipelineSteps = [
  { name: "Intake Agent", icon: Inbox, messages: { Pending: "Waiting for claim details", Active: "Collecting incident data", Complete: "Incident details collected", Blocked: "Intake requires review" } },
  { name: "Firewall Agent", icon: ShieldCheck, messages: { Pending: "Queued for safety scan", Active: "Scanning for sensitive PII", Complete: "PII scan passed", Blocked: "Sensitive data detected" } },
  { name: "Assessment Agent", icon: Search, messages: { Pending: "Waiting for assessment", Active: "Evaluating policy coverage", Complete: "Coverage assessment complete", Blocked: "Coverage review blocked" } },
  { name: "Payout Agent", icon: Banknote, messages: { Pending: "Awaiting final approval", Active: "Processing approved payment", Complete: "Payment issued", Blocked: "Payment put on hold" } },
] as const;
const timestamps = ["09:41:08", "09:41:12", "09:41:16", "—"];

function ClaimsChat() {
  const [sessionId, setSessionId] = useState(sessions[0].id);
  const [draftMessages, setDraftMessages] = useState<Record<string, MockMessage[]>>({});
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const session = sessions.find((item) => item.id === sessionId) ?? sessions[0];
  const messages = draftMessages[session.id] ?? session.messages;

  useEffect(() => { textareaRef.current?.focus(); }, [sessionId, isTyping]);

  const handleSubmit = (message: PromptInputMessage) => {
    const text = message.text.trim();
    if (!text || isTyping) return;
    setDraftMessages((current) => ({ ...current, [session.id]: [...(current[session.id] ?? session.messages), { id: `user-${Date.now()}`, role: "user", text }] }));
    setIsTyping(true);
    window.setTimeout(() => {
      setDraftMessages((current) => ({ ...current, [session.id]: [...(current[session.id] ?? session.messages), { id: `assistant-${Date.now()}`, role: "assistant", text: "I’ve added that detail to the claim record. The active agent will include it in the current review." }] }));
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-[minmax(0,65fr)_minmax(320px,35fr)]">
      <section className="flex min-h-[680px] min-w-0 flex-col border-b border-border lg:h-[calc(100vh-4rem)] lg:min-h-0 lg:border-b-0 lg:border-r" aria-label="Claims Assistant chat">
        <header className="flex flex-col gap-4 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div><div className="flex items-center gap-2.5"><h1 className="text-lg font-semibold tracking-tight">Claims Assistant</h1><Badge variant="success" className="gap-1.5 font-mono text-[10px] uppercase tracking-wide"><span className="relative flex size-2" aria-hidden="true"><span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" /><span className="relative inline-flex size-2 rounded-full bg-success" /></span>Agent Active</Badge></div><p className="mt-1 text-xs text-muted-foreground">Secure claim review workspace</p></div>
          <Select value={sessionId} onValueChange={(value) => { setIsTyping(false); setSessionId(value); }}><SelectTrigger className="h-11 w-full bg-card sm:w-[280px]" aria-label="Switch claim session"><SelectValue /></SelectTrigger><SelectContent>{sessions.map((item) => <SelectItem key={item.id} value={item.id}>{item.claimNumber} · {item.title}</SelectItem>)}</SelectContent></Select>
        </header>
        <div className="border-b border-border bg-card/30 px-4 py-2.5 sm:px-6"><div className="flex items-center justify-between gap-4"><p className="truncate font-mono text-xs text-foreground">{session.claimNumber} <span className="font-sans text-muted-foreground">· {session.title}</span></p><span className="shrink-0 text-[10px] text-muted-foreground">{session.updatedAt}</span></div></div>
        <Conversation key={session.id} className="min-h-0 bg-background"><ConversationContent className="mx-auto w-full max-w-3xl gap-6 px-4 py-7 sm:px-6">
          {messages.map((message) => <Message key={message.id} from={message.role} className={message.role === "user" ? "max-w-[82%]" : "max-w-[92%]"}>
            {message.role === "assistant" && <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary"><span className="flex size-6 items-center justify-center rounded-md border border-primary/25 bg-primary/10"><Shield className="size-3.5" aria-hidden="true" /></span>ClaimGuard AI</div>}
            <MessageContent className={message.role === "user" ? "rounded-2xl rounded-br-md bg-primary px-4 py-3 text-primary-foreground" : "w-full"}><MessageResponse>{message.text}</MessageResponse>{message.summary && <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-surface)]"><div className="flex items-center gap-2 border-b border-border px-4 py-3"><ShieldCheck className="size-4 text-primary" aria-hidden="true" /><p className="text-xs font-semibold">Claim Summary</p></div><dl className="grid grid-cols-1 sm:grid-cols-2">{message.summary.map((field) => <div key={field.label} className="border-b border-border px-4 py-3 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-child(odd)]:border-r"><dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{field.label}</dt><dd className="mt-1 font-mono text-xs text-foreground">{field.value}</dd></div>)}</dl></div>}</MessageContent>
          </Message>)}
          {isTyping && <Message from="assistant"><div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary"><Shield className="size-4" />ClaimGuard AI</div><MessageContent className="flex-row items-center gap-3"><span className="flex gap-1" aria-hidden="true">{[0, 1, 2].map((i) => <span key={i} className="size-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: `${i * 120}ms` }} />)}</span><Shimmer className="text-xs">Analyzing claim details...</Shimmer></MessageContent></Message>}
        </ConversationContent><ConversationScrollButton /></Conversation>
        <div className="border-t border-border bg-background p-4 sm:px-6"><PromptInput onSubmit={handleSubmit} className="mx-auto max-w-3xl border-border bg-card shadow-[var(--shadow-surface)]"><PromptInputTextarea ref={textareaRef} maxLength={1200} rows={1} className="max-h-24 min-h-14 px-4 text-sm" placeholder="Describe your incident or ask about your claim..." /><PromptInputFooter className="justify-between px-3 pb-3"><span className="text-[10px] text-muted-foreground">Enter to send · Shift + Enter for new line</span><PromptInputSubmit disabled={isTyping} status={isTyping ? "submitted" : "ready"} className="rounded-md" /></PromptInputFooter></PromptInput></div>
      </section>
      <aside className="bg-card/35 px-5 py-6 sm:px-7 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto" aria-label="Agent Pipeline">
        <div className="mb-7 flex items-center justify-between"><div><h2 className="text-sm font-semibold">Agent Pipeline</h2><p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Live execution trace</p></div><Clock3 className="size-4 text-muted-foreground" aria-hidden="true" /></div>
        <ol className="relative space-y-3 before:absolute before:bottom-8 before:left-[19px] before:top-8 before:w-px before:bg-border">{pipelineSteps.map((step, index) => { const status = session.pipeline[index]; const active = status === "Active"; const complete = status === "Complete"; const blocked = status === "Blocked"; const Icon = step.icon; return <li key={step.name} className={cn("relative rounded-xl border bg-card p-4 transition-shadow", active && "border-primary/50 shadow-[var(--shadow-primary)]", complete && "border-success/30", blocked && "border-destructive/40")}><div className="flex items-start gap-3"><span className={cn("relative z-10 flex size-10 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground", active && "border-primary/40 bg-primary/10 text-primary", complete && "border-success/30 bg-success/10 text-success", blocked && "border-destructive/40 bg-destructive/10 text-destructive")}><Icon className="size-4" aria-hidden="true" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-semibold">{step.name}</p><Badge variant={blocked ? "destructive" : complete ? "success" : active ? "default" : "outline"} className="px-2 py-0 font-mono text-[9px] uppercase">{status}</Badge></div><p className="mt-2 text-xs leading-5 text-muted-foreground">{step.messages[status]}</p><div className="mt-2 flex items-center gap-1.5 font-mono text-[9px] text-muted-foreground/70">{complete && <Check className="size-3 text-success" />}{timestamps[index]}</div></div></div></li>; })}</ol>
        <div className="mt-6 rounded-lg border border-border bg-background/50 px-4 py-3"><p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Execution ID</p><p className="mt-1 font-mono text-[11px] text-foreground">exec_{session.id.replace("clm-", "")}_nova</p></div>
      </aside>
    </div>
  );
}