"use client";

import { useMemo, useState } from "react";
import { NotificationCard } from "@/features/support/components/NotificationCard";
import { NotificationSettingsPanel } from "@/features/support/components/NotificationSettingsPanel";
import { SupportHelpPanel } from "@/features/support/components/SupportHelpPanel";
import { SupportSecurityNotice } from "@/features/support/components/SupportSecurityNotice";
import type { SupportNotification } from "@/features/support/types/support.types";

const supportNotifications: SupportNotification[] = [];

export function SupportPageContent() {
  const [showToast, setShowToast] = useState(false);

  const newNotificationCount = useMemo(() => {
    return supportNotifications.filter(
      (notification) =>
        notification.tone === "urgent" || notification.tone === "info",
    ).length;
  }, []);

  function handleSettingsSaved() {
    setShowToast(true);

    window.setTimeout(() => {
      setShowToast(false);
    }, 2200);
  }

  return (
    <div className="bg-(--background)">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="page-title">
              Trung tâm Thông báo
            </h1>

            <p className="mt-3 text-base leading-7 text-slate-600">
              Cập nhật trạng thái mới nhất về các hồ sơ tố giác của bạn.
            </p>
          </div>

          <span className="inline-flex w-fit rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">
            {newNotificationCount} mới
          </span>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-5">
            {supportNotifications.length === 0 ? (
              <div className="rounded-xl border border-(--border) bg-white p-8 text-sm font-semibold text-slate-600">
                Hiện chưa có thông báo nào.
              </div>
            ) : null}

            {supportNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>

          <aside className="space-y-6">
            <NotificationSettingsPanel onSaved={handleSettingsSaved} />
            <SupportSecurityNotice />
            <SupportHelpPanel />
          </aside>
        </section>
      </div>

      {showToast ? (
        <div className="fixed bottom-8 right-8 z-50 rounded-xl bg-slate-900 px-6 py-4 text-sm font-bold text-white shadow-xl">
          Cập nhật thiết lập thành công
        </div>
      ) : null}
    </div>
  );
}
