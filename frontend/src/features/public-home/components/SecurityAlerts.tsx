"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { publicProcessingService } from "@/features/public-home/services/publicProcessingService";
import type {
  PublicProcessingFeed,
  PublicProcessingUpdate,
} from "@/features/public-home/types/publicHome.types";
import { formatVietnamDateTime } from "@/utils/dateTime";

const processingSteps = [
  {
    number: "01",
    title: "Tiếp nhận",
    description: "Ghi nhận tin báo và cấp mã tra cứu riêng cho người gửi.",
  },
  {
    number: "02",
    title: "Sàng lọc",
    description: "Phân loại nội dung, mức độ ưu tiên và dấu hiệu cần xác minh.",
  },
  {
    number: "03",
    title: "Điều phối",
    description: "Chuyển tin báo đến bộ phận phụ trách phù hợp, không công khai danh tính.",
  },
  {
    number: "04",
    title: "Xử lý",
    description: "Cập nhật tiến độ và hoàn tất theo quy trình nghiệp vụ.",
  },
];

const fallbackTips = [
  "Nếu phát hiện dấu hiệu bất thường, hãy ưu tiên an toàn cá nhân và gửi tin báo kèm vị trí, thời gian, bằng chứng nếu có.",
  "Không tự ý tiếp cận hoặc truy đuổi đối tượng nghi vấn; hãy chờ lực lượng chức năng xử lý.",
  "Theo dõi tiến độ bằng mã hồ sơ riêng của bạn, không chia sẻ thông tin nhạy cảm lên mạng xã hội.",
];

function BellIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path
        d="M15 17H9m10-1-1.4-1.4A2 2 0 0 1 17 13.2V10a5 5 0 0 0-10 0v3.2c0 .5-.2 1-.6 1.4L5 16h14Zm-9 3h4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path
        d="M12 3 5 6v5c0 4.4 2.8 8.3 7 10 4.2-1.7 7-5.6 7-10V6l-7-3Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function toneFor(update: PublicProcessingUpdate) {
  if (update.type === "DISPATCH_RECALLED") {
    return "border-l-amber-500 bg-amber-50 text-amber-700";
  }

  if (update.type === "CASE_REASSIGNED") {
    return "border-l-sky-600 bg-sky-50 text-sky-700";
  }

  return "border-l-emerald-600 bg-emerald-50 text-emerald-700";
}

export function SecurityAlerts() {
  const [feed, setFeed] = useState<PublicProcessingFeed>();

  useEffect(() => {
    let isActive = true;

    async function loadFeed() {
      try {
        const data = await publicProcessingService.getFeed();
        if (isActive) setFeed(data);
      } catch {
        // Bản tin vẫn có nội dung tĩnh hữu ích nếu API tạm thời chưa sẵn sàng.
      }
    }

    void loadFeed();
    const refreshInterval = window.setInterval(() => void loadFeed(), 30_000);

    return () => {
      isActive = false;
      window.clearInterval(refreshInterval);
    };
  }, []);

  const latestUpdates = useMemo(
    () => feed?.latestUpdates.slice(0, 4) ?? [],
    [feed?.latestUpdates],
  );
  const safetyTips = feed?.safetyTips?.length ? feed.safetyTips : fallbackTips;

  return (
    <section aria-labelledby="community-updates-heading">
      <div className="mb-5 flex items-end justify-between gap-4 border-b-2 border-(--primary) pb-3">
        <div>
          <h2
            id="community-updates-heading"
            className="flex items-center gap-2 text-xl font-bold text-(--primary)"
          >
            <BellIcon />
            Bản tin cộng đồng
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Cập nhật xử lý đã ẩn danh và khuyến nghị an toàn dành cho người dân.
          </p>
        </div>

        <Link
          href="/tracking"
          className="shrink-0 text-sm font-semibold text-sky-700 hover:text-(--primary)"
        >
          Tra cứu hồ sơ
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-(--border) bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-linear-to-br from-red-50 via-white to-amber-50 p-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-(--primary)">
              <ShieldIcon />
              Thông tin công khai
            </div>

            <h3 className="mt-4 text-2xl font-black text-slate-950">
              {feed?.headline ?? "Cộng đồng hiện chưa có cập nhật xử lý mới"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {feed?.summary ??
                "Hệ thống vẫn duy trì tiếp nhận tin báo 24/7. Người dân có thể gửi tin báo hoặc tra cứu tiến độ bằng mã hồ sơ cá nhân."}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <div className="rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100">
                <p className="text-2xl font-black text-(--primary)">
                  {feed?.updatesLast24Hours ?? 0}
                </p>
                <p className="text-xs font-bold uppercase text-slate-500">
                  cập nhật trong 24 giờ
                </p>
              </div>
              <div className="rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100">
                <p className="text-2xl font-black text-slate-950">Ẩn danh</p>
                <p className="text-xs font-bold uppercase text-slate-500">
                  không lộ mã hồ sơ/cán bộ
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 p-5 lg:border-l lg:border-t-0">
            <p className="text-sm font-black uppercase tracking-wide text-slate-900">
              Khuyến nghị an toàn
            </p>
            <ul className="mt-3 space-y-3">
              {safetyTips.map((tip) => (
                <li key={tip} className="flex gap-3 text-sm leading-6 text-slate-600">
                  <span className="mt-2 size-2 shrink-0 rounded-full bg-(--primary)" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ol className="grid gap-3 border-t border-slate-100 bg-slate-50 p-4 sm:grid-cols-2 xl:grid-cols-4">
          {processingSteps.map((step) => (
            <li key={step.number} className="rounded-lg bg-white p-4 shadow-sm">
              <span className="text-xs font-black text-(--primary)">
                {step.number}
              </span>
              <h3 className="mt-1 font-bold text-slate-900">{step.title}</h3>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {latestUpdates.length > 0 ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {latestUpdates.map((update) => (
            <article
              key={update.id}
              className={`rounded-lg border border-(--border) border-l-4 bg-white p-4 shadow-sm ${toneFor(update)}`}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-sm font-bold text-slate-950">
                  {update.title}
                </h3>
                <span className="shrink-0 rounded bg-white/80 px-2 py-1 text-[0.65rem] font-bold uppercase">
                  Đã ẩn danh
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {update.message}
              </p>
              <time className="mt-2 block text-xs font-semibold text-slate-500">
                {formatVietnamDateTime(update.createdAt)}
              </time>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
          Chưa có bản tin xử lý mới. Khi có hoạt động điều phối hoặc cập nhật phương án xử lý,
          hệ thống sẽ hiển thị tại đây ở dạng tổng quan và đã ẩn danh.
        </div>
      )}
    </section>
  );
}
