import { CommanderMapLegend } from "@/features/commander-dashboard/components/CommanderMapLegend";
import { CommanderMapReportPopup } from "@/features/commander-dashboard/components/CommanderMapReportPopup";
import type {
  CommanderMapReport,
  CommanderMapSeverity,
} from "@/features/commander-dashboard/types/commanderMap.types";

type CommanderMapCanvasProps = {
  reports: CommanderMapReport[];
  selectedReport: CommanderMapReport | null;
  onSelectReport: (report: CommanderMapReport) => void;
  isLoading: boolean;
};

const pinClassNames: Record<CommanderMapSeverity, string> = {
  CRITICAL: "border-red-500 bg-red-500 shadow-red-500/40",
  HIGH: "border-orange-400 bg-orange-400 shadow-orange-400/40",
  MEDIUM: "border-yellow-400 bg-yellow-400 shadow-yellow-400/40",
  LOW: "border-green-400 bg-green-400 shadow-green-400/40",
};

export function CommanderMapCanvas({
  reports,
  selectedReport,
  onSelectReport,
  isLoading,
}: CommanderMapCanvasProps) {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-[#08112b]">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(circle at 55% 45%, rgba(34,211,238,0.22), transparent 24%), linear-gradient(rgba(34,211,238,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.14) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 42px 42px, 42px 42px",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 60% 52%, transparent 0 6rem, rgba(34,211,238,0.5) 6.1rem, transparent 6.25rem), radial-gradient(circle at 60% 52%, transparent 0 12rem, rgba(34,211,238,0.35) 12.1rem, transparent 12.25rem), radial-gradient(circle at 60% 52%, transparent 0 18rem, rgba(34,211,238,0.25) 18.1rem, transparent 18.25rem)",
        }}
      />

      {reports.map((report) => (
        <button
          key={report.id}
          type="button"
          onClick={() => onSelectReport(report)}
          className={[
            "absolute z-10 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 shadow-xl transition hover:scale-125",
            pinClassNames[report.severity],
          ].join(" ")}
          style={{
            left: `${report.x}%`,
            top: `${report.y}%`,
          }}
          aria-label={`Chọn tin báo ${report.code}`}
        >
          <span className="absolute inset-[-0.7rem] rounded-full border border-current opacity-40" />
        </button>
      ))}

      {selectedReport ? (
        <CommanderMapReportPopup report={selectedReport} />
      ) : null}

      {isLoading ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#090f24]/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="mx-auto flex size-20 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-400/10 text-3xl text-cyan-300">
              ◈
            </div>

            <h2 className="mt-6 text-2xl font-black uppercase tracking-[0.25em] text-cyan-300">
              Đang thiết lập kết nối vệ tinh
            </h2>

            <p className="mt-3 text-sm text-slate-400">
              Đang tải dữ liệu địa hình và tín hiệu... 45%
            </p>
          </div>
        </div>
      ) : null}

      <div className="absolute bottom-8 left-8 z-20">
        <CommanderMapLegend />
      </div>

      <div className="absolute bottom-8 right-8 z-20 space-y-3">
        <button className="flex size-12 items-center justify-center rounded-lg border border-white/10 bg-[#121b3a] text-2xl font-bold text-slate-200 hover:bg-white/10">
          +
        </button>

        <button className="flex size-12 items-center justify-center rounded-lg border border-white/10 bg-[#121b3a] text-2xl font-bold text-slate-200 hover:bg-white/10">
          −
        </button>

        <button className="flex size-12 items-center justify-center rounded-lg border border-white/10 bg-[#121b3a] text-xl font-bold text-cyan-300 hover:bg-white/10">
          ◎
        </button>
      </div>
    </section>
  );
}
