"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { TrackingFilterBar } from "@/features/tracking/components/TrackingFilterBar";
import { TrackingPrivacyBanner } from "@/features/tracking/components/TrackingPrivacyBanner";

export function TrackingPageContent() {
  const router = useRouter();
  const [trackingCode, setTrackingCode] = useState("");
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedTrackingCode = trackingCode.trim().toUpperCase();

    if (!normalizedTrackingCode) {
      setError("Vui lòng nhập mã tra cứu.");
      return;
    }

    setError(undefined);
    setIsLoading(true);
    router.push(`/tracking/${encodeURIComponent(normalizedTrackingCode)}`);
  }

  return (
    <div className="bg-(--background)">
      <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <section>
          <h1 className="text-2xl font-bold text-(--primary) md:text-3xl">
            Tra cứu tiến độ tin báo
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Nhập mã tra cứu được cấp sau khi gửi tin báo để xem trạng thái xử lý
            mới nhất.
          </p>
        </section>

        <div className="mt-8">
          <TrackingFilterBar
            trackingCode={trackingCode}
            isLoading={isLoading}
            error={error}
            onTrackingCodeChange={(value) => {
              setTrackingCode(value);
              setError(undefined);
            }}
            onSubmit={handleSubmit}
          />
        </div>

        <section className="mt-8 rounded-xl border border-sky-100 bg-sky-50 p-6">
          <h2 className="font-bold text-slate-900">Bạn chưa có mã tra cứu?</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Mã được tạo tự động sau khi hệ thống tiếp nhận tin báo của bạn.
          </p>
          <Link
            href="/report"
            className="mt-5 inline-flex rounded-md bg-(--primary) px-5 py-3 text-sm font-bold text-white transition hover:bg-(--primary-hover)"
          >
            Gửi tin báo mới
          </Link>
        </section>

        <div className="mt-10">
          <TrackingPrivacyBanner />
        </div>
      </div>

      <Link
        href="tel:113"
        className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-xl bg-(--primary) text-xl font-bold text-white shadow-xl shadow-red-900/30 transition hover:bg-[var(--primary-hover)]"
        aria-label="Gọi đường dây nóng 113"
      >
        113
      </Link>
    </div>
  );
}
