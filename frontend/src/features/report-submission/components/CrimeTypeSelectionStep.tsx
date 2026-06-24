/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnonymousModeToggle } from "@/features/report-submission/components/AnonymousModeToggle";
import { CrimeTypeCard } from "@/features/report-submission/components/CrimeTypeCard";
import { ReportStepIndicator } from "@/features/report-submission/components/ReportStepIndicator";
import { fallbackCrimeTypes } from "@/features/report-submission/data/fallbackCrimeTypes";
import { crimeTypeService } from "@/features/report-submission/services/crimeTypeService";
import { reportDraftStorage } from "@/features/report-submission/services/reportDraftStorage";
import type { CrimeType } from "@/features/report-submission/types/reportSubmission.types";
import { useRouter } from "next/navigation";

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

export function CrimeTypeSelectionStep() {
  const [crimeTypes, setCrimeTypes] = useState<CrimeType[]>([]);
  const [selectedCrimeType, setSelectedCrimeType] = useState<CrimeType | null>(
    null,
  );
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function loadCrimeTypes() {
      try {
        setLoading(true);
        setApiErrorMessage(null);

        const data = await crimeTypeService.getCrimeTypes();

        if (!mounted) return;

        if (data.length === 0) {
          setCrimeTypes(fallbackCrimeTypes);
          setApiErrorMessage(
            "API chưa có dữ liệu loại tin báo. Đang hiển thị dữ liệu mẫu.",
          );
          return;
        }

        setCrimeTypes(data);
      } catch (error) {
        if (!mounted) return;

        setCrimeTypes(fallbackCrimeTypes);
        setApiErrorMessage(
          error instanceof Error
            ? `Không tải được loại tin báo từ API: ${error.message}. Đang hiển thị dữ liệu mẫu.`
            : "Không tải được loại tin báo từ API. Đang hiển thị dữ liệu mẫu.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    const savedDraft = reportDraftStorage.getClassification();

    if (savedDraft) {
      setAnonymous(savedDraft.anonymous);
    }

    loadCrimeTypes();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const savedDraft = reportDraftStorage.getClassification();

    if (!savedDraft || crimeTypes.length === 0) return;

    const matchedCrimeType = crimeTypes.find(
      (crimeType) => crimeType.id === savedDraft.crimeTypeId,
    );

    if (matchedCrimeType) {
      setSelectedCrimeType(matchedCrimeType);
    }
  }, [crimeTypes]);

  const canContinue = useMemo(() => {
    return selectedCrimeType !== null;
  }, [selectedCrimeType]);

  function handleContinue() {
    if (!selectedCrimeType) return;

    reportDraftStorage.saveClassification({
      crimeTypeId: selectedCrimeType.id,
      crimeTypeCode: selectedCrimeType.code,
      crimeTypeName: selectedCrimeType.name,
      anonymous,
    });

    // Change to step 2
    router.push("/report/reporter");
  }

  return (
    <div className="bg-(--background)">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <ReportStepIndicator currentStep={1} />

        <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
          <div className="border-l-4 border-(--primary) pl-6">
            <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900 md:text-3xl">
              Bước 1: Chọn nhóm hành vi vi phạm
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Vui lòng xác định lĩnh vực liên quan để chúng tôi chuyển tin báo
              đến cơ quan chức năng phù hợp nhất.
            </p>
          </div>

          <AnonymousModeToggle checked={anonymous} onChange={setAnonymous} />
        </div>

        {apiErrorMessage ? (
          <div className="mt-8 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            {apiErrorMessage}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="min-h-72 animate-pulse rounded-lg border border-(--border) bg-white p-8"
              >
                <div className="size-16 rounded-2xl bg-slate-100" />
                <div className="mt-8 h-6 w-2/3 rounded bg-slate-100" />
                <div className="mt-5 space-y-3">
                  <div className="h-4 rounded bg-slate-100" />
                  <div className="h-4 rounded bg-slate-100" />
                  <div className="h-4 w-4/5 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {crimeTypes.map((crimeType) => (
              <CrimeTypeCard
                key={crimeType.id}
                crimeType={crimeType}
                selected={selectedCrimeType?.id === crimeType.id}
                onSelect={setSelectedCrimeType}
              />
            ))}
          </div>
        )}

        <div className="mt-12 flex flex-col gap-5 rounded-lg border border-(--border) bg-white px-6 py-7 md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-3 text-sm text-slate-600">
            <span className="text-sky-700">
              <InfoIcon />
            </span>
            Hệ thống đang hoạt động trong môi trường bảo mật SSL/TLS 256-bit.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border border-slate-500 px-8 py-4 font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeftIcon />
              Hủy bỏ
            </Link>

            <button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue}
              className="inline-flex items-center justify-center gap-2 bg-(--primary) px-8 py-4 font-semibold text-white transition hover:bg-(--primary-hover) disabled:cursor-not-allowed disabled:bg-red-300"
            >
              Tiếp tục
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
