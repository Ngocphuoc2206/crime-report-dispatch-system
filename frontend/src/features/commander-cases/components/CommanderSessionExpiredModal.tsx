type CommanderSessionExpiredModalProps = {
  open: boolean;
  onCancel: () => void;
  onRelock: () => void;
};

export function CommanderSessionExpiredModal({
  open,
  onCancel,
  onRelock,
}: CommanderSessionExpiredModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-6 backdrop-blur-sm">
      <section className="w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-2xl">
        <div className="p-8 text-center">
          <div className="mx-auto flex size-20 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-4xl font-black text-[var(--primary)]">
            !
          </div>

          <h2 className="mt-6 text-2xl font-bold text-slate-950">
            Phien lam viec het han
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            Phien cap nhat ho so da het han. Ban co muon thu khoa lai ho so
            khong?
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-slate-200 px-5 py-3 font-bold text-slate-700 hover:bg-slate-50"
            >
              Huy bo
            </button>

            <button
              type="button"
              onClick={onRelock}
              className="rounded-md bg-[var(--primary)] px-5 py-3 font-bold text-white hover:bg-[var(--primary-hover)]"
            >
              Thu khoa lai
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
