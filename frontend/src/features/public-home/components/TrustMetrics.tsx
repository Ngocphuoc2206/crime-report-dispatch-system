import { trustMetrics } from "@/features/public-home/data/publicHome.data";

export function TrustMetrics() {
  return (
    <section
      aria-label="Chỉ số tin cậy"
      className="bg-[#2f2f2f] px-6 py-10 text-white"
    >
      <div className="mx-auto grid max-w-7xl gap-y-8 md:grid-cols-3">
        {trustMetrics.map((metric, index) => (
          <div
            key={metric.id}
            className={[
              "text-center",
              index > 0 ? "md:border-l md:border-white/25" : "",
            ].join(" ")}
          >
            <p className="font-serif text-4xl text-red-200 md:text-5xl">
              {metric.value}
            </p>

            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/65">
              {metric.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
