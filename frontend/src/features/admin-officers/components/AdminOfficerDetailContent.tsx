"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminEditOfficerModal } from "@/features/admin-officers/components/AdminEditOfficerModal";
import { AdminOfficerStatusBadge } from "@/features/admin-officers/components/AdminOfficerBadges";
import { adminOfficerProfiles } from "@/features/admin-officers/data/adminOfficers.data";
import { adminOfficerService } from "@/features/admin-officers/services/adminOfficerService";
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
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  async function loadOfficer() {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await adminOfficerService.getDetail(officerId);
      setOfficer(response);
    } catch {
      setOfficer(initialOfficer);
      setApiError(
        "Khong ket noi duoc backend admin officer detail. Dang hien thi du lieu mau.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadOfficer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [officerId]);

  if (isLoading) {
    return (
      <div className="px-8 py-8">
        <section className="rounded-xl border border-slate-200 bg-white p-8 text-center font-semibold text-slate-600 shadow-sm">
          Dang tai ho so can bo...
        </section>
      </div>
    );
  }

  if (!officer) {
    return (
      <div className="px-8 py-8">
        <section className="rounded-xl border border-red-200 bg-white p-8">
          <h1 className="text-2xl font-black text-[var(--primary)]">
            Khong tim thay ho so can bo
          </h1>

          <Link
            href="/admin/officers"
            className="mt-6 inline-flex rounded-lg bg-[var(--primary)] px-5 py-3 font-black text-white"
          >
            Quay lai danh sach
          </Link>
        </section>
      </div>
    );
  }

  function handleSaveOfficer(updatedOfficer: AdminOfficerProfile) {
    void adminOfficerService
      .update(updatedOfficer)
      .then((savedOfficer) => {
        setOfficer(savedOfficer);
        setEditModalOpen(false);
        setToast("Cap nhat ho so can bo thanh cong");
        window.setTimeout(() => setToast(null), 2200);
      })
      .catch((updateError) => {
        setApiError(
          updateError instanceof Error
            ? updateError.message
            : "Khong cap nhat duoc ho so can bo.",
        );
      });
  }

  return (
    <div className="relative px-8 py-8">
      {toast ? (
        <div className="fixed bottom-8 right-8 z-50 rounded-xl bg-white px-6 py-4 font-black text-slate-900 shadow-2xl ring-1 ring-slate-200">
          {toast}
        </div>
      ) : null}

      <AdminEditOfficerModal
        open={editModalOpen}
        officer={officer}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveOfficer}
      />

      {apiError ? (
        <section className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-[var(--primary)]">
          {apiError}
        </section>
      ) : null}

      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-500">
            <Link href="/admin/officers" className="hover:text-[var(--primary)]">
              Ho so can bo
            </Link>{" "}
            &gt; Chi tiet
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <h1 className="text-4xl font-black text-slate-950">
              Ho so can bo: {officer.fullName}
            </h1>

            <AdminOfficerStatusBadge status={officer.status} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setEditModalOpen(true)}
          className="rounded-lg bg-[var(--primary)] px-5 py-3 font-black text-white hover:bg-[var(--primary-hover)]"
        >
          Chinh sua ho so
        </button>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Thong tin ca nhan
            </h2>

            <div className="mt-5 h-px bg-slate-200" />

            <div className="mt-6 grid gap-8 md:grid-cols-[10rem_1fr_1fr]">
              <div className="flex h-36 w-36 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-5xl font-black text-slate-400">
                {officer.fullName.slice(0, 1)}
              </div>

              <dl className="space-y-5">
                <div>
                  <dt className="text-sm text-slate-500">Ho va ten</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {officer.fullName}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-slate-500">Ngay sinh</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {officer.dateOfBirth}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-slate-500">Email noi bo</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {officer.email}
                  </dd>
                </div>
              </dl>

              <dl className="space-y-5">
                <div>
                  <dt className="text-sm text-slate-500">Gioi tinh</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {officer.gender}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-slate-500">So dien thoai</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {officer.phone}
                  </dd>
                </div>
              </dl>
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Thong tin nghiep vu
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
                <dt className="text-sm text-slate-500">So hieu can bo</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {officer.badgeNumber}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">Cap bac</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {officer.rank}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-slate-500">Ngay gia nhap</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {officer.joinedAt}
                </dd>
              </div>

              <div className="md:col-span-2">
                <dt className="text-sm text-slate-500">Don vi cong tac</dt>
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
              Thong ke hieu suat
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-5">
                <span className="text-slate-500">Da xu ly</span>
                <strong className="text-2xl text-slate-950">
                  {officer.performance.processedCases}
                </strong>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-5">
                <span className="text-slate-500">Dung han SLA</span>
                <strong className="text-2xl text-slate-950">
                  {officer.performance.slaRate}
                </strong>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-5">
                <span className="text-slate-500">Danh gia</span>
                <strong className="text-2xl text-slate-950">
                  {officer.performance.rating}
                </strong>
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Ho so gan day
            </h2>

            <div className="mt-5 divide-y divide-slate-200">
              {officer.recentCases.length === 0 ? (
                <p className="py-4 text-sm text-slate-500">
                  Chua co du lieu ho so gan day.
                </p>
              ) : (
                officer.recentCases.map((item) => (
                  <div key={item.code} className="py-4">
                    <p className="font-black text-[var(--primary)]">
                      #{item.code}
                    </p>
                    <p className="mt-2 text-sm text-slate-700">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.updatedAt}
                    </p>
                  </div>
                ))
              )}
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
