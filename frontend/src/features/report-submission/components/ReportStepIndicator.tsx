type Step = {
  number: number;
  label: string;
};

const steps: Step[] = [
  { number: 1, label: "Phân loại" },
  { number: 2, label: "Nội dung" },
  { number: 3, label: "Bằng chứng" },
  { number: 4, label: "Hoàn tất" },
];

type ReportStepIndicatorProps = {
  currentStep: number;
};

export function ReportStepIndicator({ currentStep }: ReportStepIndicatorProps) {
  return (
    <nav aria-label="Tiến trình gửi tin báo">
      <ol className="relative grid grid-cols-4">
        <span
          aria-hidden="true"
          className="absolute left-[12.5%] right-[12.5%] top-[1.375rem] h-0.5 bg-slate-200"
        />

        {steps.map((step) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;

          return (
            <li
              key={step.number}
              className="relative flex flex-col items-center"
            >
              <span
                className={[
                  "relative z-10 flex size-11 items-center justify-center rounded-xl text-sm font-bold",
                  isActive || isCompleted
                    ? "bg-(--primary) text-white shadow-sm"
                    : "bg-slate-200 text-slate-500",
                ].join(" ")}
              >
                {step.number}
              </span>

              <span
                className={[
                  "mt-3 text-center text-sm font-medium md:text-base",
                  isActive ? "text-(--primary)" : "text-slate-600",
                ].join(" ")}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
