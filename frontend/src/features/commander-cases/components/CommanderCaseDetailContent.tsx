"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpamWarningBadge } from "@/components/ui/SpamWarningBadge";
import {
  CommanderSeverityBadge,
  CommanderStatusBadge,
} from "@/features/commander-cases/components/CommanderCaseBadges";
import { CommanderStatusUpdateModal } from "@/features/commander-cases/components/CommanderStatusUpdateModal";
import { commanderCaseService } from "@/features/commander-cases/services/commanderCaseService";
import type {
  CommanderCase,
  CommanderCaseEvidenceVerificationStatus,
  CommanderCaseStatus,
} from "@/features/commander-cases/types/commanderCase.types";
import { endpoints } from "@/services/endpoints";
import { formatVietnamDateTime } from "@/utils/dateTime";
import { openEvidenceFile } from "@/utils/evidenceDownload";

type CommanderCaseDetailContentProps = {
  caseCode: string;
};

function formatDateTime(value: string) {
  return formatVietnamDateTime(value);
}

function hasValidCoordinates(caseItem: CommanderCase) {
  return (
    typeof caseItem.latitude === "number" &&
    typeof caseItem.longitude === "number" &&
    Number.isFinite(caseItem.latitude) &&
    Number.isFinite(caseItem.longitude)
  );
}

function getOpenStreetMapEmbedUrl(latitude: number, longitude: number) {
  const delta = 0.006;
  const bbox = [
    longitude - delta,
    latitude - delta,
    longitude + delta,
    latitude + delta,
  ].join(",");

  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox,
  )}&layer=mapnik&marker=${encodeURIComponent(`${latitude},${longitude}`)}`;
}

function getOpenStreetMapUrl(latitude: number, longitude: number) {
  return `https://www.openstreetmap.org/?mlat=${encodeURIComponent(
    String(latitude),
  )}&mlon=${encodeURIComponent(String(longitude))}#map=17/${encodeURIComponent(
    String(latitude),
  )}/${encodeURIComponent(String(longitude))}`;
}

function getSpamSourceLabel(source?: string | null) {
  if (source === "HYBRID") return "Rule + AI";
  if (source === "RULE_BASED") return "Rule-based";
  return source || "Chưa cập nhật";
}

const evidenceVerificationLabels: Record<
  CommanderCaseEvidenceVerificationStatus,
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

export function CommanderCaseDetailContent({
  caseCode,
}: CommanderCaseDetailContentProps) {
  const [caseItem, setCaseItem] = useState<CommanderCase | undefined>(undefined);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadDetail() {
    setIsLoading(true);
    setError(null);

    try {
      const detail = await commanderCaseService.getDetail(caseCode);
      setCaseItem(detail);
    } catch (loadError) {
      setCaseItem(undefined);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Không kết nối được backend chi tiết hồ sơ chỉ huy.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseCode]);

  if (isLoading) {
    return (
      <div className="px-8 py-8">
        <section className="rounded-xl border border-slate-200 bg-white p-8 text-center font-semibold text-slate-600 shadow-sm">
          Đang tải chi tiết hồ sơ...
        </section>
      </div>
    );
  }

  if (!caseItem) {
    return (
      <div className="px-8 py-8">
        <section className="rounded-xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-2xl font-bold text-[var(--primary)]">
            Không tìm thấy hồ sơ
          </h1>

          <Link
            href="/commander/cases"
            className="mt-6 inline-flex rounded-lg bg-[var(--primary)] px-6 py-3 font-bold text-white"
          >
            Quay lại danh sách
          </Link>
        </section>
      </div>
    );
  }

  const activeCase = caseItem;
  const readOnly =
    activeCase.status === "SPAM_OR_FAKE" || activeCase.status === "RESOLVED";
  const canShowMap = hasValidCoordinates(activeCase);
  const mapEmbedUrl = canShowMap
    ? getOpenStreetMapEmbedUrl(activeCase.latitude!, activeCase.longitude!)
    : null;
  const mapUrl = canShowMap
    ? getOpenStreetMapUrl(activeCase.latitude!, activeCase.longitude!)
    : null;

  function handleConfirmUpdate(nextStatus: CommanderCaseStatus, note: string) {
    void commanderCaseService
      .updateStatus(activeCase.code, nextStatus, note)
      .then((updatedCase) => {
        setCaseItem(updatedCase);
        setUpdateModalOpen(false);
        setToast("Cập nhật trạng thái thành công");
        window.setTimeout(() => setToast(null), 2200);
      })
      .catch((updateError) => {
        setError(
          updateError instanceof Error
            ? updateError.message
            : "Không cập nhật được trạng thái.",
        );
      });
  }

  async function updateEvidenceVerification(
    evidenceId: string,
    status: CommanderCaseEvidenceVerificationStatus,
  ) {
    const note = window.prompt("Ghi chú xác minh minh chứng", "");
    setIsMutating(true);
    setError(null);

    try {
      await commanderCaseService.updateEvidenceVerification(evidenceId, status, note);
      await loadDetail();
      setToast("Đã cập nhật trạng thái minh chứng");
      window.setTimeout(() => setToast(null), 2200);
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Không cập nhật được trạng thái minh chứng.",
      );
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <div className="px-8 py-8">
      {toast ? (
        <div className="fixed right-8 top-24 z-50 rounded-lg border-l-4 border-[var(--primary)] bg-white px-6 py-4 text-sm font-bold text-slate-900 shadow-xl">
          {toast}
        </div>
      ) : null}

      <CommanderStatusUpdateModal
        open={updateModalOpen}
        caseItem={activeCase}
        onClose={() => setUpdateModalOpen(false)}
        onConfirm={handleConfirmUpdate}
      />

      {error ? (
        <section className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-[var(--primary)]">
          {error}
        </section>
      ) : null}

      {readOnly ? (
        <section className="mb-6 rounded-xl border-l-4 border-slate-400 bg-white px-6 py-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">
            Hồ sơ này đã kết thúc xử lý và chỉ đọc
          </h2>

          <p className="mt-2 text-slate-600">
            Tất cả thao tác cập nhật đã bị vô hiệu hoá. Bạn chỉ có thể xem lại
            thông tin lịch sử của hồ sơ này.
          </p>
        </section>
      ) : null}

      <section className="flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            href="/commander/cases"
            className="text-sm font-bold text-slate-500 hover:text-[var(--primary)]"
          >
            &lt; Quay lại danh sách hồ sơ
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Mã hồ sơ: {activeCase.code}
            </span>

            <CommanderStatusBadge status={activeCase.status} />
            <CommanderSeverityBadge severity={activeCase.severity} />
            <SpamWarningBadge
              level={activeCase.spamLevel}
              score={activeCase.spamScore}
              reasons={activeCase.spamReasons}
            />
          </div>

          <h1 className="mt-4 max-w-4xl text-3xl font-bold text-slate-950">
            {activeCase.title}
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            disabled={readOnly}
            onClick={() => setUpdateModalOpen(true)}
            className="rounded-lg bg-[var(--primary)] px-5 py-3 font-bold text-white hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Cập nhật
          </button>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">
              Chi tiết tin báo
            </h2>

            <dl className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <dt className="text-sm font-bold uppercase text-slate-500">
                  Người báo tin
                </dt>
                <dd className="mt-2 text-slate-800">
                  {activeCase.reporter.name}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-bold uppercase text-slate-500">
                  Thời gian tiếp nhận
                </dt>
                <dd className="mt-2 text-slate-800">
                  {formatDateTime(activeCase.receivedAt)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-bold uppercase text-slate-500">
                  Phân loại hệ thống
                </dt>
                <dd className="mt-2 text-slate-800">{activeCase.category}</dd>
              </div>

              <div>
                <dt className="text-sm font-bold uppercase text-slate-500">
                  Độ tin cậy ban đầu
                </dt>
                <dd className="mt-2 font-bold text-[var(--primary)]">
                  {activeCase.confidence}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <p className="text-sm font-bold uppercase text-slate-500">
                Nội dung mô tả
              </p>

              {activeCase.spamLevel && activeCase.spamLevel !== "NONE" ? (
                <div className="mt-3 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-900">
                  <p className="font-bold">Cảnh báo nghi spam</p>
                  <p className="mt-1">
                    Điểm: {activeCase.spamScore ?? 0}
                    {activeCase.spamReasons ? ` - ${activeCase.spamReasons}` : ""}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-red-800">
                    Nguồn phân tích: {getSpamSourceLabel(activeCase.spamDetectionSource)}
                    {activeCase.aiDecision ? ` - AI: ${activeCase.aiDecision}` : ""}
                    {activeCase.aiConfidence != null
                      ? ` - Tin cậy AI: ${activeCase.aiConfidence}%`
                      : ""}
                  </p>
                  {activeCase.aiError ? (
                    <p className="mt-2 rounded-md border border-red-200 bg-white px-3 py-2 text-xs text-red-800">
                      AI fallback: {activeCase.aiError}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-5 leading-7 text-slate-700">
                {activeCase.description}
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">
              Dữ liệu đính kèm
            </h2>

            {activeCase.attachments.length === 0 ? (
              <p className="mt-5 text-slate-500">Không có tệp đính kèm.</p>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {activeCase.attachments.map((file) => (
                  <div
                    key={file.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-5"
                  >
                    <p className="font-semibold text-slate-800">{file.name}</p>
                    <p className="mt-2 text-sm text-slate-500">
                      {file.type.toUpperCase()} - {file.size}
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
                          endpoints.commanderEvidenceDownload(file.id),
                          file.name,
                        )
                      }
                      className="mt-4 rounded-md border border-red-200 px-3 py-2 text-sm font-bold text-[var(--primary)] hover:bg-red-50"
                    >
                      Xem / tải
                    </button>
                    {!readOnly ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={isMutating}
                        onClick={() =>
                          void updateEvidenceVerification(file.id, "VERIFIED")
                        }
                        className="rounded-md border border-green-200 px-3 py-2 text-xs font-bold text-green-700 hover:bg-green-50 disabled:opacity-60"
                      >
                        Hợp lệ
                      </button>
                      <button
                        type="button"
                        disabled={isMutating}
                        onClick={() =>
                          void updateEvidenceVerification(file.id, "REJECTED")
                        }
                        className="rounded-md border border-red-200 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50 disabled:opacity-60"
                      >
                        Không hợp lệ
                      </button>
                      <button
                        type="button"
                        disabled={isMutating}
                        onClick={() =>
                          void updateEvidenceVerification(
                            file.id,
                            "NEEDS_MORE_INFO",
                          )
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
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            {mapEmbedUrl ? (
              <iframe
                title={`Bản đồ vị trí hồ sơ ${activeCase.code}`}
                src={mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-56 w-full rounded-lg border border-slate-200"
              />
            ) : (
              <div className="flex h-40 items-center justify-center rounded-lg bg-slate-100 px-5 text-center text-sm font-semibold text-slate-500">
                Chưa có toạ độ hợp lệ để hiển thị bản đồ.
              </div>
            )}

            <h2 className="mt-6 text-xl font-bold text-slate-950">
              Vị trí báo cáo
            </h2>

            <p className="mt-3 text-slate-600">
              Toạ độ: {activeCase.coordinate}
            </p>

            {mapUrl ? (
              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-md border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                Mở trên bản đồ
              </a>
            ) : null}

            {activeCase.locationWarning ? (
              <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-[var(--primary)]">
                Cảnh báo: {activeCase.locationWarning}
              </p>
            ) : null}
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Lịch sử xử lý</h2>

            <div className="mt-6 space-y-6">
              {activeCase.histories.map((history) => (
                <div
                  key={history.id}
                  className="grid grid-cols-[2rem_1fr] gap-4"
                >
                  <span
                    className={[
                      "mt-1 flex size-6 items-center justify-center rounded-full text-xs font-bold",
                      history.tone === "danger"
                        ? "bg-red-50 text-[var(--primary)]"
                        : history.tone === "success"
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-600",
                    ].join(" ")}
                  >
                    •
                  </span>

                  <div>
                    <p className="text-sm font-bold text-slate-500">
                      {history.time}
                    </p>

                    <p className="mt-1 font-bold text-slate-950">
                      {history.title}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {history.description}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Bởi: {history.actor}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
