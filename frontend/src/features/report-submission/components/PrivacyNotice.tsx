type PrivacyNoticeProps = {
  accepted: boolean;
  onAcceptedChange: (accepted: boolean) => void;
  error?: string;
};

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6">
      <path
        d="M7 10V8a5 5 0 0 1 10 0v2m-9 0h8a2 2 0 0 1 2 2v7H6v-7a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function PrivacyNotice({
  accepted,
  onAcceptedChange,
  error,
}: PrivacyNoticeProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-red-100 bg-red-50 p-5">
        <div className="flex items-start gap-4">
          <span className="mt-1 text-(--primary)">
            <LockIcon />
          </span>

          <p className="text-sm leading-6 text-slate-700">
            Thông tin định danh của bạn sẽ được mã hóa, chỉ phục vụ quá trình
            tiếp nhận, xác minh và xử lý tin báo. Cơ quan chức năng có trách
            nhiệm bảo vệ danh tính người tố giác theo quy định pháp luật.
          </p>
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => onAcceptedChange(event.target.checked)}
          className="mt-1 size-5 rounded border-slate-300 accent-(--primary)"
        />

        <span className="text-sm leading-6 text-slate-700">
          Tôi đồng ý với{" "}
          <span className="font-semibold text-(--primary)">
            chính sách bảo vệ dữ liệu cá nhân
          </span>{" "}
          và cam kết thông tin cung cấp là đúng sự thật.
        </span>
      </label>

      {error ? <p className="text-sm text-(--primary)">{error}</p> : null}
    </div>
  );
}
