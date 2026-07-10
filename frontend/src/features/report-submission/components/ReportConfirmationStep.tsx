"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ReportStepIndicator } from "@/features/report-submission/components/ReportStepIndicator";
import { useEvidenceFiles } from "@/features/report-submission/contexts/EvidenceFilesContext";
import { formatFileSize } from "@/features/report-submission/data/evidenceUpload.config";
import { reportDraftStorage } from "@/features/report-submission/services/reportDraftStorage";
import { reportSubmissionService } from "@/features/report-submission/services/reportSubmissionService";
import type {
  EvidenceUploadDraft,
  IncidentInformationDraft,
  ReportClassificationDraft,
  ReporterIdentityDraft,
} from "@/features/report-submission/types/reportSubmission.types";

type ReviewDrafts = {
  classification: ReportClassificationDraft;
  reporter: ReporterIdentityDraft;
  incident: IncidentInformationDraft;
  evidence: EvidenceUploadDraft;
};

function formatDateTime(value: string, timeUnknown: boolean) {
  if (timeUnknown) return "Không nhớ chính xác thời gian";
  if (!value) return "Chưa cung cấp";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function maskCitizenId(value: string) {
  if (!value) return "Không cung cấp";
  if (value.length <= 4) return value;

  return `${value.slice(0, 4)}${"*".repeat(Math.max(value.length - 6, 3))}${value.slice(-2)}`;
}

function maskPhone(value: string) {
  if (!value) return "Không cung cấp";
  if (value.length <= 6) return value;

  return `${value.slice(0, 4)} *** ${value.slice(-3)}`;
}

function ReviewCard({
  title,
  editHref,
  children,
}: {
  title: string;
  editHref: string;
  children: React.ReactNode;
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-sm">
      <header className="flex items-center justify-between gap-4 border-b border-[var(--border)] bg-slate-50 px-6 py-4">
        <h2 className="font-bold text-slate-900">{title}</h2>

        <Link
          href={editHref}
          className="text-sm font-semibold text-sky-700 hover:text-[var(--primary)]"
        >
          Chỉnh sửa
        </Link>
      </header>

      <div className="p-6">{children}</div>
    </article>
  );
}

export function ReportConfirmationStep() {
  const router = useRouter();
  const {
    files: evidenceBinaryFiles,
    clearFiles: clearEvidenceBinaryFiles,
  } = useEvidenceFiles();

  const [drafts, setDrafts] = useState<ReviewDrafts | null>(null);
  const [missingMessage, setMissingMessage] = useState<string | null>(null);
  const [consentAccuracy, setConsentAccuracy] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const classification = reportDraftStorage.getClassification();
    const reporter = reportDraftStorage.getReporterIdentity();
    const incident = reportDraftStorage.getIncidentInformation();
    const evidence = reportDraftStorage.getEvidenceUpload() ?? { files: [] };

    if (!classification) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMissingMessage("Bạn chưa hoàn thành bước phân loại tin báo.");
      return;
    }

    if (!reporter) {
      setMissingMessage("Bạn chưa hoàn thành bước thông tin người tố giác.");
      return;
    }

    if (!incident) {
      setMissingMessage("Bạn chưa hoàn thành bước thông tin sự việc.");
      return;
    }

    setDrafts({
      classification,
      reporter,
      incident,
      evidence,
    });
  }, []);

  const selectedEvidenceFiles = useMemo(() => {
    if (!drafts) return [];

    const filesById = new Map(
      evidenceBinaryFiles.map(({ id, file }) => [id, file]),
    );

    return drafts.evidence.files
      .map(({ id }) => filesById.get(id))
      .filter((file): file is File => Boolean(file));
  }, [drafts, evidenceBinaryFiles]);

  const hasMissingEvidenceFiles = Boolean(
    drafts && selectedEvidenceFiles.length !== drafts.evidence.files.length,
  );

  const canSubmit = useMemo(() => {
    return Boolean(
      drafts &&
        consentAccuracy &&
        consentPrivacy &&
        !submitting &&
        !hasMissingEvidenceFiles,
    );
  }, [
    drafts,
    consentAccuracy,
    consentPrivacy,
    submitting,
    hasMissingEvidenceFiles,
  ]);

  const emergencyLevel = useMemo(() => {
    if (!drafts) return "Thông thường";

    if (
      drafts.incident.isHappeningNow ||
      drafts.incident.hasWeapon ||
      drafts.incident.hasInjured
    ) {
      return "Khẩn cấp";
    }

    return "Thông thường";
  }, [drafts]);

  async function handleSubmit() {
    if (!drafts || !canSubmit) return;

    try {
      setSubmitting(true);
      setSubmitError(null);

      const result = await reportSubmissionService.submitReport({
        classification: drafts.classification,
        reporter: drafts.reporter,
        incident: drafts.incident,
        files: selectedEvidenceFiles,
      });

      reportDraftStorage.saveSubmitResult(result);
      reportDraftStorage.clearWorkingDrafts();
      clearEvidenceBinaryFiles();

      router.push("/report/success");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Không thể gửi tin báo lúc này. Vui lòng kiểm tra kết nối và thử lại.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (missingMessage) {
    return (
      <div className="bg-(--background)">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <ReportStepIndicator currentStep={5} />

          <section className="mt-12 rounded-xl border border-yellow-200 bg-yellow-50 p-8">
            <h1 className="text-xl font-bold text-yellow-900">
              Thiếu thông tin
            </h1>

            <p className="mt-3 text-sm leading-6 text-yellow-800">
              {missingMessage}
            </p>

            <Link
              href="/report"
              className="mt-6 inline-flex rounded-md bg-(--primary) px-6 py-3 font-semibold text-white"
            >
              Quay lại bước 1
            </Link>
          </section>
        </div>
      </div>
    );
  }

  if (!drafts) return null;

  const isAnonymous = drafts.reporter.mode === "anonymous";

  return (
    <div className="bg-(--background)">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <ReportStepIndicator currentStep={5} />

        <section className="mt-12">
          <div className="text-center">
            <h1 className="page-title uppercase">
              Bước 5: Xem lại và xác nhận thông tin
            </h1>

            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Vui lòng kiểm tra kỹ thông tin trước khi gửi. Sau khi tiếp nhận,
              hệ thống sẽ cấp mã tra cứu để bạn theo dõi tiến trình xử lý.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-6">
              <ReviewCard
                title="1. Thông tin người tố giác"
                editHref="/report/reporter"
              >
                {isAnonymous ? (
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-5">
                    <p className="font-bold text-yellow-900">
                      Gửi tin báo ẩn danh
                    </p>

                    <p className="mt-2 text-sm leading-6 text-yellow-800">
                      Hệ thống không lưu thông tin định danh cá nhân của người
                      gửi trong hồ sơ này.
                    </p>
                  </div>
                ) : (
                  <dl className="grid gap-5 md:grid-cols-2">
                    <div>
                      <dt className="text-sm font-semibold text-slate-500">
                        Họ và tên
                      </dt>
                      <dd className="mt-1 font-medium text-slate-900">
                        {drafts.reporter.fullName}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-semibold text-slate-500">
                        Số CCCD / Định danh
                      </dt>
                      <dd className="mt-1 font-medium text-slate-900">
                        {maskCitizenId(drafts.reporter.citizenId)}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-semibold text-slate-500">
                        Số điện thoại
                      </dt>
                      <dd className="mt-1 font-medium text-slate-900">
                        {maskPhone(drafts.reporter.phone)}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-semibold text-slate-500">
                        Email
                      </dt>
                      <dd className="mt-1 font-medium text-slate-900">
                        {drafts.reporter.email || "Không cung cấp"}
                      </dd>
                    </div>

                    <div className="md:col-span-2">
                      <dt className="text-sm font-semibold text-slate-500">
                        Địa chỉ liên hệ
                      </dt>
                      <dd className="mt-1 font-medium text-slate-900">
                        {drafts.reporter.address}
                      </dd>
                    </div>
                  </dl>
                )}
              </ReviewCard>

              <ReviewCard
                title="2. Chi tiết sự việc"
                editHref="/report/content"
              >
                <div className="flex flex-wrap gap-2">
                  <span
                    className={[
                      "rounded-full px-3 py-1 text-xs font-bold",
                      emergencyLevel === "Khẩn cấp"
                        ? "bg-red-50 text-(--primary)"
                        : "bg-slate-100 text-slate-600",
                    ].join(" ")}
                  >
                    Mức độ: {emergencyLevel}
                  </span>

                  <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                    Loại: {drafts.classification.crimeTypeName}
                  </span>

                  {drafts.incident.isHappeningNow ? (
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                      Đang xảy ra
                    </span>
                  ) : null}

                  {drafts.incident.hasWeapon ? (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-(--primary)">
                      Có vũ khí
                    </span>
                  ) : null}

                  {drafts.incident.hasInjured ? (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-(--primary)">
                      Có người bị thương
                    </span>
                  ) : null}
                </div>

                <dl className="mt-6 space-y-5">
                  <div>
                    <dt className="text-sm font-semibold text-slate-500">
                      Thời gian xảy ra
                    </dt>
                    <dd className="mt-1 font-medium text-slate-900">
                      {formatDateTime(
                        drafts.incident.incidentTime,
                        drafts.incident.timeUnknown,
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-semibold text-slate-500">
                      Địa điểm xảy ra
                    </dt>
                    <dd className="mt-1 font-medium text-slate-900">
                      {drafts.incident.address}
                    </dd>
                  </div>

                  {(drafts.incident.latitude || drafts.incident.longitude) && (
                    <div>
                      <dt className="text-sm font-semibold text-slate-500">
                        Tọa độ
                      </dt>
                      <dd className="mt-1 font-medium text-slate-900">
                        {drafts.incident.latitude || "?"},{" "}
                        {drafts.incident.longitude || "?"}
                      </dd>
                    </div>
                  )}

                  <div>
                    <dt className="text-sm font-semibold text-slate-500">
                      Tóm tắt nội dung
                    </dt>
                    <dd
                      className="mt-2 rounded-lg border-l-4 border-(--primary) 
                    bg-slate-50 p-4 text-sm leading-7 text-slate-700"
                    >
                      {drafts.incident.description}
                    </dd>
                  </div>
                </dl>
              </ReviewCard>

              <ReviewCard
                title={`3. Tài liệu đính kèm (${drafts.evidence.files.length})`}
                editHref="/report/evidence"
              >
                {drafts.evidence.files.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Không có tệp bằng chứng đính kèm.
                  </p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {drafts.evidence.files.map((file) => (
                      <div
                        key={file.id}
                        className="rounded-lg border border-dashed border-sky-300 bg-sky-50 p-4"
                      >
                        <p className="truncate font-semibold text-slate-900">
                          {file.name}
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                          {formatFileSize(file.size)}
                        </p>

                        <p className="mt-2 text-xs font-bold text-green-700">
                          Đã kiểm tra
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </ReviewCard>
            </div>

            <aside className="space-y-5">
              <article className="rounded-xl border border-yellow-300 bg-yellow-50 p-6">
                <h2 className="text-lg font-bold text-(--primary)">
                  Cam kết và xác nhận
                </h2>

                <div className="mt-5 space-y-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={consentAccuracy}
                      onChange={(event) =>
                        setConsentAccuracy(event.target.checked)
                      }
                      className="mt-1 size-5 rounded border-slate-300 accent-(--primary)"
                    />

                    <span className="text-sm leading-6 text-slate-700">
                      Tôi cam đoan các thông tin cung cấp là đúng sự thật và
                      chịu trách nhiệm trước pháp luật về tính chính xác của
                      thông tin.
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={consentPrivacy}
                      onChange={(event) =>
                        setConsentPrivacy(event.target.checked)
                      }
                      className="mt-1 size-5 rounded border-slate-300 accent-(--primary)"
                    />

                    <span className="text-sm leading-6 text-slate-700">
                      Tôi đã đọc và đồng ý với chính sách xử lý dữ liệu cá nhân
                      của hệ thống.
                    </span>
                  </label>
                </div>

                {submitError ? (
                  <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-(--primary)">
                    {submitError}
                  </p>
                ) : null}

                {hasMissingEvidenceFiles ? (
                  <p className="mt-4 rounded-md bg-yellow-100 px-4 py-3 text-sm text-yellow-900">
                    Tệp bằng chứng đã mất sau khi tải lại trang. Vui lòng quay
                    lại bước 4 và chọn lại tệp trước khi gửi.
                  </p>
                ) : null}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="mt-6 w-full rounded-md bg-(--primary) px-6 py-4 font-bold text-white 
                  transition hover:bg-(--primary-hover) disabled:cursor-not-allowed disabled:bg-red-300"
                >
                  {submitting
                    ? "Đang gửi tin báo..."
                    : isAnonymous
                      ? "Gửi tin báo ẩn danh"
                      : "Gửi tin báo định danh"}
                </button>

                <Link
                  href="/report/evidence"
                  className="mt-4 inline-flex w-full justify-center rounded-md border border-slate-500 px-6 py-4 
                  font-semibold text-slate-600 hover:bg-white"
                >
                  Quay lại
                </Link>
              </article>

              <article className="rounded-xl border border-sky-100 bg-sky-50 p-6">
                <h2 className="font-bold text-sky-900">Bảo mật thông tin</h2>

                <p className="mt-3 text-sm leading-6 text-slate-700">
                  Dữ liệu gửi lên hệ thống được sử dụng phục vụ tiếp nhận, xác
                  minh và xử lý tin báo. Mã tra cứu sẽ được cấp sau khi gửi
                  thành công.
                </p>
              </article>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}
