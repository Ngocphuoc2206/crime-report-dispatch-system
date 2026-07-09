"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  allowedEvidenceMimeTypes,
  formatFileSize,
  getMaxFileSizeByKind,
  MAX_EVIDENCE_FILES,
  MAX_EVIDENCE_TOTAL_SIZE,
} from "@/features/report-submission/data/evidenceUpload.config";
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
      report.status === "RESOLVED" || index < currentIndex
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string>();
  const [uploadMessage, setUploadMessage] = useState<string>();
  const [isUploading, setIsUploading] = useState(false);
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
    const refreshInterval = window.setInterval(() => {
      void loadStatus();
    }, 30_000);

    return () => {
      isActive = false;
      window.clearInterval(refreshInterval);
    };
  }, [trackingCode]);

  function validateFiles(files: File[]) {
    if (files.length > MAX_EVIDENCE_FILES) {
      return `Chỉ được gửi tối đa ${MAX_EVIDENCE_FILES} tệp.`;
    }

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_EVIDENCE_TOTAL_SIZE) {
      return "Tổng dung lượng minh chứng vượt quá giới hạn 190MB.";
    }

    for (const file of files) {
      const kind = allowedEvidenceMimeTypes[file.type];
      if (!kind) {
        return `Tệp ${file.name} không đúng định dạng ảnh, video hoặc âm thanh.`;
      }

      if (file.size > getMaxFileSizeByKind(kind)) {
        return `Tệp ${file.name} vượt quá dung lượng cho phép.`;
      }
    }

    return null;
  }

  function handleSelectFiles(files: FileList | null) {
    if (!files) return;

    const nextFiles = Array.from(files);
    const validationError = validateFiles(nextFiles);

    setUploadError(validationError ?? undefined);
    setUploadMessage(undefined);
    setSelectedFiles(validationError ? [] : nextFiles);
  }

  async function handleUploadSupplementalEvidence() {
    if (selectedFiles.length === 0) {
      setUploadError("Vui lòng chọn ít nhất một tệp minh chứng.");
      return;
    }

    const validationError = validateFiles(selectedFiles);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setIsUploading(true);
    setUploadError(undefined);
    setUploadMessage(undefined);

    try {
      await trackingService.uploadSupplementalEvidence(trackingCode, selectedFiles);
      const report = await trackingService.getStatus(trackingCode);
      setDetail(toTrackingDetail(report));
      setSelectedFiles([]);
      setUploadMessage("Đã gửi minh chứng bổ sung. Cơ quan xử lý sẽ kiểm tra lại.");
    } catch (uploadFailure) {
      setUploadError(
        uploadFailure instanceof Error
          ? uploadFailure.message
          : "Không gửi được minh chứng bổ sung.",
      );
    } finally {
      setIsUploading(false);
    }
  }

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
            <h1 className="page-title">
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
            {detail.needsAdditionalEvidence ? (
              <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                <h2 className="text-lg font-bold text-amber-950">
                  Cần bổ sung minh chứng
                </h2>
                <p className="mt-2 text-sm leading-6 text-amber-900">
                  Cơ quan xử lý cần thêm tài liệu để tiếp tục xác minh tin báo.
                  Vui lòng đọc ghi chú và gửi bổ sung ảnh, video hoặc âm thanh phù hợp.
                </p>

                <div className="mt-4 space-y-3">
                  {(detail.evidenceRequests ?? []).map((request) => (
                    <div
                      key={request.id}
                      className="rounded-lg border border-amber-200 bg-white p-4 text-sm text-slate-700"
                    >
                      <p className="font-bold text-slate-900">
                        {request.originalFilename}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Yêu cầu lúc: {request.verifiedAt ?? request.uploadedAt}
                      </p>
                      <p className="mt-3 leading-6">
                        {request.verificationNote ||
                          "Vui lòng bổ sung minh chứng rõ ràng hơn cho nội dung đã báo."}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-lg border border-dashed border-amber-300 bg-white p-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,audio/*"
                    onChange={(event) => handleSelectFiles(event.target.files)}
                    className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-[var(--primary)] file:px-4 file:py-2 file:font-bold file:text-white"
                  />

                  {selectedFiles.length > 0 ? (
                    <div className="mt-4 space-y-2">
                      {selectedFiles.map((file) => (
                        <div
                          key={`${file.name}-${file.size}`}
                          className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2 text-sm"
                        >
                          <span className="truncate font-semibold text-slate-700">
                            {file.name}
                          </span>
                          <span className="shrink-0 text-xs text-slate-500">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {uploadError ? (
                    <p className="mt-3 text-sm font-semibold text-[var(--primary)]">
                      {uploadError}
                    </p>
                  ) : null}

                  {uploadMessage ? (
                    <p className="mt-3 text-sm font-semibold text-green-700">
                      {uploadMessage}
                    </p>
                  ) : null}

                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => void handleUploadSupplementalEvidence()}
                    className="mt-4 w-full rounded-md bg-[var(--primary)] px-5 py-3 font-bold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {isUploading ? "Đang gửi..." : "Gửi minh chứng bổ sung"}
                  </button>
                </div>
              </section>
            ) : null}
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
