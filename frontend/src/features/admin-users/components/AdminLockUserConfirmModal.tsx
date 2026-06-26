import type { AdminUser } from "@/features/admin-users/types/adminUser.types";

type AdminLockUserConfirmModalProps = {
  open: boolean;
  user: AdminUser | null;
  onClose: () => void;
  onConfirm: (userId: string) => void;
};

function getInitials(fullName: string) {
  const words = fullName.trim().split(/\s+/);

  if (words.length === 0) return "U";

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

export function AdminLockUserConfirmModal({
  open,
  user,
  onClose,
  onConfirm,
}: AdminLockUserConfirmModalProps) {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
      <section className="w-full max-w-xl rounded-2xl bg-white p-7 shadow-2xl">
        <div className="flex size-14 items-center justify-center rounded-full bg-red-100 text-2xl text-[var(--primary)]">
          🛡
        </div>

        <h2 className="mt-6 text-2xl font-black text-slate-950">
          Xác nhận khóa tài khoản
        </h2>

        <div className="mt-5 flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-black text-blue-700">
            {getInitials(user.fullName)}
          </span>

          <div>
            <p className="font-black text-slate-950">{user.username}</p>
            <p className="mt-1 text-slate-600">{user.fullName}</p>
          </div>
        </div>

        <p className="mt-6 text-lg leading-8 text-slate-600">
          Tài khoản bị khóa sẽ không thể đăng nhập vào hệ thống. Công quản trị
          cũng như các dịch vụ liên kết khác có thể bị ảnh hưởng. Bạn có chắc
          chắn muốn thực hiện hành động này?
        </p>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-5 py-3 font-black text-slate-600 hover:bg-slate-50"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={() => onConfirm(user.id)}
            className="rounded-lg bg-(--primary) px-5 py-3 font-black text-white hover:bg-[var(--primary-hover)]"
          >
            🔒 Khóa tài khoản
          </button>
        </div>
      </section>
    </div>
  );
}
