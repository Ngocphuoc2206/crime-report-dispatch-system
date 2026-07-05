import type { NotificationSettings } from "@/features/support/types/support.types";

const NOTIFICATION_SETTINGS_KEY = "notificationSettings";

const defaultSettings: NotificationSettings = {
  smsEnabled: true,
  emailEnabled: true,
  browserEnabled: false,
};

export const notificationSettingsStorage = {
  get: (): NotificationSettings => {
    if (typeof window === "undefined") return defaultSettings;

    const rawValue = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);

    if (!rawValue) return defaultSettings;

    try {
      return JSON.parse(rawValue) as NotificationSettings;
    } catch {
      return defaultSettings;
    }
  },

  save: (settings: NotificationSettings) => {
    if (typeof window === "undefined") return;

    localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
  },
};
