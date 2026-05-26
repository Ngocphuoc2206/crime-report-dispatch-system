# 03. Case State Machine

## 1. Tổng quan

Tài liệu này mô tả vòng đời trạng thái của một tin báo trong hệ thống Tiếp nhận và Điều phối Thông tin Tố giác Tội phạm.

Mục tiêu của state machine là đảm bảo tin báo chỉ được chuyển trạng thái theo đúng luồng nghiệp vụ, đúng vai trò người dùng và có lưu lịch sử xử lý đầy đủ.

Một tin báo không được phép cập nhật trạng thái tự do. Mọi thao tác chuyển trạng thái phải được kiểm tra bởi hệ thống.

---

## 2. Danh sách trạng thái tin báo

| Mã trạng thái | Tên hiển thị | Ý nghĩa |
|---|---|---|
| NEW_RECEIVED | Mới tiếp nhận | Tin báo vừa được người dân gửi lên hệ thống |
| UNDER_VERIFICATION | Đang xác minh | Tin báo đã được cán bộ trực ban nhận xử lý và đang xác minh |
| TRANSFERRED_TO_INVESTIGATION | Đã chuyển cơ quan điều tra | Tin báo đã được xác minh sơ bộ và chuyển đến bộ phận/cơ quan điều tra phù hợp |
| RESOLVED | Đã xử lý | Tin báo đã được xử lý xong |
| SPAM_OR_FAKE | Hồ sơ giả/Spam | Tin báo bị xác định là giả, spam hoặc không đủ cơ sở xử lý |

---

## 3. Ý nghĩa từng trạng thái

### 3.1. NEW_RECEIVED

Đây là trạng thái đầu tiên của tin báo sau khi người dân gửi thành công.

Ở trạng thái này:

- Tin báo đã được lưu vào hệ thống.
- Thông tin người tố giác đã được mã hóa.
- Hệ thống đã sinh mã tra cứu ẩn danh.
- Hệ thống có thể đã tính điểm nguy cấp.
- Hệ thống có thể đã điều phối tự động hoặc chờ điều phối thủ công.

Các hành động có thể thực hiện:

- Cán bộ trực ban nhận xử lý.
- Điều phối viên gán lại tin báo.
- Hệ thống đánh dấu là spam nếu phát hiện dữ liệu bất thường.

---

### 3.2. UNDER_VERIFICATION

Đây là trạng thái khi tin báo đã được cán bộ tiếp nhận và đang trong quá trình xác minh.

Ở trạng thái này:

- Hồ sơ có thể đang được khóa tạm thời bởi một cán bộ.
- Cán bộ được phép xem chi tiết tin báo trong phạm vi quyền hạn.
- Cán bộ có thể cập nhật kết quả xác minh ban đầu.

Các hành động có thể thực hiện:

- Chuyển sang cơ quan điều tra.
- Đánh dấu đã xử lý.
- Đánh dấu spam/giả nếu xác minh không hợp lệ.

---

### 3.3. TRANSFERRED_TO_INVESTIGATION

Đây là trạng thái khi tin báo đã được chuyển sang bộ phận hoặc cơ quan điều tra có thẩm quyền.

Ở trạng thái này:

- Tin báo đã qua bước xác minh ban đầu.
- Có thể đã có dispatch task hoặc transfer record.
- Người dân chỉ nhìn thấy trạng thái rút gọn là “Tin báo đã được chuyển xử lý”.

Các hành động có thể thực hiện:

- Cập nhật thành đã xử lý.
- Ghi nhận kết quả xử lý cuối cùng.

---

### 3.4. RESOLVED

Đây là trạng thái cuối khi tin báo đã được xử lý xong.

Ở trạng thái này:

- Không cho phép cập nhật nghiệp vụ thông thường.
- Không cho phép quay lại trạng thái trước đó.
- Chỉ admin hoặc commander có thể xem lịch sử xử lý nếu có quyền.

---

### 3.5. SPAM_OR_FAKE

Đây là trạng thái dành cho tin báo giả, spam hoặc không hợp lệ.

Ở trạng thái này:

- Tin báo không tiếp tục được điều phối.
- Không cho phép cán bộ nhận xử lý tiếp.
- Người dân có thể thấy trạng thái rút gọn là “Tin báo không đủ điều kiện xử lý” hoặc “Tin báo đã được kiểm tra”.

Không nên hiển thị chi tiết nội bộ cho người dân.

---

## 4. Luồng trạng thái hợp lệ

### 4.1. Luồng xử lý thông thường

```text
NEW_RECEIVED
→ UNDER_VERIFICATION
→ TRANSFERRED_TO_INVESTIGATION
→ RESOLVED
```

### 4.2. Luồng xử lý nhanh

```text
NEW_RECEIVED
→ UNDER_VERIFICATION
→ RESOLVED
```

Áp dụng khi tin báo đơn giản, không cần chuyển sang cơ quan điều tra khác.

### 4.3. Luồng tin báo giả hoặc spam

```text
NEW_RECEIVED
→ SPAM_OR_FAKE
```

Hoặc:

```text
UNDER_VERIFICATION
→ SPAM_OR_FAKE
```

## 5. Bảng transition hợp lệ

---

| From Status | To Status | Actor được phép | Điều kiện |
|---|---:|---|---|
| NEW_RECEIVED | UNDER_VERIFICATION | DUTY_OFFICER | Tin báo thuộc phạm vi xử lý và chưa bị khóa bởi người khác |
| NEW_RECEIVED | SPAM_OR_FAKE | DUTY_OFFICER, DISPATCHER | Tin báo có dấu hiệu giả, spam hoặc không hợp lệ |
| NEW_RECEIVED | TRANSFERRED_TO_INVESTIGATION | DISPATCHER, COMMANDER | Tin báo nguy cấp cần chuyển thẳng đến bộ phận điều tra |
| UNDER_VERIFICATION | TRANSFERRED_TO_INVESTIGATION | DUTY_OFFICER, DISPATCHER | Đã xác minh sơ bộ và cần chuyển cơ quan điều tra |
| UNDER_VERIFICATION | RESOLVED | DUTY_OFFICER, COMMANDER | Tin báo đã được xử lý xong |
| UNDER_VERIFICATION | SPAM_OR_FAKE | DUTY_OFFICER, DISPATCHER | Sau xác minh, tin báo không hợp lệ |
| TRANSFERRED_TO_INVESTIGATION | RESOLVED | DUTY_OFFICER, COMMANDER | Cơ quan xử lý đã hoàn tất |

---

## 6. Các transition không hợp lệ

Các chuyển trạng thái sau không được phép:

| From Status | To Status | Lý do |
|---|---|---|
| RESOLVED | NEW_RECEIVED | Hồ sơ đã xử lý không được quay về mới tiếp nhận |
| RESOLVED | UNDER_VERIFICATION | Hồ sơ đã kết thúc không được xử lý lại trong MVP |
| SPAM_OR_FAKE | UNDER_VERIFICATION | Tin báo đã bị loại không được tự động mở lại |
| SPAM_OR_FAKE | RESOLVED | Tin báo spam không đi qua luồng xử lý thường |
| TRANSFERRED_TO_INVESTIGATION | NEW_RECEIVED | Không được quay ngược về trạng thái ban đầu |
| UNDER_VERIFICATION | NEW_RECEIVED | Không được quay ngược sau khi cán bộ đã nhận xử lý |

Trong phiên bản mở rộng, hệ thống có thể bổ sung chức năng “reopen case”, nhưng MVP chưa hỗ trợ.

---

## 7. Quy tắc chuyển trạng thái

Khi một người dùng muốn chuyển trạng thái tin báo, hệ thống phải kiểm tra theo thứ tự:

1. Người dùng đã đăng nhập hay chưa.
2. Người dùng có role phù hợp hay không.
3. Tin báo có tồn tại hay không.
4. Tin báo có thuộc phạm vi xử lý của người dùng hay không.
5. Trạng thái hiện tại có cho phép chuyển sang trạng thái mới hay không.
6. Tin báo có đang bị khóa bởi người khác hay không.
7. Nếu hợp lệ, hệ thống cập nhật trạng thái.
8. Hệ thống ghi lịch sử thay đổi trạng thái.
9. Hệ thống ghi audit log.

---

## 8. Quy tắc hiển thị trạng thái cho người dân

Người dân không nhìn thấy trạng thái nghiệp vụ chi tiết giống cán bộ.

| Internal Status | Public Display Status |
|---|---|
| NEW_RECEIVED | Tin báo đã được tiếp nhận |
| UNDER_VERIFICATION | Tin báo đang được xác minh |
| TRANSFERRED_TO_INVESTIGATION | Tin báo đã được chuyển xử lý |
| RESOLVED | Tin báo đã được xử lý |
| SPAM_OR_FAKE | Tin báo đã được kiểm tra |

Lý do:

- Bảo vệ thông tin nghiệp vụ nội bộ.
- Không để lộ quá trình điều phối lực lượng.
- Không hiển thị tên cán bộ hoặc đơn vị xử lý cụ thể.
- Đảm bảo người dân chỉ thấy tiến độ ở mức phù hợp.

---

## 9. Quy tắc khóa hồ sơ khi chuyển trạng thái

Một tin báo có thể bị khóa tạm thời khi cán bộ đang xử lý.

### 9.1. Khi nào tạo lock?

Hệ thống tạo temporary case lock khi:

- Cán bộ bấm “Nhận xử lý”.
- Cán bộ mở chi tiết hồ sơ để xác minh.
- Cán bộ bắt đầu cập nhật trạng thái xử lý.

### 9.2. Mục tiêu của lock

- Tránh hai cán bộ cùng nhận xử lý một tin báo.
- Tránh hai điều phối viên cùng gán một tin báo cho hai người khác nhau.
- Tránh ghi đè trạng thái khi nhiều người thao tác cùng lúc.

### 9.3. Quy tắc lock

- Một case tại một thời điểm chỉ có một active lock.
- Lock có thời hạn, ví dụ 10 phút hoặc 15 phút.
- Nếu hết hạn, hệ thống cho phép người khác nhận xử lý.
- Người đang giữ lock có thể gia hạn hoặc giải phóng lock.
- Khi chuyển trạng thái thành công, hệ thống ghi nhận lịch sử xử lý.

---

## 10. Case status history

Mỗi lần tin báo chuyển trạng thái, hệ thống phải lưu lịch sử vào bảng case_status_history.

### 10.1. Thông tin cần lưu

| Field | Ý nghĩa |
|---|---|
| case_id | Tin báo được cập nhật |
| old_status | Trạng thái cũ |
| new_status | Trạng thái mới |
| changed_by | Người thực hiện thay đổi |
| reason | Lý do chuyển trạng thái |
| created_at | Thời điểm thay đổi |

### 10.2. Ví dụ

| case_id | old_status | new_status | changed_by | reason |
|---:|---|---|---:|---|
| 1 | NEW_RECEIVED | UNDER_VERIFICATION | 5 | Cán bộ trực ban nhận xử lý |
| 1 | UNDER_VERIFICATION | TRANSFERRED_TO_INVESTIGATION | 5 | Đã xác minh sơ bộ, chuyển cơ quan điều tra |
| 1 | TRANSFERRED_TO_INVESTIGATION | RESOLVED | 9 | Đã hoàn tất xử lý |

---

## 11. Audit log khi chuyển trạng thái

Ngoài case_status_history, hệ thống cần ghi audit_log cho các thao tác nhạy cảm.

Ví dụ action:

| Action | Ý nghĩa |
|---|---|
| CASE_STATUS_CHANGED | Thay đổi trạng thái tin báo |
| CASE_ACCEPTED | Cán bộ nhận xử lý tin báo |
| CASE_LOCKED | Hồ sơ bị khóa tạm thời |
| CASE_UNLOCKED | Hồ sơ được mở khóa |
| CASE_ASSIGNED | Tin báo được gán cho cán bộ hoặc đơn vị |
| CASE_MARKED_SPAM | Tin báo bị đánh dấu spam/giả |

Audit log giúp truy vết ai đã làm gì trong hệ thống.

---

## 12. Pseudo-code kiểm tra transition

```text
function changeCaseStatus(caseId, newStatus, currentUser, reason):

    case = findCaseById(caseId)

    if case does not exist:
        throw NotFoundException

    if currentUser does not have permission on this case:
        throw ForbiddenException

    if case is locked by another user:
        throw CaseLockedException

    currentStatus = case.status

    if transition from currentStatus to newStatus is not allowed:
        throw InvalidStatusTransitionException

    if currentUser role is not allowed to perform this transition:
        throw ForbiddenException

    update case.status = newStatus

    create case_status_history record

    create audit_log record

    return updated case
```
