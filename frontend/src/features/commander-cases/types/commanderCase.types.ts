export type CommanderCaseSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type CommanderCaseSpamLevel = "NONE" | "LOW" | "MEDIUM" | "HIGH";

export type CommanderCaseStatus =
  | "NEW"
  | "PROCESSING"
  | "VERIFYING"
  | "INVESTIGATING"
  | "RESOLVED"
  | "SPAM_OR_FAKE";

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
  spamScore?: number | null;
  spamLevel?: CommanderCaseSpamLevel | null;
  spamReasons?: string | null;
  description: string;
  coordinate: string;
  latitude?: number | null;
  longitude?: number | null;
  locationWarning?: string;
  attachments: CommanderCaseAttachment[];
  histories: CommanderCaseHistory[];
};
