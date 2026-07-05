"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { reportDraftStorage } from "@/features/report-submission/services/reportDraftStorage";
import type { SubmittedReportResult } from "@/features/report-submission/types/reportSubmission.types";
import { formatVietnamDateTime } from "@/utils/dateTime";

function formatSubmittedAt(value: string) {
  return formatVietnamDateTime(value);
}

export function ReportSuccessStep() {
  const [result, setResult] = useState<SubmittedReportResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResult(reportDraftStorage.getSubmitResult());
  }, []);

  async function handleCopyTrackingCode() {
    if (!result) return;

    await navigator.clipboard.writeText(result.trackingCode);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  function handleDownloadReceipt() {
    if (!result) return;

    const content = [
      "BIÊN NHẬN TIẾP NHẬN TIN BÁO",
      "",
      `Mã tra cứu: ${result.trackingCode}`,
      `Thời gian tiếp nhận: ${formatSubmittedAt(result.submittedAt)}`,
      `Trạng thái: Đã tiếp nhận`,
      `Hình thức gửi: ${
        result.mode === "anonymous" ? "Ẩn danh" : "Định danh bảo mật"
      }`,
      "",
      "Vui lòng lưu mã tra cứu để theo dõi tiến trình xử lý tin báo.",
    ].join("\n");

    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `bien-nhan-${result.trackingCode}.txt`;
    anchor.click();

    URL.revokeObjectURL(url);
  }

  if (!result) {
    return (
      <div className="bg-(--background) px-6 py-16">
        <section className="mx-auto max-w-3xl rounded-xl border border-yellow-200 bg-yellow-50 p-8 text-center">
          <h1 className="text-2xl font-bold text-yellow-900">
            Không tìm thấy mã tiếp nhận
          </h1>

          <p className="mt-3 text-sm leading-6 text-yellow-800">
            Có thể bạn đã làm mới phiên làm việc hoặc chưa gửi tin báo thành
            công.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-md bg-(--primary) px-6 py-3 font-semibold text-white"
          >
            Quay về trang chủ
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-(--background) px-6 py-16">
      <section
        className="mx-auto max-w-4xl rounded-xl border border-(--border) bg-white p-8 
      text-center shadow-sm md:p-12"
      >
        <div
          className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-green-50 
        text-4xl text-green-700"
        >
          ✓
        </div>

        <h1 className="mt-8 text-3xl font-bold text-slate-900">
          Tiếp nhận thông tin thành công
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Hệ thống đã ghi nhận tin báo của bạn một cách an toàn. Vui lòng lưu mã
          tra cứu dưới đây để theo dõi tiến trình xử lý.
        </p>

        <div
          className="mx-auto mt-8 max-w-2xl rounded-xl border-2 border-dashed border-(--primary) 
        bg-red-50/40 p-8"
        >
          <p className="text-sm font-bold uppercase tracking-wide text-slate-600">
            Mã tra cứu
          </p>

          <div
            className="mt-4 rounded-lg border border-(--border) bg-white px-6 py-5 
          font-mono text-3xl font-bold tracking-[0.3em] text-(--primary) shadow-sm"
          >
            {result.trackingCode}
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Thời gian tiếp nhận: {formatSubmittedAt(result.submittedAt)}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleCopyTrackingCode}
              className="rounded-md border border-slate-500 px-6 py-3 font-semibold text-slate-600 transition hover:bg-white"
            >
              {copied ? "Đã sao chép" : "Sao chép mã"}
            </button>

            <button
              type="button"
              onClick={handleDownloadReceipt}
              className="rounded-md bg-(--primary) px-6 py-3 font-semibold text-white transition hover:bg-(--primary-hover)"
            >
              Tải biên nhận
            </button>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-yellow-200 bg-yellow-50 p-6 text-left">
          <h2 className="font-bold text-yellow-900">
            Hướng dẫn và lưu ý quan trọng
          </h2>

          <div className="mt-4 space-y-3 text-sm leading-6 text-yellow-800">
            <p>
              <strong>Cách tra cứu:</strong> vào mục “Tra cứu” trên trang chủ và
              nhập mã tra cứu để theo dõi trạng thái xử lý.
            </p>

            <p>
              <strong>Bảo mật thông tin:</strong> không chia sẻ mã này công khai
              trên mạng xã hội hoặc với người không liên quan.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-md border border-slate-500 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Quay về trang chủ
          </Link>

          <Link
            href="/tracking"
            className="rounded-md bg-(--primary) px-6 py-3 font-semibold text-white transition hover:bg-(--primary-hover)"
          >
            Tra cứu tiến độ
          </Link>
        </div>
      </section>
    </div>
  );
}
