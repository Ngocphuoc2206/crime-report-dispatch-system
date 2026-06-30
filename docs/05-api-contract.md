# 05. API Contract

## 1. Tổng quan

Tài liệu này mô tả các API cốt lõi của hệ thống Tiếp nhận và Điều phối Thông tin Tố giác Tội phạm.

Theo kiến trúc microservice, frontend chỉ gọi API qua api-gateway. Các service phía sau không được expose trực tiếp cho frontend trong luồng chuẩn.

API contract được thiết kế cho phiên bản MVP, tập trung vào luồng chính:

```text
Người dân gửi tin báo
→ Hệ thống mã hóa danh tính
→ Hệ thống tính điểm nguy cấp
→ Hệ thống điều phối tin báo
→ Cán bộ trực ban nhận xử lý
→ Người dân tra cứu tiến độ
→ Chỉ huy xem dashboard
```

---

## 2. Quy ước chung

### 2.1. Base URL

```http
/api
```

Base URL trên là URL của api-gateway. Gateway route request đến các service:

| Path | Service sở hữu |
|---|---|
| /api/auth/** | auth-service |
| /api/admin/users/** | auth-service |
| /api/public/reports/** | report-service |
| /api/public/crime-types | report-service |
| /api/officer/cases/** | report-service |
| /api/commander/dashboard/** | report-service |
| /api/admin/crime-types/** | report-service |
| /api/officer/evidences/** | evidence-service |
| /api/urgency/** | urgency-service |
| /api/admin/urgency-rules/** | urgency-service |
| /api/dispatch/** | dispatch-service |
| /api/admin/officers/** | dispatch-service |
| /api/admin/units/** | dispatch-service |

Ví dụ:

```http
POST /api/public/reports
```

---

### 2.2. Authentication

Các API nội bộ yêu cầu JWT token.

Header:

```http
Authorization: Bearer <access_token>
```

Các API public không cần token:

```text
POST /api/public/reports
GET /api/public/reports/{trackingCode}/status
```

---

### 2.3. Format response thành công

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

---

### 2.4. Format response lỗi

```json
{
  "success": false,
  "message": "Error message",
  "errorCode": "ERROR_CODE",
  "details": {}
}
```

---

### 2.5. HTTP status code

| Status | Ý nghĩa |
|---:|---|
| 200 | Thành công |
| 201 | Tạo mới thành công |
| 400 | Request không hợp lệ |
| 401 | Chưa đăng nhập |
| 403 | Không có quyền |
| 404 | Không tìm thấy dữ liệu |
| 409 | Xung đột dữ liệu, thường dùng cho locking/version |
| 500 | Lỗi hệ thống |

---

## 3. Auth APIs

---

## 3.1. Đăng nhập

```http
POST /api/auth/login
```

### Role được gọi

```text
OFFICER
DISPATCHER
COMMANDER
ADMIN
```

### Request

```json
{
  "username": "officer01",
  "password": "123456"
}
```

### Response

```json
{
  "success": true,
  "message": "Login successfully",
  "data": {
    "accessToken": "jwt_token_here",
    "tokenType": "Bearer",
    "user": {
      "id": 1,
      "username": "officer01",
      "fullName": "Nguyễn Văn A",
      "roles": ["OFFICER"]
    }
  }
}
```

### Ghi chú

- Người dân trong MVP chưa cần đăng nhập.
- Chỉ cán bộ, điều phối viên, chỉ huy và admin cần tài khoản.

---

# 4. Public Report APIs

---

## 4.1. Người dân gửi tin báo

```http
POST /api/public/reports
Content-Type: multipart/form-data
```

### Role được gọi

```text
PUBLIC
```

### Request fields

| Field | Type | Required | Mô tả |
|---|---|---:|---|
| crimeTypeId | Long | Có | ID loại tội phạm |
| description | String | Có | Mô tả vụ việc |
| incidentTime | DateTime | Không | Thời điểm xảy ra |
| isHappeningNow | Boolean | Có | Vụ việc đang diễn ra hay không |
| hasWeapon | Boolean | Có | Có vũ khí hay không |
| hasInjuredPerson | Boolean | Có | Có người bị thương hay không |
| latitude | Decimal | Có | Vĩ độ |
| longitude | Decimal | Có | Kinh độ |
| addressText | String | Có | Địa chỉ mô tả |
| reporterFullName | String | Không | Họ tên người tố giác |
| reporterCitizenId | String | Không | Số CCCD/định danh cá nhân |
| reporterPhone | String | Không | Số điện thoại |
| reporterEmail | String | Không | Email |
| reporterAddress | String | Không | Địa chỉ liên hệ |
| files | File[] | Không | File bằng chứng |

Chỉ chấp nhận bằng chứng dạng ảnh, video hoặc âm thanh. File PDF và các loại tài liệu khác bị từ chối.

### Ví dụ request dạng multipart

Backend nhận hai multipart part:

| Part | Content | Required |
|---|---|---:|
| report | Chuỗi JSON theo cấu trúc bên dưới | Có |
| files | Một hoặc nhiều file bằng chứng | Không |

```json
{
  "crimeTypeId": 1,
  "description": "Có đối tượng dùng dao cướp tài sản",
  "incidentTime": "2026-05-26T10:00:00",
  "isHappeningNow": true,
  "hasWeapon": true,
  "hasInjuredPerson": false,
  "latitude": 10.7769,
  "longitude": 106.7009,
  "addressText": "Phường Bến Nghé, Quận 1, TP.HCM",
  "reporterFullName": "Nguyễn Văn A",
  "reporterCitizenId": "079123456789",
  "reporterPhone": "0900000000",
  "reporterEmail": "a@example.com",
  "reporterAddress": "Quận 1, TP.HCM"
}
```

Frontend phải `JSON.stringify` object trên và append vào key `report`; mỗi file được append vào key `files`.

### Response

```json
{
  "success": true,
  "message": "Tin báo đã được tiếp nhận",
  "data": {
    "caseId": 1,
    "trackingCode": "TB-2026-000001",
    "status": "NEW_RECEIVED",
    "urgencyScore": 110,
    "urgencyLevel": "CRITICAL",
    "message": "Tin báo đã được tiếp nhận"
  }
}
```

### Xử lý backend

Khi nhận request qua api-gateway, các service phối hợp theo luồng:

```text
1. api-gateway nhận request và route đến report-service.
2. report-service validate dữ liệu đầu vào.
3. report-service tạo tracking code và case_report.
4. report-service mã hóa thông tin người tố giác và lưu reporter_identity.
5. report-service gọi urgency-service hoặc sử dụng kết quả tính điểm để lưu urgency_score, urgency_level.
6. evidence-service lưu metadata/file bằng chứng theo case_id.
7. report-service gọi dispatch-service để smart dispatch theo tọa độ vụ việc. Nếu có ca trực và cán bộ AVAILABLE, hệ thống gán đơn vị/cán bộ phù hợp và tạo dispatch_task; nếu không đủ dữ liệu trực ban, tin báo vẫn được giữ ở hàng chờ điều phối.
8. report-service ghi audit/case history cần thiết.
9. report-service trả tracking code cho người dân.
```

---

## 4.2. Người dân tra cứu trạng thái tin báo

```http
GET /api/public/reports/{trackingCode}/status
```

### Role được gọi

```text
PUBLIC
```

### Path variable

| Field | Type | Required | Mô tả |
|---|---|---:|---|
| trackingCode | String | Có | Mã tra cứu ẩn danh |

### Response

```json
{
  "success": true,
  "message": "Report status retrieved successfully",
  "data": {
    "trackingCode": "TB-2026-000001",
    "status": "UNDER_VERIFICATION",
    "displayStatus": "Tin báo đang được xác minh",
    "createdAt": "2026-05-26T10:00:00"
  }
}
```

### Không được trả về

API này không được trả:

```text
Thông tin người tố giác
Tên cán bộ xử lý
Thông tin điều phối nội bộ
Ghi chú nghiệp vụ
Audit log
Danh sách file bằng chứng nội bộ nếu chưa cần thiết
```

---

# 5. Officer APIs

---

## 5.1. Cán bộ xem danh sách tin báo được giao

```http
GET /api/officer/cases
```

### Role được gọi

```text
OFFICER
DISPATCHER
COMMANDER
ADMIN
```

### Query params

| Param | Type | Required | Mô tả |
|---|---|---:|---|
| status | String | Không | Lọc theo trạng thái |
| urgencyLevel | String | Không | Lọc theo mức nguy cấp |
| page | Integer | Không | Trang hiện tại |
| size | Integer | Không | Số phần tử mỗi trang |

### Ví dụ

```http
GET /api/officer/cases?status=NEW_RECEIVED&urgencyLevel=CRITICAL&page=0&size=10
```

### Response

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "content": [
      {
        "id": 1,
        "trackingCode": "TB-2026-000001",
        "title": "Cướp giật",
        "description": "Có đối tượng dùng dao cướp tài sản",
        "status": "NEW_RECEIVED",
        "urgencyLevel": "CRITICAL",
        "latitude": 10.7769,
        "longitude": 106.7009,
        "address": "Phường Bến Nghé, Quận 1",
        "assignedUnitId": 1,
        "assignedOfficerId": 2,
        "createdAt": "2026-05-26T10:00:00",
        "updatedAt": "2026-05-26T10:05:00"
      }
    ],
    "number": 0,
    "size": 10,
    "totalElements": 1,
    "totalPages": 1,
    "first": true,
    "last": true,
    "empty": false
  }
}
```

`data` là JSON serialization của Spring `Page`, vì vậy frontend đọc danh sách từ `data.content`.

### Quy tắc phân quyền

- `OFFICER` chỉ xem tin báo thuộc đơn vị hoặc được giao cho mình.
- `DISPATCHER` xem các tin báo thuộc phạm vi điều phối.
- `COMMANDER` xem toàn hệ thống.
- `ADMIN` xem được dữ liệu phục vụ quản trị, nhưng không nên can thiệp nghiệp vụ nếu không cần.

---

## 5.2. Cán bộ xem chi tiết tin báo

```http
GET /api/officer/cases/{caseId}
```

### Role được gọi

```text
OFFICER
DISPATCHER
COMMANDER
ADMIN
```

### Response

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "trackingCode": "TB-2026-000001",
    "description": "Có đối tượng dùng dao cướp tài sản",
    "crimeType": "Cướp giật",
    "status": "NEW_RECEIVED",
    "urgencyLevel": "CRITICAL",
    "latitude": 10.7769,
    "longitude": 106.7009,
    "address": "Phường Bến Nghé, Quận 1, TP.HCM",
    "assignedUnitId": 1,
    "assignedOfficerId": 2,
    "anonymous": false,
    "createdAt": "2026-05-26T10:00:00",
    "updatedAt": "2026-05-26T10:05:00",
    "evidences": [
      {
        "id": 1,
        "caseId": 1,
        "originalFilename": "video.mp4",
        "contentType": "video/mp4",
        "sizeBytes": 2048000,
        "fileType": "VIDEO",
        "checksumSha256": "sha256-value",
        "uploadedAt": "2026-05-26T10:00:05"
      }
    ]
  }
}
```

### Ghi chú bảo mật

Mặc định API này **không trả thông tin định danh người tố giác đã giải mã**.

Nếu cần xem thông tin người tố giác, nên tạo API riêng có audit log:

```http
GET /api/officer/cases/{caseId}/reporter-identity
```

---

## 5.3. Cán bộ nhận xử lý tin báo

```http
POST /api/officer/cases/{caseId}/accept
```

### Role được gọi

```text
OFFICER
```

### Request

Không có request body.

### Response

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "caseId": 1,
    "trackingCode": "TB-2026-000001",
    "caseStatus": "UNDER_VERIFICATION",
    "assignedUnitId": 1,
    "assignedOfficerId": 2,
    "lockResponse": {
      "caseId": 1,
      "lockedByUserId": 2,
      "lockedByOfficerId": 2,
      "lockedByUnitId": 1,
      "caseLockStatus": "ACTIVE",
      "lockedAt": "2026-05-26T10:00:00",
      "expiresAt": "2026-05-26T10:15:00",
      "lockedByMe": true,
      "active": true
    }
  }
}
```

### Xử lý backend

```text
1. Kiểm tra user đã đăng nhập.
2. Kiểm tra role OFFICER.
3. Kiểm tra case có tồn tại không.
4. Kiểm tra case thuộc phạm vi xử lý của officer.
5. Kiểm tra case đang ở trạng thái NEW_RECEIVED.
6. Kiểm tra case có đang bị lock bởi người khác không.
7. Tạo case_lock.
8. Chuyển trạng thái sang UNDER_VERIFICATION.
9. Ghi case_history.
10. Ghi audit_log.
```

### Lỗi có thể xảy ra

```json
{
  "success": false,
  "message": "Hồ sơ đang được xử lý bởi cán bộ khác",
  "errorCode": "CASE_LOCKED"
}
```

HTTP status:

```http
409 Conflict
```

---

## 5.4. Cập nhật trạng thái tin báo

```http
PATCH /api/officer/cases/{caseId}/status
```

### Role được gọi

```text
OFFICER
DISPATCHER
COMMANDER
```

### Request

```json
{
  "caseStatus": "TRANSFERRED_TO_INVESTIGATION",
  "note": "Đã xác minh sơ bộ, chuyển cơ quan điều tra"
}
```

### Response

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "caseId": 1,
    "trackingCode": "TB-2026-000001",
    "oldStatus": "UNDER_VERIFICATION",
    "newStatus": "TRANSFERRED_TO_INVESTIGATION",
    "note": "Đã xác minh sơ bộ, chuyển cơ quan điều tra",
    "updatedAt": "2026-05-26T10:30:00"
  }
}
```

### Quy tắc

API này phải kiểm tra theo `03-state-machine.md`.

Ví dụ:

```text
NEW_RECEIVED → UNDER_VERIFICATION: hợp lệ
UNDER_VERIFICATION → RESOLVED: hợp lệ
RESOLVED → NEW_RECEIVED: không hợp lệ
SPAM_OR_FAKE → UNDER_VERIFICATION: không hợp lệ trong MVP
```

---

## 5.5. Quản lý khóa hồ sơ

Các endpoint:

```http
POST   /api/officer/cases/{caseId}/lock
POST   /api/officer/cases/{caseId}/lock/renew
GET    /api/officer/cases/{caseId}/lock
DELETE /api/officer/cases/{caseId}/lock
```

### Role được gọi

```text
OFFICER
DISPATCHER
COMMANDER
ADMIN
```

`POST`, `POST /renew` và `GET` trả về cấu trúc:

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "caseId": 1,
    "lockedByUserId": 2,
    "lockedByOfficerId": 2,
    "lockedByUnitId": 1,
    "caseLockStatus": "ACTIVE",
    "lockedAt": "2026-05-26T10:00:00",
    "expiresAt": "2026-05-26T10:15:00",
    "lockedByMe": true,
    "active": true
  }
}
```

`DELETE` trả `data: null`. Frontend chỉ được hiện nút gia hạn hoặc giải phóng khi `lockedByMe=true` và `active=true`.

---

# 6. Dispatcher APIs

---

> **Trạng thái triển khai:** Dispatch-service hiện dùng route `/api/dispatch/**`. Không dùng prefix cũ `/api/dispatcher/**`.

## 6.1. Xem danh sách tin báo chờ điều phối

```http
GET /api/dispatch/cases/pending
```

### Role được gọi

```text
DISPATCHER
COMMANDER
```

### Response

```json
{
  "success": true,
  "message": "Pending cases retrieved successfully",
  "data": [
    {
      "caseId": 1,
      "trackingCode": "TB-2026-000001",
      "crimeTypeName": "Cướp giật",
      "urgencyLevel": "CRITICAL",
      "status": "NEW_RECEIVED",
      "addressText": "Phường Bến Nghé, Quận 1",
      "createdAt": "2026-05-26T10:00:00"
    }
  ]
}
```

---

## 6.2. Gán tin báo cho đơn vị hoặc cán bộ

```http
POST /api/dispatch/cases/{trackingCode}/dispatch
```

### Role được gọi

```text
DISPATCHER
COMMANDER
```

### Request

```json
{
  "unitId": 1,
  "officerId": 2,
  "note": "Gán cho đơn vị gần nhất có cán bộ trực rảnh"
}
```

### Response

```json
{
  "success": true,
  "message": "Case assigned successfully",
  "data": {
    "caseId": 1,
    "trackingCode": "TB-2026-000001",
    "assignedUnitId": 1,
    "assignedOfficerId": 2,
    "dispatchStatus": "ASSIGNED"
  }
}
```

### Xử lý backend

```text
1. Kiểm tra quyền DISPATCHER hoặc COMMANDER.
2. Kiểm tra case tồn tại.
3. Kiểm tra case chưa bị lock bởi người khác.
4. Kiểm tra unit/officer hợp lệ.
5. Cập nhật assigned_unit_id và assigned_officer_id.
6. Tạo dispatch_task.
7. Ghi audit_log.
8. Sử dụng optimistic locking để tránh race condition.
```

---

## 6.3. Danh sách task điều phối

```http
GET /api/dispatch/tasks
GET /api/dispatch/tasks/{taskId}
GET /api/dispatch/tasks/history
```

### Role được gọi

```text
DISPATCHER
COMMANDER
ADMIN
```

---

## 6.4. Điều phối lại, thu hồi hoặc cập nhật trạng thái task

```http
PATCH /api/dispatch/tasks/{taskId}/reassign
PATCH /api/dispatch/tasks/{taskId}/recall
PATCH /api/dispatch/tasks/{taskId}/status
```

### Role được gọi

```text
DISPATCHER
COMMANDER
```

---

## 6.5. Tra cứu cán bộ khả dụng và dữ liệu bản đồ điều phối

```http
GET /api/dispatch/officers/available
GET /api/dispatch/officers/busy
GET /api/dispatch/officers/availability
GET /api/dispatch/map/cases
GET /api/dispatch/map/units
GET /api/dispatch/dashboard/overview
GET /api/dispatch/dashboard/priority-queue
GET /api/dispatch/dashboard/activity
```

Các API này phục vụ màn hình điều phối/trực ban: xem tin báo trên bản đồ, đơn vị công an, cán bộ đang rảnh/bận và hàng đợi ưu tiên.

---

# 7. Commander Dashboard APIs

---

## 7.1. Dashboard tổng quan

```http
GET /api/commander/dashboard/overview
```

### Role được gọi

```text
COMMANDER
ADMIN
```

### Response

```json
{
  "success": true,
  "message": "Dashboard overview retrieved successfully",
  "data": {
    "totalReports": 120,
    "newReports": 15,
    "underVerificationReports": 30,
    "transferredReports": 20,
    "resolvedReports": 50,
    "spamReports": 5,
    "criticalReports": 10,
    "highReports": 25,
    "mediumReports": 55,
    "lowReports": 30
  }
}
```

---

## 7.2. Timeline tin báo mới nhất

```http
GET /api/commander/dashboard/timeline
```

### Role được gọi

```text
COMMANDER
ADMIN
```

### Query params

| Param | Type | Required | Mô tả |
|---|---|---:|---|
| limit | Integer | Không | Số lượng bản ghi mới nhất, mặc định 20, hợp lệ từ 1 đến 100 |

Timeline lấy các audit event của resource `CASE_REPORT`, sắp xếp theo `createdAt` giảm dần rồi theo audit ID giảm dần.

### Response

```json
{
  "success": true,
  "message": "Timeline retrieved successfully",
  "data": [
    {
      "caseId": 1,
      "trackingCode": "TB-2026-000001",
      "event": "CASE_CREATED",
      "description": "Tin báo cướp giật được tiếp nhận",
      "urgencyLevel": "CRITICAL",
      "createdAt": "2026-05-26T10:00:00"
    },
    {
      "caseId": 1,
      "trackingCode": "TB-2026-000001",
      "event": "CASE_STATUS_CHANGED",
      "description": "Tin báo chuyển sang trạng thái đang xác minh",
      "urgencyLevel": "CRITICAL",
      "createdAt": "2026-05-26T10:05:00"
    }
  ]
}
```

---

## 7.3. Dữ liệu bản đồ/heatmap

```http
GET /api/commander/dashboard/heatmap
```

### Query params

| Param | Type | Required | Mô tả |
|---|---|---:|---|
| from | ISO DateTime | Không | Chỉ lấy case tạo từ thời điểm này, tính cả mốc `from` |
| to | ISO DateTime | Không | Chỉ lấy case tạo đến thời điểm này, tính cả mốc `to` |
| urgencyLevel | Enum | Không | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |

Ví dụ:

```http
GET /api/commander/dashboard/heatmap?from=2026-06-01T00:00:00&to=2026-06-30T23:59:59&urgencyLevel=HIGH
```

Nếu `from` lớn hơn `to`, backend trả lỗi `REPORT_1017`.

### Role được gọi

```text
COMMANDER
ADMIN
```

### Response

```json
{
  "success": true,
  "message": "Heatmap data retrieved successfully",
  "data": [
    {
      "caseId": 1,
      "latitude": 10.7769,
      "longitude": 106.7009,
      "urgencyLevel": "CRITICAL",
      "crimeTypeName": "Cướp giật",
      "status": "NEW_RECEIVED",
      "createdAt": "2026-05-26T10:00:00"
    }
  ]
}
```

---

# 8. Admin APIs

---

## 8.1. Lấy danh sách loại tội phạm

```http
GET /api/admin/crime-types
```

### Role được gọi

```text
ADMIN
```

### Response

```json
{
  "success": true,
  "message": "Crime types retrieved successfully",
  "data": [
    {
      "id": 1,
      "code": "ROBBERY",
      "name": "Cướp giật",
      "description": "Hành vi cướp giật tài sản",
      "baseScore": 30,
      "isActive": true,
      "category": {
        "id": 1,
        "code": "SOCIAL_ORDER",
        "name": "Trật tự xã hội",
        "defaultUrgencyLevel": "HIGH"
      }
    }
  ]
}
```

---

## 8.2. Tạo loại tội phạm

```http
POST /api/admin/crime-types
```

### Role được gọi

```text
ADMIN
```

### Request

```json
{
  "categoryId": 1,
  "code": "ROBBERY",
  "name": "Cướp giật",
  "description": "Hành vi cướp giật tài sản",
  "baseScore": 30,
  "isActive": true
}
```

### Response

```json
{
  "success": true,
  "message": "Crime type created successfully",
  "data": {
    "id": 1,
    "code": "ROBBERY",
    "name": "Cướp giật",
    "baseScore": 30,
    "isActive": true,
    "category": {
      "id": 1,
      "code": "SOCIAL_ORDER",
      "name": "Trật tự xã hội",
      "defaultUrgencyLevel": "HIGH"
    }
  }
}
```

---

## 8.3. Lấy danh sách rule tính điểm nguy cấp

```http
GET /api/admin/urgency-rules
```

### Role được gọi

```text
ADMIN
```

### Response

```json
{
  "success": true,
  "message": "Urgency rules retrieved successfully",
  "data": [
    {
      "id": 1,
      "ruleCode": "HAS_WEAPON",
      "scoreValue": 40,
      "description": "Có vũ khí",
      "isActive": true
    }
  ]
}
```

---

## 8.4. Tạo rule tính điểm nguy cấp

```http
POST /api/admin/urgency-rules
```

### Role được gọi

```text
ADMIN
```

### Request

```json
{
  "ruleCode": "HAS_WEAPON",
  "scoreValue": 40,
  "description": "Có vũ khí",
  "isActive": true
}
```

### Response

```json
{
  "success": true,
  "message": "Urgency rule created successfully",
  "data": {
    "id": 1,
    "ruleCode": "HAS_WEAPON",
    "scoreValue": 40,
    "description": "Có vũ khí",
    "isActive": true
  }
}
```

---

## 8.5. Tính điểm nguy cấp

```http
POST /api/urgency/score
```

### Service sở hữu

```text
urgency-service
```

### Request

```json
{
  "baseScore": 30,
  "hasWeapon": true,
  "isHappeningNow": true,
  "hasInjuredPerson": false,
  "hasVideoEvidence": true
}
```

### Response

```json
{
  "success": true,
  "message": "Urgency score calculated successfully",
  "data": {
    "score": 110,
    "level": "CRITICAL"
  }
}
```

---

## 8.6. Cập nhật loại tội phạm

```http
PATCH /api/admin/crime-types/{id}
```

Request có cùng cấu trúc với API tạo loại tội phạm và phải gửi đầy đủ `categoryId`, `code`, `name`, `description`, `baseScore`, `isActive`.

---

## 8.7. Cập nhật rule tính điểm nguy cấp

```http
PATCH /api/admin/urgency-rules/{id}
```

```json
{
  "id": 1,
  "ruleCode": "HAS_WEAPON",
  "scoreValue": 45,
  "description": "Có vũ khí",
  "isActive": true
}
```

---

## 8.8. Lấy danh sách user

```http
GET /api/admin/users
```

Role: `ADMIN`.

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 2,
      "username": "officer01",
      "fullName": "Nguyễn Văn A",
      "email": "officer01@example.com",
      "phone": "0900000002",
      "active": true,
      "roles": ["OFFICER"],
      "createdAt": "2026-05-26T09:00:00"
    }
  ]
}
```

---

## 8.9. Tạo user

```http
POST /api/admin/users
Content-Type: application/json
```

```json
{
  "username": "officer02",
  "password": "officer123",
  "fullName": "Trần Văn B",
  "email": "officer02@example.com",
  "phone": "0900000005",
  "roles": ["OFFICER"]
}
```

Response là một `AdminUserResponse` như phần tử trong danh sách user. Backend mã hóa password và không bao giờ trả `password` hoặc `passwordHash`.

---

## 8.10. Cập nhật role user

```http
PATCH /api/admin/users/{id}/roles
```

```json
{
  "roles": ["OFFICER", "DISPATCHER"]
}
```

---

## 8.11. Bật hoặc tắt user

```http
PATCH /api/admin/users/{id}/status
```

```json
{
  "active": false
}
```

User bị tắt không thể đăng nhập và JWT cũ không còn hợp lệ.

---

## 8.12. Quản lý đơn vị công an

```http
GET /api/admin/units
POST /api/admin/units
PATCH /api/admin/units/{unitId}
GET /api/admin/units/areas
```

### Role được gọi

```text
ADMIN
```

### Request tạo/cập nhật đơn vị

```json
{
  "code": "CA_Q1",
  "name": "Công an Quận 1",
  "areaId": 1,
  "address": "Quận 1, TP.HCM",
  "latitude": 10.7769,
  "longitude": 106.7009,
  "unitType": "DISTRICT_POLICE",
  "active": true
}
```

`GET /api/admin/units/areas` trả danh sách địa bàn để admin chọn `areaId` trên form tạo đơn vị.

---

## 8.13. Tạo hồ sơ officer

```http
POST /api/admin/officers
```

```json
{
  "userId": 5,
  "unitId": 1,
  "badgeNumber": "CB002",
  "rankName": "Trung úy"
}
```

```json
{
  "success": true,
  "message": "Officer profile created successfully",
  "data": {
    "officerId": 5,
    "userId": 5,
    "unitId": 1,
    "unitName": "Công an Phường Bến Nghé",
    "badgeNumber": "CB002",
    "rankName": "Trung úy"
  }
}
```

Luồng tạo cán bộ gồm hai bước: tạo user có role `OFFICER`, sau đó dùng `userId` để tạo hồ sơ officer. Trước khi tạo officer cần có dữ liệu police unit qua API `/api/admin/units` hoặc seed demo.

---

# 9. Evidence APIs

---

## 9.1. Download file bằng chứng

```http
GET /api/officer/evidences/{evidenceId}/download
```

### Role được gọi

```text
OFFICER
DISPATCHER
COMMANDER
ADMIN
```

### Response

```text
Binary file stream
```

### Quy tắc bảo mật

- Chỉ người có quyền với case chứa evidence mới được tải file.
- Không public trực tiếp file URL nếu file nhạy cảm.
- Nếu dùng MinIO, nên dùng presigned URL có thời hạn.

---

# 10. Reporter Identity APIs

---

> **Trạng thái triển khai:** Endpoint giải mã danh tính bên dưới chưa có controller/gateway route ở backend hiện tại. Frontend không hiển thị chức năng này cho đến khi backend hoàn thiện.

## 10.1. Xem thông tin người tố giác đã giải mã

```http
GET /api/officer/cases/{caseId}/reporter-identity
```

### Role được gọi

```text
COMMANDER
ADMIN
```

Trong MVP, nên hạn chế quyền API này. `OFFICER` không mặc định được xem danh tính người tố giác nếu không thật sự cần.

### Response

```json
{
  "success": true,
  "message": "Reporter identity retrieved successfully",
  "data": {
    "caseId": 1,
    "fullName": "Nguyễn Văn A",
    "citizenId": "079123456789",
    "phone": "0900000000",
    "email": "a@example.com",
    "address": "Quận 1, TP.HCM"
  }
}
```

### Quy tắc bắt buộc

Khi gọi API này, backend phải ghi audit log:

```text
REPORTER_IDENTITY_DECRYPTED
```

---

# 11. Error codes

| Error Code | Ý nghĩa |
|---|---|
| AUTH_1001 | Không tìm thấy user |
| AUTH_1002 | Username đã tồn tại |
| AUTH_1003 | Email đã tồn tại |
| AUTH_1004 | Role không tồn tại |
| REPORT_1002 | Không tìm thấy loại tội phạm |
| REPORT_1003 | Loại tội phạm không hoạt động |
| REPORT_1004 | Không tìm thấy tracking code |
| REPORT_1005 | Không tìm thấy case |
| REPORT_1009 | Case đang bị khóa |
| REPORT_1010 | Khóa đã hết hạn |
| REPORT_1011 | Không tìm thấy khóa |
| REPORT_1012 | User hiện tại không phải chủ khóa |
| REPORT_1014 | Chuyển trạng thái không hợp lệ |
| REPORT_1015 | Role không được phép chuyển trạng thái |
| REPORT_1017 | Khoảng thời gian heatmap không hợp lệ |
| REPORT_1018 | Timeline limit phải từ 1 đến 100 |
| EVIDENCE_1006 | Không tìm thấy file bằng chứng |
| URGENCY_1001 | Không tìm thấy urgency rule |
| URGENCY_1002 | Rule code đã được sử dụng |
| DISPATCH_1004 | Không tìm thấy đơn vị phù hợp |
| DISPATCH_1007 | Không có officer khả dụng |

Response lỗi vẫn dùng wrapper `{success, message, errorCode}`. Global exception handler hiện ánh xạ phần lớn `AppException` về HTTP `400`; frontend nên ưu tiên đọc `errorCode` thay vì chỉ dựa vào HTTP status cho đến khi backend bổ sung mapping `404/409` chi tiết.

---

# 12. API ưu tiên triển khai trong MVP

Thứ tự ưu tiên như sau:

## Phase 1 - Auth

```http
POST /api/auth/login
```

## Phase 2 - Public report

```http
POST /api/public/reports
GET /api/public/reports/{trackingCode}/status
```

## Phase 3 - Officer workflow

```http
GET /api/officer/cases
GET /api/officer/cases/{caseId}
POST /api/officer/cases/{caseId}/accept
PATCH /api/officer/cases/{caseId}/status
POST /api/officer/cases/{caseId}/lock
POST /api/officer/cases/{caseId}/lock/renew
GET /api/officer/cases/{caseId}/lock
DELETE /api/officer/cases/{caseId}/lock
```

## Phase 4 - Dispatcher

```http
GET /api/dispatch/cases/pending
GET /api/dispatch/cases/{trackingCode}
POST /api/dispatch/cases/{trackingCode}/dispatch
GET /api/dispatch/tasks
PATCH /api/dispatch/tasks/{taskId}/reassign
PATCH /api/dispatch/tasks/{taskId}/recall
PATCH /api/dispatch/tasks/{taskId}/status
GET /api/dispatch/officers/available
GET /api/dispatch/map/cases
GET /api/dispatch/map/units
```

## Phase 5 - Dashboard

```http
GET /api/commander/dashboard/overview
GET /api/commander/dashboard/timeline
GET /api/commander/dashboard/heatmap
```

## Phase 6 - Admin

```http
GET /api/admin/crime-types
POST /api/admin/crime-types
PATCH /api/admin/crime-types/{id}
GET /api/admin/urgency-rules
POST /api/admin/urgency-rules
PATCH /api/admin/urgency-rules/{id}
GET /api/admin/users
POST /api/admin/users
PATCH /api/admin/users/{id}/roles
PATCH /api/admin/users/{id}/status
GET /api/admin/units
POST /api/admin/units
PATCH /api/admin/units/{unitId}
GET /api/admin/units/areas
POST /api/admin/officers
```

---
