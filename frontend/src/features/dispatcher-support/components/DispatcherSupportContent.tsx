import {
  dispatcherFaqs,
  dispatcherGuides,
} from "@/features/dispatcher-support/data/dispatcherSupport.data";

export function DispatcherSupportContent() {
  return (
    <div className="px-8 py-8">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-950">
            Trợ giúp điều phối
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            Hướng dẫn thao tác nghiệp vụ cho Dispatcher trong quá trình tiếp
            nhận, điều phối và theo dõi hồ sơ.
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <p className="text-sm font-bold text-red-900/70">Hỗ trợ nội bộ</p>
          <p className="mt-1 text-2xl font-black text-[var(--primary)]">
            1900-113
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          {dispatcherGuides.map((guide) => (
            <article
              key={guide.title}
              className="rounded-xl border border-red-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-black text-red-950">
                {guide.title}
              </h2>

              <ol className="mt-5 space-y-3">
                {guide.items.map((item, index) => (
                  <li key={item} className="flex gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-50 font-black text-[var(--primary)] ring-1 ring-red-200">
                      {index + 1}
                    </span>

                    <span className="leading-7 text-slate-700">{item}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>

        <aside className="space-y-6">
          <section className="rounded-xl border border-orange-200 bg-orange-50 p-6">
            <h2 className="text-xl font-black text-orange-900">
              Lưu ý nghiệp vụ
            </h2>

            <p className="mt-3 leading-7 text-orange-800">
              Mọi thao tác điều phối, đổi đơn vị hoặc thu hồi nhiệm vụ đều được
              ghi nhận vào lịch sử hệ thống. Cần nhập ghi chú rõ ràng khi thay
              đổi trạng thái xử lý.
            </p>
          </section>

          <section className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">
              Câu hỏi thường gặp
            </h2>

            <div className="mt-5 space-y-4">
              {dispatcherFaqs.map((faq) => (
                <details
                  key={faq.question}
                  className="rounded-lg border border-red-100 bg-red-50/50 p-4"
                >
                  <summary className="cursor-pointer font-black text-red-950">
                    {faq.question}
                  </summary>

                  <p className="mt-3 leading-7 text-slate-700">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">
              Liên hệ quản trị
            </h2>

            <div className="mt-4 space-y-3 text-slate-700">
              <p>
                <strong>Email:</strong> support@hethong.gov.vn
              </p>

              <p>
                <strong>Tổng đài:</strong> 1900-113
              </p>

              <p>
                <strong>Thời gian hỗ trợ:</strong> 24/7
              </p>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
