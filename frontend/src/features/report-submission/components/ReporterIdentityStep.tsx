"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PrivacyNotice } from "@/features/report-submission/components/PrivacyNotice";
import { ReporterModeCard } from "@/features/report-submission/components/ReporterModeCard";
import { ReporterTextField } from "@/features/report-submission/components/ReporterTextField";
import { ReportStepIndicator } from "@/features/report-submission/components/ReportStepIndicator";
import { reportDraftStorage } from "@/features/report-submission/services/reportDraftStorage";
import type {
  ReporterIdentityDraft,
  ReporterMode,
} from "@/features/report-submission/types/reportSubmission.types";

type ReporterFormErrors = Partial<Record<keyof ReporterIdentityDraft, string>>;

const initialForm: ReporterIdentityDraft = {
  mode: "identified",
  fullName: "",
  citizenId: "",
  phone: "",
  email: "",
  address: "",
  privacyAccepted: false,
};

function withoutIdentity(
  form: ReporterIdentityDraft,
): ReporterIdentityDraft {
  return {
    ...form,
    mode: "anonymous",
    fullName: "",
    citizenId: "",
    phone: "",
    email: "",
    address: "",
  };
}

function ArrowLeftIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path
        d="M19 12H5m6-6-6 6 6 6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path
        d="M12 17v-6m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function validateReporterForm(form: ReporterIdentityDraft) {
  const errors: ReporterFormErrors = {};

  if (!form.privacyAccepted) {
    errors.privacyAccepted =
      "Bạn cần đồng ý với chính sách bảo vệ dữ liệu cá nhân.";
  }

  if (form.mode === "anonymous") {
    return errors;
  }

  if (!form.fullName.trim()) {
    errors.fullName = "Vui lòng nhập họ và tên.";
  }

  if (!form.citizenId.trim()) {
    errors.citizenId = "Vui lòng nhập số CCCD hoặc định danh cá nhân.";
  } else if (!/^\d{9,12}$/.test(form.citizenId.trim())) {
    errors.citizenId = "Số CCCD/định danh nên gồm 9 đến 12 chữ số.";
  }

  if (!form.phone.trim()) {
    errors.phone = "Vui lòng nhập số điện thoại.";
  } else if (!/^(0|\+84)\d{8,10}$/.test(form.phone.trim())) {
    errors.phone = "Số điện thoại chưa đúng định dạng.";
  }

  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Email chưa đúng định dạng.";
  }

  if (!form.address.trim()) {
    errors.address = "Vui lòng nhập địa chỉ liên hệ.";
  }

  return errors;
}

export function ReporterIdentityStep() {
  const router = useRouter();
  const [form, setForm] = useState<ReporterIdentityDraft>(initialForm);
  const [errors, setErrors] = useState<ReporterFormErrors>({});
  const [missingClassification, setMissingClassification] = useState(false);

  useEffect(() => {
    const classificationDraft = reportDraftStorage.getClassification();
    const reporterDraft = reportDraftStorage.getReporterIdentity();

    if (!classificationDraft) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMissingClassification(true);
    }

    if (reporterDraft && classificationDraft) {
      setForm(
        classificationDraft.anonymous
          ? withoutIdentity(reporterDraft)
          : { ...reporterDraft, mode: "identified" },
      );
      return;
    }

    if (classificationDraft?.anonymous) {
      setForm((current) => ({
        ...current,
        mode: "anonymous",
      }));
    }
  }, []);

  const isAnonymous = form.mode === "anonymous";

  const canContinue = useMemo(() => {
    if (missingClassification) return false;
    if (!form.privacyAccepted) return false;

    if (form.mode === "anonymous") return true;

    return (
      form.fullName.trim() !== "" &&
      form.citizenId.trim() !== "" &&
      form.phone.trim() !== "" &&
      form.address.trim() !== ""
    );
  }, [form, missingClassification]);

  function handleModeChange(mode: ReporterMode) {
    setForm((current) =>
      mode === "anonymous"
        ? withoutIdentity(current)
        : { ...current, mode: "identified" },
    );

    const classificationDraft = reportDraftStorage.getClassification();

    if (classificationDraft) {
      reportDraftStorage.saveClassification({
        ...classificationDraft,
        anonymous: mode === "anonymous",
      });
    }

    setErrors({});
  }

  function handleFieldChange(name: string, value: string) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  }

  function handlePrivacyAcceptedChange(accepted: boolean) {
    setForm((current) => ({
      ...current,
      privacyAccepted: accepted,
    }));

    setErrors((current) => ({
      ...current,
      privacyAccepted: undefined,
    }));
  }

  function handleContinue() {
    const classificationDraft = reportDraftStorage.getClassification();

    if (!classificationDraft) {
      setMissingClassification(true);
      return;
    }

    const nextErrors = validateReporterForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const reporterDraft =
      form.mode === "anonymous" ? withoutIdentity(form) : form;

    reportDraftStorage.saveClassification({
      ...classificationDraft,
      anonymous: reporterDraft.mode === "anonymous",
    });
    reportDraftStorage.saveReporterIdentity(reporterDraft);

    router.push("/report/content");
  }

  return (
    <div className="bg-(--background)">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <ReportStepIndicator currentStep={2} />

        {missingClassification ? (
          <div className="mt-10 rounded-md border border-yellow-200 bg-yellow-50 px-5 py-4 text-sm leading-6 text-yellow-800">
            Bạn chưa chọn nhóm hành vi vi phạm ở bước 1. Vui lòng quay lại bước
            phân loại trước khi tiếp tục.
          </div>
        ) : null}

        <section className="mt-12 rounded-xl border border-(--border) bg-white p-6 shadow-sm md:p-8">
          <div className="border-l-4 border-(--primary) pl-6">
            <h1 className="page-title uppercase">
              Bước 2: Thông tin người tố giác
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Bạn có thể gửi tin báo ẩn danh hoặc cung cấp thông tin định danh
              để cơ quan chức năng dễ dàng liên hệ, xác minh và phản hồi khi
              cần.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <ReporterModeCard
              mode="anonymous"
              title="Gửi tin báo ẩn danh"
              description="Thông tin cá nhân của bạn sẽ không được thu thập. Việc điều tra có thể gặp khó khăn nếu thiếu thông tin liên lạc."
              selected={form.mode === "anonymous"}
              onSelect={handleModeChange}
            />

            <ReporterModeCard
              mode="identified"
              title="Gửi tin báo định danh bảo mật"
              description="Cung cấp thông tin cá nhân giúp cơ quan chức năng dễ dàng liên hệ, xác minh và thúc đẩy quá trình điều tra."
              selected={form.mode === "identified"}
              onSelect={handleModeChange}
            />
          </div>

          {isAnonymous ? (
            <div className="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 p-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-yellow-700">
                  <InfoIcon />
                </span>

                <div>
                  <h2 className="font-semibold text-yellow-900">
                    Bạn đang chọn chế độ gửi ẩn danh
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-yellow-800">
                    Hệ thống sẽ không yêu cầu họ tên, CCCD, số điện thoại hoặc
                    địa chỉ liên hệ. Tuy nhiên, nếu vụ việc cần xác minh thêm,
                    cơ quan chức năng có thể không có kênh để liên hệ lại với
                    bạn.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <ReporterTextField
                label="Họ và tên"
                name="fullName"
                value={form.fullName}
                placeholder="Nhập họ và tên"
                required
                error={errors.fullName}
                onChange={handleFieldChange}
              />

              <ReporterTextField
                label="Số CCCD / Định danh cá nhân"
                name="citizenId"
                value={form.citizenId}
                placeholder="Nhập số CCCD"
                required
                error={errors.citizenId}
                onChange={handleFieldChange}
              />

              <ReporterTextField
                label="Số điện thoại"
                name="phone"
                value={form.phone}
                placeholder="Nhập số điện thoại"
                required
                error={errors.phone}
                onChange={handleFieldChange}
              />

              <ReporterTextField
                label="Email"
                name="email"
                value={form.email}
                placeholder="Nhập địa chỉ email"
                type="email"
                error={errors.email}
                onChange={handleFieldChange}
              />

              <div className="md:col-span-2">
                <ReporterTextField
                  label="Địa chỉ liên hệ"
                  name="address"
                  value={form.address}
                  placeholder="Nhập địa chỉ chi tiết"
                  required
                  error={errors.address}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
          )}

          <div className="mt-8">
            <PrivacyNotice
              accepted={form.privacyAccepted}
              onAcceptedChange={handlePrivacyAcceptedChange}
              error={errors.privacyAccepted}
            />
          </div>

          <div className="mt-10 border-t border-(--border) pt-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/report"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-500 px-8 py-4 font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <ArrowLeftIcon />
                Quay lại
              </Link>

              <button
                type="button"
                onClick={handleContinue}
                disabled={!canContinue}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-(--primary) px-8 py-4 font-semibold text-white transition hover:bg-(--primary-hover) disabled:cursor-not-allowed disabled:bg-red-300"
              >
                Tiếp tục
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
