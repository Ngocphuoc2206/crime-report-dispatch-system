# 08. Frontend Integration

## 1. API base URL

Frontend chỉ gọi API Gateway:

```text
http://localhost:8080
```

Không gọi trực tiếp port của từng microservice. Biến môi trường đề xuất:

```text
VITE_API_BASE_URL=http://localhost:8080
```

Backend hiện chưa cấu hình CORS. Khi phát triển local, cấu hình dev-server proxy `/api` đến `http://localhost:8080`, hoặc bổ sung CORS tại API Gateway trước khi deploy khác origin.

## 2. Response wrapper

Response JSON thông thường:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Response lỗi:

```json
{
  "success": false,
  "message": "Error message",
  "errorCode": "REPORT_1005"
}
```

Frontend nên xử lý `success`, `errorCode` và HTTP status. Backend hiện trả HTTP `400` cho phần lớn `AppException`, nên không suy luận loại lỗi chỉ từ status.

## 3. Authentication

Đăng nhập:

```http
POST /api/auth/login
```

Các request protected gửi:

```http
Authorization: Bearer <accessToken>
```

Role hiện hành:

```text
OFFICER
DISPATCHER
COMMANDER
ADMIN
```

Không sử dụng tên cũ `DUTY_OFFICER`.

## 4. Enum dùng chung

Case status:

```text
NEW_RECEIVED
UNDER_VERIFICATION
TRANSFERRED_TO_INVESTIGATION
RESOLVED
SPAM_OR_FAKE
```

Urgency level:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

Case lock status:

```text
ACTIVE
RELEASED
EXPIRED
```

## 5. Multipart tạo report

```javascript
const formData = new FormData();
formData.append("report", JSON.stringify(report));

for (const file of files) {
  formData.append("files", file);
}

await api.post("/api/public/reports", formData);
```

Không tự đặt header `Content-Type`; browser cần tự thêm multipart boundary.

## 6. Pagination

`GET /api/officer/cases` trả Spring Page. Danh sách nằm tại:

```text
response.data.data.content
```

Metadata thường dùng:

```text
number
size
totalElements
totalPages
first
last
empty
```

Backend giới hạn `size` tối đa 50.

## 7. DateTime và filter

DateTime dùng ISO-8601 không timezone, ví dụ:

```text
2026-06-23T10:30:00
```

Heatmap hỗ trợ `from`, `to`, `urgencyLevel`. Timeline hỗ trợ `limit` từ 1 đến 100.

## 8. File download

`GET /api/officer/evidences/{evidenceId}/download` trả binary. HTTP client frontend phải dùng `blob`/`arraybuffer` và lấy tên file từ response header nếu backend cung cấp.

## 9. Mapping màn hình và API

| Màn hình | API chính |
|---|---|
| Public report form | Public crime types, create report |
| Public tracking | Report status by tracking code |
| Login | Auth login |
| Officer case list | Officer cases |
| Officer case detail | Case detail, evidence download, lock, accept, update status |
| Dispatcher console | Pending cases, dispatch detail, task list, available officers, map, dispatch dashboard |
| Commander dashboard | Overview, timeline, heatmap |
| Admin users | List/create user, update roles/status |
| Admin catalog | Crime types, urgency rules |
| Admin dispatch setup | Police units, administrative areas, officer profile |

## 10. Chức năng chưa sẵn sàng hoặc để hướng phát triển

- Reporter identity API chưa có controller/gateway route.
- AI summary, AI spam detection, forecasting và live stream/chat evidence chưa có luồng frontend/backend hoàn chỉnh.

Frontend nên ẩn các chức năng này hoặc giữ ở trạng thái disabled cho đến khi backend hoàn thiện.
