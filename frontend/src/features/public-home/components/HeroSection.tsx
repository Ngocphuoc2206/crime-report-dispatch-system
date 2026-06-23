import Link from "next/link";

function MegaphoneIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path
        d="M4 13.5h3l8 4.5V6L7 10.5H4a2 2 0 0 0-2 2v-1a2 2 0 0 0 2 2Zm4 0v4a2 2 0 0 0 2 2h1l-1.5-5.2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M18 9.5c1.2 1.2 1.2 3.8 0 5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path
        d="m21 21-4.3-4.3m1.3-5.2a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <path
        d="M12 3 5 6v5.2c0 4.4 2.8 8.3 7 9.8 4.2-1.5 7-5.4 7-9.8V6l-7-3Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(90deg,var(--gold)_0%,var(--gold-soft)_66%,#e2d792_66%,#e2d792_100%)] px-6 py-20 text-center md:py-24">
      <div
        aria-hidden="true"
        className="absolute -bottom-20 right-[5%] -z-10 hidden text-[18rem] leading-none text-white/35 lg:block"
      >
        ⚖
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_38%_35%,rgba(255,255,255,0.45),transparent_32%)]"
      />

      <div className="mx-auto max-w-5xl">
        <p className="mb-7 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white/70 px-4 py-2 text-sm font-semibold text-red-700 shadow-sm">
          <ShieldIcon />
          Hệ thống tiếp nhận thông tin an ninh quốc gia
        </p>

        <h1 className="text-4xl font-medium tracking-tight text-(--primary) md:text-6xl">
          Bảo vệ - Tố giác - An toàn
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
          Chung tay cùng lực lượng Công an nhân dân trong việc phát hiện và tố
          giác tội phạm, góp phần xây dựng một môi trường sống an toàn và thượng
          tôn pháp luật.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/report"
            className="inline-flex items-center justify-center gap-3 rounded-md bg-(--primary) px-7 py-4 font-bold text-white shadow-lg shadow-red-900/20 transition hover:bg-[var(--primary-hover)]"
          >
            <MegaphoneIcon />
            Gửi tin báo ngay
          </Link>

          <Link
            href="/tracking"
            className="inline-flex items-center justify-center gap-3 rounded-md border-2 border-slate-600 bg-white/20 px-7 py-4 font-bold text-slate-700 transition hover:bg-white/50"
          >
            <SearchIcon />
            Tra cứu tiến độ
          </Link>
        </div>
      </div>
    </section>
  );
}
