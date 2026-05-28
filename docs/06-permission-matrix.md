# 06. Permission Matrix

## 1. Danh sách role

| Role | Mô tả |
|---|---|
| CITIZEN | Người dân gửi tin báo và tra cứu tiến độ |
| DUTY_OFFICER | Cán bộ trực ban tiếp nhận và xác minh tin báo |
| DISPATCHER | Cán bộ điều phối tin báo |
| COMMANDER | Chỉ huy theo dõi toàn hệ thống |
| ADMIN | Quản trị viên hệ thống |

---

## 2. Permission theo chức năng

| Chức năng | Citizen | Duty Officer | Dispatcher | Commander | Admin |
|---|---:|---:|---:|---:|---:|
| Gửi tin báo | ✅ | ❌ | ❌ | ❌ | ❌ |
| Tra cứu tiến độ bằng tracking code | ✅ | ❌ | ❌ | ❌ | ❌ |
| Xem danh sách case được giao | ❌ | ✅ | ✅ | ✅ | ✅ |
| Xem chi tiết case | ❌ | ✅ | ✅ | ✅ | ✅ |
| Nhận xử lý case | ❌ | ✅ | ❌ | ❌ | ❌ |
| Cập nhật trạng thái case | ❌ | ✅ | ✅ | ✅ | ❌ |
| Gán case cho đơn vị/cán bộ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Điều phối lại case | ❌ | ❌ | ✅ | ✅ | ❌ |
| Xem dashboard tổng quan | ❌ | ❌ | ❌ | ✅ | ✅ |
| Xem heatmap | ❌ | ❌ | ❌ | ✅ | ✅ |
| Quản lý user | ❌ | ❌ | ❌ | ❌ | ✅ |
| Quản lý role/RBAC | ❌ | ❌ | ❌ | ❌ | ✅ |
| Quản lý danh mục tội phạm | ❌ | ❌ | ❌ | ❌ | ✅ |
| Quản lý rule tính điểm nguy cấp | ❌ | ❌ | ❌ | ❌ | ✅ |
| Xem audit log | ❌ | ❌ | ❌ | ✅ | ✅ |
| Giải mã danh tính người tố giác | ❌ | ❌ | ❌ | ✅ | ✅ |

---

## 3. Permission theo API

| API | Public | Duty Officer | Dispatcher | Commander | Admin |
|---|---:|---:|---:|---:|---:|
| POST /api/public/reports | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/public/reports/{trackingCode}/status | ✅ | ❌ | ❌ | ❌ | ❌ |
| POST /api/auth/login | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /api/officer/cases | ❌ | ✅ | ✅ | ✅ | ✅ |
| GET /api/officer/cases/{caseId} | ❌ | ✅ | ✅ | ✅ | ✅ |
| POST /api/officer/cases/{caseId}/accept | ❌ | ✅ | ❌ | ❌ | ❌ |
| PATCH /api/officer/cases/{caseId}/status | ❌ | ✅ | ✅ | ✅ | ❌ |
| POST /api/dispatcher/cases/{caseId}/assign | ❌ | ❌ | ✅ | ✅ | ❌ |
| GET /api/commander/dashboard/overview | ❌ | ❌ | ❌ | ✅ | ✅ |
| GET /api/commander/dashboard/heatmap | ❌ | ❌ | ❌ | ✅ | ✅ |
| GET /api/admin/crime-types | ❌ | ❌ | ❌ | ❌ | ✅ |
| POST /api/admin/crime-types | ❌ | ❌ | ❌ | ❌ | ✅ |
| GET /api/admin/urgency-rules | ❌ | ❌ | ❌ | ❌ | ✅ |
| POST /api/admin/urgency-rules | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 4. Quy tắc data scope

### Citizen

- Chỉ được gửi tin báo.
- Chỉ được tra cứu trạng thái rút gọn bằng tracking code.
- Không được thấy thông tin cán bộ, đơn vị xử lý, ghi chú nghiệp vụ, audit log.

### Duty Officer

- Chỉ được xem case thuộc đơn vị mình hoặc được assign cho mình.
- Được nhận xử lý case nếu case chưa bị lock.
- Không mặc định được giải mã danh tính người tố giác.

### Dispatcher

- Được xem case chờ điều phối.
- Được gán hoặc điều phối lại case.
- Không mặc định được giải mã danh tính người tố giác.

### Commander

- Được xem toàn bộ dashboard.
- Được xem audit log.
- Được duyệt truy cập danh tính người tố giác nếu cần.

### Admin

- Quản lý hệ thống, user, role, danh mục, rule.
- Không nên trực tiếp xử lý nghiệp vụ case trong MVP.