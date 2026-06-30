"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TrackingDetailSummary } from "@/features/tracking/components/TrackingDetailSummary";
import { TrackingTimeline } from "@/features/tracking/components/TrackingTimeline";
import { trackingService } from "@/features/tracking/services/trackingService";
import type {
  ReportStatusResponse,
  TrackingCaseDetail,
  TrackingStatus,
  TrackingTimelineItem,
} from "@/features/tracking/types/tracking.types";

type TrackingDetailPageContentProps = {
  trackingCode: string;
};

const statusOrder: Exclude<TrackingStatus, "SPAM_OR_FAKE">[] = [
  "NEW_RECEIVED",
  "UNDER_VERIFICATION",
  "TRANSFERRED_TO_INVESTIGATION",
  "RESOLVED",
];

const timelineDefinitions: Record<
  Exclude<TrackingStatus, "SPAM_OR_FAKE">,
  Pick<TrackingTimelineItem, "id" | "title" | "description">
> = {
  NEW_RECEIVED: {
    id: "received",
    title: "Đã tiếp nhận",
    description: "Hệ thống đã ghi nhận tin báo và cấp mã tra cứu.",
  },
  UNDER_VERIFICATION: {
    id: "verifying",
    title: "Đang xác minh",
    description: "Cơ quan chức năng đang kiểm tra và đối chiếu thông tin.",
  },
  TRANSFERRED_TO_INVESTIGATION: {
    id: "transferred",
    title: "Đã chuyển xử lý",
    description: "Tin báo đã được chuyển đến bộ phận có thẩm quyền xử lý.",
  },
  RESOLVED: {
    id: "resolved",
    title: "Đã xử lý",
    description: "Quá trình tiếp nhận và xử lý tin báo đã hoàn tất.",
  },
};

function buildTimeline(report: ReportStatusResponse): TrackingTimelineItem[] {
  if (report.status === "SPAM_OR_FAKE") {
    return [
      {
        ...timelineDefinitions.NEW_RECEIVED,
        occurredAt: report.createdAt,
        state: "completed",
      },
      {
        id: "reviewed",
        title: "Đã kiểm tra",
        description: report.displayStatus,
        state: "current",
      },
    ];
  }

  const currentIndex = statusOrder.indexOf(report.status);

  return statusOrder.map((status, index) => ({
    ...timelineDefinitions[status],
    occurredAt: index === 0 ? report.createdAt : undefined,
    state:
      index < currentIndex
        ? "completed"
        : index === currentIndex
          ? "current"
          : "pending",
  }));
}

function toTrackingDetail(report: ReportStatusResponse): TrackingCaseDetail {
  return {
    ...report,
    timeline: buildTimeline(report),
  };
}

export function TrackingDetailPageContent({
  trackingCode,
}: TrackingDetailPageContentProps) {
  const [detail, setDetail] = useState<TrackingCaseDetail>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadStatus() {
      try {
        const report = await trackingService.getStatus(trackingCode);

        if (isActive) {
          setDetail(toTrackingDetail(report));
          setError(undefined);
        }
      } catch (loadError) {
        if (isActive) {
          setDetail(undefined);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Không thể tra cứu hồ sơ lúc này.",
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadStatus();

    return () => {
      isActive = false;
    };
  }, [trackingCode]);

  async function handleCopy() {
    await navigator.clipboard.writeText(trackingCode);
    setCopied(true);

    window.setTimeout(() => setCopied(false), 1800);
  }

  function handleDownloadReceipt() {
    if (!detail) return;

    const content = [
      "BIÊN NHẬN TRA CỨU TIN BÁO",
      "",
      `Mã hồ sơ: ${detail.trackingCode}`,
      `Trạng thái: ${detail.displayStatus}`,
      `Thời gian tiếp nhận: ${detail.createdAt}`,
      "",
      "Vui lòng bảo mật mã hồ sơ và chỉ sử dụng để tra cứu tiến trình xử lý.",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `bien-nhan-${trackingCode}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (isLoading) {
    return (
      <div className="bg-(--background)">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <section className="rounded-xl border border-(--border) bg-white p-8 text-center shadow-sm">
            <p className="font-semibold text-slate-700">Đang tra cứu hồ sơ...</p>
          </section>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="bg-(--background)">
        <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
          <section className="rounded-xl border border-yellow-200 bg-yellow-50 p-8 text-center">
            <h1 className="text-2xl font-bold text-yellow-900">
              Không thể tra cứu hồ sơ
            </h1>
            <p className="mt-3 text-sm leading-6 text-yellow-800">
              {error ?? "Vui lòng kiểm tra lại mã tra cứu và thử lại."}
            </p>
            <Link
              href="/tracking"
              className="mt-6 inline-flex rounded-md bg-(--primary) px-6 py-3 font-semibold text-white"
            >
              Nhập mã khác
            </Link>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-(--background)">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Tiến độ xử lý tin báo
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Trạng thái mới nhất được cung cấp trực tiếp từ hệ thống tiếp nhận
              tin báo.
            </p>
          </div>
          <div className="inline-flex w-fit rounded-md border border-red-100 bg-red-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-(--primary)">
            Mức độ bảo mật: Cao
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[25rem_1fr]">
          <div className="space-y-5">
            <TrackingDetailSummary detail={detail} />
            <button
              type="button"
              onClick={handleCopy}
              className="w-full rounded-md border border-slate-500 px-6 py-3 font-semibold text-slate-600 transition hover:bg-white"
            >
              {copied ? "Đã sao chép mã hồ sơ" : "Sao chép mã hồ sơ"}
            </button>
          </div>

          <div className="space-y-5">
            <TrackingTimeline items={detail.timeline} />
            <div className="flex flex-col gap-3 rounded-xl border border-(--border) bg-white p-6 shadow-sm sm:flex-row sm:justify-end">
              <Link
                href="/tracking"
                className="rounded-md border border-slate-500 px-6 py-3 text-center font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Tra cứu mã khác
              </Link>
              <button
                type="button"
                onClick={handleDownloadReceipt}
                className="rounded-md bg-sky-700 px-6 py-3 font-semibold text-white transition hover:bg-sky-800"
              >
                Tải biên nhận
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
