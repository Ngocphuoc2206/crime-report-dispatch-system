"use client";

import { useEffect, useState } from "react";
import { notificationSettingsStorage } from "@/features/support/services/notificationSettingsStorage";
import type { NotificationSettings } from "@/features/support/types/support.types";

type NotificationSettingsPanelProps = {
  onSaved: () => void;
};

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        "relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700",
        checked ? "bg-green-600" : "bg-slate-200",
      ].join(" ")}
    >
      <span
        className={[
          "absolute left-0 top-1 size-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  );
}

export function NotificationSettingsPanel({
  onSaved,
}: NotificationSettingsPanelProps) {
  const [settings, setSettings] = useState<NotificationSettings>({
    smsEnabled: true,
    emailEnabled: true,
    browserEnabled: false,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(notificationSettingsStorage.get());
  }, []);

  function updateSetting<K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K],
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleSave() {
    notificationSettingsStorage.save(settings);
    onSaved();
  }

  return (
    <article className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-sm">
      <header className="border-b border-(--border) bg-slate-50 px-6 py-5">
        <h2 className="text-lg font-bold text-slate-900">
          Thiết lập thông báo
        </h2>
      </header>

      <div className="space-y-6 p-6">
        <p className="text-sm italic leading-6 text-slate-600">
          Nhận thông báo tự động khi có thay đổi trạng thái hồ sơ của bạn.
        </p>

        <div className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-slate-900">Tin nhắn SMS</p>
              <p className="mt-1 text-sm text-slate-500">Gửi tới: 098****456</p>
            </div>

            <ToggleSwitch
              checked={settings.smsEnabled}
              onChange={(checked) => updateSetting("smsEnabled", checked)}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-slate-900">Email cá nhân</p>
              <p className="mt-1 text-sm text-slate-500">nguyen***@gmail.com</p>
            </div>

            <ToggleSwitch
              checked={settings.emailEnabled}
              onChange={(checked) => updateSetting("emailEnabled", checked)}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-slate-900">Thông báo trình duyệt</p>
              <p className="mt-1 text-sm text-slate-500">
                Hiển thị trực tiếp trên máy tính
              </p>
            </div>

            <ToggleSwitch
              checked={settings.browserEnabled}
              onChange={(checked) => updateSetting("browserEnabled", checked)}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-md bg-sky-700 px-6 py-4 font-bold text-white transition hover:bg-sky-800"
        >
          Lưu thiết lập
        </button>
      </div>
    </article>
  );
}
