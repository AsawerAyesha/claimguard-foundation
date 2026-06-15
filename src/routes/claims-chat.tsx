import { createFileRoute } from "@tanstack/react-router";
import { MessageSquareText } from "lucide-react";

export const Route = createFileRoute("/claims-chat")({
  head: () => ({
    meta: [
      { title: "Claims Chat | ClaimGuard" },
      { name: "description", content: "Chat-first AI workspace for investigating NovaCover insurance claims." },
    ],
  }),
  component: ClaimsChat,
});

function ClaimsChat() {
  return (
    <div className="flex flex-1 items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <MessageSquareText className="mx-auto size-6 text-primary" aria-hidden="true" />
        <h1 className="mt-4 text-xl font-semibold text-foreground">Claims Chat</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">The chat-first claim review workspace will live here.</p>
      </div>
    </div>
  );
}