type CommanderErrorStateProps = {
  onRetry: () => void;
};

export function CommanderErrorState({ onRetry }: CommanderErrorStateProps) {
  return (
    <div className="flex min-h-136 items-center justify-center">
      <section className="max-w-xl rounded-xl border border-red-300/30 bg-white/10 p-10 text-center shadow-2xl shadow-black/30">
        <div className="mx-auto flex size-20 items-center justify-center rounded-xl border border-red-300/30 bg-red-400/10 text-4xl text-red-200">
          ⚠
        </div>

        <h2 className="mt-7 text-2xl font-bold text-slate-100">
          Lỗi tải dashboard
        </h2>

        <p className="mt-3 leading-7 text-slate-400">
          Không thể kết nối đến máy chủ dữ liệu. Vui lòng kiểm tra kết nối mạng
          hoặc liên hệ quản trị viên hệ thống.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-7 rounded-lg bg-cyan-400 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-300"
        >
          Làm mới
        </button>
      </section>
    </div>
  );
}
