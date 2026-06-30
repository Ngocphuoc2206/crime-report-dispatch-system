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

Seed dữ liệu điều phối TP.HCM trước khi demo luồng smart dispatch:

```powershell
Get-Content docs\demo-hcm-dispatch-seed.sql | docker exec -i crime-report-mariadb mariadb -ucrime_user -pcrime_password
```

Seed này tạo địa bàn, đơn vị công an, officer, ca trực đang ACTIVE và duty assignment trạng thái `AVAILABLE`. Nếu bỏ qua bước này, hệ thống vẫn nhận tin báo nhưng smart dispatch có thể không tìm được cán bộ trực phù hợp.

Tài khoản seed:

| Role | Username | Password |
|---|---|---|
| ADMIN | admin | admin123 |
| OFFICER | officer01 | officer123 |
| DISPATCHER | dispatcher01 | dispatcher123 |
| COMMANDER | commander01 | commander123 |

Tài khoản officer demo TP.HCM sau khi chạy seed:

| Username | Password | Đơn vị |
|---|---|---|
| officer_hcm_q1 | officer123 | Công an Quận 1 |
| officer_hcm_q3 | officer123 | Công an Quận 3 |
| officer_hcm_binh_thanh | officer123 | Công an Quận Bình Thạnh |
| officer_hcm_tan_binh | officer123 | Công an Quận Tân Bình |
| officer_hcm_113 | officer123 | Trung tâm 113 TP.HCM |

## 2. Luồng người dân

1. Gọi `GET /api/public/crime-types` để tải danh mục.
2. Gửi `POST /api/public/reports` dạng multipart gồm part `report` là chuỗi JSON và các part `files`.
3. Lưu `trackingCode` nhận được.
4. Gọi `GET /api/public/reports/{trackingCode}/status` và hiển thị trạng thái rút gọn.

Tọa độ gợi ý để demo dispatch trên địa bàn TP.HCM:

| Khu vực demo | Latitude | Longitude |
|---|---:|---:|
| Quận 1 / Bến Thành | 10.7769000 | 106.7009000 |
| Thành phố Thủ Đức | 10.8490000 | 106.7698000 |
| Quận 7 | 10.7380000 | 106.7219000 |
| Tân Bình | 10.8017000 | 106.6520000 |
| Củ Chi | 10.9736000 | 106.4931000 |

Kết quả mong đợi: response có `trackingCode`, `urgencyScore`, `urgencyLevel`; nếu có dữ liệu trực ban phù hợp, case có `assignedUnitId` và `assignedOfficerId`.

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

## 4. Luồng Dispatcher

Sau khi đăng nhập bằng tài khoản Dispatcher:

1. Gọi `GET /api/dispatch/cases/pending` để xem tin báo chưa điều phối hoặc cần theo dõi.
2. Mở chi tiết bằng `GET /api/dispatch/cases/{trackingCode}`.
3. Kiểm tra cán bộ khả dụng bằng `GET /api/dispatch/officers/available`.
4. Điều phối/gán lại nếu cần bằng `POST /api/dispatch/cases/{trackingCode}/dispatch`.
5. Theo dõi task bằng `GET /api/dispatch/tasks`.
6. Thử điều phối lại hoặc thu hồi task bằng:

```http
PATCH /api/dispatch/tasks/{taskId}/reassign
PATCH /api/dispatch/tasks/{taskId}/recall
PATCH /api/dispatch/tasks/{taskId}/status
```

7. Mở màn hình bản đồ/hàng đợi bằng:

```http
GET /api/dispatch/map/cases
GET /api/dispatch/map/units
GET /api/dispatch/dashboard/overview
GET /api/dispatch/dashboard/priority-queue
GET /api/dispatch/dashboard/activity
```

## 5. Luồng Commander

Sau khi đăng nhập bằng tài khoản Commander:

1. `GET /api/commander/dashboard/overview`.
2. `GET /api/commander/dashboard/timeline?limit=20`.
3. `GET /api/commander/dashboard/heatmap?urgencyLevel=CRITICAL`.

Kiểm tra tổng số liệu, event mới nhất và các điểm có latitude/longitude trên bản đồ.

## 6. Luồng Admin

Sau khi đăng nhập bằng tài khoản Admin:

1. Xem/tạo/cập nhật crime type.
2. Xem/tạo/cập nhật urgency rule.
3. Xem danh sách user.
4. Xem/tạo/cập nhật đơn vị công an bằng `GET/POST/PATCH /api/admin/units`.
5. Lấy danh sách địa bàn bằng `GET /api/admin/units/areas`.
6. Tạo user mới có role `OFFICER`.
7. Dùng `userId` vừa tạo để gọi `POST /api/admin/officers`.
8. Thử cập nhật role và bật/tắt user.

## 7. Kịch bản chụp hình đưa vào báo cáo

Các hình nên chụp cho báo cáo:

| Hình | Nội dung |
|---|---|
| Hình 3.1 | Form người dân gửi tin báo, có bằng chứng và màn hình trả `trackingCode` |
| Hình 3.2 | Dashboard chỉ huy gồm overview, timeline và heatmap |
| Hình bổ sung | Màn hình dispatcher với pending cases/map/tasks nếu còn trang |

## 8. Chức năng chưa demo hoặc để hướng phát triển

Endpoint giải mã reporter identity đang được mô tả định hướng nhưng chưa có controller/gateway route hoàn chỉnh. Không đưa chức năng này vào demo frontend hiện tại.

Các chức năng AI summary, AI spam detection, forecasting và live stream/chat evidence nên ghi trong báo cáo là hướng phát triển, không ghi là đã hoàn thành nếu chưa triển khai backend/frontend thực tế.
