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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050817]/80 px-6 backdrop-blur-sm">
      <section className="w-full max-w-xl rounded-xl border border-white/10 bg-[#172142] shadow-2xl shadow-black/40">
        <div className="p-8 text-center">
          <div className="mx-auto flex size-20 items-center justify-center rounded-2xl border border-red-400/40 bg-red-500/15 text-4xl text-red-300">
            🔒
          </div>

          <h2 className="mt-6 text-2xl font-bold text-slate-100">
            Phiên làm việc hết hạn
          </h2>

          <p className="mt-3 leading-7 text-slate-400">
            Phiên cập nhật hồ sơ đã hết hạn. Hệ thống không thể tiếp tục giữ
            khóa dữ liệu an toàn. Bạn có muốn thử yêu cầu khóa lại không?
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-white/15 px-5 py-3 font-bold text-slate-300 hover:bg-white/10"
            >
              Hủy bỏ
            </button>

            <button
              type="button"
              onClick={onRelock}
              className="rounded-md bg-cyan-400 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-300"
            >
              Thử khóa lại
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
