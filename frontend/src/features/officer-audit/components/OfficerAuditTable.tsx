import Link from "next/link";
import { OfficerAuditActionBadge } from "@/features/officer-audit/components/OfficerAuditActionBadge";
import type { AuditLogItem } from "@/features/officer-audit/types/officerAudit.types";
import { formatVietnamDateTime } from "@/utils/dateTime";

type OfficerAuditTableProps = {
  logs: AuditLogItem[];
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function formatDateTime(value: string) {
  return formatVietnamDateTime(value);
}

function getVisiblePages(page: number, totalPages: number) {
  const pages = new Set([0, page - 1, page, page + 1, totalPages - 1]);

  return Array.from(pages)
    .filter((item) => item >= 0 && item < totalPages)
    .sort((a, b) => a - b);
}

export function OfficerAuditTable({
  logs,
  page,
  pageSize,
  totalElements,
  totalPages,
  onPageChange,
}: OfficerAuditTableProps) {
  const visiblePages = getVisiblePages(page, totalPages);
  const start = totalElements === 0 ? 0 : page * pageSize + 1;
  const end = totalElements === 0 ? 0 : Math.min(start + logs.length - 1, totalElements);

  return (
    <section className="overflow-hidden rounded-xl border border-(--border) bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-262.5 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-4">Thời gian</th>
              <th className="px-6 py-4">Tài khoản</th>
              <th className="px-6 py-4">Hành động</th>
              <th className="px-6 py-4">Đối tượng / Ghi chú</th>
              <th className="px-6 py-4">IP Address</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-(--border)">
            {logs.map((item) => (
              <tr key={item.id} className="hover:bg-red-50/40">
                <td className="px-6 py-5 align-top font-medium text-slate-700">
                  {formatDateTime(item.occurredAt)}
                </td>

                <td className="px-6 py-5 align-top">
                  <div className="flex items-center gap-3">
                    <span
                      className={[
                        "flex size-9 items-center justify-center rounded-full text-xs font-bold",
                        item.actionType === "REPORTER_IDENTITY_DECRYPTED"
                          ? "bg-red-50 text-(--primary)"
                          : "bg-slate-950 text-white",
                      ].join(" ")}
                    >
                      {item.accountCode}
                    </span>

                    <span
                      className={[
                        "font-bold",
                        item.actionType === "REPORTER_IDENTITY_DECRYPTED"
                          ? "text-(--primary)"
                          : "text-slate-900",
                      ].join(" ")}
                    >
                      {item.accountName}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-5 align-top">
                  <OfficerAuditActionBadge actionType={item.actionType} />
                </td>

                <td className="px-6 py-5 align-top">
                  {item.targetCode ? (
                    <div>
                      <Link
                        href={`/officer/cases/${encodeURIComponent(
                          String(item.resourceId),
                        )}`}
                        className="font-bold text-slate-900 hover:text-(--primary)"
                      >
                        {item.targetCode}
                      </Link>

                      <p className="mt-1 text-slate-600">{item.note}</p>
                    </div>
                  ) : (
                    <div>
                      <span className="font-semibold text-slate-800">
                        {item.resourceType} #{item.resourceId}
                      </span>
                      <p className="mt-1 text-slate-600">{item.note}</p>
                    </div>
                  )}
                </td>

                <td className="px-6 py-5 align-top font-mono text-slate-600">
                  {item.ipAddress || "Không ghi nhận"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="flex flex-col gap-4 border-t border-(--border) bg-slate-50 px-6 py-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <p>
          Hiển thị {start}-{end} của {totalElements} bản ghi
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 0}
            onClick={() => onPageChange(page - 1)}
            className="rounded-md px-3 py-2 text-slate-600 disabled:text-slate-400"
          >
            ‹
          </button>

          {visiblePages.map((item, index) => {
            const previous = visiblePages[index - 1];
            const hasGap = previous !== undefined && item - previous > 1;

            return (
              <span key={item} className="flex items-center gap-2">
                {hasGap ? <span className="px-2 text-slate-400">...</span> : null}
                <button
                  type="button"
                  onClick={() => onPageChange(item)}
                  className={[
                    "rounded-md px-3 py-2 font-bold",
                    item === page
                      ? "bg-slate-950 text-white"
                      : "text-slate-600 hover:bg-white",
                  ].join(" ")}
                >
                  {item + 1}
                </button>
              </span>
            );
          })}

          <button
            type="button"
            disabled={page >= totalPages - 1}
            onClick={() => onPageChange(page + 1)}
            className="rounded-md px-3 py-2 text-slate-600 disabled:text-slate-400"
          >
            ›
          </button>
        </div>
      </footer>
    </section>
  );
}
