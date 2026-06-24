export function EvidenceHelpPanel() {
  return (
    <aside className="space-y-5">
      <article className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
        <h2 className="font-bold text-yellow-900">Ghi âm trực tiếp</h2>

        <p className="mt-3 text-sm leading-6 text-yellow-800">
          Nếu bạn không có tệp âm thanh, có thể ghi âm bằng thiết bị của mình
          rồi tải tệp lên hệ thống.
        </p>

        <button
          type="button"
          disabled
          className="mt-5 w-full rounded-md border border-yellow-300 bg-white px-5 py-3 font-semibold
           text-yellow-900 opacity-70"
        >
          Tính năng ghi âm sẽ phát triển sau
        </button>
      </article>

      <article className="rounded-xl border border-sky-100 bg-sky-50 p-6">
        <h2 className="font-bold text-sky-900">Bảo mật thông tin</h2>

        <p className="mt-3 text-sm leading-6 text-slate-700">
          Tệp bằng chứng chỉ phục vụ quá trình tiếp nhận, xác minh và xử lý tin
          báo. Không chỉnh sửa nội dung gốc trước khi gửi nếu có thể.
        </p>
      </article>

      <article className="rounded-xl border border-(--border) bg-white p-6 shadow-sm">
        <h2 className="font-bold text-slate-900">Hướng dẫn đính kèm</h2>

        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
          <li>Ưu tiên ảnh rõ nét, không qua chỉnh sửa.</li>
          <li>Video nên giữ nguyên âm thanh gốc.</li>
          <li>Audio nên nghe rõ giọng nói hoặc âm thanh liên quan.</li>
          <li>Không tải tệp không liên quan đến vụ việc.</li>
        </ul>
      </article>
    </aside>
  );
}
