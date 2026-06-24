type Step = {
  number: number;
  label: string;
};

const steps: Step[] = [
  { number: 1, label: "Phân loại" },
  { number: 2, label: "Người tố giác" },
  { number: 3, label: "Sự việc" },
  { number: 4, label: "Bằng chứng" },
  { number: 5, label: "Xác nhận" },
];

type ReportStepIndicatorProps = {
  currentStep: number;
};

export function ReportStepIndicator({ currentStep }: ReportStepIndicatorProps) {
  return (
    <nav aria-label="Tiến trình gửi tin báo">
      <ol className="grid grid-cols-5 gap-2 md:gap-3">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;

          return (
            <li
              key={step.number}
              className="relative flex flex-col items-center"
            >
              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={[
                    "absolute left-[58%] top-5 hidden h-0.5 w-[85%] transition-colors duration-500 md:block",
                    isCompleted ? "bg-(--primary)" : "bg-slate-200",
                  ].join(" ")}
                />
              ) : null}

              <span
                className={[
                  "relative z-10 flex size-10 items-center justify-center rounded-xl text-sm font-bold md:size-11",
                  isActive || isCompleted
                    ? "bg-(--primary) text-white shadow-sm"
                    : "bg-slate-200 text-slate-500",
                ].join(" ")}
              >
                {isCompleted ? "✓" : step.number}
              </span>

              <span
                className={[
                  "mt-3 text-center text-xs font-medium md:text-sm lg:text-base",
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
