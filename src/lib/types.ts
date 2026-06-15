export type MessageRole = "user" | "assistant" | "system";

export type ClaimMessage = {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  citations?: string[];
};

export type ClaimSession = {
  id: string;
  claimNumber: string;
  title: string;
  status: "active" | "review" | "closed";
  messages: ClaimMessage[];
  createdAt: string;
  updatedAt: string;
};

export type FirewallDecision = {
  id: string;
  sessionId: string;
  outcome: "allow" | "review" | "block";
  reason: string;
  riskScore: number;
  ruleIds: string[];
  createdAt: string;
};

export type AgentStep = {
  id: string;
  sessionId: string;
  label: string;
  status: "pending" | "running" | "complete" | "failed";
  detail?: string;
  startedAt?: string;
  completedAt?: string;
};