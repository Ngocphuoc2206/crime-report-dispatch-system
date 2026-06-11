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
| /api/public/reports/** | report-service |
| /api/public/crime-types | report-service |
| /api/officer/evidences/** | evidence-service |
| /api/urgency/** | urgency-service |

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
DUTY_OFFICER
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
      "roles": ["DUTY_OFFICER"]
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
| reporterPhone | String | Không | Số điện thoại |
| reporterEmail | String | Không | Email |
| reporterAddress | String | Không | Địa chỉ liên hệ |
| files | File[] | Không | File bằng chứng |

### Ví dụ request dạng multipart

```text
crimeTypeId=1
description=Có đối tượng dùng dao cướp tài sản
incidentTime=2026-05-26T10:00:00
isHappeningNow=true
hasWeapon=true
hasInjuredPerson=false
latitude=10.7769
longitude=106.7009
addressText=Phường Bến Nghé, Quận 1, TP.HCM
reporterFullName=Nguyễn Văn A
reporterPhone=0900000000
reporterEmail=a@example.com
files=video.mp4
```

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
    "urgencyLevel": "CRITICAL"
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
7. Các bước điều phối, audit và dashboard có thể được tách thêm thành service riêng ở các giai đoạn sau.
8. report-service trả tracking code cho người dân.
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
DUTY_OFFICER
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
  "message": "Cases retrieved successfully",
  "data": {
    "items": [
      {
        "caseId": 1,
        "trackingCode": "TB-2026-000001",
        "crimeTypeName": "Cướp giật",
        "description": "Có đối tượng dùng dao cướp tài sản",
        "addressText": "Phường Bến Nghé, Quận 1",
        "urgencyScore": 110,
        "urgencyLevel": "CRITICAL",
        "status": "NEW_RECEIVED",
        "createdAt": "2026-05-26T10:00:00"
      }
    ],
    "page": 0,
    "size": 10,
    "totalElements": 1,
    "totalPages": 1
  }
}
```

### Quy tắc phân quyền

- `DUTY_OFFICER` chỉ xem tin báo thuộc đơn vị hoặc được giao cho mình.
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
DUTY_OFFICER
DISPATCHER
COMMANDER
ADMIN
```

### Response

```json
{
  "success": true,
  "message": "Case detail retrieved successfully",
  "data": {
    "caseId": 1,
    "trackingCode": "TB-2026-000001",
    "crimeType": {
      "id": 1,
      "name": "Cướp giật"
    },
    "description": "Có đối tượng dùng dao cướp tài sản",
    "incidentTime": "2026-05-26T10:00:00",
    "isHappeningNow": true,
    "hasWeapon": true,
    "hasInjuredPerson": false,
    "latitude": 10.7769,
    "longitude": 106.7009,
    "addressText": "Phường Bến Nghé, Quận 1, TP.HCM",
    "urgencyScore": 110,
    "urgencyLevel": "CRITICAL",
    "status": "NEW_RECEIVED",
    "assignedUnit": {
      "id": 1,
      "name": "Công an Phường Bến Nghé"
    },
    "assignedOfficer": {
      "id": 2,
      "fullName": "Trần Văn B"
    },
    "evidences": [
      {
        "id": 1,
        "fileName": "video.mp4",
        "fileType": "VIDEO",
        "fileUrl": "/api/officer/evidences/1/download",
        "fileSize": 2048000
      }
    ],
    "createdAt": "2026-05-26T10:00:00"
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
DUTY_OFFICER
```

### Request

```json
{
  "reason": "Cán bộ trực ban nhận xử lý tin báo"
}
```

### Response

```json
{
  "success": true,
  "message": "Đã nhận xử lý tin báo",
  "data": {
    "caseId": 1,
    "status": "UNDER_VERIFICATION",
    "lockedBy": 2,
    "lockedUntil": "2026-05-26T10:15:00"
  }
}
```

### Xử lý backend

```text
1. Kiểm tra user đã đăng nhập.
2. Kiểm tra role DUTY_OFFICER.
3. Kiểm tra case có tồn tại không.
4. Kiểm tra case thuộc phạm vi xử lý của officer.
5. Kiểm tra case đang ở trạng thái NEW_RECEIVED.
6. Kiểm tra case có đang bị lock bởi người khác không.
7. Tạo case_lock.
8. Chuyển trạng thái sang UNDER_VERIFICATION.
9. Ghi case_status_history.
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
DUTY_OFFICER
DISPATCHER
COMMANDER
```

### Request

```json
{
  "newStatus": "TRANSFERRED_TO_INVESTIGATION",
  "reason": "Đã xác minh sơ bộ, chuyển cơ quan điều tra"
}
```

### Response

```json
{
  "success": true,
  "message": "Case status updated successfully",
  "data": {
    "caseId": 1,
    "oldStatus": "UNDER_VERIFICATION",
    "newStatus": "TRANSFERRED_TO_INVESTIGATION",
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

## 5.5. Giải phóng khóa hồ sơ

```http
POST /api/officer/cases/{caseId}/release-lock
```

### Role được gọi

```text
DUTY_OFFICER
DISPATCHER
COMMANDER
```

### Response

```json
{
  "success": true,
  "message": "Case lock released successfully",
  "data": {
    "caseId": 1,
    "released": true
  }
}
```

---

# 6. Dispatcher APIs

---

## 6.1. Xem danh sách tin báo chờ điều phối

```http
GET /api/dispatcher/cases/pending
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
POST /api/dispatcher/cases/{caseId}/assign
```

### Role được gọi

```text
DISPATCHER
COMMANDER
```

### Request

```json
{
  "assignedUnitId": 1,
  "assignedOfficerId": 2,
  "reason": "Gán cho đơn vị gần nhất có cán bộ trực rảnh"
}
```

### Response

```json
{
  "success": true,
  "message": "Case assigned successfully",
  "data": {
    "caseId": 1,
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
| limit | Integer | Không | Số lượng bản ghi mới nhất |

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
      "categoryId": 1,
      "name": "Cướp giật",
      "description": "Hành vi cướp giật tài sản",
      "baseScore": 30,
      "isActive": true
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
  "name": "Cướp giật",
  "description": "Hành vi cướp giật tài sản",
  "baseScore": 30
}
```

### Response

```json
{
  "success": true,
  "message": "Crime type created successfully",
  "data": {
    "id": 1,
    "categoryId": 1,
    "name": "Cướp giật",
    "baseScore": 30,
    "isActive": true
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
      "ruleName": "Có vũ khí",
      "conditionKey": "HAS_WEAPON",
      "conditionValue": "true",
      "score": 40,
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
  "ruleName": "Có vũ khí",
  "conditionKey": "HAS_WEAPON",
  "conditionValue": "true",
  "score": 40
}
```

### Response

```json
{
  "success": true,
  "message": "Urgency rule created successfully",
  "data": {
    "id": 1,
    "ruleName": "Có vũ khí",
    "conditionKey": "HAS_WEAPON",
    "conditionValue": "true",
    "score": 40,
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

# 9. Evidence APIs

---

## 9.1. Download file bằng chứng

```http
GET /api/officer/evidences/{evidenceId}/download
```

### Role được gọi

```text
DUTY_OFFICER
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

## 10.1. Xem thông tin người tố giác đã giải mã

```http
GET /api/officer/cases/{caseId}/reporter-identity
```

### Role được gọi

```text
COMMANDER
ADMIN
```

Trong MVP, nên hạn chế quyền API này. `DUTY_OFFICER` không mặc định được xem danh tính người tố giác nếu không thật sự cần.

### Response

```json
{
  "success": true,
  "message": "Reporter identity retrieved successfully",
  "data": {
    "caseId": 1,
    "fullName": "Nguyễn Văn A",
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
| VALIDATION_ERROR | Dữ liệu đầu vào không hợp lệ |
| UNAUTHORIZED | Chưa đăng nhập |
| FORBIDDEN | Không có quyền |
| CASE_NOT_FOUND | Không tìm thấy tin báo |
| CASE_LOCKED | Hồ sơ đang bị khóa |
| INVALID_STATUS_TRANSITION | Chuyển trạng thái không hợp lệ |
| ASSIGNMENT_CONFLICT | Có xung đột khi gán tin báo |
| FILE_UPLOAD_ERROR | Lỗi upload file |
| EVIDENCE_NOT_FOUND | Không tìm thấy bằng chứng |
| TRACKING_CODE_NOT_FOUND | Không tìm thấy mã tra cứu |
| INTERNAL_SERVER_ERROR | Lỗi hệ thống |

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
```

## Phase 4 - Dispatcher

```http
GET /api/dispatcher/cases/pending
POST /api/dispatcher/cases/{caseId}/assign
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
GET /api/admin/urgency-rules
POST /api/admin/urgency-rules
```

---
