"use client";

import { useRef, useState } from "react";

type EvidenceDropzoneProps = {
  onFilesSelected: (files: File[]) => void;
};

function UploadIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-10">
      <path
        d="M12 16V4m0 0 5 5m-5-5-5 5M5 20h14"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function EvidenceDropzone({ onFilesSelected }: EvidenceDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files) return;

    onFilesSelected(Array.from(files));
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      className={[
        "rounded-xl border-2 border-dashed p-10 text-center transition",
        dragging ? "border-(--primary) bg-red-50" : "border-slate-300 bg-white",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*"
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />

      <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-red-50 text-(--primary)">
        <UploadIcon />
      </div>

      <h2 className="mt-6 text-xl font-bold text-slate-900">
        Kéo thả tệp bằng chứng vào đây
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Hoặc{" "}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="font-bold text-(--primary) underline"
        >
          nhấn để chọn tệp
        </button>{" "}
        từ thiết bị của bạn.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-slate-500">
        <span className="rounded bg-slate-100 px-3 py-1">.JPG</span>
        <span className="rounded bg-slate-100 px-3 py-1">.PNG</span>
        <span className="rounded bg-slate-100 px-3 py-1">.WEBP</span>
        <span className="rounded bg-slate-100 px-3 py-1">.MP4</span>
        <span className="rounded bg-slate-100 px-3 py-1">.MOV</span>
        <span className="rounded bg-slate-100 px-3 py-1">.MP3</span>
        <span className="rounded bg-slate-100 px-3 py-1">.WAV</span>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Tối đa 10 tệp và tổng dung lượng 190MB. Ảnh tối đa 10MB, audio tối đa
        50MB, video tối đa 100MB.
      </p>
    </div>
  );
}
