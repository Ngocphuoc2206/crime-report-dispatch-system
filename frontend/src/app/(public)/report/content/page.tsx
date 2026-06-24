import Link from "next/link";
import { ReportStepIndicator } from "@/features/report-submission/components/ReportStepIndicator";

export default function ReportContentPage() {
  return (
    <div className="bg-(--background)">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <ReportStepIndicator currentStep={3} />

        <section className="mt-12 rounded-xl border border-(--border) bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Bước 3: Thông tin sự việc
          </h1>

          <p className="mt-4 text-slate-600">
            Màn hình này sẽ được phát triển ở issue tiếp theo.
          </p>

          <Link
            href="/report/reporter"
            className="mt-6 inline-flex rounded-md border border-slate-500 px-6 py-3 font-semibold text-slate-600 hover:bg-slate-50"
          >
            Quay lại bước 2
          </Link>
        </section>
      </div>
    </div>
  );
}
