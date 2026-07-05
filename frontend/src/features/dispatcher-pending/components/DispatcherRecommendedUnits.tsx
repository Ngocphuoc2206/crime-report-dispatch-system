"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/services/apiClient";
import { endpoints } from "@/services/endpoints";

type SmartDispatchResult = {
  taskId: number;
};

export function DispatcherRecommendedUnits({ caseCode }: { caseCode: string }) {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const [dispatching, setDispatching] = useState(false);

  async function handleSmartDispatch() {
    setDispatching(true);

    try {
      const response = await apiClient.post<SmartDispatchResult>(
        endpoints.dispatchCaseDispatch(caseCode),
        {
          smartDispatch: true,
          note: "Requested from dispatcher smart dispatch panel",
        },
        { auth: true },
      );

      setToast(`Đã điều phối thông minh hồ sơ ${caseCode}`);
      router.push(
        `/dispatcher/assigned/${encodeURIComponent(String(response.taskId))}`,
      );
    } catch (error) {
      setToast(
        error instanceof Error
          ? error.message
          : `Không thể điều phối hồ sơ ${caseCode}`,
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
          Hồ sơ đang nằm trong hàng đợi điều phối. Thao tác bên dưới sẽ gọi
          dispatch-service để backend tự chọn đơn vị và cán bộ phù hợp, sau đó
          chuyển sang trang theo dõi nhiệm vụ mới.
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
