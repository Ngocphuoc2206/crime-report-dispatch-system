"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EvidenceDropzone } from "@/features/report-submission/components/EvidenceDropzone";
import { EvidenceFileList } from "@/features/report-submission/components/EvidenceFileList";
import { EvidenceHelpPanel } from "@/features/report-submission/components/EvidenceHelpPanel";
import { ReportStepIndicator } from "@/features/report-submission/components/ReportStepIndicator";
import {
  allowedEvidenceMimeTypes,
  getMaxFileSizeByKind,
  MAX_EVIDENCE_FILES,
} from "@/features/report-submission/data/evidenceUpload.config";
import { reportDraftStorage } from "@/features/report-submission/services/reportDraftStorage";
import type {
  EvidenceFileDraft,
  EvidenceFileKind,
} from "@/features/report-submission/types/reportSubmission.types";

function createEvidenceId() {
  return `evidence-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function validateFile(file: File): {
  valid: boolean;
  kind?: EvidenceFileKind;
  error?: string;
} {
  const kind = allowedEvidenceMimeTypes[file.type];

  if (!kind) {
    return {
      valid: false,
      error: "Chỉ hỗ trợ tệp ảnh, video hoặc âm thanh.",
    };
  }

  const maxSize = getMaxFileSizeByKind(kind);

  if (file.size > maxSize) {
    return {
      valid: false,
      kind,
      error: "Dung lượng tệp vượt quá giới hạn cho phép.",
    };
  }

  return {
    valid: true,
    kind,
  };
}

export function EvidenceUploadStep() {
  const router = useRouter();
  const [files, setFiles] = useState<EvidenceFileDraft[]>([]);
  const [pageError, setPageError] = useState<string | null>(null);
  const [missingPreviousStep, setMissingPreviousStep] = useState(false);

  useEffect(() => {
    const classificationDraft = reportDraftStorage.getClassification();
    const reporterDraft = reportDraftStorage.getReporterIdentity();
    const incidentDraft = reportDraftStorage.getIncidentInformation();
    const evidenceDraft = reportDraftStorage.getEvidenceUpload();

    if (!classificationDraft || !reporterDraft || !incidentDraft) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMissingPreviousStep(true);
    }

    if (evidenceDraft) {
      setFiles(evidenceDraft.files);
    }
  }, []);

  const validFiles = useMemo(() => {
    return files.filter((file) => file.status === "uploaded");
  }, [files]);

  const hasUploadingFile = useMemo(() => {
    return files.some((file) => file.status === "uploading");
  }, [files]);

  function simulateProgress(fileIds: string[]) {
    const timer = window.setInterval(() => {
      setFiles((currentFiles) => {
        let allDone = true;

        const nextFiles = currentFiles.map((file) => {
          if (!fileIds.includes(file.id) || file.status !== "uploading") {
            return file;
          }

          const nextProgress = Math.min(file.progress + 20, 100);

          if (nextProgress < 100) {
            allDone = false;

            return {
              ...file,
              progress: nextProgress,
            };
          }

          return {
            ...file,
            progress: 100,
            status: "uploaded" as const,
          };
        });

        if (allDone) {
          window.clearInterval(timer);
        }

        return nextFiles;
      });
    }, 350);
  }

  function handleFilesSelected(selectedFiles: File[]) {
    setPageError(null);

    if (files.length + selectedFiles.length > MAX_EVIDENCE_FILES) {
      setPageError(`Chỉ được đính kèm tối đa ${MAX_EVIDENCE_FILES} tệp.`);
      return;
    }

    const nextFiles: EvidenceFileDraft[] = selectedFiles.map((file) => {
      const result = validateFile(file);

      if (!result.valid || !result.kind) {
        return {
          id: createEvidenceId(),
          name: file.name,
          size: file.size,
          type: file.type || "unknown",
          kind: result.kind ?? "image",
          progress: 0,
          status: "failed",
          error: result.error,
        };
      }

      return {
        id: createEvidenceId(),
        name: file.name,
        size: file.size,
        type: file.type,
        kind: result.kind,
        progress: 0,
        status: "uploading",
      };
    });

    setFiles((current) => [...current, ...nextFiles]);

    const uploadingIds = nextFiles
      .filter((file) => file.status === "uploading")
      .map((file) => file.id);

    if (uploadingIds.length > 0) {
      simulateProgress(uploadingIds);
    }
  }

  function handleRemoveFile(id: string) {
    setFiles((current) => current.filter((file) => file.id !== id));
  }

  function handleContinue() {
    reportDraftStorage.saveEvidenceUpload({
      files: validFiles,
    });

    router.push("/report/review");
  }

  return (
    <div className="bg-(--background)">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <ReportStepIndicator currentStep={4} />

        {missingPreviousStep ? (
          <div className="mt-10 rounded-md border border-yellow-200 bg-yellow-50 px-5 py-4 text-sm leading-6 text-yellow-800">
            Bạn chưa hoàn thành các bước trước. Vui lòng kiểm tra lại phần phân
            loại, người tố giác và thông tin sự việc trước khi tiếp tục.
          </div>
        ) : null}

        <section className="mt-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900 md:text-3xl">
              Bước 4: Đính kèm bằng chứng
            </h1>

            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Bạn có thể tải lên hình ảnh, video hoặc âm thanh liên quan đến sự
              việc. Bằng chứng là không bắt buộc, nhưng sẽ giúp cơ quan chức
              năng xác minh tin báo nhanh hơn.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-6">
              <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-bold text-slate-900">Khu vực tải lên</h2>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                    Kiểm tra loại tệp & dung lượng
                  </span>
                </div>

                <EvidenceDropzone onFilesSelected={handleFilesSelected} />

                {pageError ? (
                  <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-(--primary)">
                    {pageError}
                  </p>
                ) : null}
              </article>

              <EvidenceFileList files={files} onRemove={handleRemoveFile} />
            </div>

            <EvidenceHelpPanel />
          </div>

          <div className="mt-10 rounded-xl border border-(--border) bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/report/content"
                className="inline-flex items-center justify-center rounded-md border border-slate-500 px-8 py-4 font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                ← Quay lại
              </Link>

              <button
                type="button"
                onClick={handleContinue}
                disabled={hasUploadingFile}
                className="inline-flex items-center justify-center rounded-md bg-(--primary) px-8 py-4 
                font-semibold text-white transition hover:bg-(--primary-hover) disabled:cursor-not-allowed disabled:bg-red-300"
              >
                Tiếp tục: Xác nhận →
              </button>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Bạn có thể tiếp tục ngay cả khi không đính kèm bằng chứng.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
