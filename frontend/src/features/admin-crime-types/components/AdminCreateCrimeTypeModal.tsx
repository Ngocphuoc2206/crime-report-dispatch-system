"use client";

import { useState } from "react";
import type {
  AdminCrimeType,
  AdminCrimeTypeStatus,
} from "@/features/admin-crime-types/types/adminCrimeType.types";

type AdminCreateCrimeTypeModalProps = {
  open: boolean;
  nextId: number;
  onClose: () => void;
  onCreate: (crimeType: AdminCrimeType) => void;
};

export function AdminCreateCrimeTypeModal({
  open,
  nextId,
  onClose,
  onCreate,
}: AdminCreateCrimeTypeModalProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [baseScore, setBaseScore] = useState("");
  const [status, setStatus] = useState<AdminCrimeTypeStatus>("ACTIVE");

  if (!open) return null;

  const canSubmit =
    code.trim().length > 0 &&
    name.trim().length > 0 &&
    description.trim().length > 0 &&
    Number(categoryId) > 0 &&
    Number(baseScore) >= 0 &&
    Number(baseScore) <= 100;

  function handleSubmit() {
    if (!canSubmit) return;

    const newCrimeType: AdminCrimeType = {
      id: nextId,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      categoryId: Number(categoryId),
      baseScore: Number(baseScore),
      status,
    };

    onCreate(newCrimeType);

    setCode("");
    setName("");
    setDescription("");
    setCategoryId("");
    setBaseScore("");
    setStatus("ACTIVE");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
      <section className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-7 py-5">
          <div>
            <h2 className="section-title">
              Tạo loại tội phạm
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Khai báo danh mục nghiệp vụ dùng khi người dân gửi tin báo.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-3xl text-slate-500 hover:text-slate-950"
          >
            ×
          </button>
        </header>

        <div className="p-7">
          <div className="grid gap-5 md:grid-cols-2">
            <label>
              <span className="text-sm font-black text-slate-700">
                Mã loại <span className="text-[var(--primary)]">*</span>
              </span>

              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="VD: TC02"
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none 
                focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
              />
            </label>

            <label>
              <span className="text-sm font-black text-slate-700">
                Tên loại tội phạm <span className="text-[var(--primary)]">*</span>
              </span>

              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="VD: Lừa đảo qua mạng"
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
              />
            </label>
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-black text-slate-700">
              Mô tả <span className="text-[var(--primary)]">*</span>
            </span>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              placeholder="Mô tả ngắn về loại tội phạm này..."
              className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-4 py-3 
              outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
            />
          </label>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <label>
              <span className="text-sm font-black text-slate-700">
                Category ID <span className="text-[var(--primary)]">*</span>
              </span>

              <input
                type="number"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                placeholder="VD: 40"
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none 
                focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
              />
            </label>

            <label>
              <span className="text-sm font-black text-slate-700">
                Điểm cơ sở <span className="text-[var(--primary)]">*</span>
              </span>

              <input
                type="number"
                min={0}
                max={100}
                value={baseScore}
                onChange={(event) => setBaseScore(event.target.value)}
                placeholder="0 - 100"
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
              />

              <p className="mt-1 text-xs text-slate-500">
                Điểm dùng làm đầu vào cho quy tắc nguy cấp.
              </p>
            </label>

            <label>
              <span className="text-sm font-black text-slate-700">
                Trạng thái
              </span>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as AdminCrimeTypeStatus)
                }
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-red-100"
              >
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Ngừng hoạt động</option>
              </select>
            </label>
          </div>

          <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm leading-6 text-slate-700">
              <strong>Lưu ý:</strong> Loại tội phạm sau khi tạo sẽ xuất hiện ở
              form gửi tin báo của người dân và có thể ảnh hưởng đến thuật toán
              phân loại mức độ nguy cấp.
            </p>
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-7 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-5 py-3 font-black text-slate-700 hover:bg-slate-50"
          >
            Hủy
          </button>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="rounded-lg bg-[var(--primary)] px-5 py-3 font-black text-white hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            + Tạo loại tội phạm
          </button>
        </footer>
      </section>
    </div>
  );
}
