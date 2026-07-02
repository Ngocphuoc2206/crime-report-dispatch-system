import { TrackingStatusBadge } from "@/features/tracking/components/TrackingStatusBadge";
import type { TrackingCaseDetail } from "@/features/tracking/types/tracking.types";
import { formatVietnamDateTime } from "@/utils/dateTime";

type TrackingDetailSummaryProps = {
  detail: TrackingCaseDetail;
};

function formatDate(value: string) {
  return formatVietnamDateTime(value);
}

export function TrackingDetailSummary({ detail }: TrackingDetailSummaryProps) {
  return (
    <aside className="space-y-5">
      <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Mã hồ sơ
        </p>

        <h2 className="mt-3 break-all font-mono text-2xl font-bold tracking-wide text-(--primary)">
          {detail.trackingCode}
        </h2>

        <div className="mt-5 border-t border-(--border) pt-5">
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Trạng thái hiện tại
          </p>

          <div className="mt-3">
            <TrackingStatusBadge status={detail.status} />
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {detail.displayStatus}
          </p>
        </div>

        <dl className="mt-6">
          <div>
            <dt className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Thời gian tiếp nhận
            </dt>
            <dd className="mt-1 font-semibold text-slate-900">
              {formatDate(detail.createdAt)}
            </dd>
          </div>
        </dl>
      </article>

      <article className="rounded-xl border border-sky-100 bg-sky-50 p-5">
        <p className="text-sm leading-6 text-slate-700">
          Trang công khai chỉ hiển thị trạng thái rút gọn. Danh tính người báo
          tin, cán bộ xử lý và ghi chú nghiệp vụ luôn được bảo vệ.
        </p>
      </article>
    </aside>
  );
}
