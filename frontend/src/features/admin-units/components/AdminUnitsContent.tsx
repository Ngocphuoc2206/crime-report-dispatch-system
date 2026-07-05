"use client";

import { MouseEvent, useEffect, useMemo, useState } from "react";
import { adminUnitService } from "@/features/admin-units/services/adminUnitService";
import type {
  AdminArea,
  AdminPoliceUnit,
  AdminUnitType,
} from "@/features/admin-units/types/adminUnit.types";

const unitTypes: AdminUnitType[] = [
  "WARD_POLICE",
  "DISTRICT_POLICE",
  "CRIMINAL_POLICE",
  "EMERGENCY_CENTER",
];

const pageSize = 10;

const emptyUnit: AdminPoliceUnit = {
  id: "",
  code: "",
  name: "",
  areaId: "",
  areaName: "",
  address: "",
  latitude: "",
  longitude: "",
  unitType: "WARD_POLICE",
  active: true,
};

const locationSuggestions = [
  {
    label:
      "Ga Bến Thành, Pham Ngu Lao Street, Khu phố 19, Bến Thành, TP. Hồ Chí Minh, Việt Nam",
    latitude: "10.7719800",
    longitude: "106.6983200",
  },
  {
    label:
      "Nhà ga Bến Thành, đường Lê Thị Hồng Gấm, Phường Bến Thành, TP. Hồ Chí Minh, Việt Nam",
    latitude: "10.7728400",
    longitude: "106.7001200",
  },
];

function toCoordinate(value: number, min: number, max: number) {
  return (min + (max - min) * value).toFixed(7);
}

function buildOpenStreetMapEmbedUrl(latitude: string, longitude: string) {
  const lat = Number(latitude);
  const lng = Number(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return "";
  }

  const offset = 0.006;
  const bbox = [
    lng - offset,
    lat - offset,
    lng + offset,
    lat + offset,
  ].join(",");

  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}

type AdminCreateUnitModalProps = {
  open: boolean;
  areas: AdminArea[];
  onClose: () => void;
  onCreate: (unit: AdminPoliceUnit) => Promise<void>;
};

function AdminCreateUnitModal({
  open,
  areas,
  onClose,
  onCreate,
}: AdminCreateUnitModalProps) {
  const [draft, setDraft] = useState<AdminPoliceUnit>(emptyUnit);
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const canCreate =
    draft.code.trim().length > 0 &&
    draft.name.trim().length > 0 &&
    draft.areaId.trim().length > 0;

  const markerLeft =
    draft.longitude === ""
      ? 50
      : ((Number(draft.longitude) - 106.62) / (106.78 - 106.62)) * 100;
  const markerTop =
    draft.latitude === ""
      ? 42
      : (1 - (Number(draft.latitude) - 10.72) / (10.84 - 10.72)) * 100;
  const mapEmbedUrl = buildOpenStreetMapEmbedUrl(
    draft.latitude,
    draft.longitude,
  );

  function handleMapClick(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));

    setDraft((current) => ({
      ...current,
      latitude: toCoordinate(1 - y, 10.72, 10.84),
      longitude: toCoordinate(x, 106.62, 106.78),
    }));
  }

  function setCenterHcm() {
    setDraft((current) => ({
      ...current,
      latitude: "10.7769000",
      longitude: "106.7009000",
    }));
  }

  function fillCoordinateFromAddress() {
    const seed = Array.from(draft.address || draft.name || draft.code).reduce(
      (total, char) => total + char.charCodeAt(0),
      0,
    );
    const x = (seed % 100) / 100;
    const y = ((seed * 7) % 100) / 100;

    setDraft((current) => ({
      ...current,
      latitude: toCoordinate(1 - y, 10.72, 10.84),
      longitude: toCoordinate(x, 106.62, 106.78),
    }));
  }

  function selectSuggestion(suggestion: (typeof locationSuggestions)[number]) {
    setDraft((current) => ({
      ...current,
      address: suggestion.label,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
    }));
  }

  function openGoogleMaps() {
    const query =
      draft.latitude && draft.longitude
        ? `${draft.latitude},${draft.longitude}`
        : draft.address || draft.name || "Ho Chi Minh City";
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  async function handleCreate() {
    if (!canCreate || saving) return;

    setSaving(true);
    try {
      await onCreate(draft);
      setDraft(emptyUnit);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <section className="max-h-[94vh] w-full max-w-[520px] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <header className="flex items-center justify-between px-6 pb-3 pt-6">
          <h2 className="text-2xl font-black text-slate-900">
            Thêm đơn vị mới
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-3xl leading-none text-slate-400 hover:text-slate-900"
          >
            ×
          </button>
        </header>

        <div className="space-y-5 px-6 pb-6">
          <label className="block">
            <span className="text-xs font-black uppercase text-slate-500">
              Mã đơn vị
            </span>
            <input
              value={draft.code}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  code: event.target.value,
                }))
              }
              placeholder="Ví dụ: PU_Q2"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase text-slate-500">
              Tên đơn vị
            </span>
            <input
              value={draft.name}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              placeholder="Ví dụ: Công an Phường Bến Nghé"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase text-slate-500">
              Khu vực
            </span>
            <div className="relative mt-2">
              <select
                value={draft.areaId}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    areaId: event.target.value,
                  }))
                }
                className="w-full appearance-none rounded-xl border border-slate-200 px-4 py-3 pr-11 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="">Chọn khu vực</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                ⊙
              </span>
            </div>
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase text-slate-500">
              Loại đơn vị
            </span>
            <select
              value={draft.unitType}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  unitType: event.target.value as AdminUnitType,
                }))
              }
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              {unitTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <section className="rounded-2xl border border-slate-100 bg-slate-50 p-3 shadow-inner">
            <header className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase text-slate-600">
                  Tìm & chọn tọa độ
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Tìm theo địa điểm hoặc click trực tiếp trên bản đồ.
                </p>
              </div>

              <button
                type="button"
                onClick={openGoogleMaps}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm hover:bg-slate-50"
              >
                ↗ Google Maps
              </button>
            </header>

            <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <span className="flex size-5 items-center justify-center rounded-full text-sm text-slate-400">
                ⌕
              </span>
              <input
                value={draft.address}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    address: event.target.value,
                  }))
                }
                placeholder="Tìm địa điểm, ví dụ: Ga Bến Thành"
                className="w-full border-0 bg-transparent py-1.5 text-sm font-semibold text-slate-700 outline-none placeholder:font-normal placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={fillCoordinateFromAddress}
                className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-black text-blue-700 hover:bg-blue-100"
              >
                Tìm
              </button>
            </div>

            {draft.address.trim().length > 0 ? (
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
                {locationSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.label}
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    className={[
                      "flex w-full items-start gap-3 px-3 py-3 text-left text-sm text-slate-600 hover:bg-blue-50",
                      index > 0 ? "border-t border-slate-100" : "",
                    ].join(" ")}
                  >
                    <span className="mt-0.5 text-blue-600">⌖</span>
                    <span>{suggestion.label}</span>
                  </button>
                ))}
              </div>
            ) : null}

            <div
              role="button"
              tabIndex={0}
              onClick={handleMapClick}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  setCenterHcm();
                }
              }}
              className="relative mt-3 h-44 overflow-hidden rounded-xl bg-[#a9d8e2] outline-none ring-1 ring-sky-100"
            >
              {mapEmbedUrl ? (
                <iframe
                  title="Bản đồ vị trí đơn vị"
                  src={mapEmbedUrl}
                  className="pointer-events-none absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.28)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.28)_1px,transparent_1px)] bg-[size:36px_36px]" />
                  <div className="absolute left-[8%] top-[36%] h-4 w-[90%] rotate-[-9deg] rounded-full bg-white/45 shadow-sm" />
                  <div className="absolute left-[30%] top-[-16%] h-[132%] w-4 rotate-[15deg] rounded-full bg-white/35 shadow-sm" />
                  <div className="absolute left-[64%] top-[-12%] h-[128%] w-4 rotate-[-8deg] rounded-full bg-white/35 shadow-sm" />
                  <div className="absolute left-[2%] top-[68%] h-3 w-[72%] rotate-[5deg] rounded-full bg-white/25" />
                  <span className="absolute left-[10%] top-[58%] rotate-[-8deg] text-sm font-semibold text-slate-600/60">
                    Bến Thành
                  </span>
                  <span className="absolute left-[42%] top-[45%] text-xs font-semibold text-slate-600/50">
                    Khu phố 10
                  </span>
                  <span className="absolute right-[12%] top-[62%] rotate-[-18deg] text-xs font-semibold text-slate-600/50">
                    Sông Sài Gòn
                  </span>
                </>
              )}

              <div className="absolute right-3 top-3 z-20 flex overflow-hidden rounded-lg bg-white shadow">
                <button
                  type="button"
                  onClick={(event) => event.stopPropagation()}
                  className="px-3 py-2 text-lg font-black text-slate-700 hover:bg-slate-50"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={(event) => event.stopPropagation()}
                  className="border-l border-slate-200 px-3 py-2 text-lg font-black text-slate-700 hover:bg-slate-50"
                >
                  −
                </button>
              </div>

              <div
                style={{
                  left: `${Math.min(94, Math.max(6, markerLeft))}%`,
                  top: `${Math.min(90, Math.max(10, markerTop))}%`,
                }}
                className="absolute z-10 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-base font-black text-white shadow-xl shadow-blue-700/30 ring-[12px] ring-blue-500/10"
              >
                ↕
              </div>

              <span className="absolute bottom-2 right-2 rounded-md bg-white/90 px-2 py-1 text-xs font-bold text-slate-500">
                OpenStreetMap
              </span>
            </div>

            <button
              type="button"
              onClick={setCenterHcm}
              className="mt-3 text-sm font-black text-blue-600 hover:text-blue-700"
            >
              ⊕ Đặt về trung tâm TP.HCM
            </button>
          </section>

          <section>
            <p className="text-xs font-black uppercase text-slate-500">
              Tọa độ GPS
            </p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-3">
                <span className="text-xs font-black text-slate-400">LAT</span>
                <input
                  value={draft.latitude}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      latitude: event.target.value,
                    }))
                  }
                  placeholder="10.7769"
                  className="w-full border-0 bg-transparent text-sm font-semibold text-slate-600 outline-none"
                />
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-3">
                <span className="text-xs font-black text-slate-400">LONG</span>
                <input
                  value={draft.longitude}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      longitude: event.target.value,
                    }))
                  }
                  placeholder="106.7009"
                  className="w-full border-0 bg-transparent text-sm font-semibold text-slate-600 outline-none"
                />
              </label>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Có thể dán trực tiếp cặp tọa độ từ bản đồ, ví dụ: 10.7769,
              106.7009.
            </p>
          </section>

          <section className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="font-black text-slate-900">Trạng thái</p>
              <p className="text-sm text-slate-500">
                Kích hoạt đơn vị ngay khi thêm
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  active: !current.active,
                }))
              }
              className={[
                "relative h-7 w-12 rounded-full transition",
                draft.active ? "bg-blue-600" : "bg-slate-300",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute top-1 size-5 rounded-full bg-white shadow transition",
                  draft.active ? "left-6" : "left-1",
                ].join(" ")}
              />
            </button>
          </section>
        </div>

        <footer className="flex justify-end gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-5 py-3 font-black text-slate-600 hover:bg-slate-50"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={!canCreate || saving}
            onClick={() => void handleCreate()}
            className="rounded-xl bg-blue-600 px-6 py-3 font-black text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            {saving ? "Đang thêm..." : "Thêm đơn vị"}
          </button>
        </footer>
      </section>
    </div>
  );
}

export function AdminUnitsContent() {
  const [units, setUnits] = useState<AdminPoliceUnit[]>([]);
  const [areas, setAreas] = useState<AdminArea[]>([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      const [unitData, areaData] = await Promise.all([
        adminUnitService.getUnits(),
        adminUnitService.getAreas(),
      ]);
      setUnits(unitData);
      setAreas(areaData);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Không tải được danh sách đơn vị",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData();
  }, []);

  const filteredUnits = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return units.filter(
      (unit) =>
        q === "" ||
        unit.code.toLowerCase().includes(q) ||
        unit.name.toLowerCase().includes(q) ||
        unit.areaName.toLowerCase().includes(q),
    );
  }, [units, keyword]);

  const totalPages = Math.max(1, Math.ceil(filteredUnits.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pagedUnits = filteredUnits.slice(pageStart, pageStart + pageSize);
  const visibleStart = filteredUnits.length === 0 ? 0 : pageStart + 1;
  const visibleEnd = Math.min(
    pageStart + pagedUnits.length,
    filteredUnits.length,
  );

  async function handleCreate(unit: AdminPoliceUnit) {
    const created = await adminUnitService.create(unit);
    setUnits((current) => [created, ...current]);
    setPage(1);
    setToast("Tạo đơn vị thành công");
    window.setTimeout(() => setToast(null), 2200);
  }

  return (
    <div className="relative px-8 py-8">
      {toast ? (
        <div className="fixed bottom-8 right-8 z-50 rounded-xl bg-white px-6 py-4 font-black text-slate-900 shadow-2xl ring-1 ring-slate-200">
          {toast}
        </div>
      ) : null}

      <AdminCreateUnitModal
        open={modalOpen}
        areas={areas}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />

      <section className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-950">
            Quản lý đơn vị công an
          </h1>
          <p className="mt-3 text-slate-600">
            Tạo đơn vị trước, sau đó mới gán cán bộ vào đơn vị khi lập hồ sơ
            cán bộ.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-[var(--primary)] px-5 py-3 font-black text-white shadow-sm hover:bg-[var(--primary-hover)]"
        >
          + Thêm đơn vị
        </button>
      </section>

      {error ? (
        <section className="mt-6 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm font-semibold text-[var(--primary)]">
          {error}
        </section>
      ) : null}

      <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
        <header className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              Danh sách đơn vị
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredUnits.length} trong số {units.length} đơn vị
            </p>
          </div>
          <input
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value);
              setPage(1);
            }}
            placeholder="Tìm đơn vị"
            className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100 md:max-w-sm"
          />
        </header>

        {loading ? (
          <div className="p-8 text-center font-semibold text-slate-600">
            Đang tải danh sách đơn vị...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-250 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Mã / tên đơn vị</th>
                  <th className="px-6 py-4">Khu vực</th>
                  <th className="px-6 py-4">Loại</th>
                  <th className="px-6 py-4">Tọa độ</th>
                  <th className="px-6 py-4">Trạng thái</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {pagedUnits.map((unit) => (
                  <tr key={unit.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-700">{unit.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-black text-slate-900">{unit.code}</p>
                      <p className="mt-1 text-sm text-slate-500">{unit.name}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {unit.areaName}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {unit.unitType}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {unit.latitude || "--"}, {unit.longitude || "--"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">
                        {unit.active ? "Đang hoạt động" : "Tạm dừng"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <footer className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>
            Hiển thị {visibleStart}-{visibleEnd} trong số{" "}
            {filteredUnits.length} đơn vị
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="rounded-md px-3 py-2 font-black text-slate-600 disabled:cursor-not-allowed disabled:text-slate-300"
            >
              &lt;
            </button>

            <span className="rounded-md bg-[var(--primary)] px-3 py-2 font-black text-white">
              {currentPage}
            </span>

            <span className="px-2 text-slate-500">/ {totalPages}</span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              className="rounded-md px-3 py-2 font-black text-slate-600 disabled:cursor-not-allowed disabled:text-slate-300"
            >
              &gt;
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
