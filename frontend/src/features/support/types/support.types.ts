export type SupportNotificationTone = "urgent" | "info" | "success" | "pending";

export type SupportNotification = {
  id: string;
  title: string;
  description: string;
  timeLabel: string;
  tone: SupportNotificationTone;
  statusLabel: string;
  actionLabel?: string;
  actionHref?: string;
};

export type NotificationSettings = {
  smsEnabled: boolean;
  emailEnabled: boolean;
  browserEnabled: boolean;
};
