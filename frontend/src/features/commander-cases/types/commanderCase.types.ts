export type CommanderCaseSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type CommanderCaseStatus =
  | "NEW"
  | "PROCESSING"
  | "VERIFYING"
  | "INVESTIGATING"
  | "RESOLVED"
  | "SPAM_OR_FAKE"
  | "CLOSED";

export type CommanderCaseAttachment = {
  id: string;
  name: string;
  type: "image" | "audio" | "video" | "pdf";
  size: string;
};

export type CommanderCaseHistory = {
  id: string;
  time: string;
  title: string;
  description: string;
  actor: string;
  tone: "normal" | "success" | "danger";
};

export type CommanderCase = {
  code: string;
  title: string;
  category: string;
  shortDescription: string;
  location: string;
  severity: CommanderCaseSeverity;
  status: CommanderCaseStatus;
  reporter: {
    mode: "anonymous" | "identified";
    name: string;
    citizenId?: string;
  };
  receivedAt: string;
  confidence: string;
  description: string;
  coordinate: string;
  locationWarning?: string;
  attachments: CommanderCaseAttachment[];
  histories: CommanderCaseHistory[];
};
