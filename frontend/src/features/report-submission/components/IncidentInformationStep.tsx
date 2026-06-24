"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EmergencyFlagCard } from "@/features/report-submission/components/EmergencyFlagCard";
import { ReportStepIndicator } from "@/features/report-submission/components/ReportStepIndicator";
import { reportDraftStorage } from "@/features/report-submission/services/reportDraftStorage";
import type { IncidentInformationDraft } from "@/features/report-submission/types/reportSubmission.types";

type IncidentErrors = Partial<Record<keyof IncidentInformationDraft, string>>;

const quickTags = [
  "Trộm cắp",
  "Cướp giật",
  "Hành hung",
  "Lừa đảo",
  "Gây rối",
  "Ma túy",
];

const initialForm: IncidentInformationDraft = {
  description: "",
  incidentTime: "",
  timeUnknown: false,
  address: "",
  latitude: "",
  longitude: "",
  estimatedCrimeType: "",
  isHappeningNow: false,
  hasWeapon: false,
  hasInjured: false,
  tags: [],
};

function validateIncidentForm(form: IncidentInformationDraft) {
  const errors: IncidentErrors = {};

  if (!form.description.trim()) {
    errors.description = "Vui lòng mô tả sự việc.";
  } else if (form.description.trim().length < 30) {
    errors.description =
      "Mô tả nên có ít nhất 30 ký tự để cơ quan chức năng nắm được nội dung.";
  }

  if (!form.timeUnknown && !form.incidentTime) {
    errors.incidentTime =
      "Vui lòng chọn thời gian xảy ra hoặc đánh dấu không nhớ chính xác.";
  }

  if (!form.address.trim()) {
    errors.address = "Vui lòng nhập địa điểm xảy ra sự việc.";
  }

  const latitude = Number(form.latitude);

  if (!form.latitude.trim()) {
    errors.latitude = "Vui lòng nhập hoặc lấy vĩ độ hiện tại.";
  } else if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    errors.latitude = "Vĩ độ phải nằm trong khoảng -90 đến 90.";
  }

  const longitude = Number(form.longitude);

  if (!form.longitude.trim()) {
    errors.longitude = "Vui lòng nhập hoặc lấy kinh độ hiện tại.";
  } else if (
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    errors.longitude = "Kinh độ phải nằm trong khoảng -180 đến 180.";
  }

  return errors;
}

export function IncidentInformationStep() {
  const router = useRouter();
  const [form, setForm] = useState<IncidentInformationDraft>(initialForm);
  const [errors, setErrors] = useState<IncidentErrors>({});
  const [locationLoading, setLocationLoading] = useState(false);
  const [missingPreviousStep, setMissingPreviousStep] = useState(false);

  useEffect(() => {
    const classificationDraft = reportDraftStorage.getClassification();
    const reporterDraft = reportDraftStorage.getReporterIdentity();
    const incidentDraft = reportDraftStorage.getIncidentInformation();

    if (!classificationDraft || !reporterDraft) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMissingPreviousStep(true);
    }

    if (incidentDraft) {
      setForm(incidentDraft);
      return;
    }

    if (classificationDraft) {
      setForm((current) => ({
        ...current,
        estimatedCrimeType: classificationDraft.crimeTypeName,
      }));
    }
  }, []);

  const canContinue = useMemo(() => {
    return (
      !missingPreviousStep &&
      Object.keys(validateIncidentForm(form)).length === 0
    );
  }, [form, missingPreviousStep]);

  function updateField<K extends keyof IncidentInformationDraft>(
    key: K,
    value: IncidentInformationDraft[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => ({
      ...current,
      [key]: undefined,
    }));
  }

  function toggleTag(tag: string) {
    setForm((current) => {
      const existed = current.tags.includes(tag);

      return {
        ...current,
        tags: existed
          ? current.tags.filter((item) => item !== tag)
          : [...current.tags, tag],
      };
    });
  }

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setErrors((current) => ({
        ...current,
        address: "Trình duyệt không hỗ trợ lấy vị trí hiện tại.",
      }));
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateField("latitude", String(position.coords.latitude));
        updateField("longitude", String(position.coords.longitude));
        setLocationLoading(false);
      },
      () => {
        setErrors((current) => ({
          ...current,
          address: "Không thể lấy vị trí hiện tại. Vui lòng nhập thủ công.",
        }));
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  }

  function handleContinue() {
    if (missingPreviousStep) return;

    const nextErrors = validateIncidentForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    reportDraftStorage.saveIncidentInformation(form);
    router.push("/report/evidence");
  }

  return (
    <div className="bg-(--background)">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <ReportStepIndicator currentStep={3} />

        {missingPreviousStep ? (
          <div className="mt-10 rounded-md border border-yellow-200 bg-yellow-50 px-5 py-4 text-sm leading-6 text-yellow-800">
            Bạn chưa hoàn thành các bước trước. Vui lòng kiểm tra lại phần phân
            loại và thông tin người tố giác trước khi tiếp tục.
          </div>
        ) : null}

        <section className="mt-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900 md:text-3xl">
              Bước 3: Thông tin sự việc
            </h1>

            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Vui lòng mô tả rõ nội dung, thời gian và địa điểm xảy ra sự việc.
              Thông tin càng cụ thể thì quá trình tiếp nhận, xác minh và xử lý
              càng thuận lợi.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-6">
              <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Mô tả sự việc
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Hãy mô tả những gì bạn chứng kiến, đối tượng liên quan,
                      hành vi, phương tiện, biển số hoặc đặc điểm nhận dạng nếu
                      có.
                    </p>
                  </div>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    Bảo mật
                  </span>
                </div>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Ví dụ: Tôi phát hiện một nhóm đối tượng đang cố phá khóa xe máy tại..."
                  rows={9}
                  className={[
                    "mt-5 w-full resize-none rounded-md border bg-white px-4 py-3 text-base leading-7 text-slate-900 outline-none transition placeholder:text-slate-400",
                    errors.description
                      ? "border-red-400 focus:border-(--primary) focus:ring-4 focus:ring-red-100"
                      : "border-(--border) focus:border-(--primary) focus:ring-4 focus:ring-red-100",
                  ].join(" ")}
                />

                <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                  <p className="text-slate-500">
                    Tối thiểu 30 ký tự. Hiện tại:{" "}
                    {form.description.trim().length}
                  </p>

                  {errors.description ? (
                    <p className="text-(--primary)">{errors.description}</p>
                  ) : null}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {quickTags.map((tag) => {
                    const selected = form.tags.includes(tag);

                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={[
                          "rounded-full border px-4 py-2 text-sm font-medium transition",
                          selected
                            ? "border-(--primary) bg-red-50 text-(--primary)"
                            : "border-(--border) bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-(--primary)",
                        ].join(" ")}
                      >
                        + {tag}
                      </button>
                    );
                  })}
                </div>
              </article>

              <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                  Thời gian và loại vụ việc
                </h2>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">
                      Thời gian xảy ra{" "}
                      <span className="text-(--primary)">*</span>
                    </span>

                    <input
                      type="datetime-local"
                      value={form.incidentTime}
                      disabled={form.timeUnknown}
                      onChange={(event) =>
                        updateField("incidentTime", event.target.value)
                      }
                      className={[
                        "mt-2 w-full rounded-md border bg-white px-4 py-3 text-base text-slate-900 outline-none transition disabled:bg-slate-100 disabled:text-slate-400",
                        errors.incidentTime
                          ? "border-red-400 focus:border-(--primary) focus:ring-4 focus:ring-red-100"
                          : "border-(--border) focus:border-(--primary) focus:ring-4 focus:ring-red-100",
                      ].join(" ")}
                    />

                    {errors.incidentTime ? (
                      <span className="mt-1 block text-sm text-(--primary)">
                        {errors.incidentTime}
                      </span>
                    ) : null}
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">
                      Loại tội phạm ước tính
                    </span>

                    <input
                      value={form.estimatedCrimeType}
                      onChange={(event) =>
                        updateField("estimatedCrimeType", event.target.value)
                      }
                      placeholder="Ví dụ: Trật tự xã hội"
                      className="mt-2 w-full rounded-md border border-(--border) bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-(--primary) focus:ring-4 focus:ring-red-100"
                    />
                  </label>
                </div>

                <label className="mt-4 flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.timeUnknown}
                    onChange={(event) => {
                      updateField("timeUnknown", event.target.checked);

                      if (event.target.checked) {
                        updateField("incidentTime", "");
                      }
                    }}
                    className="size-5 rounded border-slate-300 accent-(--primary)"
                  />

                  <span className="text-sm text-slate-700">
                    Tôi không nhớ chính xác thời gian xảy ra
                  </span>
                </label>
              </article>

              <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                  Tình trạng khẩn cấp
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Các thông tin này giúp hệ thống ưu tiên xử lý tin báo nguy
                  hiểm.
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <EmergencyFlagCard
                    label="Đang xảy ra"
                    description="Vụ việc vẫn đang diễn ra tại hiện trường."
                    checked={form.isHappeningNow}
                    onChange={(checked) =>
                      updateField("isHappeningNow", checked)
                    }
                  />

                  <EmergencyFlagCard
                    label="Có vũ khí"
                    description="Đối tượng có dao, súng, hung khí hoặc vật nguy hiểm."
                    checked={form.hasWeapon}
                    onChange={(checked) => updateField("hasWeapon", checked)}
                  />

                  <EmergencyFlagCard
                    label="Có người bị thương"
                    description="Có nạn nhân bị thương hoặc cần hỗ trợ y tế."
                    checked={form.hasInjured}
                    onChange={(checked) => updateField("hasInjured", checked)}
                  />
                </div>
              </article>
            </div>

            <aside className="space-y-6">
              <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                  Vị trí hiện trường
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Nhập địa chỉ hoặc sử dụng vị trí hiện tại. Nếu chưa tích hợp
                  bản đồ, có thể nhập vĩ độ và kinh độ thủ công.
                </p>

                <div className="mt-5 h-64 overflow-hidden rounded-lg border border-(--border) bg-[linear-gradient(135deg,#eef6ff,#f8fafc)]">
                  <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                    <span className="text-4xl">📍</span>
                    <p className="mt-3 font-semibold text-slate-800">
                      Khu vực bản đồ
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Có thể tích hợp Leaflet/Google Maps ở issue riêng. Hiện
                      tại dùng địa chỉ + tọa độ thủ công.
                    </p>
                  </div>
                </div>

                <label className="mt-5 block">
                  <span className="text-sm font-semibold text-slate-700">
                    Địa chỉ xảy ra <span className="text-(--primary)">*</span>
                  </span>

                  <input
                    value={form.address}
                    onChange={(event) =>
                      updateField("address", event.target.value)
                    }
                    placeholder="Nhập địa chỉ, tuyến đường, phường/xã..."
                    className={[
                      "mt-2 w-full rounded-md border bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400",
                      errors.address
                        ? "border-red-400 focus:border-(--primary) focus:ring-4 focus:ring-red-100"
                        : "border-(--border) focus:border-(--primary) focus:ring-4 focus:ring-red-100",
                    ].join(" ")}
                  />

                  {errors.address ? (
                    <span className="mt-1 block text-sm text-(--primary)">
                      {errors.address}
                    </span>
                  ) : null}
                </label>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">
                      Vĩ độ <span className="text-(--primary)">*</span>
                    </span>

                    <input
                      value={form.latitude}
                      onChange={(event) =>
                        updateField("latitude", event.target.value)
                      }
                      placeholder="21.0278"
                      className="mt-2 w-full rounded-md border border-(--border) bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-(--primary) focus:ring-4 focus:ring-red-100"
                    />

                    {errors.latitude ? (
                      <span className="mt-1 block text-sm text-(--primary)">
                        {errors.latitude}
                      </span>
                    ) : null}
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">
                      Kinh độ <span className="text-(--primary)">*</span>
                    </span>

                    <input
                      value={form.longitude}
                      onChange={(event) =>
                        updateField("longitude", event.target.value)
                      }
                      placeholder="105.8342"
                      className="mt-2 w-full rounded-md border border-(--border) bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-(--primary) focus:ring-4 focus:ring-red-100"
                    />

                    {errors.longitude ? (
                      <span className="mt-1 block text-sm text-(--primary)">
                        {errors.longitude}
                      </span>
                    ) : null}
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={locationLoading}
                  className="mt-5 w-full rounded-md border border-sky-700 px-5 py-3 font-semibold text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {locationLoading
                    ? "Đang lấy vị trí..."
                    : "Lấy vị trí hiện tại"}
                </button>
              </article>

              <article className="rounded-xl border border-red-100 bg-red-50 p-5">
                <h2 className="font-bold text-(--primary)">Lưu ý an toàn</h2>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Nếu vụ việc đang diễn ra, có vũ khí hoặc có người bị thương,
                  hãy ưu tiên gọi ngay đường dây nóng 113 để được hỗ trợ khẩn
                  cấp.
                </p>
              </article>
            </aside>
          </div>

          <div className="mt-10 rounded-xl border border-(--border) bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/report/reporter"
                className="inline-flex items-center justify-center rounded-md border border-slate-500 px-8 py-4 font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                ← Quay lại
              </Link>

              <button
                type="button"
                onClick={handleContinue}
                disabled={!canContinue}
                className="inline-flex items-center justify-center rounded-md bg-(--primary) px-8 py-4 font-semibold text-white transition 
                hover:bg-(--primary-hover) disabled:cursor-not-allowed disabled:bg-red-300"
              >
                Tiếp tục: Đính kèm bằng chứng →
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
