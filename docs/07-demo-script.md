# 07. Demo Script

## 1. Chuẩn bị

Khởi động toàn bộ backend từ thư mục `backend`:

```powershell
docker compose up -d --build
```

Frontend và công cụ kiểm thử chỉ gọi API Gateway:

```text
http://localhost:8080
```

Tài khoản seed:

| Role | Username | Password |
|---|---|---|
| ADMIN | admin | admin123 |
| OFFICER | officer01 | officer123 |
| DISPATCHER | dispatcher01 | dispatcher123 |
| COMMANDER | commander01 | commander123 |

## 2. Luồng người dân

1. Gọi `GET /api/public/crime-types` để tải danh mục.
2. Gửi `POST /api/public/reports` dạng multipart gồm part `report` là chuỗi JSON và các part `files`.
3. Lưu `trackingCode` nhận được.
4. Gọi `GET /api/public/reports/{trackingCode}/status` và hiển thị trạng thái rút gọn.

## 3. Luồng Officer

1. Đăng nhập bằng `POST /api/auth/login`.
2. Gắn access token vào header `Authorization: Bearer <token>`.
3. Gọi `GET /api/officer/cases?page=0&size=20`.
4. Mở chi tiết bằng `GET /api/officer/cases/{caseId}`.
5. Nhận xử lý bằng `POST /api/officer/cases/{caseId}/accept`.
6. Kiểm tra lock bằng `GET /api/officer/cases/{caseId}/lock`.
7. Cập nhật trạng thái bằng `PATCH /api/officer/cases/{caseId}/status` với body:

```json
{
  "caseStatus": "TRANSFERRED_TO_INVESTIGATION",
  "note": "Đã xác minh sơ bộ"
}
```

8. Giải phóng khóa bằng `DELETE /api/officer/cases/{caseId}/lock` khi cần.

## 4. Luồng Commander

Sau khi đăng nhập bằng tài khoản Commander:

1. `GET /api/commander/dashboard/overview`.
2. `GET /api/commander/dashboard/timeline?limit=20`.
3. `GET /api/commander/dashboard/heatmap?urgencyLevel=CRITICAL`.

Kiểm tra tổng số liệu, event mới nhất và các điểm có latitude/longitude trên bản đồ.

## 5. Luồng Admin

Sau khi đăng nhập bằng tài khoản Admin:

1. Xem/tạo/cập nhật crime type.
2. Xem/tạo/cập nhật urgency rule.
3. Xem danh sách user.
4. Tạo user mới có role `OFFICER`.
5. Dùng `userId` vừa tạo để gọi `POST /api/admin/officers`.
6. Thử cập nhật role và bật/tắt user.

## 6. Chức năng chưa demo

Các endpoint dispatcher thủ công và giải mã reporter identity đang được mô tả định hướng nhưng chưa có controller/gateway route. Không đưa hai chức năng này vào demo frontend hiện tại.
