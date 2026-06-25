"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  OfficerCasePriorityBadge,
  OfficerCaseStatusBadge,
} from "@/features/officer-cases/components/OfficerCaseBadge";
import { OfficerCaseTimeline } from "@/features/officer-cases/components/OfficerCaseTimeline";
import {
  CURRENT_OFFICER_ID,
  CURRENT_OFFICER_NAME,
  mockOfficerCases,
} from "@/features/officer-cases/data/officerCases.data";
import type { OfficerCase } from "@/features/officer-cases/types/officerCase.types";

type OfficerCaseDetailContentProps = {
  caseCode: string;
};

function findCase(caseCode: string) {
  return mockOfficerCases.find((item) => item.code === caseCode);
}

function formatLockTime(expiresAt?: string) {
  if (!expiresAt) return "";

  const diff = new Date(expiresAt).getTime() - Date.now();
  const minutes = Math.max(0, Math.floor(diff / 1000 / 60));
  const seconds = Math.max(0, Math.floor((diff / 1000) % 60));

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function OfficerCaseDetailContent({
  caseCode,
}: OfficerCaseDetailContentProps) {
  const initialCase = useMemo(() => findCase(caseCode), [caseCode]);
  const [caseDetail, setCaseDetail] = useState<OfficerCase | undefined>(
    initialCase,
  );
  const [toast, setToast] = useState<string | null>(null);

  if (!caseDetail) {
    return (
      <div className="px-6 py-8">
        <section className="rounded-xl border border-yellow-200 bg-yellow-50 p-8">
          <h1 className="text-xl font-bold text-yellow-900">
            Không tìm thấy hồ sơ
          </h1>
          <Link
            href="/officer/cases"
            className="mt-5 inline-flex rounded-md bg-(--primary) px-5 py-3 font-bold text-white"
          >
            Quay lại hộp hồ sơ
          </Link>
        </section>
      </div>
    );
  }

  const isClosed = caseDetail.status === "CLOSED";
  const isLockedByMe = caseDetail.lock?.lockedById === CURRENT_OFFICER_ID;
  const isLockedByOther =
    Boolean(caseDetail.lock) &&
    caseDetail.lock?.lockedById !== CURRENT_OFFICER_ID;
  const canOperate = !isClosed && isLockedByMe;

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2000);
  }

  function handleAcceptCase() {
    setCaseDetail((current) => {
      if (!current) return current;

      return {
        ...current,
        status: "VERIFYING",
        assignedOfficerName: CURRENT_OFFICER_NAME,
        lock: {
          lockedById: CURRENT_OFFICER_ID,
          lockedByName: CURRENT_OFFICER_NAME,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        },
        timeline: [
          ...current.timeline,
          {
            id: `timeline-${Date.now()}`,
            title: "Nhận xử lý hồ sơ",
            description: "Cán bộ trực ban đã nhận quyền xử lý hồ sơ.",
            actor: CURRENT_OFFICER_NAME,
            occurredAt: new Date().toISOString(),
          },
        ],
      };
    });

    showToast("Đã nhận xử lý hồ sơ");
  }

  function handleReleaseLock() {
    setCaseDetail((current) => {
      if (!current) return current;

      return {
        ...current,
        lock: undefined,
      };
    });

    showToast("Đã giải phóng khóa hồ sơ");
  }

  function handleMarkResolved() {
    setCaseDetail((current) => {
      if (!current) return current;

      return {
        ...current,
        status: "RESOLVED",
        timeline: [
          ...current.timeline,
          {
            id: `timeline-${Date.now()}`,
            title: "Cập nhật trạng thái đã xử lý",
            description: "Cán bộ cập nhật kết quả xử lý ban đầu.",
            actor: CURRENT_OFFICER_NAME,
            occurredAt: new Date().toISOString(),
          },
        ],
      };
    });

    showToast("Đã cập nhật trạng thái xử lý");
  }

  function handleMarkSpam() {
    setCaseDetail((current) => {
      if (!current) return current;

      return {
        ...current,
        status: "REJECTED",
        timeline: [
          ...current.timeline,
          {
            id: `timeline-${Date.now()}`,
            title: "Đánh dấu hồ sơ giả / Spam",
            description:
              "Hồ sơ được đánh dấu cần rà soát do có dấu hiệu không hợp lệ.",
            actor: CURRENT_OFFICER_NAME,
            occurredAt: new Date().toISOString(),
          },
        ],
      };
    });

    showToast("Đã đánh dấu hồ sơ giả / Spam");
  }

  function handleRequestAdditionalEvidence() {
    setCaseDetail((current) => {
      if (!current) return current;

      return {
        ...current,
        status: "NEEDS_ADDITIONAL_EVIDENCE",
        timeline: [
          ...current.timeline,
          {
            id: `timeline-${Date.now()}`,
            title: "Yêu cầu bổ sung bằng chứng",
            description:
              "Người dân sẽ nhận thông báo bổ sung tài liệu, hình ảnh hoặc video liên quan.",
            actor: CURRENT_OFFICER_NAME,
            occurredAt: new Date().toISOString(),
          },
        ],
      };
    });

    showToast("Đã gửi yêu cầu bổ sung bằng chứng");
  }

  return (
    <div className="px-6 py-8">
      {toast ? (
        <div className="fixed bottom-8 right-8 z-50 rounded-xl bg-slate-900 px-6 py-4 text-sm font-bold text-white shadow-xl">
          {toast}
        </div>
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
                {formatLockTime(caseDetail.lock?.expiresAt)}
              </p>
            </div>

            <div className="flex gap-3">
              <button className="rounded-md border border-white/40 px-5 py-3 text-sm font-bold hover:bg-white/10">
                Gia hạn
              </button>

              <button
                onClick={handleReleaseLock}
                className="rounded-md bg-white px-5 py-3 text-sm font-bold text-(--primary)"
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
            Hồ sơ đang được xử lý bởi {caseDetail.lock?.lockedByName}. Bạn đang
            xem ở chế độ chỉ đọc.
          </p>
        </section>
      ) : null}

      {isClosed ? (
        <section className="mb-6 rounded-xl border border-slate-200 bg-slate-100 px-6 py-5 text-slate-700">
          <h2 className="font-bold">Hồ sơ đã kết thúc</h2>
          <p className="mt-1 text-sm leading-6">
            Hồ sơ chỉ hiển thị ở chế độ lưu trữ, không cho phép thao tác nghiệp
            vụ.
          </p>
        </section>
      ) : null}

      <section className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <Link
            href="/officer/cases"
            className="text-sm font-semibold text-slate-600 hover:text-(--primary)"
          >
            ← Quay lại danh sách
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <OfficerCaseStatusBadge status={caseDetail.status} />
            <OfficerCasePriorityBadge priority={caseDetail.priority} />
            <span className="font-mono text-sm text-slate-500">
              {caseDetail.code}
            </span>
          </div>

          <h1 className="mt-4 max-w-4xl text-3xl font-bold text-slate-950">
            {caseDetail.title}
          </h1>
        </div>

        {!caseDetail.lock && !isClosed ? (
          <button
            onClick={handleAcceptCase}
            className="rounded-md bg-green-600 px-6 py-4 font-bold text-white hover:bg-green-700"
          >
            Nhận xử lý
          </button>
        ) : null}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Thông tin người trình báo
            </h2>

            {caseDetail.reporterMode === "anonymous" ? (
              <div className="mt-5 rounded-xl bg-slate-100 p-6">
                <p className="text-2xl font-bold tracking-wide text-slate-700">
                  INCOGNITO
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Người báo tin yêu cầu bảo mật danh tính.
                </p>
                <p className="mt-4 text-sm font-bold text-slate-900">
                  Mã định danh tạm thời: {caseDetail.anonymousTemporaryId}
                </p>
              </div>
            ) : (
              <dl className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <dt className="text-sm font-bold uppercase text-slate-500">
                    Họ và tên
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {caseDetail.reporter?.fullName}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-bold uppercase text-slate-500">
                    Số điện thoại
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {caseDetail.reporter?.phone}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-bold uppercase text-slate-500">
                    CCCD / CMND
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {caseDetail.reporter?.citizenId}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-bold uppercase text-slate-500">
                    Địa chỉ
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {caseDetail.reporter?.address}
                  </dd>
                </div>
              </dl>
            )}
          </article>

          <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Nội dung trình báo
            </h2>

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

              {caseDetail.incident.relatedBank ? (
                <div className="rounded-lg border border-(--border) p-4">
                  <p className="text-sm font-bold uppercase text-slate-500">
                    Ngân hàng liên quan
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {caseDetail.incident.relatedBank}
                  </p>
                </div>
              ) : null}

              {caseDetail.incident.estimatedDamage ? (
                <div className="rounded-lg border border-(--border) p-4">
                  <p className="text-sm font-bold uppercase text-slate-500">
                    Thiệt hại ước tính
                  </p>
                  <p className="mt-1 font-semibold text-(--primary)">
                    {caseDetail.incident.estimatedDamage}
                  </p>
                </div>
              ) : null}
            </div>
          </article>

          <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Tài liệu & Chứng cứ đính kèm
            </h2>

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
                </div>
              ))}
            </div>
          </article>
        </div>

        <aside className="space-y-6">
          <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Thao tác nghiệp vụ
            </h2>

            <div className="mt-5 space-y-3">
              <button
                disabled={!canOperate}
                className="w-full rounded-md bg-slate-900 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Chuyển cơ quan điều tra
              </button>

              <button
                onClick={handleMarkResolved}
                disabled={!canOperate}
                className="w-full rounded-md bg-green-600 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Đã xử lý xong
              </button>

              <button
                onClick={handleMarkSpam}
                disabled={!canOperate}
                className="w-full rounded-md bg-red-50 px-5 py-3 font-bold text-(--primary) disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              >
                Hồ sơ giả / Spam
              </button>

              <button
                onClick={handleRequestAdditionalEvidence}
                disabled={!canOperate}
                className="w-full rounded-md border border-slate-400 px-5 py-3 font-bold text-slate-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
              >
                Yêu cầu bổ sung bằng chứng
              </button>
            </div>
          </article>

          <OfficerCaseTimeline items={caseDetail.timeline} />
        </aside>
      </section>
    </div>
  );
}
