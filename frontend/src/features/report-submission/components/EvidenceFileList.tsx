"use client";

import { formatFileSize } from "@/features/report-submission/data/evidenceUpload.config";
import type {
  EvidenceFileDraft,
  EvidenceFileKind,
} from "@/features/report-submission/types/reportSubmission.types";

type EvidenceFileListProps = {
  files: EvidenceFileDraft[];
  onRemove: (id: string) => void;
};

function getKindLabel(kind: EvidenceFileKind) {
  if (kind === "image") return "Ảnh";
  if (kind === "video") return "Video";
  return "Âm thanh";
}

function FileIcon({ kind }: { kind: EvidenceFileKind }) {
  const label = kind === "image" ? "IMG" : kind === "video" ? "VID" : "AUD";

  return (
    <span className="flex size-12 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-600">
      {label}
    </span>
  );
}

export function EvidenceFileList({ files, onRemove }: EvidenceFileListProps) {
  if (files.length === 0) {
    return (
      <div className="rounded-xl border border-(--border) bg-white p-6 text-center text-sm text-slate-500">
        Chưa có tệp bằng chứng nào được chọn.
      </div>
    );
  }

  return (
    <article className="rounded-xl border border-(--border) bg-white shadow-sm">
      <div className="border-b border-(--border) px-6 py-4">
        <h2 className="font-bold text-slate-900">
          Tệp đã đính kèm ({files.length})
        </h2>
      </div>

      <div className="divide-y divide-(--border)">
        {files.map((file) => (
          <div key={file.id} className="flex items-center gap-4 px-6 py-4">
            <FileIcon kind={file.kind} />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="truncate font-semibold text-slate-900">
                  {file.name}
                </p>

                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                  {getKindLabel(file.kind)}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {formatFileSize(file.size)}
              </p>

              {file.status === "ready" ? (
                <p className="mt-1 text-xs font-semibold text-green-700">
                  Đã kiểm tra, sẵn sàng gửi
                </p>
              ) : null}

              {file.status === "failed" ? (
                <p className="mt-1 text-xs font-semibold text-(--primary)">
                  {file.error ?? "Tệp không hợp lệ"}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => onRemove(file.id)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold 
              text-slate-600 transition hover:bg-red-50 hover:text-(--primary)"
            >
              Xóa
            </button>
          </div>
        ))}
      </div>
    </article>
  );
}
