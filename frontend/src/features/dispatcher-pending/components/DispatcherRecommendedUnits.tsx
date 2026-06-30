"use client";

import { useState } from "react";
import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";

export function DispatcherRecommendedUnits({ caseCode }: { caseCode: string }) {
  const [toast, setToast] = useState<string | null>(null);
  const [dispatching, setDispatching] = useState(false);

  async function handleSmartDispatch() {
    setDispatching(true);

    try {
      await apiClient.post(
        endpoints.dispatchCaseDispatch(caseCode),
        {
          smartDispatch: true,
          note: "Requested from dispatcher smart dispatch panel",
        },
        { auth: true },
      );

      setToast(`Da gui lenh dieu phoi thong minh cho ho so ${caseCode}`);
    } catch (error) {
      setToast(
        error instanceof Error
          ? error.message
          : `Khong the dieu phoi ho so ${caseCode}`,
      );
    } finally {
      setDispatching(false);
    }

    window.setTimeout(() => {
      setToast(null);
    }, 2400);
  }

  return (
    <aside className="relative rounded-xl border border-red-200 bg-red-50/60 p-5 shadow-sm">
      {toast ? (
        <div className="fixed bottom-8 right-8 z-50 rounded-xl bg-white px-6 py-4 font-black text-slate-900 shadow-2xl ring-1 ring-red-100">
          {toast}
        </div>
      ) : null}

      <h2 className="text-2xl font-black text-red-950">Điều phối</h2>

      <div className="mt-5 rounded-xl border border-red-200 bg-white p-5 shadow-sm">
        <p className="text-sm leading-6 text-slate-600">
          Chưa có API trả danh sách đơn vị đề xuất riêng. Thao tác bên dưới sẽ
          gọi dispatch-service để backend tự tính đơn vị/cán bộ phù hợp.
        </p>

        <button
          type="button"
          disabled={dispatching}
          onClick={() => void handleSmartDispatch()}
          className="mt-5 w-full rounded-lg bg-(--primary) px-5 py-3 font-black text-white hover:bg-(--primary-hover) disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {dispatching ? "Đang điều phối..." : "Điều phối thông minh"}
        </button>
      </div>
    </aside>
  );
}
