import { createFileRoute } from "@tanstack/react-router";
import { BookOpenText } from "lucide-react";

export const Route = createFileRoute("/policy-reference")({
  head: () => ({ meta: [{ title: "Policy Reference | ClaimGuard" }, { name: "description", content: "Access the policy reference workspace for NovaCover claim analysis." }] }),
  component: PolicyReference,
});

function PolicyReference() {
  return (
    <div className="flex flex-1 items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <BookOpenText className="mx-auto size-6 text-primary" aria-hidden="true" />
        <h1 className="mt-4 text-xl font-semibold text-foreground">Policy Reference</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Coverage language and policy references will be available here.</p>
      </div>
    </div>
  );
}