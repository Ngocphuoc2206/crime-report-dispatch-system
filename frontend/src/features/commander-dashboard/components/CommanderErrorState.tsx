type CommanderErrorStateProps = {
  onRetry: () => void;
};

export function CommanderErrorState({ onRetry }: CommanderErrorStateProps) {
  return (
    <div className="flex min-h-136 items-center justify-center">
      <section className="max-w-xl rounded-xl border border-red-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex size-20 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-4xl font-black text-[var(--primary)]">
          !
        </div>

        <h2 className="mt-7 text-2xl font-bold text-slate-950">
          Loi tai dashboard
        </h2>

        <p className="mt-3 leading-7 text-slate-600">
          Khong the ket noi den may chu du lieu. Vui long kiem tra backend hoac
          thu lam moi lai.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-7 rounded-lg bg-[var(--primary)] px-6 py-3 font-bold text-white hover:bg-[var(--primary-hover)]"
        >
          Lam moi
        </button>
      </section>
    </div>
  );
}
