/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SpamWarningBadge } from "@/components/ui/SpamWarningBadge";
import {
  OfficerCasePriorityBadge,
  OfficerCaseStatusBadge,
} from "@/features/officer-cases/components/OfficerCaseBadge";
import { OfficerCaseTimeline } from "@/features/officer-cases/components/OfficerCaseTimeline";
import { officerCaseService } from "@/features/officer-cases/services/officerCaseService";
import type {
  OfficerCase,
  OfficerCaseEvidenceVerificationStatus,
  OfficerCaseStatus,
} from "@/features/officer-cases/types/officerCase.types";
import { endpoints } from "@/services/endpoints";
import { openEvidenceFile } from "@/utils/evidenceDownload";
import { getBackendDateTimeMs } from "@/utils/dateTime";

type OfficerCaseDetailContentProps = {
  caseCode: string;
  backHref?: string;
  backLabel?: string;
};

function getLockRemainingMs(expiresAt?: string | null, nowMs = Date.now()) {
  if (!expiresAt) return 0;

  const expiresAtMs = getBackendDateTimeMs(expiresAt);
  if (Number.isNaN(expiresAtMs)) return 0;

  return Math.max(0, expiresAtMs - nowMs);
}

function formatLockTime(expiresAt?: string | null, nowMs = Date.now()) {
  const diff = getLockRemainingMs(expiresAt, nowMs);
  const minutes = Math.floor(diff / 1000 / 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getStatusNote(status: OfficerCaseStatus) {
  const notes: Record<OfficerCaseStatus, string> = {
    NEW_RECEIVED: "Hồ sơ mới được tiếp nhận.",
    UNDER_VERIFICATION: "Cán bộ đang xác minh thông tin.",
    TRANSFERRED_TO_INVESTIGATION: "Chuyển hồ sơ sang cơ quan điều tra.",
    RESOLVED: "Đã xác minh và xử lý xong tin báo.",
    SPAM_OR_FAKE: "Hồ sơ được đánh dấu không hợp lệ.",
  };

  return notes[status];
}

const evidenceVerificationLabels: Record<
  OfficerCaseEvidenceVerificationStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Chưa xem",
    className: "border-slate-200 bg-slate-100 text-slate-700",
  },
  VERIFIED: {
    label: "Hợp lệ",
    className: "border-green-200 bg-green-50 text-green-700",
  },
  REJECTED: {
    label: "Không hợp lệ",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  NEEDS_MORE_INFO: {
    label: "Cần bổ sung",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
};

export function OfficerCaseDetailContent({
  caseCode,
  backHref = "/officer/cases",
  backLabel = "Quay lại danh sách",
}: OfficerCaseDetailContentProps) {
  const [caseDetail, setCaseDetail] = useState<OfficerCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const loadCaseDetail = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await officerCaseService.getCaseDetail(caseCode);
      setCaseDetail(response);
    } catch (error) {
      setCaseDetail(null);
      setErrorMessage(
        error instanceof Error ? error.message : "Không thể tải hồ sơ.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [caseCode]);

  useEffect(() => {
    void loadCaseDetail();
  }, [loadCaseDetail]);

  useEffect(() => {
    const timerId = window.setInterval(() => setNowMs(Date.now()), 1000);

    return () => window.clearInterval(timerId);
  }, []);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  }

  async function runAction(action: () => Promise<unknown>, success: string) {
    setIsMutating(true);
    setErrorMessage(null);

    try {
      await action();
      await loadCaseDetail();
      showToast(success);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Thao tác không thành công.",
      );
    } finally {
      setIsMutating(false);
    }
  }

  function updateEvidenceVerification(
    evidenceId: number,
    status: OfficerCaseEvidenceVerificationStatus,
  ) {
    const note = window.prompt("Ghi chú xác minh minh chứng", "");

    void runAction(
      () => officerCaseService.updateEvidenceVerification(evidenceId, status, note),
      "Đã cập nhật trạng thái minh chứng",
    );
  }

  function requestAdditionalEvidence() {
    if (!caseDetail) return;

    const note = window.prompt(
      "Nội dung yêu cầu người dân bổ sung minh chứng",
      "Vui lòng bổ sung ảnh, video hoặc âm thanh liên quan để cơ quan xử lý có thêm căn cứ xác minh.",
    );

    if (note === null) return;

    void runAction(
      () => officerCaseService.requestAdditionalEvidence(caseDetail.id, note),
      "Đã gửi yêu cầu bổ sung minh chứng",
    );
  }

  if (isLoading) {
    return (
      <div className="px-6 py-8">
        <section className="rounded-xl border border-(--border) bg-white p-8 text-center font-semibold text-slate-600 shadow-sm">
          Đang tải chi tiết hồ sơ...
        </section>
      </div>
    );
  }

  if (!caseDetail) {
    return (
      <div className="px-6 py-8">
        <section className="rounded-xl border border-yellow-200 bg-yellow-50 p-8">
          <h1 className="text-xl font-bold text-yellow-900">
            Không tìm thấy hồ sơ
          </h1>
          {errorMessage ? (
            <p className="mt-3 text-sm text-yellow-800">{errorMessage}</p>
          ) : null}
          <Link
            href={backHref}
            className="mt-5 inline-flex rounded-md bg-(--primary) px-5 py-3 font-bold text-white"
          >
            {backLabel}
          </Link>
        </section>
      </div>
    );
  }

  const lockRemainingMs = getLockRemainingMs(caseDetail.lock?.expiresAt, nowMs);
  const activeLock =
    caseDetail.status === "UNDER_VERIFICATION" &&
    caseDetail.lock?.active &&
    lockRemainingMs > 0
      ? caseDetail.lock
      : null;
  const isLockedByMe = Boolean(activeLock?.lockedByMe);
  const isLockedByOther = Boolean(activeLock && !activeLock.lockedByMe);
  const canOperate = isLockedByMe && caseDetail.status === "UNDER_VERIFICATION";
  const canAccept = !activeLock && caseDetail.status === "NEW_RECEIVED";
  const canAcquireLock = !activeLock && caseDetail.status === "UNDER_VERIFICATION";
  const canVerifyEvidence =
    caseDetail.status !== "RESOLVED" && caseDetail.status !== "SPAM_OR_FAKE";

  return (
    <div className="px-6 py-8">
      {toast ? (
        <div className="fixed bottom-8 right-8 z-50 rounded-xl bg-slate-900 px-6 py-4 text-sm font-bold text-white shadow-xl">
          {toast}
        </div>
      ) : null}

      {errorMessage ? (
        <section className="mb-6 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm font-semibold text-(--primary)">
          {errorMessage}
        </section>
      ) : null}

      {isLockedByMe ? (
        <section className="mb-6 rounded-xl bg-(--primary) px-6 py-5 text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Bạn đang giữ quyền xử lý hồ sơ này
              </h2>
              <p className="mt-1 text-sm text-white/85">
                Hệ thống sẽ tự động giải phóng khóa sau{" "}
                {formatLockTime(activeLock?.expiresAt, nowMs)}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={isMutating}
                onClick={() =>
                  void runAction(
                    () => officerCaseService.renewLock(caseDetail.id),
                    "Đã gia hạn khóa hồ sơ",
                  )
                }
                className="rounded-md border border-white/40 px-5 py-3 text-sm font-bold hover:bg-white/10 disabled:opacity-60"
              >
                Gia hạn
              </button>

              <button
                type="button"
                disabled={isMutating}
                onClick={() =>
                  void runAction(
                    () => officerCaseService.releaseLock(caseDetail.id),
                    "Đã giải phóng khóa hồ sơ",
                  )
                }
                className="rounded-md bg-white px-5 py-3 text-sm font-bold text-(--primary) disabled:opacity-60"
              >
                Giải phóng khóa
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {isLockedByOther ? (
        <section className="mb-6 rounded-xl border border-yellow-300 bg-yellow-50 px-6 py-5 text-yellow-900">
          <h2 className="font-bold">Hồ sơ đang bị khóa</h2>
          <p className="mt-1 text-sm leading-6">
            Hồ sơ đang được xử lý bởi user #{activeLock?.lockedByUserId}. Bạn
            đang xem ở chế độ chỉ đọc.
          </p>
        </section>
      ) : null}

      <section className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <Link
            href={backHref}
            className="text-sm font-semibold text-slate-600 hover:text-(--primary)"
          >
            ← {backLabel}
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <OfficerCaseStatusBadge status={caseDetail.status} />
            <OfficerCasePriorityBadge priority={caseDetail.priority} />
            <SpamWarningBadge
              level={caseDetail.spamLevel}
              score={caseDetail.spamScore}
              reasons={caseDetail.spamReasons}
            />
            <span className="font-mono text-sm text-slate-500">
              {caseDetail.code}
            </span>
          </div>

          <h1 className="mt-4 max-w-4xl text-3xl font-bold text-slate-950">
            {caseDetail.title}
          </h1>
        </div>

        {canAccept ? (
          <button
            type="button"
            disabled={isMutating}
            onClick={() =>
              void runAction(
                () => officerCaseService.acceptCase(caseDetail.id),
                "Đã nhận xử lý hồ sơ",
              )
            }
            className="rounded-md bg-green-600 px-6 py-4 font-bold text-white hover:bg-green-700 disabled:opacity-60"
          >
            Nhận xử lý
          </button>
        ) : null}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm">
            <h2 className="section-title">
              Thông tin người trình báo
            </h2>

            <div className="mt-5 rounded-xl bg-slate-100 p-6">
              <p className="text-2xl font-bold tracking-wide text-slate-700">
                {caseDetail.reporterMode === "anonymous"
                  ? "ẨN DANH"
                  : "ĐÃ ĐỊNH DANH"}
              </p>
              {caseDetail.reporterMode === "identified" && caseDetail.reporter ? (
                <dl className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <dt className="text-sm font-bold uppercase text-slate-500">
                      Họ tên
                    </dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      {caseDetail.reporter.fullName || "Chưa cập nhật"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-bold uppercase text-slate-500">
                      CCCD / Định danh
                    </dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      {caseDetail.reporter.citizenId || "Chưa cập nhật"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-bold uppercase text-slate-500">
                      Số điện thoại
                    </dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      {caseDetail.reporter.phone || "Chưa cập nhật"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-bold uppercase text-slate-500">
                      Email
                    </dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      {caseDetail.reporter.email || "Chưa cập nhật"}
                    </dd>
                  </div>
                  <div className="md:col-span-2">
                    <dt className="text-sm font-bold uppercase text-slate-500">
                      Địa chỉ liên hệ
                    </dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      {caseDetail.reporter.address || "Chưa cập nhật"}
                    </dd>
                  </div>
                </dl>
              ) : caseDetail.anonymousTemporaryId ? (
                <p className="mt-4 text-sm font-bold text-slate-900">
                  Mã tham chiếu: {caseDetail.anonymousTemporaryId}
                </p>
              ) : null}
            </div>
          </article>

          <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm">
            <h2 className="section-title">
              Nội dung trình báo
            </h2>

            {caseDetail.spamLevel && caseDetail.spamLevel !== "NONE" ? (
              <div className="mt-5 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-900">
                <p className="font-bold">Cảnh báo nghi spam</p>
                <p className="mt-1">
                  Điểm: {caseDetail.spamScore ?? 0}
                  {caseDetail.spamReasons ? ` - ${caseDetail.spamReasons}` : ""}
                </p>
              </div>
            ) : null}

            <div className="mt-5 rounded-lg bg-slate-50 p-5 text-sm leading-7 text-slate-700">
              {caseDetail.incident.description}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-(--border) p-4">
                <p className="text-sm font-bold uppercase text-slate-500">
                  Thời gian
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {caseDetail.incident.timeText}
                </p>
              </div>

              <div className="rounded-lg border border-(--border) p-4">
                <p className="text-sm font-bold uppercase text-slate-500">
                  Địa điểm
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {caseDetail.incident.address}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm">
            <h2 className="section-title">
              Tài liệu & Chứng cứ đính kèm
            </h2>

            {caseDetail.evidence.length === 0 ? (
              <>
              <p className="mt-5 rounded-lg bg-slate-50 p-5 text-sm text-slate-600">
                Chưa có chứng cứ đính kèm.
              </p>
                <div className="mt-3 rounded-lg border border-dashed border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm leading-6 text-amber-900">
                    Nếu cần thêm căn cứ xác minh, cán bộ có thể gửi yêu cầu để người dân
                    bổ sung ảnh, video hoặc âm thanh qua trang tra cứu hồ sơ.
                  </p>
                  {canOperate && canVerifyEvidence ? (
                    <button
                      type="button"
                      disabled={isMutating}
                      onClick={requestAdditionalEvidence}
                      className="mt-3 rounded-md bg-amber-600 px-4 py-2 text-sm font-bold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Yêu cầu bổ sung minh chứng
                    </button>
                  ) : (
                    <p className="mt-3 text-xs font-semibold text-amber-800">
                      Cần nhận quyền xử lý hồ sơ trước khi gửi yêu cầu bổ sung.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {caseDetail.evidence.map((file) => (
                  <div
                    key={file.id}
                    className="rounded-lg border border-(--border) bg-slate-50 p-4"
                  >
                    <p className="font-semibold text-slate-900">{file.name}</p>
                    <p className="mt-2 text-sm text-slate-500">
                      {file.size} • {file.type.toUpperCase()}
                    </p>
                    <span
                      className={[
                        "mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-bold",
                        evidenceVerificationLabels[file.verificationStatus].className,
                      ].join(" ")}
                    >
                      {evidenceVerificationLabels[file.verificationStatus].label}
                    </span>
                    {file.verificationNote ? (
                      <p className="mt-2 text-xs text-slate-500">
                        Ghi chú: {file.verificationNote}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      onClick={() =>
                        void openEvidenceFile(
                          endpoints.officerEvidenceDownload(file.id),
                          file.name,
                        )
                      }
                      className="mt-4 rounded-md border border-red-200 px-3 py-2 text-sm font-bold text-[var(--primary)] hover:bg-red-50"
                    >
                      Xem / tải
                    </button>
                    {canVerifyEvidence ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={isMutating}
                        onClick={() =>
                          updateEvidenceVerification(file.id, "VERIFIED")
                        }
                        className="rounded-md border border-green-200 px-3 py-2 text-xs font-bold text-green-700 hover:bg-green-50 disabled:opacity-60"
                      >
                        Hợp lệ
                      </button>
                      <button
                        type="button"
                        disabled={isMutating}
                        onClick={() =>
                          updateEvidenceVerification(file.id, "REJECTED")
                        }
                        className="rounded-md border border-red-200 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50 disabled:opacity-60"
                      >
                        Không hợp lệ
                      </button>
                      <button
                        type="button"
                        disabled={isMutating}
                        onClick={() =>
                          updateEvidenceVerification(file.id, "NEEDS_MORE_INFO")
                        }
                        className="rounded-md border border-amber-200 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50 disabled:opacity-60"
                      >
                        Cần bổ sung
                      </button>
                    </div>
                    ) : (
                      <p className="mt-3 rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">
                        Hồ sơ đã kết thúc, minh chứng chỉ còn để xem lại.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>

        <aside className="space-y-6">
          <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm">
            <h2 className="section-title">
              Thao tác nghiệp vụ
            </h2>

            <div className="mt-5 space-y-3">
              {canAcquireLock ? (
                <button
                  type="button"
                  onClick={() =>
                    void runAction(
                      () => officerCaseService.acquireLock(caseDetail.id),
                      "Đã nhận quyền xử lý hồ sơ",
                    )
                  }
                  disabled={isMutating}
                  className="w-full rounded-md bg-(--primary) px-5 py-3 font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Nhận quyền xử lý
                </button>
              ) : null}

              <button
                type="button"
                onClick={() =>
                  void runAction(
                    () =>
                      officerCaseService.updateStatus(
                        caseDetail.id,
                        "TRANSFERRED_TO_INVESTIGATION",
                        getStatusNote("TRANSFERRED_TO_INVESTIGATION"),
                      ),
                    "Đã chuyển hồ sơ sang cơ quan điều tra",
                  )
                }
                disabled={!canOperate || isMutating}
                className="w-full rounded-md bg-slate-900 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Chuyển cơ quan điều tra
              </button>

              <button
                type="button"
                onClick={() =>
                  void runAction(
                    () =>
                      officerCaseService.updateStatus(
                        caseDetail.id,
                        "RESOLVED",
                        getStatusNote("RESOLVED"),
                      ),
                    "Đã cập nhật trạng thái xử lý",
                  )
                }
                disabled={!canOperate || isMutating}
                className="w-full rounded-md bg-green-600 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Đã xử lý xong
              </button>

              <button
                type="button"
                onClick={() =>
                  void runAction(
                    () =>
                      officerCaseService.updateStatus(
                        caseDetail.id,
                        "SPAM_OR_FAKE",
                        getStatusNote("SPAM_OR_FAKE"),
                      ),
                    "Đã đánh dấu hồ sơ giả / Spam",
                  )
                }
                disabled={!canOperate || isMutating}
                className="w-full rounded-md bg-red-50 px-5 py-3 font-bold text-(--primary) disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              >
                Hồ sơ giả / Spam
              </button>
            </div>
          </article>

          <OfficerCaseTimeline items={caseDetail.timeline} />
        </aside>
      </section>
    </div>
  );
}
