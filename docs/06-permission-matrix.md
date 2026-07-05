# 06. Permission Matrix

## 1. Danh sách role

| Role | Mô tả |
|---|---|
| CITIZEN | Người dân gửi tin báo và tra cứu tiến độ |
| OFFICER | Cán bộ trực ban tiếp nhận và xác minh tin báo |
| DISPATCHER | Cán bộ điều phối tin báo |
| COMMANDER | Chỉ huy theo dõi toàn hệ thống |
| ADMIN | Quản trị viên hệ thống |

---

## 2. Permission theo chức năng

| Chức năng | Citizen | Officer | Dispatcher | Commander | Admin |
|---|---:|---:|---:|---:|---:|
| Gửi tin báo | ✅ | ❌ | ❌ | ❌ | ❌ |
| Tra cứu tiến độ bằng tracking code | ✅ | ❌ | ❌ | ❌ | ❌ |
| Xem danh sách case được giao | ❌ | ✅ | ✅ | ✅ | ✅ |
| Xem chi tiết case | ❌ | ✅ | ✅ | ✅ | ✅ |
| Nhận xử lý case | ❌ | ✅ | ❌ | ❌ | ❌ |
| Cập nhật trạng thái case | ❌ | ✅ | ✅ | ✅ | ❌ |
| Gán case cho đơn vị/cán bộ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Điều phối lại case | ❌ | ❌ | ✅ | ✅ | ❌ |
| Xem bản đồ/hàng đợi điều phối | ❌ | ❌ | ✅ | ✅ | ✅ |
| Xem dashboard tổng quan | ❌ | ❌ | ❌ | ✅ | ✅ |
| Xem timeline | ❌ | ❌ | ❌ | ✅ | ✅ |
| Xem heatmap | ❌ | ❌ | ❌ | ✅ | ✅ |
| Quản lý user | ❌ | ❌ | ❌ | ❌ | ✅ |
| Quản lý role/RBAC | ❌ | ❌ | ❌ | ❌ | ✅ |
| Quản lý danh mục tội phạm | ❌ | ❌ | ❌ | ❌ | ✅ |
| Quản lý rule tính điểm nguy cấp | ❌ | ❌ | ❌ | ❌ | ✅ |
| Quản lý đơn vị công an | ❌ | ❌ | ❌ | ❌ | ✅ |
| Quản lý hồ sơ cán bộ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Xem audit log | ❌ | ❌ | ❌ | ✅ | ✅ |
| Giải mã danh tính người tố giác | ❌ | ❌ | ❌ | ✅ | ✅ |

---

## 3. Permission theo API

| API | Public | Officer | Dispatcher | Commander | Admin |
|---|---:|---:|---:|---:|---:|
| POST /api/public/reports | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/public/reports/{trackingCode}/status | ✅ | ❌ | ❌ | ❌ | ❌ |
| POST /api/auth/login | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /api/officer/cases | ❌ | ✅ | ✅ | ✅ | ✅ |
| GET /api/officer/cases/{caseId} | ❌ | ✅ | ✅ | ✅ | ✅ |
| POST /api/officer/cases/{caseId}/accept | ❌ | ✅ | ❌ | ❌ | ❌ |
| PATCH /api/officer/cases/{caseId}/status | ❌ | ✅ | ✅ | ✅ | ❌ |
| POST /api/officer/cases/{caseId}/lock | ❌ | ✅ | ✅ | ✅ | ✅ |
| POST /api/officer/cases/{caseId}/lock/renew | ❌ | ✅ | ✅ | ✅ | ✅ |
| GET /api/officer/cases/{caseId}/lock | ❌ | ✅ | ✅ | ✅ | ✅ |
| DELETE /api/officer/cases/{caseId}/lock | ❌ | ✅ | ✅ | ✅ | ✅ |
| GET /api/dispatch/cases/pending | ❌ | ❌ | ✅ | ✅ | ✅ |
| GET /api/dispatch/cases/{trackingCode} | ❌ | ❌ | ✅ | ✅ | ✅ |
| POST /api/dispatch/cases/{trackingCode}/dispatch | ❌ | ❌ | ✅ | ✅ | ❌ |
| GET /api/dispatch/tasks | ❌ | ❌ | ✅ | ✅ | ✅ |
| PATCH /api/dispatch/tasks/{taskId}/reassign | ❌ | ❌ | ✅ | ✅ | ❌ |
| PATCH /api/dispatch/tasks/{taskId}/recall | ❌ | ❌ | ✅ | ✅ | ❌ |
| PATCH /api/dispatch/tasks/{taskId}/status | ❌ | ❌ | ✅ | ✅ | ❌ |
| GET /api/dispatch/officers/available | ❌ | ❌ | ✅ | ✅ | ✅ |
| GET /api/dispatch/map/cases | ❌ | ❌ | ✅ | ✅ | ✅ |
| GET /api/dispatch/map/units | ❌ | ❌ | ✅ | ✅ | ✅ |
| GET /api/commander/dashboard/overview | ❌ | ❌ | ❌ | ✅ | ✅ |
| GET /api/commander/dashboard/timeline | ❌ | ❌ | ❌ | ✅ | ✅ |
| GET /api/commander/dashboard/heatmap | ❌ | ❌ | ❌ | ✅ | ✅ |
| GET /api/admin/crime-types | ❌ | ❌ | ❌ | ❌ | ✅ |
| POST /api/admin/crime-types | ❌ | ❌ | ❌ | ❌ | ✅ |
| PATCH /api/admin/crime-types/{id} | ❌ | ❌ | ❌ | ❌ | ✅ |
| GET /api/admin/urgency-rules | ❌ | ❌ | ❌ | ❌ | ✅ |
| POST /api/admin/urgency-rules | ❌ | ❌ | ❌ | ❌ | ✅ |
| PATCH /api/admin/urgency-rules/{id} | ❌ | ❌ | ❌ | ❌ | ✅ |
| GET /api/admin/users | ❌ | ❌ | ❌ | ❌ | ✅ |
| POST /api/admin/users | ❌ | ❌ | ❌ | ❌ | ✅ |
| PATCH /api/admin/users/{id}/roles | ❌ | ❌ | ❌ | ❌ | ✅ |
| PATCH /api/admin/users/{id}/status | ❌ | ❌ | ❌ | ❌ | ✅ |
| GET /api/admin/units | ❌ | ❌ | ❌ | ❌ | ✅ |
| POST /api/admin/units | ❌ | ❌ | ❌ | ❌ | ✅ |
| PATCH /api/admin/units/{unitId} | ❌ | ❌ | ❌ | ❌ | ✅ |
| GET /api/admin/units/areas | ❌ | ❌ | ❌ | ❌ | ✅ |
| POST /api/admin/officers | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 4. Quy tắc data scope

### Citizen

- Chỉ được gửi tin báo.
- Chỉ được tra cứu trạng thái rút gọn bằng tracking code.
- Không được thấy thông tin cán bộ, đơn vị xử lý, ghi chú nghiệp vụ, audit log.

### Officer

- Chỉ được xem case thuộc đơn vị mình hoặc được assign cho mình.
- Được nhận xử lý case nếu case chưa bị lock.
- Không mặc định được giải mã danh tính người tố giác.

### Dispatcher

- Được xem case chờ điều phối.
- Được gán hoặc điều phối lại case.
- Được xem cán bộ AVAILABLE/BUSY, bản đồ case/unit và dashboard điều phối.
- Không mặc định được giải mã danh tính người tố giác.

### Commander

- Được xem toàn bộ dashboard.
- Được xem audit log.
- Được duyệt truy cập danh tính người tố giác nếu cần.

### Admin

- Quản lý hệ thống, user, role, danh mục, rule.
- Quản lý danh mục đơn vị công an và hồ sơ cán bộ để chuẩn bị dữ liệu dispatch.
- Không nên trực tiếp xử lý nghiệp vụ case trong MVP.
