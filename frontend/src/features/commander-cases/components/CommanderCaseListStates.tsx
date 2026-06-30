type RetryProps = {
  onRetry: () => void;
};

type ClearProps = {
  onClear: () => void;
};

export function CommanderCaseLoadingState() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-950">Dang tai du lieu</h2>
      <div className="mt-6 space-y-4">
        <div className="h-12 w-1/2 animate-pulse rounded bg-slate-100" />
        <div className="h-px bg-slate-200" />
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="grid gap-4 md:grid-cols-4">
            <div className="h-9 animate-pulse rounded bg-slate-100" />
            <div className="h-9 animate-pulse rounded bg-slate-100" />
            <div className="h-9 animate-pulse rounded bg-slate-100" />
            <div className="h-9 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function CommanderCaseEmptyState() {
  return (
    <section className="flex min-h-[25rem] items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div>
        <div className="mx-auto flex size-24 items-center justify-center rounded-2xl bg-slate-100 text-5xl text-slate-500">
          0
        </div>
        <h2 className="mt-6 text-2xl font-bold text-slate-950">
          Chua co ho so
        </h2>
        <p className="mt-3 max-w-md text-slate-600">
          Hien chua co tin bao nao phu hop voi bo loc dang chon.
        </p>
      </div>
    </section>
  );
}

export function CommanderCaseNoResultState({ onClear }: ClearProps) {
  return (
    <section className="flex min-h-88 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center">
      <div>
        <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-slate-100 text-4xl text-slate-500">
          ?
        </div>
        <h2 className="mt-6 text-2xl font-bold text-slate-950">
          Khong tim thay ket qua
        </h2>
        <p className="mt-3 max-w-md text-slate-600">
          Thu xoa bo loc hoac tim bang tu khoa khac.
        </p>
        <button
          type="button"
          onClick={onClear}
          className="mt-6 rounded-lg border border-slate-200 px-6 py-3 font-bold text-slate-700 hover:bg-slate-50"
        >
          Xoa bo loc
        </button>
      </div>
    </section>
  );
}

export function CommanderCaseErrorState({ onRetry }: RetryProps) {
  return (
    <section className="flex min-h-88 items-center justify-center rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      <div>
        <div className="mx-auto flex size-24 items-center justify-center rounded-2xl border border-red-200 bg-white text-5xl font-black text-[var(--primary)]">
          !
        </div>
        <h2 className="mt-6 text-2xl font-bold text-[var(--primary)]">
          Loi tai danh sach ho so
        </h2>
        <p className="mt-3 max-w-md text-slate-600">
          Khong the tai du lieu danh sach ho so. Vui long thu lai.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-lg bg-[var(--primary)] px-6 py-3 font-bold text-white hover:bg-[var(--primary-hover)]"
        >
          Thu lai
        </button>
      </div>
    </section>
  );
}
