"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AdminEditOfficerModal } from "@/features/admin-officers/components/AdminEditOfficerModal";
import { AdminOfficerStatusBadge } from "@/features/admin-officers/components/AdminOfficerBadges";
import { adminOfficerProfiles } from "@/features/admin-officers/data/adminOfficers.data";
import type { AdminOfficerProfile } from "@/features/admin-officers/types/adminOfficer.types";

type AdminOfficerDetailContentProps = {
  officerId: string;
};

function findOfficer(officerId: string) {
  return adminOfficerProfiles.find((item) => item.officerId === officerId);
}

export function AdminOfficerDetailContent({
  officerId,
}: AdminOfficerDetailContentProps) {
  const initialOfficer = useMemo(() => findOfficer(officerId), [officerId]);
  const [officer, setOfficer] = useState<AdminOfficerProfile | undefined>(
    initialOfficer,
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  if (!officer) {
    return (
      <div className="px-8 py-8">
        <section className="rounded-xl border border-red-200 bg-white p-8">
          <h1 className="text-2xl font-black text-[var(--primary)]">
            Không tìm thấy hồ sơ cán bộ
          </h1>

          <Link
            href="/admin/officers"
            className="mt-6 inline-flex rounded-lg bg-[var(--primary)] px-5 py-3 font-black text-white"
          >
            Quay lại danh sách
          </Link>
        </section>
      </div>
    );
  }

  function handleSaveOfficer(updatedOfficer: AdminOfficerProfile) {
    setOfficer(updatedOfficer);
    setEditModalOpen(false);
    setToast("Cập nhật hồ sơ cán bộ thành công");

    window.setTimeout(() => {
      setToast(null);
    }, 2200);
  }

  return (
    <div className="relative px-8 py-8">
      {toast ? (
        <div className="fixed bottom-8 right-8 z-50 rounded-xl bg-white px-6 py-4 font-black text-slate-900 shadow-2xl ring-1 ring-slate-200">
          ✓ {toast}
        </div>
      ) : null}

      <AdminEditOfficerModal
        open={editModalOpen}
        officer={officer}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveOfficer}
      />

      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-500">
            <Link
              href="/admin/officers"
              className="hover:text-[var(--primary)]"
            >
              Hồ sơ cán bộ
            </Link>{" "}
            › Chi tiết
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <h1 className="text-4xl font-black text-slate-950">
              Hồ sơ cán bộ: {officer.fullName}
            </h1>

            <AdminOfficerStatusBadge status={officer.status} />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="rounded-lg border border-red-200 bg-white px-5 py-3 font-black text-slate-800 hover:bg-red-50"
          >
            Khóa tài khoản
          </button>

          <button
            type="button"
            onClick={() => setEditModalOpen(true)}
            className="rounded-lg bg-[var(--primary)] px-5 py-3 font-black text-white hover:bg-[var(--primary-hover)]"
          >
            Chỉnh sửa hồ sơ
          </button>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Thông tin cá nhân
            </h2>

            <div className="mt-5 h-px bg-slate-200" />

            <div className="mt-6 grid gap-8 md:grid-cols-[10rem_1fr_1fr]">
              <div className="flex h-36 w-36 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-5xl font-black text-slate-400">
                {officer.fullName.slice(0, 1)}
              </div>

              <dl className="space-y-5">
                <div>
                  <dt className="text-sm text-slate-500">Họ và tên</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {officer.fullName}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-slate-500">Ngày sinh</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {officer.dateOfBirth}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-slate-500">Email nội bộ</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {officer.email}
                  </dd>
                </div>
              </dl>

              <dl className="space-y-5">
                <div>
                  <dt className="text-sm text-slate-500">Giới tính</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {officer.gender}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-slate-500">Số điện thoại</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {officer.phone}
                  </dd>
                </div>
              </dl>
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Thông tin nghiệp vụ
            </h2>

            <div className="mt-5 h-px bg-slate-200" />

            <dl className="mt-6 grid gap-8 md:grid-cols-2">
              <div>
                <dt className="text-sm text-slate-500">Officer ID</dt>
                <dd className="mt-1 inline-flex rounded bg-slate-100 px-3 py-1 font-semibold text-slate-900">
                  {officer.officerId}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">Số hiệu cán bộ</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {officer.badgeNumber}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">Cấp bậc</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {officer.rank}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">
                  Ngày gia nhập hệ thống
                </dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {officer.joinedAt}
                </dd>
              </div>

              <div className="md:col-span-2">
                <dt className="text-sm text-slate-500">Đơn vị công tác</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {officer.unitName}
                </dd>
              </div>
            </dl>
          </article>
        </div>

        <aside className="space-y-6">
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Thống kê hiệu suất
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-5">
                <span className="text-slate-500">Đã xử lý</span>
                <strong className="text-2xl text-slate-950">
                  {officer.performance.processedCases}
                </strong>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-5">
                <span className="text-slate-500">Đúng hạn SLA</span>
                <strong className="text-2xl text-slate-950">
                  {officer.performance.slaRate}
                </strong>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-5">
                <span className="text-slate-500">Đánh giá</span>
                <strong className="text-2xl text-slate-950">
                  {officer.performance.rating}
                </strong>
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-950">
                Hồ sơ gần đây
              </h2>

              <button className="text-sm font-black text-[var(--primary)]">
                Xem tất cả
              </button>
            </div>

            <div className="mt-5 divide-y divide-slate-200">
              {officer.recentCases.map((item) => (
                <div key={item.code} className="py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black text-[var(--primary)]">
                      #{item.code}
                    </p>

                    <span
                      className={[
                        "rounded px-2 py-1 text-xs font-black",
                        item.status === "COMPLETED"
                          ? "bg-green-50 text-green-700"
                          : "bg-yellow-50 text-yellow-700",
                      ].join(" ")}
                    >
                      {item.status === "COMPLETED"
                        ? "Hoàn thành"
                        : "Đang xử lý"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-700">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.updatedAt}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
