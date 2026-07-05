"use client";

import { useEffect, useMemo, useState } from "react";
import { DispatcherMapCasePanel } from "@/features/dispatcher-map/components/DispatcherMapCasePanel";
import { DispatcherMapCanvas } from "@/features/dispatcher-map/components/DispatcherMapCanvas";
import { dispatcherMapService } from "@/features/dispatcher-map/services/dispatcherMapService";
import type {
  DispatcherMapCase,
  DispatcherMapPriority,
  DispatcherMapUnit,
} from "@/features/dispatcher-map/types/dispatcherMap.types";

type PriorityFilter = "ALL" | DispatcherMapPriority;

export function DispatcherMapContent() {
  const [cases, setCases] = useState<DispatcherMapCase[]>([]);
  const [units, setUnits] = useState<DispatcherMapUnit[]>([]);
  const [keyword, setKeyword] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("ALL");
  const [districtFilter, setDistrictFilter] = useState("ALL");
  const [selectedCase, setSelectedCase] = useState<DispatcherMapCase | null>(null);

  const filteredCases = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return cases.filter((item) => {
      const matchKeyword =
        q === "" ||
        item.caseCode.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q);

      const matchPriority =
        priorityFilter === "ALL" || item.priority === priorityFilter;

      const matchDistrict =
        districtFilter === "ALL" || item.district === districtFilter;

      return matchKeyword && matchPriority && matchDistrict;
    });
  }, [cases, keyword, priorityFilter, districtFilter]);

  const criticalCount = filteredCases.filter(
    (item) => item.priority === "CRITICAL",
  ).length;

  useEffect(() => {
    let ignore = false;

    async function loadMapData() {
      try {
        const [caseData, unitData] = await Promise.all([
          dispatcherMapService.getCases(),
          dispatcherMapService.getUnits(),
        ]);

        if (!ignore) {
          setCases(caseData);
          setUnits(unitData);
          setSelectedCase(caseData[0] ?? null);
        }
      } catch {
        if (!ignore) {
          setCases([]);
          setUnits([]);
          setSelectedCase(null);
        }
      }
    }

    void loadMapData();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="px-8 py-8">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-950">
            Bản đồ điều phối
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            Theo dõi vị trí tin báo và đơn vị xử lý để hỗ trợ quyết định điều
            phối nhanh.
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <p className="text-sm font-bold text-red-900/70">Tin khẩn cấp</p>
          <p className="mt-1 text-3xl font-black text-[var(--primary)]">
            {criticalCount}
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-red-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.7fr_0.7fr_auto]">
          <label>
            <span className="text-sm font-bold text-slate-600">
              Tìm kiếm tin báo
            </span>

            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm theo mã tin, địa điểm, nội dung..."
              className="mt-2 w-full rounded-lg border border-red-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
            />
          </label>

          <label>
            <span className="text-sm font-bold text-slate-600">Mức độ</span>

            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value as PriorityFilter)
              }
              className="mt-2 w-full rounded-lg border border-red-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
            >
              <option value="ALL">Tất cả mức độ</option>
              <option value="CRITICAL">Khẩn cấp</option>
              <option value="HIGH">Cao</option>
              <option value="MEDIUM">Trung bình</option>
              <option value="LOW">Thấp</option>
            </select>
          </label>

          <label>
            <span className="text-sm font-bold text-slate-600">Khu vực</span>

            <select
              value={districtFilter}
              onChange={(event) => setDistrictFilter(event.target.value)}
              className="mt-2 w-full rounded-lg border border-red-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
            >
              <option value="ALL">Tất cả khu vực</option>
              <option value="Quận 1">Quận 1</option>
              <option value="Quận 3">Quận 3</option>
              <option value="Quận Thanh Xuân">Quận Thanh Xuân</option>
              <option value="Hoàn Kiếm">Hoàn Kiếm</option>
            </select>
          </label>

          <button
            type="button"
            onClick={() => {
              setKeyword("");
              setPriorityFilter("ALL");
              setDistrictFilter("ALL");
              setSelectedCase(cases[0] ?? null);
            }}
            className="self-end rounded-lg border border-red-200 px-5 py-3 font-black text-slate-700 hover:bg-red-50"
          >
            Đặt lại
          </button>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_26rem]">
        <DispatcherMapCanvas
          cases={filteredCases}
          units={units}
          selectedCaseId={selectedCase?.id ?? null}
          onSelectCase={setSelectedCase}
        />

        <DispatcherMapCasePanel selectedCase={selectedCase} />
      </section>
    </div>
  );
}
