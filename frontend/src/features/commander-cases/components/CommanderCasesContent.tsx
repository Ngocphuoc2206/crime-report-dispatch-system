"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CommanderSeverityBadge,
  CommanderStatusBadge,
} from "@/features/commander-cases/components/CommanderCaseBadges";
import {
  CommanderCaseEmptyState,
  CommanderCaseErrorState,
  CommanderCaseLoadingState,
  CommanderCaseNoResultState,
} from "@/features/commander-cases/components/CommanderCaseListStates";
import { CommanderSessionExpiredModal } from "@/features/commander-cases/components/CommanderSessionExpiredModal";
import { commanderCases } from "@/features/commander-cases/data/commanderCases.data";
import { commanderCaseService } from "@/features/commander-cases/services/commanderCaseService";
import type {
  CommanderCase,
  CommanderCaseSeverity,
  CommanderCaseStatus,
} from "@/features/commander-cases/types/commanderCase.types";

type PageState = "normal" | "loading" | "empty" | "error";
type SeverityFilter = "ALL" | CommanderCaseSeverity;
type StatusFilter = "ALL" | CommanderCaseStatus;

export function CommanderCasesContent() {
  const [pageState, setPageState] = useState<PageState>("normal");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [sessionExpiredOpen, setSessionExpiredOpen] = useState(false);
  const [cases, setCases] = useState<CommanderCase[]>([]);
  const [totalCases, setTotalCases] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);

  async function loadCases() {
    setPageState("loading");
    setApiError(null);

    try {
      const response = await commanderCaseService.getCases({
        status: statusFilter,
        severity: severityFilter,
        keyword: searchTerm,
        size: 50,
      });

      setCases(response.content);
      setTotalCases(response.totalElements);
      setPageState(response.content.length === 0 ? "empty" : "normal");
    } catch {
      setCases(commanderCases);
      setTotalCases(commanderCases.length);
      setApiError("Khong ket noi duoc backend commander cases. Dang hien thi du lieu mau.");
      setPageState("normal");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadCases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCases = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return cases.filter((item) => {
      const matchedKeyword =
        keyword === "" ||
        item.code.toLowerCase().includes(keyword) ||
        item.title.toLowerCase().includes(keyword) ||
        item.shortDescription.toLowerCase().includes(keyword) ||
        item.location.toLowerCase().includes(keyword);

      const matchedStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      const matchedSeverity =
        severityFilter === "ALL" || item.severity === severityFilter;

      return matchedKeyword && matchedStatus && matchedSeverity;
    });
  }, [cases, searchTerm, statusFilter, severityFilter]);

  function handleReset() {
    setStatusFilter("ALL");
    setSeverityFilter("ALL");
    setSearchTerm("");
    setPageState("normal");
    void commanderCaseService
      .getCases({ size: 50 })
      .then((response) => {
        setCases(response.content);
        setTotalCases(response.totalElements);
      })
      .catch(() => {
        setCases(commanderCases);
        setTotalCases(commanderCases.length);
      });
  }

  function handleRetry() {
    setPageState("loading");

    window.setTimeout(() => {
      setPageState("normal");
    }, 900);
  }

  return (
    <div className="px-8 py-8">
      <CommanderSessionExpiredModal
        open={sessionExpiredOpen}
        onCancel={() => setSessionExpiredOpen(false)}
        onRelock={() => setSessionExpiredOpen(false)}
      />

      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-950">
            Danh sach ho so
          </h1>

          <p className="mt-3 text-slate-600">
            Tra cuu va giam sat tien do xu ly tin bao tren toan he thong.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setPageState("loading")}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            Test loading
          </button>

          <button
            type="button"
            onClick={() => setPageState("empty")}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            Test empty
          </button>

          <button
            type="button"
            onClick={() => setPageState("error")}
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-[var(--primary)] hover:bg-white"
          >
            Test error
          </button>

          <button
            type="button"
            onClick={() => setSessionExpiredOpen(true)}
            className="rounded-lg bg-[var(--primary)] px-4 py-3 text-sm font-bold text-white hover:bg-[var(--primary-hover)]"
          >
            Test het phien
          </button>
        </div>
      </section>

      {apiError ? (
        <section className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-[var(--primary)]">
          {apiError}
        </section>
      ) : null}

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1.4fr_auto_auto]">
          <label className="block">
            <span className="text-sm font-bold text-slate-600">
              Trang thai
            </span>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
            >
              <option value="ALL">Tat ca trang thai</option>
              <option value="NEW">Moi tiep nhan</option>
              <option value="PROCESSING">Dang xu ly</option>
              <option value="VERIFYING">Dang xac minh</option>
              <option value="INVESTIGATING">Dieu tra</option>
              <option value="RESOLVED">Da giai quyet</option>
              <option value="SPAM_OR_FAKE">Spam / Fake</option>
              <option value="CLOSED">Da ket thuc</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-600">
              Muc nguy cap
            </span>

            <select
              value={severityFilter}
              onChange={(event) =>
                setSeverityFilter(event.target.value as SeverityFilter)
              }
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
            >
              <option value="ALL">Tat ca muc do</option>
              <option value="CRITICAL">Khan cap</option>
              <option value="HIGH">Cao</option>
              <option value="MEDIUM">Trung binh</option>
              <option value="LOW">Thap</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-600">Tim kiem</span>

            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tim ma ho so, dia diem, mo ta..."
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
            />
          </label>

          <button
            type="button"
            onClick={() => void loadCases()}
            className="self-end rounded-md bg-[var(--primary)] px-5 py-3 font-bold text-white hover:bg-[var(--primary-hover)]"
          >
            Ap dung
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="self-end rounded-md border border-slate-200 px-5 py-3 font-bold text-slate-600 hover:bg-slate-50"
          >
            Dat lai
          </button>
        </div>
      </section>

      <section className="mt-6">
        {pageState === "loading" ? <CommanderCaseLoadingState /> : null}
        {pageState === "empty" ? <CommanderCaseEmptyState /> : null}
        {pageState === "error" ? (
          <CommanderCaseErrorState onRetry={handleRetry} />
        ) : null}
        {pageState === "normal" && filteredCases.length === 0 ? (
          <CommanderCaseNoResultState onClear={handleReset} />
        ) : null}

        {pageState === "normal" && filteredCases.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Ma tin bao</th>
                    <th className="px-5 py-4">Loai vu viec</th>
                    <th className="px-5 py-4">Mo ta ngan</th>
                    <th className="px-5 py-4">Dia diem</th>
                    <th className="px-5 py-4">Muc nguy cap</th>
                    <th className="px-5 py-4">Trang thai</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {filteredCases.map((item) => (
                    <tr key={item.code} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <Link
                          href={`/commander/cases/${encodeURIComponent(
                            item.code,
                          )}`}
                          className="font-mono font-black text-[var(--primary)] hover:text-[var(--primary-hover)]"
                        >
                          {item.code}
                        </Link>
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {item.category}
                      </td>

                      <td className="max-w-sm px-5 py-4 text-slate-600">
                        <p className="line-clamp-1">{item.shortDescription}</p>
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {item.location}
                      </td>

                      <td className="px-5 py-4">
                        <CommanderSeverityBadge severity={item.severity} />
                      </td>

                      <td className="px-5 py-4">
                        <CommanderStatusBadge status={item.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="flex justify-between border-t border-slate-200 px-5 py-4 text-sm text-slate-600">
              <p>
                Hien thi 1-{filteredCases.length} trong so{" "}
                {totalCases || filteredCases.length} ho so
              </p>

              <p>1-20 trong so 485</p>
            </footer>
          </div>
        ) : null}
      </section>
    </div>
  );
}
